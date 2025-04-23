const mysql = require('mysql2/promise');

// Your connection string details
const dbConfig = {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  user: 'XHhksHk9jyMbn5c.root',
  password: 'gYOUYMKHnOYjHea1',
  database: 'test',
  port: 4000,
};

// Create a pool for connection
const pool = mysql.createPool(dbConfig);

// Function to test the connection
async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('DB Connection OK:', rows);
  } catch (err) {
    console.error('Connection error:', err.message);
  }
}

// Test the connection
testConnection();

// Export the pool for further use
module.exports = pool;
