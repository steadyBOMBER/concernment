#!/usr/bin/env bash
set -e
echo "Building frontend..."
if [ -d frontend ]; then
  cd frontend
  npm ci --silent
  npm run build
  cd ..
  rm -rf static/admin-app || true
  mkdir -p static/admin-app
  if [ -d frontend-dist ]; then
    cp -r frontend-dist/* static/admin-app/
    echo "Copied from frontend-dist/"
  elif [ -d frontend/dist ]; then
    cp -r frontend/dist/* static/admin-app/
    echo "Copied from frontend/dist/"
  else
    echo "ERROR: Frontend build folder not found - check Vite output"
    exit 1
  fi
else
  echo "No frontend directory - skipping frontend build"
fi
echo "Build finished."
