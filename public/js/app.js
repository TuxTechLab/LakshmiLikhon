(function () {
  var navLinks = document.querySelectorAll('.nav-link[data-page]');
  var brandLink = document.getElementById('nav-brand-link');
  var pages = document.querySelectorAll('.page');
  var businessConfig = null;

  function navigateTo(pageName) {
    pages.forEach(function (p) { p.classList.remove('active'); });
    navLinks.forEach(function (l) { l.classList.remove('active'); });

    var page = document.getElementById('page-' + pageName);
    if (page) {
      page.classList.add('active');
    }

    navLinks.forEach(function (l) {
      if (l.dataset.page === pageName) {
        l.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageName === 'dashboard') loadDashboard();
    if (pageName === 'history') loadHistory();
  }

  function setupNavLinks(selector) {
    document.querySelectorAll(selector).forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var page = link.dataset.page || 'dashboard';
        navigateTo(page);
      });
    });
  }

  setupNavLinks('.nav-link[data-page]');
  setupNavLinks('[data-page]');
  if (brandLink) {
    brandLink.addEventListener('click', function (e) {
      e.preventDefault();
      navigateTo('dashboard');
    });
  }

  async function loadBusinessConfig() {
    try {
      var res = await App.apiCall('GET', '/config');
      businessConfig = res.business;
    } catch (err) {
      businessConfig = {};
    }
  }

  async function loadDashboard() {
    try {
      var bills = await App.apiCall('GET', '/bills?limit=5');

      document.getElementById('stat-bill-count').textContent = bills.length || 0;

      if (bills.length > 0) {
        document.getElementById('stat-latest-bill').textContent = bills[0].bill_number;
      } else {
        document.getElementById('stat-latest-bill').textContent = '-';
      }

      var list = document.getElementById('recent-bills-list');
      if (bills.length === 0) {
        list.innerHTML =
          '<div class="empty-state">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>' +
            '<p>No bills yet. Create your first bill!</p>' +
          '</div>';
      } else {
        list.innerHTML = '';
        bills.forEach(function (bill) {
          var card = App.renderBillCard(bill);
          card.addEventListener('click', function () {
            viewBill(bill.id);
          });
          list.appendChild(card);
        });
      }
    } catch (err) {
      document.getElementById('stat-bill-count').textContent = '-';
      document.getElementById('stat-latest-bill').textContent = '-';
      App.showEmpty(document.getElementById('recent-bills-list'), 'Failed to load bills.');
    }
  }

  async function loadHistory(search) {
    var list = document.getElementById('history-list');
    App.showLoading(list);

    try {
      var bills;
      if (search) {
        bills = await App.apiCall('GET', '/bills/search?q=' + encodeURIComponent(search));
      } else {
        bills = await App.apiCall('GET', '/bills');
      }

      if (bills.length === 0) {
        App.showEmpty(list, search ? 'No bills match your search.' : 'No bills found.');
      } else {
        list.innerHTML = '';
        bills.forEach(function (bill) {
          var card = App.renderBillCard(bill);
          card.addEventListener('click', function () {
            viewBill(bill.id);
          });
          list.appendChild(card);
        });
      }
    } catch (err) {
      App.showEmpty(list, 'Failed to load bills.');
    }
  }

  async function viewBill(id) {
    try {
      var bill = await App.apiCall('GET', '/bills/' + id);
      App.renderBillView(bill, businessConfig);
      navigateTo('view');
    } catch (err) {
      App.showError('Failed to load bill: ' + err.message);
    }
  }

  document.getElementById('add-item-btn').addEventListener('click', function () {
    App.addItem();
  });

  document.getElementById('bill-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    var data = App.getFormData();

    if (!data.customer_name) {
      App.showError('Customer name is required');
      return;
    }

    if (data.items.length === 0) {
      App.showError('At least one item is required');
      return;
    }

    for (var i = 0; i < data.items.length; i++) {
      if (!data.items[i].product_name) {
        App.showError('Product name is required for all items');
        return;
      }
    }

    try {
      var bill = await App.apiCall('POST', '/bills', data);
      App.showToast('Bill ' + bill.bill_number + ' saved successfully!', 'success');
      App.renderBillView(bill, businessConfig);
      navigateTo('view');
    } catch (err) {
      App.showError('Failed to save bill: ' + err.message);
    }
  });

  document.getElementById('clear-form-btn').addEventListener('click', function () {
    App.clearForm();
    App.showToast('Form cleared', 'info');
  });

  document.getElementById('search-btn').addEventListener('click', function () {
    var q = document.getElementById('search-input').value.trim();
    loadHistory(q);
  });

  document.getElementById('search-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var q = this.value.trim();
      loadHistory(q);
    }
  });

  document.getElementById('clear-search-btn').addEventListener('click', function () {
    document.getElementById('search-input').value = '';
    loadHistory();
  });

  document.getElementById('print-btn').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('discount').addEventListener('input', function () {
    App.recalculate();
  });

  document.querySelectorAll('.currency-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      App.setCurrency(btn.dataset.currency);
    });
  });

  App.updateCurrencyButtons();
  App.addItem();

  loadBusinessConfig().then(function () {
    navigateTo('dashboard');
  });
})();
