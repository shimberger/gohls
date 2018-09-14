package main

import (
	"bytes"
	"fmt"
	"io"
	"mime"
	"net/http"
	"path"
	"strings"

	log "github.com/Sirupsen/logrus"
)

// SingleAssetHandler handles an asset in a path
type SingleAssetHandler struct {
	path string
}

// NewSingleAssetHandler returns an asset handler
func NewSingleAssetHandler(path string) *SingleAssetHandler {
	return &SingleAssetHandler{path}
}

func (s *SingleAssetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	data, err := Asset(strings.TrimLeft(r.URL.Path, "/"))
	if err != nil {
		log.Debugf("SPA HTTP handling fallback")
		data, err = Asset(s.path)
		if err != nil {
			http.NotFound(w, r)
			fmt.Fprintf(w, "Not found %v", s.path)
			return
		}
		w.Header().Set("Content-Type", mime.TypeByExtension(path.Ext(s.path)))
		io.Copy(w, bytes.NewBuffer(data))
		// Asset was not found.
	}
	w.Header().Set("Content-Type", mime.TypeByExtension(path.Ext(r.URL.Path)))
	io.Copy(w, bytes.NewBuffer(data))
}
