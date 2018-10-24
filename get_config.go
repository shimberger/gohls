package main

import (
	"encoding/json"
	homedir "github.com/mitchellh/go-homedir"
	"io/ioutil"
)

type Config struct {
	Folders []RootFolder
}

type RootFolder struct {
	Id    string `json:"id"`
	Title string `json:"title"`
	Path  string `json:"path"`
}

func readConfig(path string) (*Config, error) {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var config Config
	err = json.Unmarshal(data, &config)
	if err != nil {
		return nil, err
	}
	for i, folder := range config.Folders {
		dir, err := homedir.Expand(folder.Path)
		if err != nil {
			return nil, err
		}
		config.Folders[i].Path = dir
		config.Folders[i].Id = getHash(dir)
	}
	return &config, nil
}

func getConfig(path string) (*Config, error) {
	return readConfig(path)
}
