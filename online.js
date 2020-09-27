const mySql = require('mysql')

const info = {
    host: 'localhost',
    user: 'root',
    password: 'password1!',
    port:  3306 ,
    database: 'signUpIn'
}

let mysql = mySql.createConnection(info);

mysql.connect((error)=> {
    if(error){
        console.log("DB 연동 실패 : ", error);
    }
    else {
        console.log("DB 연동 성공!");
    }
});

module.exports = {
    mysql, info
}




var express = require('express');
var router = express.Router();
var db = require('mysql');

router.get('/online', function (req, res) {
  return res.render('online', { title: '온라인id' });
});

router.post('/online', (req, res) => {
  let { id } = req.body;
  // db에서 사용자가 입력한 아이디를 조회한다.
  i=id;
  db.mysql.query('SELECT * FROM user_info WHERE id=?', id, (err, userInfo) => {
    // 만약 사용자 정보가 입력한 아이디가 존재하지 않은 경우 에러페이지를 보여준다.
    res.render('error', { title: userInfo });
    /* bcrypt.comrare라는 함수를 사용해 사용자가 입력한 비밀번호와 db에 암호화 되어있는 비밀번호를 비교해서 참이면 로그인
       아니면 에러페이지에 message를 가지고 가서 띄어준다. */

    });
});


module.exports = router;
