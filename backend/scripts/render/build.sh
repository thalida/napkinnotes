#!/usr/bin/env bash
# exit on error
set -o errexit

poetry install
poetry python manage.py collectstatic --no-input
poetry python manage.py migrate
