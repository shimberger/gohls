package main

import (
	"context"
	"flag"
	"fmt"
	log "github.com/Sirupsen/logrus"
	"github.com/google/subcommands"
	"github.com/shimberger/gohls/hls"
	"net/http"
)

type serveCmd struct {
	port       int
	homeDir    string
	configFile string
}

func (*serveCmd) Name() string     { return "serve" }
func (*serveCmd) Synopsis() string { return "Serves the directory for streaming" }
func (*serveCmd) Usage() string {
	return `serve:
  Serve videos in path as HTTP
`
}

func (p *serveCmd) SetFlags(f *flag.FlagSet) {
	f.IntVar(&p.port, "port", 8080, "Listening port")
	f.StringVar(&p.configFile, "config", "./gohls-config.json", "The configuration file to use")

}

func (p *serveCmd) Execute(_ context.Context, f *flag.FlagSet, _ ...interface{}) subcommands.ExitStatus {

	// Generate variables and paths
	port := p.port

	config, err := getConfig(p.configFile)
	if err != nil {
		log.Fatalf("Error reading config: %v", err)
	}

	http.Handle("/api/list/", NewDebugHandlerWrapper(http.StripPrefix("/api/list/", NewFoldersHandler(config))))

	for _, folder := range config.Folders {
		videoDir := folder.Path
		id := folder.Id
		http.Handle("/api/list/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/list/"+id+"/", hls.NewListHandler(videoDir, folder.Title, id))))
		http.Handle("/api/frame/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/frame/"+id+"/", hls.NewFrameHandler(videoDir, id))))
		http.Handle("/api/playlist/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/playlist/"+id+"/", hls.NewPlaylistHandler(videoDir, id, "/api/segments/"+id+"/"))))
		http.Handle("/api/segments/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/segments/"+id+"/", hls.NewStreamHandler(videoDir, "/segments/"+id))))
		http.Handle("/api/download/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/download/"+id+"/", NewDownloadHandler(videoDir))))
	}

	// Setup HTTP server
	http.Handle("/", NewDebugHandlerWrapper(NewSingleAssetHandler("index.html")))

	// Dump information to user
	fmt.Printf("Path to ffmpeg executable: %v\n", hls.FFMPEGPath)
	fmt.Printf("Path to ffprobe executable: %v\n", hls.FFProbePath)
	fmt.Printf("HLS data directory: %v/\n", hls.HomeDir)
	fmt.Printf("Visit http://localhost:%v/\n", port)

	if herr := http.ListenAndServe(fmt.Sprintf(":%v", port), nil); herr != nil {
		fmt.Printf("Error listening %v", herr)
	}

	return subcommands.ExitSuccess
}
