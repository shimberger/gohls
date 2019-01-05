package main

import (
	homedir "github.com/mitchellh/go-homedir"
	"github.com/shimberger/gohls/hls"
	log "github.com/sirupsen/logrus"
	"os"
	"os/exec"
	"path"
	"strconv"
)

func init() {
	log.SetOutput(os.Stderr)
	log.SetLevel(log.InfoLevel)
	if _, err := strconv.ParseBool(os.Getenv("DEBUG")); err == nil {
		log.SetLevel(log.DebugLevel)
	}
	if _, err := strconv.ParseBool(os.Getenv("TRACE")); err == nil {
		log.SetLevel(log.TraceLevel)
	}

	// Find ffmpeg
	ffmpeg, err := exec.LookPath("ffmpeg")
	if err != nil {
		log.Fatal("ffmpeg could not be found in your path", err)
	}

	// Find ffprobe
	ffprobe, err := exec.LookPath("ffprobe")
	if err != nil {
		log.Fatal("ffprobe could not be found in your path", err)
	}

	homeDir, err := homedir.Dir()
	if err != nil {
		log.Fatal("Could not determine home directory", err)
	}

	// Configure HLS module
	hls.FFMPEGPath = ffmpeg
	hls.FFProbePath = ffprobe
	hls.HomeDir = path.Join(homeDir, ".gohls")
}
