package api

import (
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	log "github.com/sirupsen/logrus"
	"net/http"
	"regexp"
	"strconv"
)

var streamRegexp = regexp.MustCompile(`^(.*)/([0-9]+)\.ts$`)

func handleSegment(w http.ResponseWriter, r *http.Request) {
	log.Debugf("Stream request: %v", r.URL.Path)

	pathParam := "" + chi.URLParam(r, "*")
	d := getIndexWithRoot(r)
	idx := d.idx

	matches := streamRegexp.FindStringSubmatch(pathParam)
	if matches == nil {
		http.Error(w, "Wrong path format", 400)
		return
	}

	entry, err := idx.Get(matches[1])
	if err != nil {
		serveJson(404, err, w)
		return
	}

	res := int64(720)
	segment, _ := strconv.ParseInt(matches[2], 0, 64)
	file := entry.Path()

	hls.WriteSegment(file, segment, res, w)
}
