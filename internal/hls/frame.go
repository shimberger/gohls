package hls

import (
	"fmt"
	"io"
	"path/filepath"

	"github.com/shimberger/gohls/internal/worker"
)

var frameWorker = worker.NewWorkerServer(worker.WorkerServerConf{
	NumWorkers: 2,
	CacheDir:   filepath.Join(HomeDir, cacheDirName, "frames"),
	Worker:     worker.NewCommandWorker(FFMPEGPath),
})

func WriteFrame(video string, time int, w io.Writer) error {
	args := []string{
		"-timelimit", "15",
		"-loglevel", "error",
		"-ss", fmt.Sprintf("%v.0", time),
		"-i", video,
		"-vf", "scale=320:-1",
		"-frames:v", "1",
		"-f", "image2",
		"-",
	}
	return frameWorker.Serve(args, w)
}
