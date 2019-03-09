package api

import (
	"github.com/shimberger/gohls/internal/config"
	"net/http"
)

type foldersHandler struct {
	conf *config.Config
}

func NewFoldersHandler(conf *config.Config) *foldersHandler {
	return &foldersHandler{conf}
}

func (s *foldersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	videos := make([]*ListResponseVideo, 0)
	folders := make([]*ListResponseFolder, 0)
	parents := make([]*ListResponseFolder, 0)
	response := &ListResponse{nil, "Home", "/", &parents, folders, videos}
	for _, f := range s.conf.Folders {
		folder := &ListResponseFolder{f.Title, f.Id}
		folders = append(folders, folder)
	}
	response.Videos = videos
	response.Folders = folders
	serveJson(200, response, w)
}
