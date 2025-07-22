const express = require('express');
const cors = require('cors');
const db = require('./config/db.js');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/noticias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM noticias_automaticas ORDER BY data_publicacao DESC LIMIT 10');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
});

// Start server...

app.listen(3001, () => console.log('Servidor rodando na porta 3001'));
