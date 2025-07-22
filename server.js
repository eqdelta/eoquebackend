const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db.js');

import cron from 'node-cron';
import { puxarFeed } from './scripts/puxarFeeds.js';


const app = express();


cron.schedule('*/30 * * * *', () => {
  console.log('Atualizando notícias...');
  puxarFeed();
});

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
