var express = require('express');
var router = express.Router();
var Hue = require('philips-hue');
var bridgeInfo = require('../bridge.json')
var hue = new Hue();

light();
function light() {
    console.log("Running Hue APIs");
    hue.bridge = bridgeInfo.bridge.ip;
    hue.username = bridgeInfo.bridge.username;
    console.log("Light On");
    hue.light(4).on();
    var state = {bri: 200, sat: 120, hue: 50000};

    hue.light(4).setState(state).then(console.log).catch(console.error);

    hue.light(4).setState({effect: "colorloop"});

    hue.light(4).setState({alert: "lselect"});


    console.log("Light Off");
    hue.light(4).off();
    // hue.getBridges()
    //     .then(function (bridges) {
    //         console.log(bridges);
    //         var bridge = bridges[0]; // use 1st bridge
    //         console.log("bridge: " + bridge);
    //         return hue.auth(bridge);
    //     })
    //     .then(function (username) {
    //         console.log("username: " + username);
    //         var light = hue.light(4);
    //
    //         light.on().then(console.log).catch(console.error);
    //         console.log("Light On");
    //         hue.light(4).on();
    //         console.log("Light Off");
    //         hue.light(4).off();
    //         //     // controll Hue lights
    //         //     hue.light(4).on();
    //         //     hue.light(4).off();
    //         //     hue.light(4).setState({effect: "colorloop"});
    //     })
    //     .catch(function (err) {
    //         console.error(err.stack || err);
    //     });
}

module.exports = router;
