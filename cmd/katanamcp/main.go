package main

import (
	"errors"
	"fmt"
	"katanampc/internals/kmcp"
	"log"
	"os"

	"github.com/joho/godotenv"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var version = "version"
var commit = "commit"
var date = "date"

var (
	rootCmd = &cobra.Command{
		Use:     "katana-mcp",
		Short:   "Katana MCP",
		Long:    `Katana MCP server handles various tools and resources.`,
		Version: fmt.Sprintf("Version: %s\nCommit: %s\nBuild Date: %s", version, commit, date),
	}

	stdioCmd = &cobra.Command{
		Use:   "stdio",
		Short: "Katana MCP stdio",
		Long:  `Katana MCP stdio server handles various tools and resources.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			token := viper.GetString("enviroment_api_key")
			if token == "" {
				return errors.New("enviroment_api_key not set")
			}

			stdioServerConfig := kmcp.StdioServerConfig{Varsion: version, Host: viper.GetString("enviroment_host"), ApiKey: token}
			return kmcp.RunStdioServer(stdioServerConfig)
		},
	}
)

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().String("host", "", "katana external api host cannot be empty")

	_ = viper.BindPFlag("host", rootCmd.PersistentFlags().Lookup("host"))
	rootCmd.AddCommand(stdioCmd)
}

func initConfig() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Bind each environment variable to viper

	viper.AutomaticEnv()
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
