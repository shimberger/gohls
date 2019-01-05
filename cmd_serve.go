package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/google/subcommands"
	"github.com/shimberger/gohls/fileindex"
	"github.com/shimberger/gohls/hls"
	log "github.com/sirupsen/logrus"
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
		id := folder.Id
		filter := fileindex.AndFilter(fileindex.HiddenFilter)
		idx, err := fileindex.NewMemIndex(folder.Path, id, filter)
		if err != nil {
			log.Errorf("Could not create file index for %v: %v", folder.Path, err)
			continue
		}
		http.Handle("/api/info/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/info/"+id+"/", hls.NewInfoHandler(idx, folder.Title, id))))
		http.Handle("/api/list/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/list/"+id+"/", hls.NewListHandler(idx, folder.Title, id))))
		http.Handle("/api/frame/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/frame/"+id+"/", hls.NewFrameHandler(idx, id))))
		http.Handle("/api/playlist/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/playlist/"+id+"/", hls.NewPlaylistHandler(idx, id, "/api/segments/"+id+"/"))))
		http.Handle("/api/segments/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/segments/"+id+"/", hls.NewStreamHandler(idx, "/segments/"+id))))
		http.Handle("/api/download/"+id+"/", NewDebugHandlerWrapper(http.StripPrefix("/api/download/"+id+"/", NewDownloadHandler(idx))))
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
