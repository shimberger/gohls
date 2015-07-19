package main

import (
	_ "bytes"
	"log"
	"net/http"
	"os/exec"
	"path"
)

type FrameHandler struct {
	root string
}

func NewFrameHandler(root string) *FrameHandler {
	return &FrameHandler{root}
}

func (s *FrameHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := path.Join(s.root, r.URL.Path)
	cmd := exec.Command("tools/ffmpeg", "-loglevel", "error", "-ss", "00:00:30", "-i", path, "-vf", "scale=320:-1", "-frames:v", "1", "-f", "image2", "-")
	if err := ServeCommand(cmd, w); err != nil {
		log.Printf("Error serving screenshot: %v", err)
	}
}
