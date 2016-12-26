package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/google/subcommands"
	"github.com/shimberger/gohls/hls"
	"log"
	"net/http"
	"os/exec"
	"os/user"
	"path"
)

type serveCmd struct {
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
	//f.StringVar(&p.homeDir, "home", ".", "The home directory")
}

func (p *serveCmd) Execute(_ context.Context, f *flag.FlagSet, _ ...interface{}) subcommands.ExitStatus {
	// Determine user info
	usr, uerr := user.Current()
	if uerr != nil {
		log.Fatal(uerr)
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

	// Generate variables and paths
	var port = 8080
	var videoDir = path.Join(usr.HomeDir, "Videos")
	if f.NArg() > 0 {
		videoDir = f.Arg(0)
	}

	// Configure HLS module
	hls.FFMPEGPath = "ffmpeg"
	hls.FFProbePath = "ffprobe"
	hls.HomeDir = GetHomeDir()

	// Setup HTTP server
	http.Handle("/", http.RedirectHandler("/ui/", 302))
	http.Handle("/ui/assets/", http.StripPrefix("/ui/assets/", &assetHandler{}))
	http.Handle("/ui/", hls.NewDebugHandlerWrapper(http.StripPrefix("/ui/", NewSingleAssetHandler("index.html"))))
	http.Handle("/list/", hls.NewDebugHandlerWrapper(http.StripPrefix("/list/", hls.NewListHandler(videoDir))))
	http.Handle("/frame/", hls.NewDebugHandlerWrapper(http.StripPrefix("/frame/", hls.NewFrameHandler(videoDir))))
	http.Handle("/playlist/", hls.NewDebugHandlerWrapper(http.StripPrefix("/playlist/", hls.NewPlaylistHandler(videoDir))))
	http.Handle("/segments/", hls.NewDebugHandlerWrapper(http.StripPrefix("/segments/", hls.NewStreamHandler(videoDir))))

	// Dump information to user
	fmt.Printf("Path to ffmpeg executable: %v\n", ffmpeg)
	fmt.Printf("Path to ffprobe executable: %v\n", ffprobe)
	fmt.Printf("Home directory: %v/\n", hls.HomeDir)
	fmt.Printf("Serving videos in %v\n", videoDir)
	fmt.Printf("Visit http://localhost:%v/\n", port)

	if herr := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); herr != nil {
		fmt.Printf("Error listening %v", herr)
	}

	return subcommands.ExitSuccess
}
