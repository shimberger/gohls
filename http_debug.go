package main

import (
	"net/http"

	log "github.com/Sirupsen/logrus"
)

type DebugHandlerWrapper struct {
	handler http.Handler
}

func NewDebugHandlerWrapper(handler http.Handler) *DebugHandlerWrapper {
	return &DebugHandlerWrapper{handler}
}

func (s *DebugHandlerWrapper) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Debugf("HTTP %v %v", r.Method, r.URL.Path)
	s.handler.ServeHTTP(w, r)
}
