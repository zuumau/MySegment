var connPool = require('./ConnPool');
var async = require('async');

module.exports = {
    ask: function (req, res) {
        pool = connPool();
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
    queList: function (req, res, loginbean,cb) {
        pool = connPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                res.send('读取连接失败:'+ err.message);
                return;
            }

            var page = 1;
            if (req.query['page']!=undefined) {
                page = parseInt(req.query['page']);
                if (page < 1) {
                    page = 1;
                }

            }
            pageSize = 3;
            pointStart = (page-1)*pageSize;
            count = 0;

            var countSql = 'select count(*) as count from question';
            var queryListSql = 'select qid,title,looknum,renum,finished,updtime,createtime from question order by qid desc limit ?,?';
            var parma = [pointStart, pageSize];

            async.series({
                one: function (callback) {
                    conn.query(countSql, [], function (err, rs) {
                        count = rs[0]['count'];
                        countPage = Math.ceil(count/pageSize);
                        if (page > countPage) {
                            page = countPage;
                            pointStart = (page-1)*pageSize;
                            parma = [pointStart, pageSize];
                        }
                        callback(null, rs);
                    });
                },
                two: function (callback) {
                    conn.query(queryListSql, parma, function (err, rs) {
                        callback(null, rs);
                    });
                }
            },function (err, results) {

                console.log('```````````````````');
                data = results['two']
                res.render('index', {loginbean: loginbean, data: data, page:page, count: count, countPage: countPage});
                // res.send('查完');
            });



            conn.release();
        })
    }
}