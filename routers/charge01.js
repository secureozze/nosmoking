var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.query.proindex);
    var proindex = req.query.proindex;
    res.render('charge01', {proindex : proindex});
});

module.exports = router;