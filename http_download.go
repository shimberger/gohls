package main

import (
	"github.com/shimberger/gohls/hls"
	log "github.com/sirupsen/logrus"
	"net/http"
	"path/filepath"
	"strings"
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
