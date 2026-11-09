const $ = (selector) => document.querySelector(selector);
const money = (amount) => `${store.currency} ${amount.toLocaleString()}`;
const art = (product) => `<div class="product-art ${product.style}"><div class="mini-paper"><small>${product.id === 'study-planner' ? 'my study plan' : product.id.replace('-', ' ')}</small><b>${product.id === 'study-planner' ? 'a little progress\nevery day' : 'one step\nat a time'}</b><i></i><i></i><i></i></div><span class="art-sparkle">✦</span></div>`;

function renderProducts() {
  $('#product-grid').innerHTML = store.products.map((p) => `
    <article class="product-card">
      ${art(p)}
      <div class="product-info"><p class="badge">${p.badge}</p><h3>${p.name}</h3><p>${p.description}</p>
      <div class="card-bottom"><strong>${money(p.price)}</strong><button class="text-button" data-product="${p.id}">View details <span>→</span></button></div></div>
    </article>`).join('');
}

function productById(id) { return store.products.find((p) => p.id === id); }
function details(product) {
  return `${art(product)}<div class="modal-copy"><p class="eyebrow">Digital download</p><h2>${product.name}</h2><p>${product.description}</p><ul>${product.details.map((d) => `<li>${d}</li>`).join('')}</ul><div class="modal-footer"><strong>${money(product.price)}</strong><button class="button primary buy-button" data-buy="${product.id}">${product.badge === 'Coming soon' ? 'Join the waitlist' : 'Get this download'} <span>→</span></button></div></div>`;
}
function openProduct(id) { $('#modal-content').innerHTML = details(productById(id)); $('#product-modal').showModal(); }
function checkout(product) {
  if (product.paymentLink) { window.location.assign(product.paymentLink); return; }
  const isComingSoon = product.badge === 'Coming soon';
  $('#checkout-content').innerHTML = `<div class="checkout-icon">${isComingSoon ? '✦' : '♡'}</div><p class="eyebrow">${isComingSoon ? 'Coming soon' : 'Payment setup needed'}</p><h2>${isComingSoon ? 'This product is almost here.' : 'This checkout isn’t live yet.'}</h2><p>${isComingSoon ? `Email us to join the waitlist for <b>${product.name}</b>.` : `The shop owner needs to connect a verified M-Pesa or PayPal payment link before <b>${product.name}</b> can be purchased online.`}</p><a class="button primary" href="mailto:${store.email}?subject=${encodeURIComponent(isComingSoon ? 'Waitlist: ' + product.name : 'Question about: ' + product.name)}">${isComingSoon ? 'Join by email' : 'Contact the shop'} <span>→</span></a><p class="checkout-note">No payment has been taken.</p>`;
  $('#checkout-modal').showModal();
}

renderProducts();
$('#email-link').href = `mailto:${store.email}`;
$('#year').textContent = new Date().getFullYear();
document.addEventListener('click', (event) => {
  const productButton = event.target.closest('[data-product]');
  const buyButton = event.target.closest('[data-buy]');
  if (productButton) openProduct(productButton.dataset.product);
  if (buyButton) { $('#product-modal').close(); checkout(productById(buyButton.dataset.buy)); }
  if (event.target.closest('.close')) event.target.closest('dialog').close();
});
document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); }));
