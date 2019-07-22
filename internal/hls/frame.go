package hls

import (
	"fmt"
	"github.com/shimberger/gohls/internal/worker"
	"io"
	"path/filepath"
)

var frameWorker = worker.NewWorkerServer(worker.WorkerServerConf{2, filepath.Join(HomeDir, cacheDirName, "frames"), worker.NewCommandWorker(FFMPEGPath)})

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
