var express = require('express');
var router = express.Router();
var data = require('./data.js');

router.get('/', function(req, res, next) {
  res.json("/")
});

module.exports = router;
