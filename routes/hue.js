var express = require('express');
var router = express.Router();
var Hue = require('philips-hue');
var bridgeInfo = require('../bridge.json');
var sense = require("sense-hat-led").sync;
var hue = new Hue();
var i = 0;

ChangeColor();
function ChangeColor() {
    console.log("Running Hue APIs");
    (i <= 65280) ? i = i + 2000 : i = 0;
    hue.bridge = bridgeInfo.bridge.ip;
    hue.username = bridgeInfo.bridge.username;
    // console.log("Light On");
    // hue.light(4).on();
    console.log("Hue : " + i);
    var state = {bri: 50, sat: 120, hue: i};
    hue.getLights()
        .then(function (lights) {
            for (light in lights){
                // hue.light(light).setState({alert: "lselect"});
                // sense.clear(i.toString(), 0.1, [124, 252, 0]);
                // sense.clear();
                hue.light(light).setState(state).then(console.log).catch(console.error);
                // hue.light(4).setState({effect: "colorloop"});
            }
        }).catch(function (err) {
        console.error(err.stack || err);
        setTimeout(everyMinute, 1000);
    });
}

function everyMinute() {
    ChangeColor();
}

module.exports = router;
