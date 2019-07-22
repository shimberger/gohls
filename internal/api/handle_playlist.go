package api

import (
	"fmt"
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	"net/http"
)

func handlePlaylist(w http.ResponseWriter, r *http.Request) {
	w.Header()["Content-Type"] = []string{hls.PlaylistContentType}
	entry := getEntry(r)
	template := fmt.Sprintf("%v://%v/api/segments/{{.Resolution}}/{{.Segment}}/%v/%v", r.URL.Scheme, r.Host, chi.URLParam(r, "folder"), chi.URLParam(r, "*"))
	hls.WritePlaylist(template, entry.Path(), w)
}
