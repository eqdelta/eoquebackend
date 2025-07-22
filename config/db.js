const mysql = require('mysql2');
const dbUrl = new URL(process.env.DATABASE_URL);

const db = mysql.createConnection({
  host: dbUrl.hostname,
  port: dbUrl.port,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace("/", "")
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
  } else {
    console.log("✅ Conectado ao banco com sucesso!");
  }
});
