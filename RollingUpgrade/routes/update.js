var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var sense = require("sense-hat-led").sync;

/*  Update  */
router.post('/message', function(req, res, next) {
    var message = req.body.Body;
    var version = req.header('version');
    console.log("Version is ______----->>" + version);
    if (message === 'Yes' || message === 'yes' || message === 'y'|| message === 'Y' ){
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

