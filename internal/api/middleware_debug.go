package api

import (
	log "github.com/sirupsen/logrus"
	"net/http"
)

func DebugMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Debugf("HTTP %v %v", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}
