package hls

import (
	"net/http"
)

type DebugHandlerWrapper struct {
	handler http.Handler
}

func NewDebugHandlerWrapper(handler http.Handler) *DebugHandlerWrapper {
	return &DebugHandlerWrapper{handler}
}

func (s *DebugHandlerWrapper) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	debug.Printf("%v %v", r.Method, r.URL.Path)
	s.handler.ServeHTTP(w, r)
}
