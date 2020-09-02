package api

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/fileindex"
	"github.com/shimberger/gohls/internal/hls"
	log "github.com/sirupsen/logrus"
)

type Item struct {
	Id   string         `json:"id"`
	Type string         `json:"type"`
	Name string         `json:"name"`
	Path string         `json:"path"`
	Info *hls.VideoInfo `json:"info"`
	Prev string         `json:"prev"`
	Next string         `json:"next"`
}

type ItemResponse struct {
	Item
	Children []Item `json:"children"`
	Parents  []Item `json:"parents"`
}

func getType(e fileindex.Entry) string {
	if !e.IsDir() {
		return "video"
	}
	return "folder"
}

func entriesToItems(entries []fileindex.Entry, parent Item) []Item {
	items := make([]Item, 0)
	for _, entry := range entries {
		var (
			err   error
			vinfo *hls.VideoInfo
		)
		if hls.FilenameLooksLikeVideo(entry.Path()) {
			vinfo, err = hls.GetVideoInformation(entry.Path())
			if err != nil {
				continue
			}
		}
		if !hls.FilenameLooksLikeVideo(entry.Path()) && !entry.IsDir() {
			continue
		}
		items = append(items, Item{entry.Id(), getType(entry), entry.Name(), entry.Id(), vinfo, "", ""})
	}
	return items
}

func handleItem(w http.ResponseWriter, r *http.Request) {
	ci.WaitForReady()
	path := chi.URLParam(r, "*")
	entries, _ := ci.List(path)
	item := Item{"", "folder", "Home", "", nil, "", ""}
	parents := make([]Item, 0)

	if path != "" {
		entry, _ := ci.Get(path)
		prev, next := getPrevNext(path)
		item = Item{entry.Id(), getType(entry), entry.Name(), entry.Id(), nil, prev, next}
		curr := entry
		for curr.ParentId() != "" {
			curr2, err := ci.Get(curr.ParentId())
			if err != nil {
				log.Errorf("Error getting parent: %v", err)
				serveJson(500, err, w)
				return
			}
			parents = append(parents, Item{curr2.Id(), getType(curr2), curr2.Name(), curr2.Id(), nil, "", ""})
			curr = curr2
		}

		parents = append(parents, Item{"", "folder", "Home", "", nil, "", ""})
	}

	response := ItemResponse{item, entriesToItems(entries, item), parents}
	serveJson(200, response, w)
}

func getPrevNext(path string) (prev string, next string) {
	entry, _ := ci.Get(path)
	entries, _ := ci.List(entry.ParentId())
	found := false
	for _, e := range entries {
		if found {
			if !e.IsDir() {
				next = e.Id()
				break
			}
		} else {
			if e.Id() == path {
				found = true
			}
			if !found && !e.IsDir() {
				prev = e.Id()
			}
		}
	}
	return
}
