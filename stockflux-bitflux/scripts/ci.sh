#!/bin/bash
set -e

VERSION=$(git describe --tags --always --dirty 2>&1)
grunt ci --versionNumber="v$VERSION"
