#!/bin/bash

cp -r /cache/node_modules/. /app/node_modules/
ls node_modules/babel-cli/bin
exec yarn build
exec yarn start
