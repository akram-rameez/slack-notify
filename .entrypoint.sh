#!/bin/bash
ls /temp/node_modules
cp -r /temp/node_modules /app/node_modules
ls /app
ls /app/node_modules
exec yarn dev
