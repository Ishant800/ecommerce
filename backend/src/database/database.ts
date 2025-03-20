import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    return;
  }
  console.log("✅ MySQL Connected Successfully!");
  connection.release(); // Release connection back to pool
});

// ✅ Export Promisified Pool
export default pool.promise();
