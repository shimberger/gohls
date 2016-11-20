package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/google/subcommands"
	"github.com/shimberger/gohls/hls"
	"net/http"
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
	f.StringVar(&p.homeDir, "home", ".", "The home directory")
	//f.BoolVar(&p.capitalize, "capitalize", false, "capitalize output")
}

func (p *serveCmd) Execute(_ context.Context, f *flag.FlagSet, _ ...interface{}) subcommands.ExitStatus {

	uiDirectory := path.Join(p.homeDir, "ui")
	indexHtml := path.Join(uiDirectory, "index.html")
	contentDir := path.Join(p.homeDir, "videos")
	if f.NArg() > 0 {
		contentDir = f.Arg(0)
	}

	var port = 8080
	var ffmpegPath = path.Join(p.homeDir, "tools", "ffmpeg")

	hls.FFProbePath = path.Join(p.homeDir, "tools", "ffprobe")
	hls.HomeDir = path.Join(p.homeDir)

	http.Handle("/", http.RedirectHandler("/ui/", 302))
	http.Handle("/ui/css/", http.StripPrefix("/ui/", http.FileServer(http.Dir(uiDirectory))))
	http.Handle("/ui/img/", http.StripPrefix("/ui/", http.FileServer(http.Dir(uiDirectory))))
	http.Handle("/ui/js/", http.StripPrefix("/ui/", http.FileServer(http.Dir(uiDirectory))))
	http.Handle("/ui/fonts/", http.StripPrefix("/ui/", http.FileServer(http.Dir(uiDirectory))))
	http.Handle("/ui/", hls.NewDebugHandlerWrapper(http.StripPrefix("/ui/", hls.NewSingleFileServer(indexHtml))))
	http.Handle("/list/", hls.NewDebugHandlerWrapper(http.StripPrefix("/list/", hls.NewListHandler(contentDir))))
	http.Handle("/frame/", hls.NewDebugHandlerWrapper(http.StripPrefix("/frame/", hls.NewFrameHandler(contentDir, ffmpegPath))))
	http.Handle("/playlist/", hls.NewDebugHandlerWrapper(http.StripPrefix("/playlist/", hls.NewPlaylistHandler(contentDir))))
	http.Handle("/segments/", hls.NewDebugHandlerWrapper(http.StripPrefix("/segments/", hls.NewStreamHandler(contentDir, ffmpegPath))))
	fmt.Printf("Home directory: %v/\n", p.homeDir)
	fmt.Printf("Serving videos in %v\n", contentDir)
	fmt.Printf("Visit http://localhost:%v/\n", port)
	http.ListenAndServe(fmt.Sprintf(":%v", port), nil)
	return subcommands.ExitSuccess
}
