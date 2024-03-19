const express = require('express');

const ftpconnector = require("../helpers/ftpconnector");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ftp', function(req, res, next) {
  ftpconnector.scanDir().then(r =>res.json({}) );

});

module.exports = router;
