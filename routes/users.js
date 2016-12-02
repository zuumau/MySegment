var express = require('express');
var router = express.Router();
var userModel = require('../models/UserModel');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
//
// router.get('/adduser', function(req, res, next) {
//   res.send('respond with a adduser');
// });
//


// 弹出模态框
router.get('/modal', function(req, res, next) {
  res.render('login');
});

// 注册
router.post('/register', function(req, res, next) {
    var nickname = req.body['nickname'];
    console.log('注册的email' + nickname);
    userModel.register(req,res);
});

// 登录或者弹出模态框
router.all('/login', function(req, res, next) {
    var subflag = req.body['subflag'];
    if (subflag==undefined) {
        res.render('login');
    } else {
        userModel.login(req, res);
    }

});

module.exports = router;
