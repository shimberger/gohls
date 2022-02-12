package api

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/shimberger/gohls/internal/config"
	"github.com/shimberger/gohls/internal/fileindex"
	log "github.com/sirupsen/logrus"
)

func serveJson(status int, data interface{}, w http.ResponseWriter) {
	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func withEntry(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ci.WaitForReady()
		pathParam := chi.URLParam(r, "*")
		entry, err := ci.Get(pathParam)
		if err != nil {
			log.Debugf("ENTRY NOT FOUND %v", pathParam)
			serveJson(404, err, w)
			return
		}
		r = setEntry(r, entry)
		handler(w, r)
	}
}

func setEntry(r *http.Request, e fileindex.Entry) *http.Request {
	return r.WithContext(context.WithValue(r.Context(), "entry", e))
}

func getEntry(r *http.Request) fileindex.Entry {
	return r.Context().Value("entry").(fileindex.Entry)
}

type IndexEntry struct {
	Id       string
	Name     string
	IsDir    bool
	ParentId string
	Path     string
}

func indexEntry(i fileindex.Entry) *IndexEntry {
	return &IndexEntry{i.Id(), i.Name(), i.IsDir(), i.ParentId(), i.Path()}
}

func indexEntries(is []fileindex.Entry) []*IndexEntry {
	es := make([]*IndexEntry, 0)
	for _, i := range is {
		es = append(es, indexEntry(i))
	}
	return es
}

var ci fileindex.Index

func Setup(conf *config.Config) {
	idxs := make([]fileindex.Index, 0)
	for _, folder := range conf.Folders {
		idx, err := fileindex.NewMemIndex(folder.Path, folder.Id, folder.Title, fileindex.HiddenFilter, folder.ScanInterval)
		if err != nil {
			log.Errorf("Could not create file index for %v: %v", folder.Path, err)
			continue
		}
		idxs = append(idxs, idx)
	}
	ci = fileindex.NewCompound("1", "Home", idxs...)

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(CORSMiddleware)
	router.Use(ForwardedProtoMiddleware)
	router.Route("/api/", func(r chi.Router) {
		r.Handle("/frame/*", withEntry(handleFrame))
		r.Handle("/playlist/*", withEntry(handlePlaylist))
		r.Handle("/segments/{resolution}/{segment}/*", withEntry(handleSegment))
		r.Handle("/download/*", withEntry(handleDownload))
		r.Handle("/captionlist/*", withEntry(handleCaptionlist))
		r.Handle("/captions/*", withEntry(handleCaption))
		r.HandleFunc("/item/*", handleItem)
	})
	router.Handle("/*", NewSingleAssetHandler("index.html"))
	http.Handle("/", router)
}
