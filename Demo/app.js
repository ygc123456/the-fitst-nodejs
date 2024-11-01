// 引入所需模块
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// 创建Express实例
const app = express();

// 配置MySQL连接
const connection = mysql.createConnection({
  host: 'localhost', // MySQL服务器地址
  user: 'root', // 用户名
  password: '123456', // 密码
  database: 'mydatabase' // 数据库名称
});

// 连接到MySQL数据库
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});

// 使用body-parser解析请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 设置模板引擎为EJS
app.set('view engine', 'ejs');

// 处理GET请求，显示注册页面
app.get('/register', (req, res) => {
  res.render('register');
});

// 处理POST请求，处理注册逻辑
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
  connection.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    res.redirect('/login');
  });
});

// 处理GET请求，显示登录页面
app.get('/login', (req, res) => {
  res.render('login');
});

// 处理POST请求，处理登录逻辑
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
        res.redirect('/board');
    } else {
      res.send('用户名或密码错误！');
    }
  });
});

// 留言板

// 处理GET请求，显示留言列表
app.get('/board', (req, res) => {
    const sql = 'SELECT * FROM messages';
    connection.query(sql, (err, results) => {
      if (err) throw err;
      res.render('board', { messages: results });
    });
  });
  
  // 处理POST请求，处理添加留言逻辑
  app.post('/add', (req, res) => {
    const { name, message } = req.body;
    const sql = 'INSERT INTO messages (name, message) VALUES (?, ?)';
    connection.query(sql, [name, message], (err, result) => {
      if (err) throw err;
      res.redirect('/board');
    });
  });
  
  // 处理GET请求，显示编辑页面
  app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM messages WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
      if (err) throw err;
      res.render('edit', { message: results[0] });
    });
  });
  
  // 处理POST请求，处理更新留言逻辑
  app.post('/update/:id', (req, res) => {
    const id = req.params.id;
    const { name, message } = req.body;
    const sql = 'UPDATE messages SET name = ?, message = ? WHERE id = ?';
    connection.query(sql, [name, message, id], (err, result) => {
      if (err) throw err;
      res.redirect('/board');
    });
  });
  
  // 处理GET请求，删除留言
  app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM messages WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
      if (err) throw err;
      res.redirect('/board');
    });
  });
  
  // 启动服务器
  app.listen(3000, () => {
    console.log('Server started on port 3000.');
  });