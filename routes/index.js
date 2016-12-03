var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var questionModel = require('../models/QuestionModel');

/*   GET home page. */
router.get('/', function(req, res, next) {
    var loginbean = req.session.loginbean;
    // console.log(loginbean);
    // questionModel.queList(req, res, function (data) {
    //     if (data != null) {
    //         res.render('index', { title: 'Express',
    //             data: data,
    //             loginbean: loginbean
    //         });
    //     }
    //    
    // });
    questionModel.queList(req, res, function (data, page, count, countPage) {
        res.render('index', {loginbean: loginbean, data: data, page: page, count: count, countPage: countPage});
    });



});

// 注销
router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });

});

// 上传图片
router.post('/uploadImg', function (req, res) {
    var form = new multiparty.Form();
    //设置编码
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./uploadtemp/";
    //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
        uploadurl='/images/upload/';
        file1 = files['filedata'];
        //paraname = file1[0].fieldName;  //参数名filedata
        originalFilename = file1[0].originalFilename.substring(1); //原始文件名
        tmpPath = file1[0].path;//uploads\mrecQCv2cGlZbj-UMjNyw_Bz.txt
        //fileSize = file1[0].size; //文件大小
        // originalFilename.substring(1);

        var timestamp=new Date().getTime(); //获取当前时间戳
        uploadurl += timestamp+originalFilename;
        newPath= './public'+uploadurl;
        console.log(timestamp);
        console.log(originalFilename);
        console.log(newPath);

        var fileReadStream = fs.createReadStream(tmpPath);
        var fileWriteStream = fs.createWriteStream(newPath);
        fileReadStream.pipe(fileWriteStream); //管道流
        fileWriteStream.on('close',function(){
            fs.unlinkSync(tmpPath);    //删除临时文件夹中的图片
            console.log('copy over');
            res.send('{"err":"","msg":"'+uploadurl+'"}')
        });
    });
    //-----------------------------------------
    //res.send('上传');
})

module.exports = router;
