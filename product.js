// product.js

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  const container = document.getElementById("product-detail-container");

  const product = window.products.find(p => p.id === productId);
  if (!product) {
    container.innerHTML = '<p style="padding: 60px; font-size: 24px">Product not found.</p>';
    return;
  }

  // Cart logic
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const found = cart.find(item => item.id === product.id);

  let actionHtml = '';
  if (found) {
    actionHtml = `
      <div class="qty-controls" style="display:flex;align-items:center;gap:10px;">
        <button id="minus-btn" style="padding:2px 10px;">-</button>
        <span id="qty-num" style="font-weight:600;min-width:18px;display:inline-block;">${found.qty}</span>
        <button id="plus-btn" style="padding:2px 10px;">+</button>
      </div>
    `;
  } else {
    actionHtml = `<button id="add-to-cart-btn" style="padding: 12px 36px; background: #CFAE74; color: black; border: none; border-radius: 8px; font-size: 1.1rem; font-family: 'Inter', sans-serif; cursor: pointer; font-weight: 600;">Add to Cart</button>`;
  }

  container.innerHTML = `
    <div style="display: flex; gap: 60px; align-items: flex-start; padding: 60px;">
      <img src="${product.image}" alt="${product.name}" style="width: 340px; height: 420px; border-radius: 18px; object-fit: cover; box-shadow: 0 8px 32px rgba(0,0,0,0.12);">
      <div style="max-width: 420px;">
        <h2 style="font-size: 2.2rem; font-family: 'inter', sans-serif; margin-bottom: 12px;">${product.name}</h2>
        <p style="font-size: 1.2rem; color: #AA5B11; font-weight: 600; margin-bottom: 22px;">${product.price}</p>
        <p style="font-size: 1.1rem; margin-bottom: 32px; color: #222;">${product.description || 'No description available.'}</p>
        <div id="product-cart-action">${actionHtml}</div>
      </div>
    </div>
  `;

  // Attach event listeners
  if (!found) {
    document.getElementById("add-to-cart-btn").onclick = function() {
      addToCart(product.id);
      renderProductPage();
    };
  } else {
    document.getElementById("minus-btn").onclick = function() {
      updateCartQty(product.id, -1);
      renderProductPage();
    };
    document.getElementById("plus-btn").onclick = function() {
      updateCartQty(product.id, 1);
      renderProductPage();
    };
  }

  updateCartBadge();

  function renderProductPage() {
    // re-render the page
    document.getElementById('product-detail-container').innerHTML = '';
    document.removeEventListener("DOMContentLoaded", arguments.callee);
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }

});

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
