const productContainer = document.querySelector('.shopping-products');
const paginationContainer = document.getElementById('pagination');

const PRODUCTS_PER_PAGE = 9;
let currentPage = 1;

// --- Category Filter Functionality (using sidebar HTML) ---
let currentCategory = 'ALL';

function setupSidebarCategoryFilters() {
  const sidebarCats = document.querySelectorAll('.shopping-filter-text');
  sidebarCats.forEach(el => {
    el.style.cursor = 'pointer';
    el.onclick = function() {
      currentCategory = el.textContent.trim().toUpperCase();
      highlightSidebarCategory(currentCategory);
      renderProducts(products, 1);
    };
  });
  // Allow ALL to reset
  const heading = document.querySelector('.shopping-filter-heading');
  if (heading) {
    heading.style.cursor = 'pointer';
    heading.onclick = function() {
      currentCategory = 'ALL';
      highlightSidebarCategory(currentCategory);
      renderProducts(products, 1);
    };
  }
}

function highlightSidebarCategory(category) {
  const sidebarCats = document.querySelectorAll('.shopping-filter-text');
  sidebarCats.forEach(el => {
    if (el.textContent.trim().toUpperCase() === category) {
      el.classList.add('active-category');
    } else {
      el.classList.remove('active-category');
    }
  });
  const heading = document.querySelector('.shopping-filter-heading');
  if (heading) {
    if (category === 'ALL') heading.classList.add('active-category');
    else heading.classList.remove('active-category');
  }
}

// --- Custom filter logic for sidebar ---
function matchesFilter(product, filter) {
  filter = filter.toUpperCase();
  if (filter === 'ALL') return true;
  if (product.category && product.category.toUpperCase() === filter) return true;
  // Custom tags: add logic for BEST SELLER, NEW ARRIVALS, GIFTS, etc.
  if (filter === 'BEST SELLER' && product.bestSeller) return true;
  if (filter === 'NEW ARRIVALS' && product.newArrival) return true;
  if (filter === 'GIFTS' && product.gift) return true;
  // Add more custom tags as needed
  return false;
}

document.addEventListener('DOMContentLoaded', function() {
  setupSidebarCategoryFilters();
  highlightSidebarCategory(currentCategory);
});

function renderProducts(products, page = 1) {
  let filteredProducts = products.filter(p => matchesFilter(p, currentCategory));
  productContainer.innerHTML = '';
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(start, end);

  currentProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.style.position = 'relative';
    productCard.innerHTML = `
      <a href="product.html?id=${product.id}" style="text-decoration:none; color:inherit; display:block;">
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price" style="margin-bottom:-10px">${product.price}</p>
      </a>
      <div class="cart-action-container" style="margin-bottom:5px"></div>
    `;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const found = cart.find(item => item.id === product.id);
    const actionDiv = productCard.querySelector('.cart-action-container');
    if (found) {
      actionDiv.innerHTML = `
        <div class="qty-controls" style="display:flex;align-items:center;gap:10px;margin-top:10px; color:black">
          <button class="qty-btn" style="padding:2px 10px;">-</button>
          <span class="qty-num" style="font-weight:600;min-width:18px;display:inline-block;">${found.qty}</span>
          <button class="qty-btn" style="padding:2px 10px;">+</button>
        </div>
      `;
      const [minus, plus] = actionDiv.querySelectorAll('.qty-btn');
      minus.onclick = function(e) {
        e.stopPropagation(); e.preventDefault();
        updateCartQty(product.id, -1); renderProducts(products, currentPage);
      };
      plus.onclick = function(e) {
        e.stopPropagation(); e.preventDefault();
        updateCartQty(product.id, 1); renderProducts(products, currentPage);
      };
    } else {
      actionDiv.innerHTML = `<button class="add-to-cart-btn" style="margin-top: 10px; padding: 7px 22px; background: #CFAE74; color: black; border: none; border-radius: 8px; font-size: 1rem; font-family: 'Inter', sans-serif; cursor: pointer; font-weight: 600;">Add to Cart</button>`;
      actionDiv.querySelector('.add-to-cart-btn').onclick = function(e) {
        e.stopPropagation(); e.preventDefault();
        addToCart(product.id); renderProducts(products, currentPage);
      };
    }
    productContainer.appendChild(productCard);
  });
  updateCartBadge();
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const found = cart.find(item => item.id === productId);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartQty(productId, delta) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const found = cart.find(item => item.id === productId);
  if (found) {
    found.qty += delta;
    if (found.qty <= 0) {
      cart = cart.filter(item => item.id !== productId);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge();
  }
}

function updateCartBadge() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count > 0 ? count : '';
  badge.style.background = '#AA5B11';
  badge.style.color = 'white';
  badge.style.borderRadius = '50%';
  badge.style.fontSize = '13px';
  badge.style.padding = '2px 7px';
  badge.style.position = 'absolute';
  badge.style.right = '-10px';
  badge.style.top = '-6px';
}

function renderPagination(products) {
  paginationContainer.innerHTML = '';
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.add('pagination-btn');
    if (i === currentPage) btn.classList.add('active');

    btn.addEventListener('click', () => {
      currentPage = i;
      renderProducts(products, currentPage);
      renderPagination(products);
    });

    paginationContainer.appendChild(btn);
  }
}

// Initialize everything
renderProducts(products, currentPage);
renderPagination(products);
