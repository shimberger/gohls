package main

import (
	"fmt"
	"github.com/shimberger/gohls/hls"
	log "github.com/sirupsen/logrus"
	"net/http"
	"os/exec"
	"path/filepath"
	"strings"
)

type downloadHandler struct {
	dir string
}

func NewDownloadHandler(root string) *downloadHandler {
	return &downloadHandler{root}
}

func (s *downloadHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Debugf("Download %v", r.URL.Path)

	if err := r.ParseForm(); err != nil {
		http.Error(w, fmt.Sprintf("ParseForm() error: %v", err), http.StatusInternalServerError)
		return
	}
	log.Debugf("Download parameters: %v", r.Form)
	var dlfile, dlfullpath string
	if len(r.Form) == 0 {
		dlfile = r.URL.Path
		dlfullpath = filepath.Join(s.dir, dlfile)
	} else {
		filePath := filepath.Join(s.dir, r.URL.Path)
		start, duration := r.Form.Get("start"), r.Form.Get("duration")
		if len(start) == 0 || len(duration) == 0 {
			http.Error(w, "Parameter start or duration missed", http.StatusNotAcceptable)
			return
		}
		ext := filepath.Ext(r.URL.Path)
		dlfile = fmt.Sprintf("%s_%s_%s%s", strings.TrimSuffix(filepath.Base(r.URL.Path), ext), start, duration, ext)
		dlfullpath = filepath.Join(hls.HomeDir, dlfile)
		args := []string{"-y", "-ss", start, "-t", duration, "-i", filePath, "-c:v", "copy", dlfullpath}
		log.Debugf("Executing: ffmpeg %v", args)
		cmd := exec.Command(hls.FFMPEGPath, args...)
		_, err := cmd.CombinedOutput()
		if err != nil {
			http.Error(w, fmt.Sprintf("Run ffmpeg error: %v", err), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Disposition", "attachment; filename='"+filepath.Base(dlfile)+"'")
	http.ServeFile(w, r, dlfullpath)
}
