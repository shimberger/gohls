package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/google/subcommands"
	"github.com/shimberger/gohls/hls"
	"net/http"
)

type serveCmd struct {
	port    int
	homeDir string
}

func (*serveCmd) Name() string     { return "serve" }
func (*serveCmd) Synopsis() string { return "Serves the directory for streaming" }
func (*serveCmd) Usage() string {
	return `serve <path to videos>:
  Serve videos in path as HTTP
`
}

func (p *serveCmd) SetFlags(f *flag.FlagSet) {
	f.IntVar(&p.port, "port", 8080, "Listening port")
}

func (p *serveCmd) Execute(_ context.Context, f *flag.FlagSet, _ ...interface{}) subcommands.ExitStatus {

	// Generate variables and paths
	var port = p.port
	var videoDir = setVideoDir(f)

	http.Handle("/api/list/", NewDebugHandlerWrapper(http.StripPrefix("/api/list/", hls.NewListHandler(videoDir))))
	http.Handle("/api/frame/", NewDebugHandlerWrapper(http.StripPrefix("/api/frame/", hls.NewFrameHandler(videoDir))))
	http.Handle("/api/playlist/", NewDebugHandlerWrapper(http.StripPrefix("/api/playlist/", hls.NewPlaylistHandler(videoDir))))
	http.Handle("/api/segments/", NewDebugHandlerWrapper(http.StripPrefix("/api/segments/", hls.NewStreamHandler(videoDir))))
	http.Handle("/api/download/", NewDebugHandlerWrapper(http.StripPrefix("/api/download/", NewDownloadHandler(videoDir))))

	// Setup HTTP server
	http.Handle("/", NewDebugHandlerWrapper(NewSingleAssetHandler("index.html")))

	// Dump information to user
	fmt.Printf("Path to ffmpeg executable: %v\n", hls.FFMPEGPath)
	fmt.Printf("Path to ffprobe executable: %v\n", hls.FFProbePath)
	fmt.Printf("Home directory: %v/\n", hls.HomeDir)
	fmt.Printf("Serving videos in %v\n", videoDir)
	fmt.Printf("Visit http://localhost:%v/\n", port)

	if herr := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); herr != nil {
		fmt.Printf("Error listening %v", herr)
	}

	return subcommands.ExitSuccess
}
