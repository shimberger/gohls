package hls

import (
	"bytes"
	"fmt"
	"io"
	"text/template"
)

func WritePlaylist(urlTemplate string, file string, w io.Writer) error {
	t := template.Must(template.New("urlTemplate").Parse(urlTemplate))

	vinfo, err := GetVideoInformation(file)
	if err != nil {
		return err
	}

	duration := vinfo.Duration

	getUrl := func(segmentIndex int) string {
		buf := new(bytes.Buffer)
		t.Execute(buf, struct {
			Resolution int64
			Segment    int
		}{
			720,
			segmentIndex,
		})
		return buf.String()
	}

	fmt.Fprint(w, "#EXTM3U\n")
	fmt.Fprint(w, "#EXT-X-VERSION:3\n")
	fmt.Fprint(w, "#EXT-X-MEDIA-SEQUENCE:0\n")
	fmt.Fprint(w, "#EXT-X-ALLOW-CACHE:YES\n")
	fmt.Fprint(w, "#EXT-X-TARGETDURATION:"+fmt.Sprintf("%.f", hlsSegmentLength)+"\n")
	fmt.Fprint(w, "#EXT-X-PLAYLIST-TYPE:VOD\n")

	leftover := duration
	segmentIndex := 0

	for leftover > 0 {
		if leftover > hlsSegmentLength {
			fmt.Fprintf(w, "#EXTINF: %f,\n", hlsSegmentLength)
		} else {
			fmt.Fprintf(w, "#EXTINF: %f,\n", leftover)
		}
		fmt.Fprintf(w, getUrl(segmentIndex)+"\n")
		segmentIndex++
		leftover = leftover - hlsSegmentLength
	}
	fmt.Fprint(w, "#EXT-X-ENDLIST\n")
	return nil
}
