var connPool = require('./ConnPool');
var async = require('async');
var EventProxy = require('eventproxy');

var ep = EventProxy();

module.exports = {
    ask: function (req, res) {
        var pool = connPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                res.send('数据库链接错误:'+ err.message);
                return;
            }

            var askAddSql = 'insert into question (title, typeid, content, uid, createtime) values(?,?,?,?,current_timestamp)';
            var param = [req.body['title'], req.body['typeid'], req.body['content'], loginbean.id];
            conn.query(askAddSql, param, function (err, rs) {
                if (err) {
                    res.send('存储异常:'+ err.message);
                    return;
                }

                res.send('<script>alert("提问成功");location.href="/";</script>');
                //res.redirect('/');
            })
            conn.release();
        })
    },
    queList: function (req, res, cb) {
        var pool = connPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                res.send('读取连接失败:'+ err.message);
                return;
            }

            var page = 1;           // 初始页码 第一页
            if (req.query['page']!=undefined) {
                page = parseInt(req.query['page']);
                if (page < 1) {
                    page = 1;
                }

            }
            var pageSize = 3;
            var pointStart = (page-1)*pageSize;
            var count = 0;

            var countSql = 'select count(*) as count from question';
            var queryListSql = 'select qid,title,looknum,renum,finished,updtime,createtime from question order by qid desc limit ?,?';
            var param = [pointStart, pageSize];

            ep.all(['queryCount'], function (result) {
                conn.query(queryListSql, result['param'], function (err, rs) {
                    if (err) {
                        // console.log(result['param']);
                    }

                    // console.log(rs);
                    cb(rs, page, result['count'], result['countPage'])
                    // res.render('index', {data: rs, page: page, count: result['count'], countPage: result['countPage']});
                })
                conn.release();

            });

            conn.query(countSql, [], function (err, rs) {
                count = rs[0]['count'];
                var countPage = Math.ceil(count/pageSize);  // 取整
                if (page > countPage) {                     // 如果传入的 页码参数 大于总页数
                    page = countPage;                       // 页码变成最后一页
                    pointStart = (page-1) * pageSize;       // 计算起点
                    param = [pointStart, pageSize];         // 参数【查询起点、查询数量】
                }
                var result = {count: count, param: param, countPage: countPage};
                ep.emit('queryCount', result);
            });

            // async.series({
            //     one: function (callback) {
            //         conn.query(countSql, [], function (err, rs) {
            //             count = rs[0]['count'];
            //             var countPage = Math.ceil(count/pageSize);
            //             if (page > countPage) {
            //                 page = countPage;
            //                 pointStart = (page-1)*pageSize;
            //                 parma = [pointStart, pageSize];
            //             }
            //             callback(null, rs);
            //         });
            //     },
            //     two: function (callback) {
            //         conn.query(queryListSql, parma, function (err, rs) {
            //             callback(null, rs);
            //         });
            //     }
            // },function (err, results) {
            //
            //     console.log('```````````````````');
            //     data = results['two']
            //     res.render('index', {loginbean: loginbean, data: data, page:page, count: count, countPage: countPage});
            //     // res.send('查完');
            // });



            // conn.release();
        })
    }
}