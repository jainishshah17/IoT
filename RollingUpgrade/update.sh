#!/usr/bin/env bash

if [ -z "$1" ]
then
      version="latest"
else
      version="$1"
fi
function rollingUpgrade {
    docker pull shahbrothers-docker-registry.bintray.io/node-version:${version}>> update.log
    docker rm -f pi>> update.log
    docker run -d --name pi -it -p 3000:3000 --privileged --restart always -v /home/pi/bridge.json:/usr/src/app/bridge.json shahbrothers-docker-registry.bintray.io/node-version:${version}>> update.log
    if [ "$(docker ps -a | grep pi)" ]; then
       echo "ok"
    fi
}

function checkForUpdate {
    echo "checking for update!!!!!"
    rollingUpgrade
}

checkForUpdate