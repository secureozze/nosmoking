var express = require("express")
var request = require('request');
var jwt = require('jsonwebtoken');
var tokenKey = "fintechAcademy0$1#0@6!2"
var auth = require('./lib/auth');

var indexRouter = require('./routers/index');
var signupRouter = require('./routers/signup');
var moreinfoRouter = require('./routers/moreinfo');
var depositRouter = require('./routers/deposit');
var loginRouter = require('./routers/login');
var forgotRouter = require('./routers/forgot');
var mainRouter = require('./routers/main');
var charge01Router = require('./routers/charge01');
var charge02Router = require('./routers/charge02');
var getPointRouter = require('./routers/getPoint');
var depositRefundRouter = require('./routers/depositRefund');
var mypageRouter = require('./routers/mypage');
var historyRouter = require('./routers/history');
var getallRouter = require('./routers/getall');
var finishedRouter = require('./routers/finished');
var getproRouter = require('./routers/getpro');

app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));//public 폴더는 공개되는 것이기 때문에 디자인들을 올림
app.set('views', __dirname + '/views');//뷰파일 위치
app.set('view engine', 'ejs');//어떤 엔진을 사용하겠다.

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/', signupRouter);
app.use('/', moreinfoRouter);
app.use('/', depositRouter);
app.use('/', mypageRouter);
app.use('/login', loginRouter);
app.use('/forgot', forgotRouter);
app.use('/main', mainRouter);
app.use('/charge01', charge01Router);
app.use('/charge02', charge02Router);
app.use('/getPoint', getPointRouter);
app.use('/depositRefund', depositRefundRouter);
app.use('/history', historyRouter);
app.use('/getall', getallRouter);
app.use('/finished', finishedRouter);
app.use('/getpro', getproRouter);
var mysql = require('mysql');

//각자에 맞게 바꾸기
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toor!@',           // CHANGE!
  database: 'kisa',
  port: '3306' //8886
});

connection.connect();




////////////////////////////////////////
app.post('/user', function (req, res) {
  console.log(req.body);
  var name = req.body.name;
  var birth = req.body.birth;
  var id = req.body.id;
  var password = req.body.password;
  var email = req.body.email;
  var accessToken = req.body.accessToken
  var refreshToken = req.body.refreshToken
  var userSeqNo = req.body.userSeqNo

  console.log(accessToken, "에세스 토큰 확인")
  console.log(refreshToken)
  // 3개 변수 추가

  var sql = "INSERT INTO kisa.user (name, birth, id, email, password, accesstoken, refreshtoken, userseqno) VALUES (?, ? , ?, ?, ?, ?, ?, ?)"
  // SQL 구문 변경 DB 구조 확인 바람

  connection.query(sql, [name, birth, id, email, password, accessToken, refreshToken, userSeqNo], function (error, results, fields) {
    // [] 배열 정보 변경 -> 변수추가
    if (error) throw error;
    console.log('The result is: ', results);
    console.log('sql is ', this.sql);
    res.json(1);
  });
})




app.get('/authResult', function (req, res) {
  var authCode = req.query.code;
  console.log(authCode);
  var option = {
    method: "POST",
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers: "",
    form: {
      code: authCode,
      client_id: 'd4lCl2xRP4En8A1VxOpzzVGeomlidpl8YfnAoa1p',               // CHANGE!
      client_secret: 'yHWkmBMC2gXpMP78Efsn4qvTrWymK9o2SXsTjgde',     // CHANGE!
      redirect_uri: 'http://localhost:3000/authResult',
      grant_type: 'authorization_code'
    }
  }
  request(option, function (error, response, body) {
    console.log(body);
    var accessRequestResult = JSON.parse(body);
    res.render('resultChild', { data: accessRequestResult })

  });
})


app.post('/charge01', function (req, res) {
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991605470U" + countnum;

  var option = {                  // CHANGE!
    method: "post",
    url: "https://testapi.openbanking.or.kr/v2.0/transfer/withdraw/fin_num",
    headers: {
      Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNjA1NTYwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNTk5MDczMzAxLCJqdGkiOiJhMDg4OGY5NC1iZTcxLTQxZmMtYWE5NC0zMDU4MjEzZGM0NzUifQ.Lf1THgB3MMlA8dgpWAuWt8WGy4I5WOVRvKorhmGQ3IY"
    },
    json: {
      "bank_tran_id" : transId,
      "cntr_account_type": "N",
      "cntr_account_num": "5713231710",
      "dps_print_content": "금연챌린지충전",
      "fintech_use_num": "199160556057881516772656",
      "tran_amt": "1000",
      "tran_dtime": "2020060410101921",
      "req_client_fintech_use_num": "199160556057881516772656",
      "req_client_name": "오지연",
      "req_client_num": "5713231710",
      "transfer_purpose": "TR",
      "recv_client_name": "오지연",
      "recv_client_bank_code": "097",
      "recv_client_account_num": "5713231710"
    }
  }
  request(option, function (error, response, body) {
    console.log(body);
    var resultObject = body;
    res.json(resultObject);
    console.log("resultObject:" + resultObject.rsp_code);

  })
})

app.post('/charge02', auth, function (req, res) {
  var userId = req.decoded.userId;
  var proindex = req.body.proindex;
  console.log(userId);
  console.log(proindex);
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991605560U" + countnum;                                   // CHANGE!
  var sql = "UPDATE kisa.user SET point = point + 100000, ingproject = ?,temporary = ? WHERE id = ?";
  connection.query(sql, [proindex, proindex, userId], function (error, results, fields) {
    if (error) throw error;
  })
  var sql2 = "INSERT INTO kisa.participant (userindex, proindex) VALUES ((SELECT userindex FROM kisa.user WHERE id = ?), ?)"
  connection.query(sql2, [userId, proindex], function (error, results, fields) { ////fields는 컬럼을 의미한다.
    if (error) throw error;
    // console.log("charge participant sql is ", this.sql);
  });
  var sql3 = 'UPDATE kisa.projectlist SET people = people+1 WHERE proindex = (SELECT ingproject FROM kisa.user WHERE id = ?);'
  connection.query(sql3, [userId], function (error, results, fields) { ////fields는 컬럼을 의미한다.
    if (error) throw error;
    // console.log("charge projectlist sql is ", this.sql);
  });

})


//챌린지 포기
app.post('/deposit', auth, function (req, res) {
  var finusenum = req.body.qrFin;
  var userId = req.decoded.userId
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991605560U" + countnum;                                      // CHANGE!
  var sql = "UPDATE kisa.user SET point = point-100000, ingproject = NULL WHERE id = ?;";
  connection.query(sql, [userId], function (error, results, fields) {
    if (error) throw error;
    var option = {                              // CHANGE!
      method: "post",
      url: "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
      headers: {
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNjA1NDcwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNTg2NTExMjg0LCJqdGkiOiIwZTM3YzgwZC0wNTcyLTQwMzMtYmE3Yy00Y2IyYmFkZGY5ZTkifQ.i7Ch-iQXDkt-RmCzYPuPZtzVLHl67ENrYT_ToIaL-Qs"
      },
      json: {
        "cntr_account_type": "N",
        "cntr_account_num": "4551653622",
        "wd_pass_phrase": "NONE",
        "wd_print_content": "환불금액",
        "name_check_option": "on",
        "tran_dtime": "20200110101921",
        "req_cnt": "1",
        "req_list": [
          {
            "tran_no": "1",
            "bank_tran_id": transId,
            "fintech_use_num": "199160547057881507772566",
            "print_content": "오픈서비스캐시백",
            "tran_amt": "100000",
            "req_client_name": "유지성", "req_client_bank_code": "097", "req_client_account_num": "4551653622",
            "req_client_num": "HONGGILDONG1234",
            "transfer_purpose": "TR"
          }
        ]
      }
    }
    request(option, function (error, response, body) {
      console.log(body);
      var resultObject = body;
      res.json(resultObject);
    })
  }
  )
  var sql2 = "DELETE FROM kisa.participant WHERE userindex = (SELECT userindex FROM kisa.user where id = ?);";
  connection.query(sql2, [userId], function (error, results, fields) { ////fields는 컬럼을 의미한다.
    if (error) throw error;
  }
  )

  var sql3 = "UPDATE kisa.projectlist SET people = people-1 WHERE proindex = (SELECT temporary FROM kisa.user WHERE id = ?)";
  connection.query(sql3, [userId], function (error, results, fields) { ////fields는 컬럼을 의미한다.
    if (error) throw error;
  }
  )


});
////////////////////////////////
//성공하였을때 환급
app.post('/depositRefund', auth, function (req, res) {
  var finusenum = req.body.qrFin;
  var userId = req.decoded.userId
  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991605470U" + countnum;                                      // CHANGE!
  var sql = "UPDATE kisa.user SET point = 0, ingproject = NULL WHERE id = ?;";
  connection.query(sql, [userId], function (error, results, fields) {
    if (error) throw error;
    var option = {                              // CHANGE!
      method: "POST",
      url: "https://testapi.openbanking.or.kr/v2.0/transfer/deposit/fin_num",
      headers: {
        Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJUOTkxNjA1NDcwIiwic2NvcGUiOlsib29iIl0sImlzcyI6Imh0dHBzOi8vd3d3Lm9wZW5iYW5raW5nLm9yLmtyIiwiZXhwIjoxNTg2NTExMjg0LCJqdGkiOiIwZTM3YzgwZC0wNTcyLTQwMzMtYmE3Yy00Y2IyYmFkZGY5ZTkifQ.i7Ch-iQXDkt-RmCzYPuPZtzVLHl67ENrYT_ToIaL-Qs"
      },
      json: {
        "cntr_account_type": "N",
        "cntr_account_num": "4551653622",
        "wd_pass_phrase": "NONE",
        "wd_print_content": "환급금액",
        "name_check_option": "on",
        "tran_dtime": "20200110101921",
        "req_cnt": "1",
        "req_list": [
          {
            "tran_no": "1",
            "bank_tran_id": transId,
            "fintech_use_num": "199160547057881507772566",
            "print_content": "환급금액",
            "tran_amt": "150000",
            "req_client_name": "유지성", "req_client_bank_code": "097", "req_client_account_num": "4551653622",
            "req_client_num": "HONGGILDONG1234",
            "transfer_purpose": "TR"
          }
        ]
      }
    }
    request(option, function (error, response, body) {
      console.log(body);
      var resultObject = body;
      res.json(resultObject);
    })
  }
  )
  var sql2 = "delete from kisa.participant where userindex = (select userindex from kisa.user where id = ?);";
  connection.query(sql2, [userId], function (error, results, fields) { ////fields는 컬럼을 의미한다.
    if (error) throw error;
  }
  )



});


////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////

app.use('/chargesuccess', function (req, res) {
  res.render('chargesuccess');
})
////////////////////////////////////////////////////////////////
app.use('/refund', function (req, res) {
  res.render('refund');
})

app.use('/depositRefund', function (req, res) {
  res.render('depositRefund');
})

app.use('/nothing', function (req, res) {
  res.render('nothing');
})
//////////////////////////////////////////////////////

app.listen(port);
console.log("Listening on port ", port);

module.exports = app;