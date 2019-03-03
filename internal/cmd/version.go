package cmd

import (
	"fmt"
	"github.com/shimberger/gohls/internal/buildinfo"
	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(versionCmd)
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number of GoHLS",
	Long:  `Print the version number of GoHLS`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("GoHLS %v (commit %v) (from %v)\n", buildinfo.VERSION, buildinfo.COMMIT, buildinfo.BUILD_TIME)
	},
}
