package api

import (
	"fmt"
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	"net/http"
)

func handlePlaylist(w http.ResponseWriter, r *http.Request) {
	entry := getEntry(r)
	idx := getIndexWithRoot(r).idx
	path := entry.Path()
	pathParam := "" + chi.URLParam(r, "*")

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
