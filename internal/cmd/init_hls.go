package cmd

import (
	"os"
	"os/exec"
	"path/filepath"

	"github.com/shimberger/gohls/internal/hls"
	log "github.com/sirupsen/logrus"
)

func init_hls(dataDir string) {
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

	log.Infof("Initializing HLS with directory '%v'", dataDir)
	dataDirInfo, err := os.Stat(dataDir)
	if err != nil {
		if !os.IsNotExist(err) {
			log.Fatalf("Error reading data directory '%v': %v", dataDir, err)
		}
		if err := os.Mkdir(filepath.Base(dataDir), 0750); err != nil {
			log.Fatalf("Could not create data directory '%v': %v", dataDir, err)
		}
	} else {
		if !dataDirInfo.IsDir() {
			log.Fatalf("Data directory '%v' is not a directory", dataDir)
		}
	}

	// Configure HLS module
	hls.FFMPEGPath = ffmpeg
	hls.FFProbePath = ffprobe
	hls.HomeDir = dataDir
}
