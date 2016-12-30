package hls

import (
	"fmt"
	log "github.com/Sirupsen/logrus"
	"net/http"
	"path"
	"strconv"
)

type FrameHandler struct {
	root       string
	cmdHandler *HttpCommandHandler
}

func NewFrameHandler(root string) *FrameHandler {
	return &FrameHandler{root, NewHttpCommandHandler(2, "frames")}
}

func (s *FrameHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	t := r.URL.Query().Get("t")
	time := 30
	if tint, err := strconv.Atoi(t); err == nil {
		time = tint
	}
	path := path.Join(s.root, r.URL.Path)
	args := []string{
		"-timelimit", "15",
		"-loglevel", "error",
		"-ss", fmt.Sprintf("%v.0", time),
		"-i", path,
		"-vf", "scale=320:-1",
		"-frames:v", "1",
		"-f", "image2",
		"-",
	}
	if err := s.cmdHandler.ServeCommand(FFMPEGPath, args, calculateCommandHash(FFMPEGPath, args), w); err != nil {
		log.Errorf("Problem serving screenshot: %v", err)
	}
}
