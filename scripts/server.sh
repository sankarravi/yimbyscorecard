#!/bin/sh

# scripts/server: Launch the application and any extra required processes
#                locally.

set -e

cd "$(dirname "$0")/.."

# boot the app and any other necessary processes.
bundle exec jekyll serve --port 5000
