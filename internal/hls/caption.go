package hls

import (
	"io"
	"path/filepath"

	"github.com/shimberger/gohls/internal/worker"
)

var captionWorker = worker.NewWorkerServer(worker.WorkerServerConf{
	NumWorkers: 2,
	CacheDir:   filepath.Join(HomeDir, cacheDirName, "captions"),
	Worker:     worker.NewCommandWorker(FFMPEGPath),
})

func WriteCaption(file string, w io.Writer) error {
	args := []string{
		"-i", file,
		"-f", "webvtt",
		"pipe:",
		// 2> /dev/null
	}
	return captionWorker.Serve(args, w)
}
