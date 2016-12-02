var connPool = require('./ConnPool');
var LoginBean = require('../jsbean/LoginBean');

module.exports = {
    register: function (req, res) {
        pool = connPool();
        // 从pool中获取连接(异步,取到后回调)
        pool.getConnection(function (err, conn) {
            if (err) {
                //console.log('insert err:', err.message)
                res.send('数据库连接错误,错误原因:'+ err.message);
                return;
            }

            // 执行注册
            var userAddSql = 'insert into user (email, pwd, nickname, createtime) values(?,?,?,current_timestamp)';
            var param = [req.body['email'], req.body['pwd'], req.body['nickname']];
            conn.query(userAddSql, param, function (err, rs) {
                if (err) {
                    console.log('insert err:', err.message);
                    errStr = err.message;
                    sendStr = "<script>";
                    if (errStr.indexOf('emailuniq')>-1) {
                        sendStr += "alert('email重复');";
                    } else if (errStr.indexOf('nichenguiq')>-1) {
                        sendStr += "alert('昵称重复');";
                    } else {
                        sendStr += "alert('数据库异常');";
                    }
                    sendStr += "history.back(); </script>"
                    res.send(sendStr);
                    return;
                }
                res.redirect(307,'login'); // 注册成功后，直接将注册的POST表单，发送给login路由，执行登录
                //res.send('<script>alert("注册成功"); location.href="/"</script>');
            })
            conn.release();
        });
    },
    login: function (req, res) {
        pool = connPool();
        pool.getConnection(function (err, conn) {
            if (err) {
                //console.log('insert err:', err.message)
                res.send('数据库连接错误,错误原因:'+ err.message);
                return;
            }

            var userSql = 'select uid,nickname from user where email=? and pwd=?';
            var param = [req.body['email'], req.body['pwd']];
            conn.query(userSql,param, function (err, rs) {
                if (err) {
                    res.send("获取连接错误,错误原因:"+err.message);
                    return;
                }
                console.log(rs);

                if (rs.length>0) {
                    loginbean = new LoginBean();
                    loginbean.id = rs[0].uid;
                    loginbean.nickname = rs[0].nickname;

                    req.session.loginbean = loginbean;
                    //res.send('登录成功');
                    res.redirect('/');            //跳转回index
                } else {
                    res.send("email/密码错误");
                }
            })
            conn.release();
        })
    }
}