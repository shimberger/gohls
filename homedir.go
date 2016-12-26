package main

import (
	"log"
	"os/user"
	"path"
)

func GetHomeDir() string {
	// Determine user info
	usr, uerr := user.Current()
	if uerr != nil {
		log.Fatal(uerr)
	}
	var homeDir = path.Join(usr.HomeDir, ".gohls")
	return homeDir
}
