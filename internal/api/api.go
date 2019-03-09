package api

import (
	"context"
	"encoding/json"
	"github.com/go-chi/chi"
	_ "github.com/go-chi/chi/middleware"

	"github.com/shimberger/gohls/internal/config"

	"github.com/shimberger/gohls/internal/fileindex"

	"fmt"
	_ "github.com/shimberger/gohls/internal/hls"
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
	router.Use(DebugMiddleware)
	router.Use(CORSMiddleware)
	router.Use(CORSMiddleware)

	router.Route("/api/", func(r chi.Router) {

		r.Handle("/list/", NewFoldersHandler(conf))

		r.HandleFunc("/list/{folder}", func(w http.ResponseWriter, r *http.Request) {
			folderId := chi.URLParam(r, "folder")
			http.Redirect(w, r, "/api/list/"+folderId+"/", 301)
		})

		r.Handle("/list/{folder}/*", withFolder(idxs, handleList))
		r.Handle("/info/{folder}/*", withFolder(idxs, handleInfo))
		r.Handle("/frame/{folder}/*", withFolder(idxs, handleFrame))
		r.Handle("/playlist/{folder}/*", withFolder(idxs, handlePlaylist))
		r.Handle("/segments/{folder}/*", withFolder(idxs, handleSegment))
		r.Handle("/download/{folder}/*", withFolder(idxs, handleDownload))

	})

	//router.PathPrefix("/").Handler(NewSingleAssetHandler("index.html"))
	// Setup HTTP server
	http.Handle("/", router)

}
