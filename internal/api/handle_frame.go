package api

import (
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	"net/http"
	"strconv"
)

func handleFrame(w http.ResponseWriter, r *http.Request) {
	t := r.URL.Query().Get("t")
	time := 30
	if tint, err := strconv.Atoi(t); err == nil {
		time = tint
	}

	pathParam := "" + chi.URLParam(r, "*")
	d := getIndexWithRoot(r)
	idx := d.idx

	entry, err := idx.Get(pathParam)
	if err != nil {
		serveJson(404, err, w)
		return
	}
	path := entry.Path()
	hls.WriteFrame(path, time, w)
}
