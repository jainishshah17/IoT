var express = require('express');
var router = express.Router();
// var Hue = require('philips-hue');
// var hue = new Hue();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
    console.log("Running Hue APIs");
    // hue.getBridges()
    //     .then(function(bridges){
    //         console.log(bridges);
    //         var bridge = bridges[0]; // use 1st bridge
    //         console.log("bridge: "+bridge);
    //         return hue.auth(bridge);
    //     })
    //     .then(function(username){
    //         console.log("username: "+username);
    //
    //         // controll Hue lights
    //         hue.light(1).on();
    //         hue.light(2).off();
    //         hue.light(3).setState({hue: 50000, sat: 200, bri: 90});
    //     })
    //     .catch(function(err){
    //         console.error(err.stack || err);
    //     });
});

module.exports = router;
