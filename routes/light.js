var express = require('express');
var sense = require("sense-hat-led").sync;
var router = express.Router();
light();

function image() {
    console.log("Printing image");
    sense.loadImage("images/logo.png");
    sense.clear();
}

image();
function light() {
    console.log("Printing numbers");
    for (var i = 10; i > 0; i--){
        sense.showLetter(i.toString());
        sense.sleep(0.6);
    }
    sense.clear();
}



module.exports = router;
