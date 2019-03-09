package api

import (
	"fmt"
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	"net/http"
)

func handlePlaylist(w http.ResponseWriter, r *http.Request) {
	pathParam := "" + chi.URLParam(r, "*")
	d := getIndexWithRoot(r)
	idx := d.idx

	entry, err := idx.Get(pathParam)
	if err != nil {
		serveJson(404, err, w)
		return
	}
	path := entry.Path()

	vinfo, err := hls.GetVideoInformation(path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Refactor into middleware
	protocol := "http"
	if r.Header.Get("X-Forwarded-Proto") != "" {
		protocol = r.Header.Get("X-Forwarded-Proto")
	}

	baseurl := fmt.Sprintf("%v://%v/api/segments/%v/%v", protocol, r.Host, idx.Id(), pathParam)

	w.Header()["Content-Type"] = []string{"application/vnd.apple.mpegurl"}
	w.Header()["Access-Control-Allow-Origin"] = []string{"*"}

	hls.WritePlaylist(baseurl, vinfo, w)
}
