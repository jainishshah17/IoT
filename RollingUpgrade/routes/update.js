var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var sense = require("sense-hat-led").sync;
var accountSid = 'ACc73f715dc0c92fcb6d4adb4b34861bb1'; // Your Account SID from www.twilio.com/console
var authToken = '742fc757ed96aabfcdcfa5b236021304';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio')(accountSid, authToken);

/*  Update  */
router.post('/message', function(req, res, next) {
    var message = req.body.Body;
    if (message == 'Yes' || message == 'yes' || message == 'y'|| message == 'Y' ){
        console.log("Triggering upgrade");
        sense.clear(255, 0, 0);
        cmd.get(
            'bash update.sh ' + version,
            function(err, data, stderr){
                console.log('Running update.sh ' + version, data);
            });
        res.sendStatus(200);
        sense.clear();
    }
});

module.exports = router;

