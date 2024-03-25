#!/usr/bin/env bash
# exit on error
set -o errexit

poetry run gunicorn api.wsgi:application
