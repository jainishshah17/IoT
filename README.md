# IoT
Internet of Things demo

![RaspberryPi](images/raspberry-pi-logo.png) 


### Add Webhook on Bintray to call Serverless:
```
curl -X POST \
  https://api.bintray.com/webhooks/$SUB/$REPO/$PACKAGE \
  -u '$USERNAME:$API_KEY' \
  -H 'content-type: application/json' \
  -d '{
  "url": "$SERVERLESS_URL",
  "method": "post"
}'
```