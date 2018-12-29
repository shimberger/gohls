package hls

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"net/http"
	"path"
	"strings"
)

type ListResponseVideo struct {
	Name string     `json:"name"`
	Path string     `json:"path"`
	Info *VideoInfo `json:"info"`
}

type ListResponseFolder struct {
	Name string `json:"name"`
	Path string `json:"path"`
}

type ListResponse struct {
	Error   error                 `json:"error"`
	Name    string                `json:"name"`
	Path    string                `json:"path"`
	Parents []*ListResponseFolder `json:"parents"`
	Folders []*ListResponseFolder `json:"folders"`
	Videos  []*ListResponseVideo  `json:"videos"`
}

type ListHandler struct {
	path    string
	name    string
	rootUri string
}

func NewListHandler(path string, name string, rootUri string) *ListHandler {
	return &ListHandler{path, name, rootUri}
}

func (s *ListHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	videos := make([]*ListResponseVideo, 0)
	folders := make([]*ListResponseFolder, 0)

	parents := make([]*ListResponseFolder, 0)
	parents = append(parents, &ListResponseFolder{"Home", "/"})
	response := &ListResponse{nil, s.name, s.rootUri, parents, folders, videos}

	if r.URL.Path != "" {
		response.Path = path.Join(s.rootUri, r.URL.Path)
		response.Name = path.Base(r.URL.Path)
	}

	files, rerr := ioutil.ReadDir(path.Join(s.path, r.URL.Path))
	if rerr != nil {
		response.Error = fmt.Errorf("Error reading path: %v", r.URL.Path)
		ServeJson(500, response, w)
		return
	}
	for _, f := range files {
		filePath := path.Join(s.path, r.URL.Path, f.Name())
		if strings.HasPrefix(f.Name(), ".") || strings.HasPrefix(f.Name(), "$") {
			continue
		}
		if FilenameLooksLikeVideo(filePath) {
			vinfo, err := GetVideoInformation(filePath)
			if err != nil {
				log.Errorf("Could not read video information of %v: %v", filePath, err)
				continue
			}
			video := &ListResponseVideo{f.Name(), path.Join(s.rootUri, r.URL.Path, f.Name()), vinfo}
			videos = append(videos, video)
		}
		if f.IsDir() {
			folder := &ListResponseFolder{f.Name(), path.Join(s.rootUri, r.URL.Path, f.Name())}
			folders = append(folders, folder)
		}
	}
	response.Videos = videos
	response.Folders = folders
	ServeJson(200, response, w)
}
