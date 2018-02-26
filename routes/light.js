var express = require('express');
var sense = require("sense-hat-led").sync;
var router = express.Router();
light();

function light() {
    console.log("Printing numbers");
    for (var i = 10; i > 0; i--){
        sense.showLetter(i.toString(), [124, 252, 0]);
        sense.sleep(0.5);
    }
    sense.clear();
    light();
}

module.exports = router;
