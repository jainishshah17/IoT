#!/usr/bin/env bash

if [ -z "$1" ]
then
      version="latest"
else
      version="$1"
fi
function rollingUpgrade {
    docker pull jfrog-int-docker-iot.bintray.io/node-version-pi:${version}>> update.log
    if [ "$(docker ps | grep pi)" ]; then
    docker rm -f pi>> update.log
    fi
    docker run -d --name pi -it -p 3000:3000 --privileged --restart always -v /home/pi/bridge.json:/usr/src/app/bridge.json jfrog-int-docker-iot.bintray.io/node-version-pi:${version}>> update.log
    if [ "$(docker ps | grep pi)" ]; then
       sleep 20;
       PING=$(curl -s http://localhost:3000/ping)
       if [ "$PING" = "OK" ]; then
            echo "OK"
       else
            echo "Error"
       fi
    fi
}

function checkForUpdate {
    echo "checking for update!!!!!"
    rollingUpgrade
}

checkForUpdate