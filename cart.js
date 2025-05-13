// cart.js

document.addEventListener("DOMContentLoaded", function () {
  renderCart();
  updateCartBadge();
});

function getCartProducts() {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.map(item => {
    const prod = window.products.find(p => p.id === item.id);
    return prod ? { ...prod, qty: item.qty } : null;
  }).filter(Boolean);
}

function renderCart() {
  const container = document.getElementById("cart-container");
  const cartProducts = getCartProducts();
  if (!container) return;
  if (cartProducts.length === 0) {
    container.innerHTML = '<div style="padding: 60px; font-size: 24px; font-family: \'Josefin Sans\', sans-serif; color: #AA5B11; text-align:center;">Your cart is empty.</div>';
    return;
  }
  let total = 0;
  container.innerHTML = cartProducts.map(product => {
    const price = parseInt(product.price.replace(/\D/g, ''));
    total += price * product.qty;
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">${product.price}</div>
          <div class="cart-item-qty-row">
            <button class="cart-qty-btn" onclick="updateQty(${product.id}, -1)">-</button>
            <span class="cart-qty-num">${product.qty}</span>
            <button class="cart-qty-btn" onclick="updateQty(${product.id}, 1)">+</button>
            <button class="cart-remove-btn" onclick="removeFromCart(${product.id})">Remove</button>
          </div>
        </div>
        <div class="cart-item-total">INR ${price * product.qty}</div>
      </div>
    `;
  }).join('') + `
    <div class="cart-total-row">Total: INR ${total}</div>
    <div style="text-align: right; margin-top: 24px;">
      <button class="pay-btn" onclick="payNow()">Pay</button>
    </div>
  `;
}

function payNow() {
  alert('Payment integration coming soon!');
}



function updateQty(productId, delta) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart = cart.filter(i => i.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
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
