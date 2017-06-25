#!/bin/sh

# scripts/update: Update application to run for its current checkout.

set -e

cd "$(dirname "$0")/.."

scripts/bootstrap.sh

echo "==> Updating data from Google Sheet…"
python scripts/update_scorecard.py
