/**
 * 连接数据库模块
 */
const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'xhao0203.',
  database: 'sell'
});

conn.connect();
console.log('database is runing...')

module.exports = conn;