package worker

import (
	"bufio"
	log "github.com/sirupsen/logrus"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
)

type WorkHandler interface {
	Key(request interface{}) string
	Handle(request interface{}, w io.Writer) error
}

type WorkerServerConf struct {
	NumWorkers int
	CacheDir   string
	Worker     WorkHandler
}

type token struct{}

type WorkerServer struct {
	conf   WorkerServerConf
	tokens chan token
}

func NewWorkerServer(conf WorkerServerConf) *WorkerServer {
	tokens := make(chan token, conf.NumWorkers)
	for i := conf.NumWorkers; i > 0; i-- {
		tokens <- token{}
	}
	return &WorkerServer{conf, tokens}
}

func (s *WorkerServer) handler() WorkHandler {
	return s.conf.Worker
}

func (s *WorkerServer) getCachePath(r interface{}) string {
	return filepath.Join(s.conf.CacheDir, s.handler().Key(r))
}

func (s *WorkerServer) tryServeFromCache(r interface{}, w io.Writer) (bool, error) {
	path := s.getCachePath(r)
	if file, err := os.Open(path); err == nil {
		defer file.Close()
		_, err = io.Copy(w, file)
		if err != nil {
			log.Errorf("Error copying file to client: %v", err)
			return true, err
		}
		return true, nil
	}
	return false, nil
}

// TODO timeout & context
func (s *WorkerServer) Serve(request interface{}, w io.Writer) error {

	if served, err := s.tryServeFromCache(request, w); served || err != nil {
		if err != nil {
			log.Errorf("Error serving request from cache: %v", err)
		}
		return err
	}

	// Wait for token
	token := <-s.tokens
	defer func() {
		s.tokens <- token
	}()

	cachePath := s.getCachePath(request)
	cacheDir := filepath.Dir(cachePath)
	cacheName := filepath.Base(cachePath)

	if err := os.MkdirAll(cacheDir, 0777); err != nil {
		log.Errorf("Could not create cache dir %v: %v", cachePath, err)
		return err
	}

	cacheTmpFile, err := ioutil.TempFile(cacheDir, cacheName+".*")
	if err != nil {
		log.Errorf("Could not create cache file %v: %v", cacheTmpFile, err)
		return err
	}

	cw := bufio.NewWriter(cacheTmpFile)
	mw := io.MultiWriter(cw, w)
	if err := s.handler().Handle(request, mw); err != nil {
		os.Remove(cacheTmpFile.Name())
		log.Errorf("Error handling request: %v", err)
		return err
	}

	if err := os.Rename(cacheTmpFile.Name(), cachePath); err != nil {
		log.Warnf("Error moving cache file into place: %v", err)
	}
	return nil
}
