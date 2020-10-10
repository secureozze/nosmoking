var express = require('express');
var request = require('request');
var router = express.Router();
var auth = require('../lib/auth');

var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'toor!@',            // CHANGE!
    database : 'kisa',
    port     : '3306' //8886
  });
   

  connection.connect();
/* GET home page. */


////////////post///////////////
router.post('/', auth, function(req, res){
    //로그인과 합치면 id 혹은 다른 것 갖고 오기
    var userData = req.decoded;
    console.log(userData);
    var id = userData.userId;
    console.log(id);
    var sql = "SELECT * FROM kisa.projectlist where id = ?"
    connection.query(sql, [id], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            console.log(result[0]);
            res.json(result[0])
        }
    })
})


module.exports = router;