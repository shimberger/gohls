package api

import (
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	"net/http"
	"path"
)

func handleInfo(w http.ResponseWriter, r *http.Request) {
	pathParam := "" + chi.URLParam(r, "*")
	d := getIndexWithRoot(r)
	idx := d.idx
	rootUri := idx.Id()
	name := d.root.Title

	folderName := ""
	folderPath := ""

	entry, err := idx.Get(pathParam)
	if err != nil {
		serveJson(404, err, w)
		return
	}
	if !hls.FilenameLooksLikeVideo(entry.Path()) {
		serveJson(404, "Not found", w)
		return
	}

	vinfo, err := hls.GetVideoInformation(entry.Path())
	if err != nil {
		serveJson(500, err, w)
		return
	}

	if entry.ParentId() != "" {
		folder, err := idx.Get(entry.ParentId())
		if err != nil {
			serveJson(404, err, w)
			return
		}
		folderName = folder.Name()
		folderPath = ""
	}

	videos := make([]*ListResponseVideo, 0)
	folders := make([]*ListResponseFolder, 0)
	parents := make([]*ListResponseFolder, 0)
	response := &ListResponse{nil, folderName, folderPath, &parents, folders, videos}

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

	parents = append(parents, &ListResponseFolder{"Home", ""})

	videos = append(videos, &ListResponseVideo{entry.Name(), path.Join(rootUri, entry.Id()), vinfo})
	response.Videos = videos
	response.Parents = &parents

	serveJson(200, response, w)

}
