package main

import (
	"flag"
	log "github.com/Sirupsen/logrus"
	"github.com/shimberger/gohls/hls"
	"path"
)

func setVideoDir(f *flag.FlagSet) string {
	if f.NArg() > 0 {
		videoDir := f.Arg(0)
		hls.HomeDir = path.Join(videoDir, ".gohls")
		return videoDir
	}
	log.Fatalf("Path to videos not specified")
	return ""
}
