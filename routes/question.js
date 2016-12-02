/**
 * Created by Administrator on 2016/11/28 0028.
 */
var express = require('express');
var router = express.Router();
var checkSession = require('../jsbean/CheckSession');
var questionModel = require('../models/QuestionModel');

router.all('/ask', function (req, res) {
    loginbead =  checkSession.check(req, res)
    if (!loginbead) {return;}
    subflag = req.body['subflag'];
    if (subflag==undefined) {
        res.render('ask', {loginbean:loginbead})
    } else {
        questionModel.ask(req, res);
    }

});

module.exports = router;