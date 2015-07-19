package main

import (
	"flag"
	"net/http"
	"path"
)

func main() {
	flag.Parse()
	uiDirectory := path.Join(".", "ui")
	indexHtml := path.Join(uiDirectory, "index.html")
	contentDir := path.Join(".", "videos")
	if flag.NArg() > 0 {
		contentDir = flag.Arg(0)
	}
	http.Handle("/ui/assets/", http.StripPrefix("/ui/", http.FileServer(http.Dir(uiDirectory))))
	http.Handle("/ui/", NewDebugHandlerWrapper(http.StripPrefix("/ui/", NewSingleFileServer(indexHtml))))
	http.Handle("/list/", NewDebugHandlerWrapper(http.StripPrefix("/list/", NewListHandler(contentDir))))
	http.Handle("/frame/", NewDebugHandlerWrapper(http.StripPrefix("/frame/", NewFrameHandler(contentDir))))
	http.Handle("/playlist/", NewDebugHandlerWrapper(http.StripPrefix("/playlist/", NewPlaylistHandler(contentDir))))
	http.Handle("/segments/", NewDebugHandlerWrapper(http.StripPrefix("/segments/", NewStreamHandler(contentDir))))
	http.ListenAndServe(":8080", nil)

}
