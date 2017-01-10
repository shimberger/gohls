package main

import (
	"net/http"
	"path/filepath"
)

type downloadHandler struct {
	dir string
}

func NewDownloadHandler(root string) *downloadHandler {
	return &downloadHandler{root}
}

func (s *downloadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Disposition", "attachment; filename='"+filepath.Base(r.URL.Path)+"'")
	http.ServeFile(w, r, filepath.Join(s.dir, r.URL.Path))
}
