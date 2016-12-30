package hls

import (
	log "github.com/Sirupsen/logrus"
	"net/http"
	"path"
	"strconv"
	"strings"
	"time"
)

type StreamHandler struct {
	root    string
	encoder *Encoder
}

func NewStreamHandler(root string) *StreamHandler {
	return &StreamHandler{root, NewEncoder("segments", 2)}
}

func (s *StreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	filePath := path.Join(s.root, r.URL.Path[0:strings.LastIndex(r.URL.Path, "/")])
	idx, _ := strconv.ParseInt(r.URL.Path[strings.LastIndex(r.URL.Path, "/")+1:strings.LastIndex(r.URL.Path, ".")], 0, 64)
	w.Header()["Access-Control-Allow-Origin"] = []string{"*"}
	er := NewEncodingRequest(filePath, idx)
	s.encoder.Encode(*er)
	select {
	case data := <-er.data:
		w.Write(*data)
	case err := <-er.err:
		log.Errorf("Error encoding %v", err)
	case <-time.After(60 * time.Second):
		log.Errorf("Timeout encoding")
	}
}
