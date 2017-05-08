#!/usr/bin/env bash

set -e
git pull origin master
yarn
pm2 delete vue-music
cross-env PORT=5000 yarn build
yarn pm2
sleep 5
yarn static
