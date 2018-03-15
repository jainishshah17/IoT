var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var sense = require("sense-hat-led").sync;
var cred = require('../cred.json');
var twilio = require('twilio')(cred.twilio.accountSid, cred.twilio.authToken);
var version = "latest";
var flash = false;
var color;

/*  Upgrade  */
router.post('/', function(req, res, next) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    // console.log("Authorization Header is: ", auth);
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

        if((username == cred.auth.username) && (password == cred.auth.password)) {   // Is the username/password correct?
            color = [135,206,235];
            flash = true;
            flashLight();
            var toNumber;
            (process.env.TO_NUMBER) ? toNumber = process.env.TO_NUMBER : toNumber = cred.twilio.number;
            var promise = twilio.messages.create({
                from: '+14086178718',
                to: toNumber,
                body: 'New version : '+ version +' is released do you want to update your device? Reply with YES or NO'
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

router.post('/message', function(req, res, next) {
    var message = req.body.Body;
    if (message === 'Yes' || message === 'yes' || message === 'y'|| message === 'Y' || message === 'YES'){
        color = [255, 0, 0];
        if(version){
            console.log("Upgrading to version : " + version);
            cmd.get(
            'bash update.sh ' + version,
            function(err, data, stderr){
                console.log('Running update.sh ' + version, data);
                if(data && data.includes("OK")){
                    console.log("Done testing version : " + version);
                    res.sendStatus(200);
                }else {
                    console.log('Error: ', stderr);
                    res.sendStatus(500);
                }
            });
            flash = false;
            sense.clear();
        }
        else{
            console.log("Version is not defined");
            res.sendStatus(500);
        }
    }
});

function flashLight() {
    sense.clear(color);
    if(flash){
        setTimeout(flashLight, 2000);
    }
}

module.exports = router;
