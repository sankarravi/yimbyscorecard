#!/bin/sh

# scripts/bootstrap: Resolve all dependencies that the application requires to
#                   run.

set -e

cd "$(dirname "$0")/.."

if [ -f "Gemfile" ]; then
  echo "==> Installing gem dependencies…"
  bundle check >/dev/null 2>&1  || {
    bundle install
  }
fi

if [ -f "requirements.txt" ]; then
  echo "==> Installing python dependencies…"
  pip install -r requirements.txt --quiet
fi
