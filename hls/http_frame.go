package hls

import (
	"log"
	"net/http"
	"path"
)

type FrameHandler struct {
	root       string
	cmdPath    string
	cmdHandler *HttpCommandHandler
}

func NewFrameHandler(root string, cmdPath string) *FrameHandler {
	return &FrameHandler{root, cmdPath, NewHttpCommandHandler(2, "frames")}
}

func (s *FrameHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := path.Join(s.root, r.URL.Path)
	if err := s.cmdHandler.ServeCommand(s.cmdPath, []string{"-timelimit", "10", "-loglevel", "error", "-ss", "00:00:30", "-i", path, "-vf", "scale=320:-1", "-frames:v", "1", "-f", "image2", "-"}, w); err != nil {
		log.Printf("Error serving screenshot: %v", err)
	}
}
