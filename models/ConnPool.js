var mysql = require('mysql');

module.exports = (function () {

    //('引入时就执行');
    var pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'segment',
        port: '3306'
    });
    pool.on('connection', function(connection){
        connection.query('SET SESSION auto_increment_increment=1');
    });

    // 调用时才执行的闭包方法
    return function () { // 返回的唯一的一个 pool , 每次调用拿到同一个
        return pool;
    };
})();

