const API_BASE = '/api';

var currentCurrency = localStorage.getItem('currency') || 'INR';

var CURRENCIES = {
  INR: { symbol: '\u20B9', label: 'Rs', locale: 'en-IN' },
  USD: { symbol: '$', label: '$', locale: 'en-US' },
  EUR: { symbol: '\u20AC', label: '\u20AC', locale: 'de-DE' },
  GBP: { symbol: '\u00A3', label: '\u00A3', locale: 'en-GB' },
  BDT: { symbol: '\u09F3', label: 'Tk', locale: 'bn-BD' },
};

async function apiCall(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function getCurrencySymbol() {
  return CURRENCIES[currentCurrency] ? CURRENCIES[currentCurrency].symbol : '\u20B9';
}

function getCurrencyLabel() {
  return CURRENCIES[currentCurrency] ? CURRENCIES[currentCurrency].label : 'Rs';
}

function formatCurrency(amount) {
  var sym = getCurrencySymbol();
  var num = Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return sym + num;
}

function formatCurrencyPlain(amount) {
  return Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatIST(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatISTDateShort(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toast-container');
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(function () {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(function () { toast.remove(); }, 300);
  }, 3000);
}

function createItemRow(index, item) {
  var div = document.createElement('div');
  div.className = 'item-card';
  div.dataset.index = index;

  var num = document.createElement('span');
  num.className = 'item-number';
  num.textContent = '#' + (index + 1);

  var removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn btn-danger btn-sm remove-item';
  removeBtn.title = 'Remove item';
  removeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  var row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML =
    '<div class="form-group">' +
      '<label>Product Name *</label>' +
      '<input type="text" class="item-product-name" value="' + (item ? item.product_name : '') + '" placeholder="e.g. Cotton Shirt" required>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Quantity</label>' +
      '<input type="number" class="item-quantity" min="0.01" step="0.01" value="' + (item ? item.quantity : 1) + '">' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Unit Price</label>' +
      '<input type="number" class="item-unit-price" min="0" step="0.01" value="' + (item ? item.unit_price : 0) + '">' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Total</label>' +
      '<div class="item-total">' + formatCurrency(item ? item.quantity * item.unit_price : 0) + '</div>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Description</label>' +
      '<input type="text" class="item-description" value="' + (item && item.description ? item.description : '') + '" placeholder="Optional">' +
    '</div>';

  removeBtn.addEventListener('click', function () {
    div.style.animation = 'fadeIn 0.2s ease reverse forwards';
    setTimeout(function () {
      div.remove();
      renumberItems();
      recalculate();
    }, 180);
  });

  var inputs = row.querySelectorAll('.item-quantity, .item-unit-price');
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      var card = input.closest('.item-card');
      var qty = parseFloat(card.querySelector('.item-quantity').value) || 0;
      var price = parseFloat(card.querySelector('.item-unit-price').value) || 0;
      card.querySelector('.item-total').textContent = formatCurrency(qty * price);
      recalculate();
    });
  });

  div.appendChild(num);
  div.appendChild(removeBtn);
  div.appendChild(row);
  return div;
}

function renumberItems() {
  var cards = document.querySelectorAll('.item-card');
  cards.forEach(function (card, i) {
    var num = card.querySelector('.item-number');
    if (num) num.textContent = '#' + (i + 1);
  });
}

function recalculate() {
  var subtotal = 0;
  document.querySelectorAll('.item-card').forEach(function (card) {
    var qty = parseFloat(card.querySelector('.item-quantity').value) || 0;
    var price = parseFloat(card.querySelector('.item-unit-price').value) || 0;
    subtotal += qty * price;
  });
  var discount = parseFloat(document.getElementById('discount').value) || 0;
  var total = Math.max(0, subtotal - discount);

  document.getElementById('subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('grand-total').textContent = formatCurrency(total);
}

function getFormData() {
  var items = [];
  document.querySelectorAll('.item-card').forEach(function (card) {
    items.push({
      product_name: card.querySelector('.item-product-name').value.trim(),
      description: card.querySelector('.item-description').value.trim(),
      quantity: card.querySelector('.item-quantity').value,
      unit_price: card.querySelector('.item-unit-price').value,
    });
  });

  return {
    customer_name: document.getElementById('customer-name').value.trim(),
    customer_phone: document.getElementById('customer-phone').value.trim(),
    customer_address: document.getElementById('customer-address').value.trim(),
    items: items,
    discount: document.getElementById('discount').value || 0,
    bill_date: new Date().toISOString().split('T')[0],
  };
}

function clearForm() {
  document.getElementById('customer-name').value = '';
  document.getElementById('customer-phone').value = '';
  document.getElementById('customer-address').value = '';
  document.getElementById('discount').value = '0';
  document.getElementById('subtotal').textContent = formatCurrency(0);
  document.getElementById('grand-total').textContent = formatCurrency(0);
  document.getElementById('items-container').innerHTML = '';
  addItem();
}

function addItem() {
  var container = document.getElementById('items-container');
  var index = container.children.length;
  container.appendChild(createItemRow(index));
}

function renderBillCard(bill) {
  var div = document.createElement('div');
  div.className = 'bill-card';
  div.dataset.id = bill.id;
  div.innerHTML =
    '<div class="bill-card-info">' +
      '<h3>' + escapeHtml(bill.bill_number) + '</h3>' +
      '<p>' + escapeHtml(bill.customer_name) + (bill.customer_phone ? ' &middot; ' + escapeHtml(bill.customer_phone) : '') + '</p>' +
    '</div>' +
    '<div class="bill-card-amount">' +
      '<span class="bill-date">' + formatISTDateShort(bill.bill_date) + '</span>' +
      '<span class="bill-amount">' + formatCurrency(bill.total) + '</span>' +
    '</div>';
  return div;
}

function renderBillView(bill, businessConfig) {
  var container = document.getElementById('bill-view-content');
  var itemsHtml = '';
  bill.items.forEach(function (item, i) {
    itemsHtml +=
      '<tr>' +
        '<td>' + (i + 1) + '</td>' +
        '<td>' + escapeHtml(item.product_name) + '</td>' +
        '<td>' + escapeHtml(item.description || '-') + '</td>' +
        '<td class="text-right">' + Number(item.quantity) + '</td>' +
        '<td class="text-right">' + formatCurrency(item.unit_price) + '</td>' +
        '<td class="text-right">' + formatCurrency(item.total) + '</td>' +
      '</tr>';
  });

  var biz = businessConfig || {};
  var bizName = biz.name || 'Your Business Name';
  var bizAddr = biz.address || '';
  var bizPhone = biz.phone || '';
  var bizEmail = biz.email || '';
  var bizGstin = biz.gstin || '';

  var businessHtml =
    '<div class="bill-view-business">' +
      '<h2>' + escapeHtml(bizName) + '</h2>' +
      (bizAddr ? '<p>' + escapeHtml(bizAddr) + '</p>' : '') +
      (bizPhone ? '<p>' + escapeHtml(bizPhone) + '</p>' : '') +
      (bizEmail ? '<p>' + escapeHtml(bizEmail) + '</p>' : '') +
      (bizGstin ? '<span class="gst-badge">GSTIN: ' + escapeHtml(bizGstin) + '</span>' : '') +
    '</div>';

  var istDatetime = formatIST(bill.created_at || bill.bill_date);

  container.innerHTML =
    '<div class="bill-view-header">' +
      '<h1>Tax Invoice</h1>' +
      '<p class="bill-number">' + escapeHtml(bill.bill_number) + '</p>' +
    '</div>' +
    businessHtml +
    '<div class="bill-view-meta">' +
      '<div>' +
        '<strong>Date:</strong> ' + formatDate(bill.bill_date) +
        '<br><small>' + istDatetime + ' IST</small>' +
      '</div>' +
      '<div>' +
        '<strong>Bill No:</strong> ' + escapeHtml(bill.bill_number) +
      '</div>' +
    '</div>' +
    '<div class="bill-view-customer">' +
      '<h3>Bill To</h3>' +
      '<p><strong>' + escapeHtml(bill.customer_name) + '</strong></p>' +
      (bill.customer_phone ? '<p>' + escapeHtml(bill.customer_phone) + '</p>' : '') +
      (bill.customer_address ? '<p>' + escapeHtml(bill.customer_address) + '</p>' : '') +
    '</div>' +
    '<table class="bill-view-table">' +
      '<thead>' +
        '<tr>' +
          '<th>#</th>' +
          '<th>Product</th>' +
          '<th>Description</th>' +
          '<th class="text-right">Qty</th>' +
          '<th class="text-right">Unit Price</th>' +
          '<th class="text-right">Total</th>' +
        '</tr>' +
      '</thead>' +
      '<tbody>' +
        itemsHtml +
      '</tbody>' +
    '</table>' +
    '<div class="bill-view-summary">' +
      '<div class="summary-row">' +
        '<span>Subtotal</span>' +
        '<span>' + formatCurrency(bill.subtotal) + '</span>' +
      '</div>' +
      '<div class="summary-row">' +
        '<span>Discount</span>' +
        '<span>' + formatCurrency(bill.discount) + '</span>' +
      '</div>' +
      '<div class="summary-divider"></div>' +
      '<div class="summary-row summary-total">' +
        '<span>Grand Total</span>' +
        '<span class="total-value">' + formatCurrency(bill.total) + '</span>' +
      '</div>' +
    '</div>' +
    '<div class="bill-view-footer">' +
      '<p>Thank you for your business!</p>' +
    '</div>';
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showError(msg) {
  showToast(msg, 'error');
}

function showLoading(el) {
  el.innerHTML = '<div class="empty-state">Loading...</div>';
}

function showEmpty(el, msg) {
  el.innerHTML = '<div class="empty-state">' + (msg || 'No bills found.') + '</div>';
}

function updateCurrencyButtons() {
  document.querySelectorAll('.currency-btn').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.currency === currentCurrency);
  });
}

function setCurrency(code) {
  currentCurrency = code;
  localStorage.setItem('currency', code);
  updateCurrencyButtons();
  recalculate();
}

window.App = {
  apiCall: apiCall,
  formatCurrency: formatCurrency,
  formatCurrencyPlain: formatCurrencyPlain,
  formatDate: formatDate,
  formatIST: formatIST,
  formatISTDateShort: formatISTDateShort,
  createItemRow: createItemRow,
  recalculate: recalculate,
  getFormData: getFormData,
  clearForm: clearForm,
  addItem: addItem,
  renderBillCard: renderBillCard,
  renderBillView: renderBillView,
  escapeHtml: escapeHtml,
  showError: showError,
  showLoading: showLoading,
  showEmpty: showEmpty,
  showToast: showToast,
  setCurrency: setCurrency,
  updateCurrencyButtons: updateCurrencyButtons,
  getCurrencySymbol: getCurrencySymbol,
  getCurrencyLabel: getCurrencyLabel,
};
