#!/usr/bin/env bash

set -e
git pull origin master
yarn
cross-env PORT=5000 yarn build
pm2 delete vue-music
yarn pm2
