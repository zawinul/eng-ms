#!/bin/bash

cd /app
mkdir mongodata
mkdir mongolog
mongod --config ./mongo.cfg &
bash
