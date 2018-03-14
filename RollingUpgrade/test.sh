#!/usr/bin/env bash

if [ -z "$1" ]
then
      version="latest"
else
      version="$1"
fi
function rollingUpgradeTest {
    docker pull docker-prod-local.artifactory/node-version-pi:${version}>> test.log
    if [ "$(docker ps | grep test-pi)" ]; then
    docker rm -f test-pi>> test.log
    fi
    docker run -d --name test-pi -it -p 5000:3000 --privileged --restart always -v /home/pi/bridge.json:/usr/src/app/bridge.json docker-prod-local.artifactory/node-version-pi:${version}>> test.log
    if [ "$(docker ps | grep test-pi)" ]; then
       sleep 20;
       PING=$(curl -s http://localhost:5000/ping)
       if [ "$PING" = "OK" ]; then
            echo "OK"
       else
            echo "Error"
       fi
    fi
}

function killTest {
    echo "Killing test container!!!"
    docker rm -f test-pi>> test.log
    echo "Killed test container!!!"
}

function testUpdate {
    echo "testing update!!!!!"
    rollingUpgradeTest
}

testUpdate
killTest