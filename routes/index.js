var express = require('express');
var router = express.Router();
var hue = require('./hue');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
    console.log("IoT Project is running");
    hue;
});

module.exports = router;
