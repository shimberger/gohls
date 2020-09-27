package config

import (
	"encoding/json"
	"io/ioutil"

	homedir "github.com/mitchellh/go-homedir"
)

const MinScanInterval = 30
const DefaultScanInterval = 300

type Config struct {
	Folders []RootFolder
}

type RootFolder struct {
	Id           string `json:"id"`
	Title        string `json:"title"`
	Path         string `json:"path"`
	ScanInterval uint   `json:"scanInterval"`
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
		if config.Folders[i].ScanInterval <= MinScanInterval {
			config.Folders[i].ScanInterval = DefaultScanInterval
		}
	}
	return &config, nil
}

func GetConfig(path string) (*Config, error) {
	return readConfig(path)
}
