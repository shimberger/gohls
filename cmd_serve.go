package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/google/subcommands"
	"github.com/shimberger/gohls/hls"
	"log"
	"net/http"
	"os/user"
	"path"
)

type serveCmd struct{}

func (*serveCmd) Name() string     { return "serve" }
func (*serveCmd) Synopsis() string { return "Serves the directory for streaming" }
func (*serveCmd) Usage() string {
	return `serve <path to videos>:
  Serve videos in path as HTTP
`
}

func (p *serveCmd) SetFlags(f *flag.FlagSet) {}

func (p *serveCmd) Execute(_ context.Context, f *flag.FlagSet, _ ...interface{}) subcommands.ExitStatus {
	// Determine user info
	usr, uerr := user.Current()
	if uerr != nil {
		log.Fatal(uerr)
	}

	// Generate variables and paths
	var port = 8080
	var videoDir = path.Join(usr.HomeDir, "Videos")
	if f.NArg() > 0 {
		videoDir = f.Arg(0)
	}

	// Setup HTTP server
	http.Handle("/", http.RedirectHandler("/ui/", 302))
	http.Handle("/ui/assets/", http.StripPrefix("/ui/assets/", &assetHandler{}))
	http.Handle("/ui/", NewDebugHandlerWrapper(http.StripPrefix("/ui/", NewSingleAssetHandler("index.html"))))
	http.Handle("/list/", NewDebugHandlerWrapper(http.StripPrefix("/list/", hls.NewListHandler(videoDir))))
	http.Handle("/frame/", NewDebugHandlerWrapper(http.StripPrefix("/frame/", hls.NewFrameHandler(videoDir))))
	http.Handle("/playlist/", NewDebugHandlerWrapper(http.StripPrefix("/playlist/", hls.NewPlaylistHandler(videoDir))))
	http.Handle("/segments/", NewDebugHandlerWrapper(http.StripPrefix("/segments/", hls.NewStreamHandler(videoDir))))
	http.Handle("/download/", NewDebugHandlerWrapper(http.StripPrefix("/download/", NewDownloadHandler(videoDir))))

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
