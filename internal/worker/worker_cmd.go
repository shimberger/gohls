package worker

import (
	"crypto/sha1"
	"fmt"
	"io"
	"os/exec"

	"github.com/shimberger/gohls/internal/cmdutil"
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
	return cmdutil.ExecAndWriteStdout(cmd, w)
}
