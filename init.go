package main

import (
	log "github.com/Sirupsen/logrus"
	"github.com/shimberger/gohls/hls"
	"os"
	"os/exec"
	"strconv"
)

func init() {
	log.SetOutput(os.Stderr)
	log.SetLevel(log.InfoLevel)
	if _, err := strconv.ParseBool(os.Getenv("DEBUG")); err == nil {
		log.SetLevel(log.DebugLevel)
	}

	// Find ffmpeg
	ffmpeg, f1err := exec.LookPath("ffmpeg")
	if f1err != nil {
		log.Fatal("ffmpeg could not be found in your path", f1err)
	}

	// Find ffprobe
	ffprobe, f2err := exec.LookPath("ffprobe")
	if f2err != nil {
		log.Fatal("ffprobe could not be found in your path", f2err)
	}

	// Configure HLS module
	hls.FFMPEGPath = ffmpeg
	hls.FFProbePath = ffprobe
}
