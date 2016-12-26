package main

import (
	"context"
	"flag"
	"github.com/google/subcommands"
	"os"
	"path/filepath"
)

type clearCmd struct {
	homeDir string
}

func (*clearCmd) Name() string     { return "clear" }
func (*clearCmd) Synopsis() string { return "Clears all caches and temporary files" }
func (*clearCmd) Usage() string {
	return `clear:
  Clears the caches
`
}

func (p *clearCmd) SetFlags(f *flag.FlagSet) {
	//f.StringVar(&p.homeDir, "home", ".", "The home directory")
}

func (p *clearCmd) Execute(_ context.Context, f *flag.FlagSet, _ ...interface{}) subcommands.ExitStatus {
	var homeDir = GetHomeDir()
	var cacheDir = filepath.Join(homeDir, "cache")
	os.RemoveAll(cacheDir)

	return subcommands.ExitSuccess
}
