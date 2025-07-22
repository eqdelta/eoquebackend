import express from 'express';
import { getNoticias, getNoticiasPorCategoria, inserirNoticia } from '../models/noticiasModel.js';

const router = express.Router();

router.get('/noticias', async (req, res) => {
  try {
    const noticias = await getNoticias();
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
});

router.get('/noticias/:categoria', async (req, res) => {
  try {
    const categoria = req.params.categoria;
    const noticias = await getNoticiasPorCategoria(categoria);
    res.json(noticias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notícias por categoria' });
  }
});

router.post('/noticias', async (req, res) => {
  try {
    const { titulo, conteudo, imagem, categoria_id } = req.body;
    const id = await inserirNoticia({ titulo, conteudo, imagem, categoria_id });
    res.status(201).json({ id, message: 'Notícia inserida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao inserir notícia' });
  }
});

export default router;
