package hls

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/shimberger/gohls/internal/cmdutil"
	log "github.com/sirupsen/logrus"
)

var VideoSuffixes = []string{".mp4", ".rmvb", ".avi", ".mkv", ".flv", ".wmv", ".mov", ".mpg"}
var videoInfosLock sync.RWMutex
var videoInfos = make(map[string]*VideoInfo)

type VideoInfo struct {
	Duration float64 `json:"duration"`
	//FileCreated      time.Time `json:"created"`
	FileLastModified time.Time `json:"lastModified"`
}

func GetVideoInformation(path string) (*VideoInfo, error) {
	videoInfosLock.RLock()
	data, ok := videoInfos[path]
	videoInfosLock.RUnlock()
	if ok {
		if data == nil {
			return nil, fmt.Errorf("no video data available due to previous error for %v", path)
		}
		return data, nil
	}
	info, jsonerr := GetFFMPEGJson(path)
	if jsonerr != nil {
		log.Warnf("Error getting video info: %v", jsonerr)
		videoInfosLock.Lock()
		videoInfos[path] = nil
		videoInfosLock.Unlock()
		return nil, jsonerr
	}
	log.Debugf("ffprobe for %v returned: %v", path, info)
	if _, ok := info["format"]; !ok {
		return nil, fmt.Errorf("ffprobe data for '%v' does not contain format info", path)
	}
	format := info["format"].(map[string]interface{})
	if _, ok := format["duration"]; !ok {
		return nil, fmt.Errorf("ffprobe format data for '%v' does not contain duration", path)
	}
	duration, perr := strconv.ParseFloat(format["duration"].(string), 64)
	if perr != nil {
		return nil, fmt.Errorf("could not parse duration (%v) of '%v' ", format["duration"].(string), path)
	}
	finfo, staterr := os.Stat(path)
	if staterr != nil {
		return nil, fmt.Errorf("could not stat file '%v': %v", path, staterr)
	}
	var vi = &VideoInfo{duration, finfo.ModTime()}
	videoInfosLock.Lock()
	videoInfos[path] = vi
	videoInfosLock.Unlock()
	return vi, nil
}

func GetFFMPEGJson(path string) (map[string]interface{}, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cmd := exec.CommandContext(ctx, FFProbePath, "-v", "quiet", "-print_format", "json", "-show_format", path)
	var info map[string]interface{}
	if err := cmdutil.ExecAndGetStdoutJson(cmd, &info); err != nil {
		return nil, fmt.Errorf("error getting JSON from ffprobe output for file '%v': %v", path, err)
	}

	return info, nil
}

func FilenameLooksLikeVideo(name string) bool {
	for _, suffix := range VideoSuffixes {
		if strings.HasSuffix(name, suffix) {
			return true
		}
	}
	return false
}
