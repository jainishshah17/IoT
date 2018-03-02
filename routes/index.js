var express = require('express');
var router = express.Router();
var Hue = require('philips-hue');
var hue = new Hue();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
    // console.log("Running Hue APIs");
    // hue.bridge = "10.6.20.153";
    // hue.username = "IckIntv7tsUM9AR3Ni6m0f83iiCpCQ5QuAB1AE68";
    // hue.light(1).off();
    // hue.light(1).setState({hue: 50000, sat: 200, bri: 90});
    //
    // var state = {bri: 200, sat: 120, hue: 50000};
    // hue.light(4).on().then(console.log).catch(console.error);
    //
    // hue.light(4).setState(state).then(console.log).catch(console.error);
    // hue.light(4).setState({effect: "colorloop"});
    // hue.light(4).setState({alert: "lselect"});
    // hue.getBridges()
    //     .then(function (bridges) {
    //         console.log(bridges);
    //         var bridge = bridges[0]; // use 1st bridge
    //         console.log("bridge: " + bridge);
    //         return hue.auth(bridge);
    //     })
    //     .then(function (username) {
    //         console.log("username: " + username);
    //
            // controll Hue lights
    //         hue.light(1).on();
    //         hue.light(1).off();
            // hue.light(1).setState({hue: 50000, sat: 200, bri: 90});
    //     })
    //     .catch(function (err) {
    //         console.error(err.stack || err);
    //     });
});

module.exports = router;
