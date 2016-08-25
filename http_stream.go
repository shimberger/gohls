package main

import (
	"fmt"
	"net/http"
	"os/exec"
	"path"
	"strconv"
	"strings"
)

type StreamHandler struct {
	root string
}

func NewStreamHandler(root string) *StreamHandler {
	return &StreamHandler{root}
}

func (s *StreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	filePath := path.Join(s.root, r.URL.Path[0:strings.LastIndex(r.URL.Path, "/")])
	idx, _ := strconv.ParseInt(r.URL.Path[strings.LastIndex(r.URL.Path, "/")+1:strings.LastIndex(r.URL.Path, ".")], 0, 64)
	startTime := idx * hlsSegmentLength
	debug.Printf("Streaming second %v of %v", startTime, filePath)

	w.Header()["Access-Control-Allow-Origin"] = []string{"*"}

	cmd := exec.Command("tools/ffmpeg", "-ss", fmt.Sprintf("%v", startTime), "-t", "5", "-i", filePath, "-vcodec", "libx264", "-strict", "experimental", "-acodec", "aac", "-pix_fmt", "yuv420p", "-r", "25", "-profile:v", "baseline", "-b:v", "2000k", "-maxrate", "2500k", "-f", "mpegts", "-")
	ServeCommand(cmd, w)
}
