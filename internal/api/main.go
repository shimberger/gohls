package api

import (
	"github.com/shimberger/gohls/internal/config"
	"github.com/shimberger/gohls/internal/fileindex"
	"github.com/shimberger/gohls/internal/hls"
	log "github.com/sirupsen/logrus"
	"net/http"
)

func Setup(conf *config.Config) {
	http.Handle("/api/list/", NewDebugHandlerWrapper(http.StripPrefix("/api/list/", NewFoldersHandler(conf))))

	for _, folder := range conf.Folders {
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

}
