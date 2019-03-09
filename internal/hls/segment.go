package hls

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"io"
	"path/filepath"
	"time"
)

var encoder = NewEncoder(filepath.Join(HomeDir, cacheDirName, "segments"), 2)

func WriteSegment(file string, segment int64, res int64, w io.Writer) error {

	er := NewEncodingRequest(file, segment, res)
	encoder.Encode(*er)

	select {
	case data := <-er.data:
		w.Write(*data)
	case err := <-er.err:
		log.Errorf("Error encoding %v", err)
		return err
	case <-time.After(60 * time.Second):
		log.Errorf("Timeout encoding")
		return fmt.Errorf("Timeout")
	}
	return nil
}
