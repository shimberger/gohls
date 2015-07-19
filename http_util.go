package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os/exec"
	"syscall"
)

func ServeCommand(cmd *exec.Cmd, w io.Writer) error {
	stdout, err := cmd.StdoutPipe()
	defer stdout.Close()
	if err != nil {
		log.Printf("Error opening stdout of command: %v", err)
		return err
	}
	err = cmd.Start()
	if err != nil {
		log.Printf("Error starting command: %v", err)
		return err
	}
	_, err = io.Copy(w, stdout)
	if err != nil {
		log.Printf("Error copying data to client: %v", err)
		// Ask the process to exit
		cmd.Process.Signal(syscall.SIGKILL)
		cmd.Process.Wait()
		return err
	}
	cmd.Wait()
	return nil
}

func ServeJson(status int, data interface{}, w http.ResponseWriter) {
	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}
