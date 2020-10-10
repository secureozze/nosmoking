var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/deposit', function(req, res, next) {
  res.render('deposit');
});

module.exports = router;
