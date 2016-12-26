package hls

import (
	"fmt"
	log "github.com/Sirupsen/logrus"
	"net/http"
	"path"
	"strconv"
	"strings"
)

type StreamHandler struct {
	root       string
	cmdHandler *HttpCommandHandler
}

func NewStreamHandler(root string) *StreamHandler {
	return &StreamHandler{root, NewHttpCommandHandler(1, "segments")}
}

func (s *StreamHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	filePath := path.Join(s.root, r.URL.Path[0:strings.LastIndex(r.URL.Path, "/")])
	idx, _ := strconv.ParseInt(r.URL.Path[strings.LastIndex(r.URL.Path, "/")+1:strings.LastIndex(r.URL.Path, ".")], 0, 64)
	startTime := idx * hlsSegmentLength
	log.Debugf("Streaming second %v of %v", startTime, filePath)
	w.Header()["Access-Control-Allow-Origin"] = []string{"*"}
	if err := s.cmdHandler.ServeCommand(FFMPEGPath, []string{
		"-timelimit", "30", // max exeution time
		"-ss", fmt.Sprintf("%v.00", startTime), // offset
		"-t", fmt.Sprintf("%v.00", hlsSegmentLength), // duration
		"-i", filePath, // input
		"-strict", "-2",
		"-vcodec", "libx264",
		"-acodec", "aac",
		"-pix_fmt", "yuv420p",
		"-r", "25",
		"-f", "mpegts",
		"-force_key_frames", "00:00:00.00",
		"-x264opts", "keyint=25:min-keyint=25:scenecut=-1",
		"-"}, w); err != nil {
		log.Errorf("Problem streaming file %v and segment %v: %v", filePath, idx, err)
	}
}
