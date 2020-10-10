var express = require('express');

var request = require('request');
var router = express.Router();
var auth = require('../lib/auth');

var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'toor!@',
    database : 'kisa',
    port     : '3306' //8886
  });
   

  connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

////////////post///////////////
router.post('/', auth, function(req, res){
    //var userData = req.decoded;
    var userData = req.decoded;
    var id = userData.userId;

    var sql1 = "SELECT ingproject FROM kisa.user where id = ?";
    var sql2 = "SELECT * FROM kisa.projectlist WHERE proindex = (SELECT max(proindex) FROM kisa.projectlist)";
    var sql3 = "SELECT * FROM kisa.projectlist WHERE proindex = ?";
    var sql4 = "SELECT start FROM kisa.projectlist WHERE proindex = ?";
    var obj ={};
    connection.query(sql1, [id], function(err, result){
        if(err){
            console.error(err);
            throw err;
        }
        else {
            //console.log(result[0].ingproject);

            //참여중인 프로젝트가 없을 때
            if(result[0].ingproject == null){
                connection.query(sql2, function(err, result){
                    if(err){
                        console.error(err);
                        throw err;
                    }
                    else {
                        //console.log(result[0]);
                        obj = result[0];
                        obj.joinornot = 0;
                        res.json(obj)
                    }
                })
            }
            //참여중인 프로젝트가 있을 때
            else{
                var ingproject = result[0].ingproject;
                connection.query(sql3, [ingproject], function(err, result){
                    if(err){
                        console.error(err);
                        throw err;
                    }
                    else {
                        obj = result[0];
                        var today = new Date();
                        var startDay = new Date(obj.start)
                        var finishDay = new Date(obj.finish);
                        console.log(today);
                        console.log(finishDay);

                        //프로젝트 포기가 가능할 때
                        if(today < startDay){
                            obj.joinornot = 1;
                        }
                        //프로젝트가 끝나기 전일 때 //포기 불가
                        else if(today < finishDay){
                            obj.joinornot = 2;
                        }
                        //프로젝트 기간이 끝났을 때
                        else{
                            obj.joinornot = 3;
                        }
                        res.json(obj);
                    }
                })
            }
        }
    
    })
})


module.exports = router;