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
	// see http://superuser.com/questions/908280/what-is-the-correct-way-to-fix-keyframes-in-ffmpeg-for-dash
	if err := s.cmdHandler.ServeCommand(FFMPEGPath, []string{
		// Prevent encoding to run longer than 30 seonds
		"-timelimit", "45",

		// TODO: Some stuff to investigate
		// "-probesize", "524288",
		// "-fpsprobesize", "10",
		// "-analyzeduration", "2147483647",
		//"-hwaccel:0", "qsv",

		// The start time
		// important: needs to be before -i to do input seeking
		"-ss", fmt.Sprintf("%v.00", startTime),

		// The source file
		"-i", filePath,

		// Put all streams to output
		"-map", "0",

		// The duration
		"-t", fmt.Sprintf("%v.00", hlsSegmentLength),

		// TODO: Find out what it does
		//"-strict", "-2",

		// x264 video codec
		"-vcodec", "libx264",

		// x264 preset
		"-preset", "fast",

		// aac audio codec
		"-acodec", "aac",

		//
		"-pix_fmt", "yuv420p",

		//"-r", "25", // fixed framerate

		"-force_key_frames", "expr:gte(t,n_forced*5.000)",

		//"-force_key_frames", "00:00:00.00",
		//"-x264opts", "keyint=25:min-keyint=25:scenecut=-1",

		//"-f", "mpegts",

		"-f", "ssegment",
		"-segment_time", fmt.Sprintf("%v.00", hlsSegmentLength),
		"-initial_offset", fmt.Sprintf("%v.00", startTime),

		"pipe:out%03d.ts"}, w); err != nil {
		log.Errorf("Problem streaming file %v and segment %v: %v", filePath, idx, err)
	}
}
