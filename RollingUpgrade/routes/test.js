var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var cred = require('../cred.json');

/*  Test  */
router.post('/', function(req, res, next) {
    var auth = req.headers['authorization'];
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
        if((username == cred.auth.username) && (password == cred.auth.password)) {   // Is the username/password correct?
            console.log("Testing version : " + version);
            cmd.get(
                'bash test.sh ' + version,
                function(err, data, stderr){
                    console.log('Running test.sh ' + version);
                    if(data && data.includes("OK")){
                        console.log("Done testing version : " + version);
                        res.sendStatus(200);
                    }else {
                        console.log('Error: ', stderr);
                        res.sendStatus(500);
                    }
                });
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
