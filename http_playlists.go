package main

import (
	"fmt"
	"net/http"
	"net/url"
	"path"
)

// UrlEncoded encodes a string like Javascript's encodeURIComponent()
func UrlEncoded(str string) (string, error) {
	u, err := url.Parse(str)
	if err != nil {
		return "", err
	}
	return u.String(), nil
}

const hlsSegmentLength = 5.0 // 5 Seconds

type PlaylistHandler struct {
	root string
}

func NewPlaylistHandler(root string) *PlaylistHandler {
	return &PlaylistHandler{root}
}

func (s *PlaylistHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	filePath := path.Join(s.root, r.URL.Path)
	vinfo, err := GetVideoInformation(filePath)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	duration := vinfo.Duration
	baseurl := fmt.Sprintf("http://%v", r.Host)

	id, err := UrlEncoded(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header()["Content-Type"] = []string{"application/vnd.apple.mpegurl"}
	w.Header()["Access-Control-Allow-Origin"] = []string{"*"}

	fmt.Fprint(w, "#EXTM3U\n")
	fmt.Fprint(w, "#EXT-X-VERSION:3\n")
	fmt.Fprint(w, "#EXT-X-MEDIA-SEQUENCE:0\n")
	fmt.Fprint(w, "#EXT-X-ALLOW-CACHE:YES\n")
	fmt.Fprint(w, "#EXT-X-TARGETDURATION:5\n")
	fmt.Fprint(w, "#EXT-X-PLAYLIST-TYPE:VOD\n")

	leftover := duration
	segmentIndex := 0

	for leftover > 0 {
		if leftover > hlsSegmentLength {
			fmt.Fprintf(w, "#EXTINF: %f,\n", hlsSegmentLength)
		} else {
			fmt.Fprintf(w, "#EXTINF: %f,\n", leftover)
		}
		fmt.Fprintf(w, baseurl+"/segments/%v/%v.ts\n", id, segmentIndex)
		segmentIndex++
		leftover = leftover - hlsSegmentLength
	}
	fmt.Fprint(w, "#EXT-X-ENDLIST\n")
}
