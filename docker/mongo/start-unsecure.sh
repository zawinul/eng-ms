#!/bin/bash
docker start eng-mongo || docker run --name eng-mongo --net mybridge -p27017:27017 -d mongo --bind_ip_all

