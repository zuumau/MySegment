var connPool = require('./ConnPool');

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
    queList: function (req, res, callback) {
        pool = connPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                res.send('读取连接失败:'+ err.message);
                return;
            }

            var queryListSql = 'select qid,title,looknum,renum,finished,updtime,createtime from question order by qid desc';
            var parma = [];
            conn.query(queryListSql, parma, function (err, rs) {
                if (err) {
                    res.send('读取异常'+ err.message);
                    return;
                }

                callback(rs);
            });
            conn.release();
        })
    }
}