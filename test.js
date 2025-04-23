const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  user: 'XHhksHk9jyMbn5c.root',
  password: 'gYOUYMKHnOYjHea1',
  database: 'test',
  port: 4000,
  ssl: {
    rejectUnauthorized: true
  }
});

conn.connect((err) => {
  if (err) {
    return console.error('Connection failed:', err.message);
  }
  console.log('Connected to TiDB Cloud!');
  conn.end();
});
