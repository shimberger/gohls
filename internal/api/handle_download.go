package api

import (
	"fmt"
	"github.com/go-chi/chi"
	"github.com/shimberger/gohls/internal/hls"
	log "github.com/sirupsen/logrus"
	"net/http"
	"os/exec"
	"path/filepath"
	"strings"
)

func handleDownload(w http.ResponseWriter, r *http.Request) {

	pathParam := "" + chi.URLParam(r, "*")
	d := getIndexWithRoot(r)
	idx := d.idx
	log.Debugf("Download %v", pathParam)

	entry, err := idx.Get(pathParam)
	if err != nil {
		serveJson(404, err, w)
		return
	}

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

	w.Header().Set("Content-Disposition", "attachment; filename="+filepath.Base(dlfile)+"")
	http.ServeFile(w, r, dlfullpath)
}