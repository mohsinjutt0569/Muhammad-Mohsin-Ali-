// articles.js – manage user‑generated articles for Hamza Fashion Embroidery

import { loadJSON, saveJSON } from './utils.js';

const ARTICLES_KEY = 'hamza_articles'; // stored as array of {id, authorId, title, content, date, img?}

export function getArticles() {
  return loadJSON(ARTICLES_KEY) || [];
}

export function addArticle(article) {
  const articles = getArticles();
  articles.unshift(article); // newest first
  saveJSON(ARTICLES_KEY, articles);
}

export function renderArticles() {
  const list = document.getElementById('articleList');
  if (!list) return;
  const articles = getArticles();
  list.innerHTML = '';
  if (articles.length === 0) {
    list.innerHTML = '<p>No articles yet.</p>';
    return;
  }
  articles.forEach(a => {
    const div = document.createElement('div');
    div.className = 'article-card';
    const html = `
      <h3>${a.title}</h3>
      <p class="meta">${a.date}</p>
      ${a.img ? `<img src="${a.img}" alt="${a.title}" class="article-img"/>` : ''}
      <p class="content">${a.content}</p>
    `;
    div.innerHTML = html;
    list.appendChild(div);
  });
}
