package api

import (
	"net/http"

	"github.com/shimberger/gohls/internal/hls"
)

func handleCaption(w http.ResponseWriter, r *http.Request) {
	w.Header()["Content-Type"] = []string{hls.CaptionContentType}
	file := getEntry(r).Path()
	hls.WriteCaption(file, w)
}
