package api

import (
	"bytes"
	"fmt"
	"net/http"
	"strings"
	"text/template"
)

var captionSuffixes = []string{".srt", ".vtt"}

func filenameLooksLikeCaptions(name string) bool {
	for _, suffix := range captionSuffixes {
		if strings.HasSuffix(name, suffix) {
			return true
		}
	}
	return false
}

func handleCaptionlist(w http.ResponseWriter, r *http.Request) {
	entry := getEntry(r)
	entries, _ := ci.List(entry.ParentId())
	captions := make([]string, 0)
	temp := fmt.Sprintf("%v://%v/api/captions/{{.CaptionID}}", r.URL.Scheme, r.Host)
	t := template.Must(template.New("urlTemplate").Parse(temp))
	getUrl := func(captionId string) string {
		buf := new(bytes.Buffer)
		t.Execute(buf, struct {
			CaptionID string
		}{
			captionId,
		})
		return buf.String()
	}
	for _, entry := range entries {
		if filenameLooksLikeCaptions(entry.Name()) {
			captions = append(captions, getUrl(entry.Id()))
		}
	}
	serveJson(200, captions, w)
}
