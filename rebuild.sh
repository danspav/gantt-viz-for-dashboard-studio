#!/usr/bin/env bash

set -e  # stop on error

# -----------------------------
# Variables
# -----------------------------
export SPLUNK_HOME="/splunk"
export GIT_HOME="/splunk/git"
export APP_DIRECTORY_NAME=$(basename "$PWD")

APP_NAME="$APP_DIRECTORY_NAME"

SOURCE_DIR="$GIT_HOME/$APP_NAME/stage/$APP_NAME"
TARGET_DIR="$SPLUNK_HOME/etc/apps/$APP_NAME"

echo "========================================"
echo "Building Splunk App: $APP_NAME"
echo "========================================"

# -----------------------------
# Step 1: Yarn build
# -----------------------------
echo ">> Running yarn build"
yarn build

# -----------------------------
# Step 2: Yarn package
# -----------------------------
echo ">> Running yarn package"
yarn package

# -----------------------------
# Step 3: Create symlink if missing
# -----------------------------
echo ">> Setting up symlink"

if [ ! -e "$TARGET_DIR" ]; then
    echo "Creating symlink:"
    echo "  $TARGET_DIR -> $SOURCE_DIR"
    ln -s "$SOURCE_DIR" "$TARGET_DIR"
else
    echo "Symlink or directory already exists at $TARGET_DIR"
fi

# -----------------------------
# Step 4: Run refresh script
# -----------------------------
echo ">> Running refresh.py"
python3 refresh.py

echo "========================================"
echo "Build complete ✔"
echo "========================================"
