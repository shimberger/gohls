package api

import (
	"bytes"
	"fmt"
	"io"
	"mime"
	"net/http"
	"path"
	"strings"

	rice "github.com/GeertJohan/go.rice"
	log "github.com/sirupsen/logrus"
)

var staticBox *rice.Box

type singleAssetHandler struct {
	path string
}

func NewSingleAssetHandler(path string) *singleAssetHandler {
	staticBox = rice.MustFindBox("../../ui/build")
	return &singleAssetHandler{path}
}

func (s *singleAssetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	data, err := staticBox.Bytes(strings.TrimLeft(r.URL.Path, "/"))
	if err != nil {
		log.Debugf("SPA HTTP handling fallback")
		data, err := staticBox.Bytes(s.path)
		if err != nil {
			http.NotFound(w, r)
			fmt.Fprintf(w, "Not found %v", s.path)
		}
		w.Header().Set("Content-Type", mime.TypeByExtension(path.Ext(s.path)))
		io.Copy(w, bytes.NewBuffer(data))
		// Asset was not found.
	}
	w.Header().Set("Content-Type", mime.TypeByExtension(path.Ext(r.URL.Path)))
	io.Copy(w, bytes.NewBuffer(data))
}
