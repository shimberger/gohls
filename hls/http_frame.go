package hls

import (
	log "github.com/Sirupsen/logrus"
	"net/http"
	"path"
)

type FrameHandler struct {
	root       string
	cmdHandler *HttpCommandHandler
}

func NewFrameHandler(root string) *FrameHandler {
	return &FrameHandler{root, NewHttpCommandHandler(2, "frames")}
}

func (s *FrameHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := path.Join(s.root, r.URL.Path)
	if err := s.cmdHandler.ServeCommand(FFMPEGPath, []string{"-timelimit", "10", "-loglevel", "error", "-ss", "00:00:30", "-i", path, "-vf", "scale=320:-1", "-frames:v", "1", "-f", "image2", "-"}, w); err != nil {
		log.Errorf("Problem serving screenshot: %v", err)
	}
}
