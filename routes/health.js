var express = require('express');
var router = express.Router();

/* GET Health Check. */
router.get('/', function(req, res, next) {
    console.log("Health Check");
    res.sendStatus(200);
});

module.exports = router;
