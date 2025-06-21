// src/lib/db.js
import mysql from 'mysql2/promise';

// Use environment variables for sensitive credentials
// Create a .env.local file in your project root with these:
// MYSQL_HOST=your_mysql_host_from_hostinger (e.g., localhost or an IP)
// MYSQL_USER=your_mysql_username
// MYSQL_PASSWORD=your_mysql_password
// MYSQL_DATABASE=your_mysql_database_name

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'job_portal_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
