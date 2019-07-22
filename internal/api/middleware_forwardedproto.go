package api

import (
	"net/http"
)

func ForwardedProtoMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.URL.Scheme = "http"
		if r.Header.Get("X-Forwarded-Proto") == "http" || r.Header.Get("X-Forwarded-Proto") == "https" {
			r.URL.Scheme = r.Header.Get("X-Forwarded-Proto")
		}
		next.ServeHTTP(w, r)
	})
}
