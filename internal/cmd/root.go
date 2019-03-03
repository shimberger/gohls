package cmd

import (
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

var (
	cfgFile string
)

func init() {
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "./gohls-config.json", "config file (default is ./gohls-config.json)")
}

var rootCmd = &cobra.Command{
	Use:   "gohls",
	Short: "GoHLS is a simple HTTP video streaming server",
	Long:  `GoHLS is a simple HTTP video streaming server`,
	Run: func(cmd *cobra.Command, args []string) {
		// Do Stuff Here
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
