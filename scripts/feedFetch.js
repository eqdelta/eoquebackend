import iconv from 'iconv-lite';
import fetch from 'node-fetch';
import Parser from 'rss-parser';
import db from '../config/db.js';

const parser = new Parser();

async function baixarFeedComCharset(url, encoding = 'utf-8') {
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const decoded = iconv.decode(Buffer.from(buffer), encoding);
    return await parser.parseString(decoded);
  } catch (err) {
    console.error(`❌ Erro ao baixar/parsing feed manual de ${url}:`, err.message);
    return null;
  }
}

const fontesBahia = [
  // { url: 'https://www.bahianoticias.com.br/rss/', categoria: 'bahia' }, // essa tava dando 404
  { url: 'https://g1.globo.com/rss/g1/bahia/', categoria: 'bahia' },
  { url: 'https://www.metro1.com.br/rss', categoria: 'bahia' },
  { url: 'https://atarde.com.br/rss', categoria: 'bahia' },
  { url: 'https://www.correio24horas.com.br/rss', categoria: 'bahia' },
];

const fontesNacionais = [
  { url: 'https://g1.globo.com/rss/g1/', categoria: 'brasil' },
  { url: 'https://feeds.folha.uol.com.br/emcimadahora/rss091.xml', categoria: 'brasil' },
  { url: 'https://rss.estadao.com.br/cidades', categoria: 'brasil' }
];

async function salvarNoticias(items, categoria) {
  for (const item of items) {
    const titulo = item.title || 'Sem título';
    const link = item.link || '';
    const dataPub = item.pubDate ? new Date(item.pubDate) : new Date();
    const conteudo = item.contentSnippet || item.content || '';

    const sql = `
      INSERT INTO noticias_automaticas (titulo, link, data_publicacao, conteudo, categoria)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE titulo = VALUES(titulo)
    `;

    try {
      const [result] = await db.query(sql, [titulo, link, dataPub, conteudo, categoria]);
      console.log(`✅ [${categoria}] Notícia salva/atualizada: ${titulo}`);
    } catch (err) {
      console.error(`❌ [${categoria}] Erro ao salvar notícia: ${titulo} - ${err.message}`);
    }
  }
}

async function puxarFeed() {
  console.log('🚀 Iniciando busca de feeds RSS...');

  // Feeds da Bahia
  for (const fonte of fontesBahia) {
    try {
      console.log(`🌍 Buscando notícias de: ${fonte.url}`);
  const feed = await baixarFeedComCharset(fonte.url, 'latin1'); // ou 'utf-8' se quiser testar os dois

      console.log(`📦 ${feed.items.length} itens encontrados`);
      await salvarNoticias(feed.items, fonte.categoria);
    } catch (err) {
      console.error(`❌ [${fonte.categoria}] Feed com erro de parse (${fonte.url}): ${err.message}`);
    }
  }

  // Feeds nacionais (pega só 20%)
  for (const fonte of fontesNacionais) {
    try {
      console.log(`🇧🇷 Buscando notícias nacionais: ${fonte.url}`);
      const feed = await parser.parseURL(fonte.url);
      const limite = Math.ceil(feed.items.length * 0.2);
      const selecionadas = feed.items.slice(0, limite);
      console.log(`🔍 Selecionando ${limite} itens dos ${feed.items.length} disponíveis`);
      await salvarNoticias(selecionadas, fonte.categoria);
    } catch (err) {
      console.error(`❌ [${fonte.categoria}] Feed com erro de parse (${fonte.url}): ${err.message}`);
    }
  }

  console.log('🎯 Finalizado com sucesso!');
}

puxarFeed();
