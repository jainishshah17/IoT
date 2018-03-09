var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var sense = require("sense-hat-led").sync;
var accountSid = 'ACc73f715dc0c92fcb6d4adb4b34861bb1'; // Your Account SID from www.twilio.com/console
var authToken = '742fc757ed96aabfcdcfa5b236021304';   // Your Auth Token from www.twilio.com/console
var twilio = require('twilio')(accountSid, authToken);
var cred = require('../cred.json');

/*  Upgrade  */
router.post('/', function(req, res, next) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    // console.log("Authorization Header is: ", auth);
    var version;
    (req.param('version')) ? version = req.param('version') : version = "latest";

    if(!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');

        res.end('<html><body>Need some creds son</body></html>');
    } else if(auth) {
        var tmp = auth.split(' ');

        var buf = new Buffer(tmp[1], 'base64');
        var plain_auth = buf.toString();

        // console.log("Decoded Authorization ", plain_auth);
        // At this point plain_auth = "username:password"

        var creds = plain_auth.split(':');      // split on a ':'
        var username = creds[0];
        var password = creds[1];

        if((username == cred.username) && (password == cred.password)) {   // Is the username/password correct?
            sense.clear(255, 0, 0);
            var promise = twilio.messages.create({
                from: '+14086178718',
                to: '+16693331498',
                body: 'New version is released do you want to update your device?'
            });
            promise.then(function(message) {
                console.log('Created message using promises');
                console.log(message.sid);
            });
            res.sendStatus(200);
        }
        else {
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.sendStatus(401); // Force them to retry authentication
            // res.end('<html><body>You shall not pass</body></html>');
        }
    } else {
        req.sendStatus(400);
    }
});

module.exports = router;
