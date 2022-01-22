package hls

import (
	"fmt"
	"io"
	"path/filepath"

	"github.com/shimberger/gohls/internal/worker"
)

var encodeWorker = worker.NewWorkerServer(worker.WorkerServerConf{
	NumWorkers: 2,
	CacheDir:   filepath.Join(HomeDir, cacheDirName, "segments"),
	Worker:     worker.NewCommandWorker(FFMPEGPath),
})

func WriteSegment(file string, segment int64, res int64, w io.Writer) error {
	args := EncodingArgs(file, segment, res)
	return encodeWorker.Serve(args, w)
}

func EncodingArgs(videoFile string, segment int64, res int64) []string {
	startTime := segment * hlsSegmentLength
	// see http://superuser.com/questions/908280/what-is-the-correct-way-to-fix-keyframes-in-ffmpeg-for-dash
	return []string{
		// Prevent encoding to run longer than 30 seonds
		"-timelimit", "45",

		// TODO: Some stuff to investigate
		// "-probesize", "524288",
		// "-fpsprobesize", "10",
		// "-analyzeduration", "2147483647",
		// "-hwaccel:0", "vda",

		// The start time
		// important: needs to be before -i to do input seeking
		"-ss", fmt.Sprintf("%v.00", startTime),

		// The source file
		"-i", videoFile,

		// Put all streams to output
		// "-map", "0",

		// The duration
		"-t", fmt.Sprintf("%v.00", hlsSegmentLength),

		// TODO: Find out what it does
		//"-strict", "-2",

		// Synchronize audio
		"-async", "1",

		// 720p
		"-vf", fmt.Sprintf("scale=-2:%v", res),

		// x264 video codec
		"-vcodec", "libx264",

		// x264 preset
		"-preset", "veryfast",

		// aac audio codec
		"-c:a", "aac",
		"-b:a", "128k",
		"-ac", "2",

		// TODO
		"-pix_fmt", "yuv420p",

		//"-r", "25", // fixed framerate

		"-force_key_frames", "expr:gte(t,n_forced*5.000)",

		//"-force_key_frames", "00:00:00.00",
		//"-x264opts", "keyint=25:min-keyint=25:scenecut=-1",

		//"-f", "mpegts",

		"-f", "ssegment",
		"-segment_time", fmt.Sprintf("%v.00", hlsSegmentLength),
		"-initial_offset", fmt.Sprintf("%v.00", startTime),

		"pipe:out%03d.ts",
	}
}
