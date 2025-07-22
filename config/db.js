// 📁 config/db.js
import mysql from 'mysql2';

// Cria pool de conexões (mais eficiente que single connection)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Casa01++',
  database: 'eoque_db',
  charset: 'utf8mb4', // Garantir acentuação certinha
});

export default pool.promise(); // <-- ESSENCIAL!
