package api

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/shimberger/gohls/internal/config"
	"github.com/shimberger/gohls/internal/fileindex"
	log "github.com/sirupsen/logrus"
	"net/http"
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

func withFolder(idxs map[string]*indexWithRoot, handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		folderId := chi.URLParam(r, "folder")
		if d, ok := idxs[folderId]; ok {
			d.idx.WaitForReady()
			r = setIndexWithRoot(r, d)
			handler(w, r)
			return
		}
		serveJson(404, fmt.Errorf("folder not found"), w)
	}
}

func withEntry(idxs map[string]*indexWithRoot, handler http.HandlerFunc) http.HandlerFunc {
	return withFolder(idxs, func(w http.ResponseWriter, r *http.Request) {
		pathParam := "" + chi.URLParam(r, "*")
		d := getIndexWithRoot(r)
		idx := d.idx

		entry, err := idx.Get(pathParam)
		if err != nil {
			serveJson(404, err, w)
			return
		}
		r = setEntry(r, entry)
		handler(w, r)
	})
}

func setEntry(r *http.Request, e fileindex.Entry) *http.Request {
	return r.WithContext(context.WithValue(r.Context(), "entry", e))
}

func getEntry(r *http.Request) fileindex.Entry {
	return r.Context().Value("entry").(fileindex.Entry)
}

func setIndexWithRoot(r *http.Request, d *indexWithRoot) *http.Request {
	return r.WithContext(context.WithValue(r.Context(), "indexWithRoot", d))
}

func getIndexWithRoot(r *http.Request) *indexWithRoot {
	return r.Context().Value("indexWithRoot").(*indexWithRoot)
}

type indexWithRoot struct {
	idx  fileindex.Index
	root config.RootFolder
}

func Setup(conf *config.Config) {
	idxs := make(map[string]*indexWithRoot)
	for _, folder := range conf.Folders {
		id := folder.Id
		idx, err := fileindex.NewMemIndex(folder.Path, id, fileindex.HiddenFilter)
		if err != nil {
			log.Errorf("Could not create file index for %v: %v", folder.Path, err)
			continue
		}
		idxs[id] = &indexWithRoot{idx, folder}
	}

	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(CORSMiddleware)
	router.Use(ForwardedProtoMiddleware)

	router.Route("/api/", func(r chi.Router) {

		r.Handle("/list/", NewFoldersHandler(conf))

		r.HandleFunc("/list/{folder}", func(w http.ResponseWriter, r *http.Request) {
			folderId := chi.URLParam(r, "folder")
			http.Redirect(w, r, "/api/list/"+folderId+"/", 301)
		})

		r.Handle("/list/{folder}/*", withFolder(idxs, handleList))
		r.Handle("/info/{folder}/*", withFolder(idxs, handleInfo))
		r.Handle("/frame/{folder}/*", withEntry(idxs, handleFrame))
		r.Handle("/playlist/{folder}/*", withEntry(idxs, handlePlaylist))
		r.Handle("/segments/{resolution}/{segment}/{folder}/*", withEntry(idxs, handleSegment))
		r.Handle("/download/{folder}/*", withEntry(idxs, handleDownload))

	})

	router.Handle("/*", NewSingleAssetHandler("index.html"))
	// Setup HTTP server
	http.Handle("/", router)

}
