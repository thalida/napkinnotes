#!/bin/bash

pre-commit install

cd /workspaces/napkinnotes/api
poetry install --no-root

cd /workspaces/napkinnotes/app
npm install
