package api

import (
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	log "github.com/sirupsen/logrus"
	"net/http"
	"path"
	"strings"
)

type ListResponseVideo struct {
	Name string         `json:"name"`
	Path string         `json:"path"`
	Info *hls.VideoInfo `json:"info"`
}

type ListResponseFolder struct {
	Name string `json:"name"`
	Path string `json:"path"`
}

type ListResponse struct {
	Error   error                  `json:"error"`
	Name    string                 `json:"name"`
	Path    string                 `json:"path"`
	Parents *[]*ListResponseFolder `json:"parents"`
	Folders []*ListResponseFolder  `json:"folders"`
	Videos  []*ListResponseVideo   `json:"videos"`
}

func handleList(w http.ResponseWriter, r *http.Request) {
	pathParam := "" + chi.URLParam(r, "*")
	log.Debugf("ListHandler called for %v", pathParam)

	d := getIndexWithRoot(r)
	idx := d.idx
	rootUri := idx.Id()
	name := d.root.Title
	videos := make([]*ListResponseVideo, 0)
	folders := make([]*ListResponseFolder, 0)
	parents := make([]*ListResponseFolder, 0)
	response := &ListResponse{nil, name, "/", &parents, folders, videos}

	if pathParam != "" {
		entry, err := idx.Get(pathParam)
		if err != nil {
			serveJson(404, err, w)
			return
		}

		curr := entry
		for curr.ParentId() != "" {
			curr, err = idx.Get(curr.ParentId())
			if err != nil {
				serveJson(500, err, w)
				return
			}
			parents = append(parents, &ListResponseFolder{curr.Name(), path.Join(rootUri, curr.Id())})
		}
		parents = append(parents, &ListResponseFolder{name, rootUri})

		response.Path = path.Join(rootUri, entry.Id())
		response.Name = entry.Name()
	}

	parents = append(parents, &ListResponseFolder{"Home", ""})

	files, err := idx.List(pathParam)
	if err != nil {
		serveJson(404, err, w)
		return
	}
	for _, f := range files {
		if strings.HasPrefix(f.Name(), ".") || strings.HasPrefix(f.Name(), "$") {
			continue
		}
		if hls.FilenameLooksLikeVideo(f.Path()) {
			vinfo, err := hls.GetVideoInformation(f.Path())
			if err != nil {
				log.Errorf("Could not read video information of %v: %v", f.Path(), err)
				continue
			}
			video := &ListResponseVideo{f.Name(), path.Join(rootUri, f.Id()), vinfo}
			videos = append(videos, video)
		}
		if f.IsDir() {
			folder := &ListResponseFolder{f.Name(), path.Join(rootUri, f.Id())}
			folders = append(folders, folder)
		}
	}
	response.Videos = videos
	response.Folders = folders
	serveJson(200, response, w)
}
