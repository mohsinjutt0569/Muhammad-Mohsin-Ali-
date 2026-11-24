// script.js – Core interactivity for Hamza Fashion Embroidery site

// ----- Utility Functions -----
function $(selector) {
  return document.querySelector(selector);
}
function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}

// ----- Back to Top Button -----
const backBtn = $('#backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backBtn.classList.add('show');
  } else {
    backBtn.classList.remove('show');
  }
});
backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ----- Sample Product Data -----
const products = [
  {
    title: 'Elegant embroidered kurta',
    price: '₹4,999',
    img: 'file:///C:/Users/Muhammad%20Mohsin%20Ali/.gemini/antigravity-ide/brain/02e9bb69-3da4-4760-a655-c072558bef78/product_placeholder_1788845443563.jpg',
    rating: 5,
    onSale: true,
  },
  {
    title: 'Classic cotton shalwar',
    price: '₹3,299',
    img: './assets/product_placeholder.jpg',
    rating: 4,
    onSale: false,
  },
  {
    title: 'Luxury silk dupatta',
    price: '₹2,499',
    img: './assets/product_placeholder.jpg',
    rating: 5,
    onSale: false,
  },
  {
    title: 'Designer embroidered shirt',
    price: '₹3,799',
    img: './assets/product_placeholder.jpg',
    rating: 4,
    onSale: true,
  },
];

// ----- Render Products -----
function renderProducts() {
  const grid = $('#productGrid');
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = p.img;
    img.alt = p.title;
    card.appendChild(img);

    if (p.onSale) {
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.textContent = 'SALE';
      card.appendChild(badge);
    }

    const info = document.createElement('div');
    info.className = 'product-info';

    const title = document.createElement('h3');
    title.textContent = p.title;
    info.appendChild(title);

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = p.price;
    info.appendChild(price);

    const rating = document.createElement('div');
    rating.className = 'rating';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = i < p.rating ? '★' : '☆';
      rating.appendChild(star);
    }
    info.appendChild(rating);

    card.appendChild(info);
    grid.appendChild(card);
  });
}

// ----- Initialize -----
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
