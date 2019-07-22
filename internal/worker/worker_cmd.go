package worker

import (
	"crypto/sha1"
	"fmt"
	log "github.com/sirupsen/logrus"
	"io"
	"os/exec"
	"syscall"
)

type CommandWorker struct {
	executable string
}

func NewCommandWorker(executable string) *CommandWorker {
	return &CommandWorker{executable}
}

func (c *CommandWorker) Key(r interface{}) string {
	args := r.([]string)
	h := sha1.New()
	h.Write([]byte(c.executable))
	for _, v := range args {
		h.Write([]byte(v))
	}
	sum := h.Sum(nil)
	return fmt.Sprintf("%x", sum)
}

func (c *CommandWorker) Handle(r interface{}, w io.Writer) error {
	args := r.([]string)
	cmd := exec.Command(c.executable, args...)
	stdout, err1 := cmd.StdoutPipe()
	defer stdout.Close()
	if err1 != nil {
		return fmt.Errorf("Error opening stdout of command: %v", err1)
	}
	log.Debugf("Executing: %v %v", c.executable, args)
	err2 := cmd.Start()
	if err2 != nil {
		return fmt.Errorf("Error starting command: %v", err2)
	}
	_, err3 := io.Copy(w, stdout)
	if err3 != nil {
		// Ask the process to exit
		cmd.Process.Signal(syscall.SIGKILL)
		cmd.Process.Wait()
		return fmt.Errorf("Error copying stdout to buffer: %v", err3)
	}
	err4 := cmd.Wait()
	if err4 != nil {
		return fmt.Errorf("Command failed %v", err4)
	}
	return nil
}
