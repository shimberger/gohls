package api

import (
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	"net/http"
	"strconv"
)

func handleSegment(w http.ResponseWriter, r *http.Request) {
	entry := getEntry(r)
	segment, _ := strconv.ParseInt(chi.URLParam(r, "segment"), 0, 64)
	resolution := int64(720)
	hls.WriteSegment(entry.Path(), segment, resolution, w)
}
