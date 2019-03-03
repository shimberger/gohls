package api

import (
	"github.com/shimberger/gohls/internal/config"
	"github.com/shimberger/gohls/internal/hls"
	"net/http"
	"path"
)

type foldersHandler struct {
	conf *config.Config
}

func NewFoldersHandler(conf *config.Config) *foldersHandler {
	return &foldersHandler{conf}
}

func (s *foldersHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	videos := make([]*hls.ListResponseVideo, 0)
	folders := make([]*hls.ListResponseFolder, 0)
	parents := make([]*hls.ListResponseFolder, 0)
	response := &hls.ListResponse{nil, "Home", "/", &parents, folders, videos}
	for _, f := range s.conf.Folders {
		folder := &hls.ListResponseFolder{f.Title, path.Join(r.URL.Path, f.Id)}
		folders = append(folders, folder)
	}
	response.Videos = videos
	response.Folders = folders
	hls.ServeJson(200, response, w)
}
