package hls

import (
	log "github.com/sirupsen/logrus"
	"net/http"
	"path"
	"regexp"
	"strconv"
	"time"
)

var streamRegexp = regexp.MustCompile(`^(.*)/([0-9]+)\.ts$`)

type StreamHandler struct {
	root    string
	rootUri string
	encoder *Encoder
}

func NewStreamHandler(root string, rootUri string) *StreamHandler {
	return &StreamHandler{root, rootUri, NewEncoder("segments", 2)}
}

func (s *StreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Debugf("Stream request: %v", r.URL.Path)
	matches := streamRegexp.FindStringSubmatch(r.URL.Path)
	if matches == nil {
		http.Error(w, "Wrong path format", 400)
		return
	}

	res := int64(720)
	segment, _ := strconv.ParseInt(matches[2], 0, 64)
	file := path.Join(s.root, matches[1])
	er := NewEncodingRequest(file, segment, res)
	s.encoder.Encode(*er)

	w.Header()["Access-Control-Allow-Origin"] = []string{"*"}
	select {
	case data := <-er.data:
		w.Write(*data)
	case err := <-er.err:
		log.Errorf("Error encoding %v", err)
	case <-time.After(60 * time.Second):
		log.Errorf("Timeout encoding")
	}
}
