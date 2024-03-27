#!/bin/bash

cd /workspaces/napkinnotes/api
poetry install --no-root

cd /workspaces/napkinnotes/app
npm install
