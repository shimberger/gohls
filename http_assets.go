package main

import (
	"bytes"
	"fmt"
	"io"
	"mime"
	"net/http"
	"path"
)

type assetHandler struct{}

func (s *assetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	data, err := Asset(r.URL.Path)
	if err != nil {
		fmt.Fprintf(w, "Not gfound %v", r.URL.Path)
		// Asset was not found.
	}
	w.Header().Set("Content-Type", mime.TypeByExtension(path.Ext(r.URL.Path)))
	io.Copy(w, bytes.NewBuffer(data))
}
