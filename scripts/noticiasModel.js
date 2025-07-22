import db from '../config/db.js';
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});


// Pegar todas as notícias com a categoria
export async function getNoticias() {
  const sql = `
    SELECT n.id, n.titulo, n.conteudo, n.imagem, n.data_publicacao, c.nome as categoria
    FROM noticias n
    LEFT JOIN categorias c ON n.categoria_id = c.id
    ORDER BY n.data_publicacao DESC
  `;
  const [rows] = await db.query(sql);
  return rows;
}

// Pegar notícias por categoria
export async function getNoticiasPorCategoria(categoriaNome) {
  const sql = `
    SELECT n.id, n.titulo, n.conteudo, n.imagem, n.data_publicacao, c.nome as categoria
    FROM noticias n
    JOIN categorias c ON n.categoria_id = c.id
    WHERE c.nome = ?
    ORDER BY n.data_publicacao DESC
  `;
  const [rows] = await db.query(sql, [categoriaNome]);
  return rows;
}

// Inserir uma notícia nova
export async function inserirNoticia({ titulo, conteudo, imagem, categoria_id }) {
  const sql = `
    INSERT INTO noticias (titulo, conteudo, imagem, categoria_id)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [titulo, conteudo, imagem, categoria_id]);
  return result.insertId; // id da notícia inserida
}
