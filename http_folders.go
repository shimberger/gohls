package main

import (
	"github.com/shimberger/gohls/hls"
	"net/http"
	"path"
)

type foldersHandler struct {
	config *Config
}

func NewFoldersHandler(config *Config) *foldersHandler {
	return &foldersHandler{config}
}

func (s *foldersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	videos := make([]*hls.ListResponseVideo, 0)
	folders := make([]*hls.ListResponseFolder, 0)
	parents := make([]*hls.ListResponseFolder, 0)
	response := &hls.ListResponse{nil, "Home", "/", parents, folders, videos}
	for _, f := range s.config.Folders {
		folder := &hls.ListResponseFolder{f.Title, path.Join(r.URL.Path, f.Id)}
		folders = append(folders, folder)
	}
	response.Videos = videos
	response.Folders = folders
	hls.ServeJson(200, response, w)
}
