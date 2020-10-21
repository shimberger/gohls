package api

import (
	"fmt"
	"net/http"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/shimberger/gohls/internal/hls"
	log "github.com/sirupsen/logrus"
)

func handleDownload(w http.ResponseWriter, r *http.Request) {
	entry := getEntry(r)
	if err := r.ParseForm(); err != nil {
		http.Error(w, fmt.Sprintf("ParseForm() error: %v", err), http.StatusInternalServerError)
		return
	}
	log.Debugf("Download parameters: %v", r.Form)

	dlfullpath := entry.Path()
	dlfile := entry.Path()

	if len(r.Form) > 0 {

		start, duration := r.Form.Get("start"), r.Form.Get("duration")
		if len(start) == 0 || len(duration) == 0 {
			http.Error(w, "Parameter start or duration missed", http.StatusNotAcceptable)
			return
		}

		ext := filepath.Ext(dlfullpath)
		dlfile = fmt.Sprintf("%s_%s_%s%s", strings.TrimSuffix(filepath.Base(dlfullpath), ext), start, duration, ext)
		dlfullpath = filepath.Join(hls.HomeDir, dlfile)
		args := []string{"-y", "-ss", start, "-t", duration, "-i", entry.Path(), "-c:v", "copy", dlfullpath}
		log.Debugf("Executing: ffmpeg %v", args)
		cmd := exec.Command(hls.FFMPEGPath, args...)
		_, err := cmd.CombinedOutput()
		if err != nil {
			http.Error(w, fmt.Sprintf("Run ffmpeg error: %v", err), http.StatusInternalServerError)
			return
		}
	}

	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", filepath.Base(dlfile)))
	http.ServeFile(w, r, dlfullpath)
}
