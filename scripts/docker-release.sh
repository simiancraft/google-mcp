#!/usr/bin/env bash
#
# Build the suite image and push it to the container registry. Invoked by
# semantic-release (@semantic-release/exec, publishCmd) with the just-computed
# release version as $1, from the release job in .github/workflows/ci.yml.
#
# The registry logins live in the workflow; this script only builds and pushes.
set -euo pipefail

VERSION="${1:?usage: docker-release.sh <version>}"
PLATFORMS="linux/amd64"

# --- GitHub Container Registry (GHCR) ----------------------------------------
GHCR_IMAGE="${GHCR_IMAGE:-ghcr.io/simiancraft/google-mcp-suite}"
docker buildx build \
  --platform "$PLATFORMS" \
  --tag "$GHCR_IMAGE:$VERSION" \
  --tag "$GHCR_IMAGE:latest" \
  --push .

# --- Docker Hub (disabled) ---------------------------------------------------
# Re-enable by uncommenting this block and the "Log in to Docker Hub" step in
# .github/workflows/ci.yml (needs DOCKERHUB_USERNAME / DOCKERHUB_TOKEN secrets).
# DOCKERHUB_IMAGE="${DOCKERHUB_IMAGE:-vantreeseba/google-mcp-suite}"
# docker buildx build \
#   --platform "$PLATFORMS" \
#   --tag "$DOCKERHUB_IMAGE:$VERSION" \
#   --tag "$DOCKERHUB_IMAGE:latest" \
#   --push .
