var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var cred = require('../cred.json');

/*  Test  */
router.post('/', function(req, res, next) {
    var version;
    (req.param('version')) ? version = req.param('version') : version = "latest";
        console.log("Testing version : " + version);
        cmd.get(
            'bash test.sh ' + version,
            function(err, data, stderr){
                if(!stderr){
                    console.log('Running update.sh ' + version, data);
                }else {
                    console.log('Error: ', stderr);
                    res.sendStatus(500);
                }
            });
        console.log("Done testing version : " + version);
        res.sendStatus(200);
});

module.exports = router;
