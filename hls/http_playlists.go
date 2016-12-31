package hls

import (
	"fmt"
	log "github.com/Sirupsen/logrus"
	"net/http"
	"net/url"
	"path"
	"regexp"
)

var playlistRegexp = regexp.MustCompile(`^(320|480|720|1080)/(.*)$`)

// Encodes a string like Javascript's encodeURIComponent()
func urlEncoded(str string) (string, error) {
	u, err := url.Parse(str)
	if err != nil {
		return "", err
	}
	return u.String(), nil
}

type PlaylistHandler struct {
	root string
}

func NewPlaylistHandler(root string) *PlaylistHandler {
	return &PlaylistHandler{root}
}

func (s *PlaylistHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Debugf("Playlist request: %v", r.URL.Path)
	matches := playlistRegexp.FindStringSubmatch(r.URL.Path)
	if matches == nil {
		http.Error(w, "Wrong path format", 400)
		return
	}
	file := path.Join(s.root, matches[2])
	res := matches[1]
	log.Debugf("Playlist request: %v", matches)

	vinfo, err := GetVideoInformation(file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	duration := vinfo.Duration
	baseurl := fmt.Sprintf("http://%v", r.Host)

	id, err := urlEncoded(matches[2])
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
	fmt.Fprint(w, "#EXT-X-TARGETDURATION:"+fmt.Sprintf("%.f", hlsSegmentLength)+"\n")
	fmt.Fprint(w, "#EXT-X-PLAYLIST-TYPE:VOD\n")

	leftover := duration
	segmentIndex := 0

	for leftover > 0 {
		if leftover > hlsSegmentLength {
			fmt.Fprintf(w, "#EXTINF: %f,\n", hlsSegmentLength)
		} else {
			fmt.Fprintf(w, "#EXTINF: %f,\n", leftover)
		}
		fmt.Fprintf(w, baseurl+"/segments/%v/%v/%v.ts\n", id, res, segmentIndex)
		segmentIndex++
		leftover = leftover - hlsSegmentLength
	}
	fmt.Fprint(w, "#EXT-X-ENDLIST\n")
}
