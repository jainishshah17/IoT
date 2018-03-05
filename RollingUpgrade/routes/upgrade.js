var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var cred = require('../cred.json');

/*  Upgrade  */
router.post('/:version', function(req, res, next) {
    var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
    // console.log("Authorization Header is: ", auth);
    var version;
    (req.params.version) ? version = req.params.version : version = "latest";

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
            cmd.get(
                'bash update.sh ' + version,
                function(err, data, stderr){
                    console.log('Running update.sh ' + version, data);
                });
            res.sendStatus(200);  // OK
            // res.end('<html><body>Congratulations you just hax0rd teh Gibson!</body></html>');
        }
        else {
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            res.sendStatus(401); // Force them to retry authentication
            // res.end('<html><body>You shall not pass</body></html>');
        }
    }
});

module.exports = router;
