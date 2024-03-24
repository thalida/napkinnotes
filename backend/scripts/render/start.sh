#!/usr/bin/env bash
# exit on error
set -o errexit

poetry run gunicorn backend.wsgi:application
