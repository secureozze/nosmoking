var express = require('express');
var request = require('request');
var auth = require('../lib/auth');
var router = express.Router();
var multer = require('multer');
var path = require('path');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'toor!@',
    database: 'kisa',
    port: '3306' //8886
});

connection.connect();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('finished');
});
console.log(__dirname)
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/../public/img/');
        },
        filename: function (req, file, cb) {
            cb(null, new Date().valueOf() + path.extname(file.originalname));
        }
    }),
});

////////////post///////////////

router.post('/upload', upload.single('img'), function (req, res, err) {
    console.log("upload load")
    var originalPath = '../public/img/';
    var filename = originalPath + req.file.filename;
    res.status(200).json({ result: 'success', path: filename });
});

router.post('/insertData', auth, function (req, res) {
    //DB에 넣기
    var userData = req.decoded;
    var id = userData.userId;
    console.log("id : " + id);

    //../public/img/1579146496278.jpg 인데 여기서 public/까지 없애기
    //localhost:3000/img/1579146496278.jpg 인데 여기서 public/까지 없애기

    var ori_fullpath = req.body.path;
    var partpath = ori_fullpath.split("/");
    text = partpath.slice(2);
    console.log("path_test : " + text);
    var confirmimg = "localhost:3000/" + text[0] + "/" + text[1];
    console.log("confirmimg : " + confirmimg);

    var sql01 = "SELECT userindex FROM kisa.user WHERE id = ?;"

    connection.query(sql01, [id], function (err, result) {
        if (err) {
            console.error(err);
            throw err;
        }
        else {
            var pre_userindex = JSON.stringify(result);
            console.log("sql01의 pre_userindex : " + pre_userindex);
            var userindex = result[0].userindex;
            console.log("sql01의 userindex : " + userindex);
            var sql02 = "UPDATE kisa.participant SET confirmimg = ? WHERE userindex = ?;"
            connection.query(sql02, [confirmimg, userindex], function (err, userindex) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                else {
                    console.log("sql02의 result : " + JSON.stringify(result));
                }
            })

        }
    })
})

module.exports = router;