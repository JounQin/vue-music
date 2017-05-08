#!/usr/bin/env bash

set -e
git pull origin master
yarn
pm2 delete vue-music
cross-env PORT=5000 yarn build
yarn pm2
cd dist
curl https://vue-music.1stg.me > new.html
curl https://vue-music.1stg.me/all > all.html
