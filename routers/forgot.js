var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var router = express.Router();


var mysql = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'toor!@',            // CHANGE!
	database : 'kisa',
	port     : '3306' //8886
  });
   
  connection.connect();

/* GET home page. */
router.get('/', function (req, res) {
	res.render('forgot');
})

router.post("/", function(req, res, next){
  
	var password = Math.floor(Math.random() * 1000000000) + 1;
	var email = req.body.email;
	
	console.log(email);

	var transporter = nodemailer.createTransport(smtpTransport({
	  service: 'gmail',
	  host : 'smtp.gmail.com',
	  auth: {
		user: 'SecureTest1817@gmail.com',
		pass: 'qkfka753!@'
	  }
	}));
  
	var mailOptions = {
	  from: 'SecureTest1817@gmail.com',    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
	  to: email ,                     // 수신 메일 주소
	  subject: 'No Smoking : 임시 비밀번호 입니다',   // 제목
	  text: '임시비밀번호 : '+ password  // 내용
	};
  
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		res.json(0);
		console.log(error);
	  }
	  else {
		console.log('Email sent: ' + info.response);
		res.json(1);
	  }
	});

	var sql = "UPDATE kisa.user SET password = ? WHERE (email = ?);"

	connection.query(sql, [password, email], function(err, result) {
		if (err) {
			console.error(err);
			throw err;
		}
		else {
			console.log(result);
		}
	})
})


module.exports = router;