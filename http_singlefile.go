package main

import "net/http"

type SingleFileServer struct {
	path string
}

func NewSingleFileServer(path string) *SingleFileServer {
	return &SingleFileServer{path}
}

func (s *SingleFileServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, s.path)
}
