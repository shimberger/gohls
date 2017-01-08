package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/google/subcommands"
)

type versionCmd struct{}

func (*versionCmd) Name() string     { return "version" }
func (*versionCmd) Synopsis() string { return "Outputs the program version" }
func (*versionCmd) Usage() string {
	return `version:
  Prints out the version
`
}

func (p *versionCmd) SetFlags(f *flag.FlagSet) {}

func (p *versionCmd) Execute(_ context.Context, f *flag.FlagSet, _ ...interface{}) subcommands.ExitStatus {
	fmt.Printf("gohls %v (commit %v) (from %v)\n", VERSION, COMMIT, BUILD_TIME)
	return subcommands.ExitSuccess
}
