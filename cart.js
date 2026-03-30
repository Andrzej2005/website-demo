(function(){

  /* ── Dati demo (in produzione arriverebbero da un'API/localStorage) ── */
  var ITEMS = [
    {
      id:1,
      name:'ProArt GeForce RTX™ 4080 16GB OC',
      category:'Schede Video',
      type:'',
      status:'available',
      price:1549.95,
      qty:1,
      img:'Asus_ProArt_RTX4080.jpg'
    },
    {
      id:2,
      name:'Fractal North XL',
      category:'Case PC',
      type:'',
      status:'soon',
      price:189.99,
      qty:1,
      img:'Fractal_North_XL.jpg'
    }
  ];

  var DISCOUNTS = { 'TECH10': 10, 'SAVE5': 5 };   /* codice → % sconto */
  var SHIPPING  = 9.90;
  var activeDiscount = 0;   /* percentuale sconto attiva */

  /* ── Helpers ── */
  var fmt = function(n){ return '€ ' + n.toFixed(2).replace('.',','); };

  /* ── Render ── */
  function render(){
    var root = document.getElementById('cartRoot');
    if(!root) return;

    if(!ITEMS.length){
      root.innerHTML = emptyHTML();
      return;
    }

    root.innerHTML =
      '<div class="cart-layout">' +
        '<div class="cart-list">' +
          ITEMS.map(itemHTML).join('') +
        '</div>' +
        summaryHTML() +
      '</div>';

    bindEvents();
  }

  function emptyHTML(){
    return '<div class="cart-empty">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/></svg>' +
      '<h2>Il tuo carrello è vuoto</h2>' +
      '<p>Aggiungi prodotti dal catalogo per iniziare.</p>' +
      '<a href="index.html" class="btn-primary">' +
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>' +
        'Esplora il catalogo' +
      '</a>' +
    '</div>';
  }

  function statusLabel(s){
    if(s==='available') return '<span class="item-status available">Disponibile</span>';
    return '<span class="item-status soon">Presto disponibile</span>';
  }

  function itemHTML(item){
    var decBtn = item.qty === 1
      ? '<button class="qty-btn trash" data-action="dec" data-id="' + item.id + '" aria-label="Rimuovi">' +
          '<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>' +
        '</button>'
      : '<button class="qty-btn" data-action="dec" data-id="' + item.id + '">−</button>';

    return '<div class="cart-item" data-id="' + item.id + '">' +
      '<div class="item-img"><img src="' + item.img + '" alt="' + item.name + '" onerror="this.style.display=\'none\'"/></div>' +
      '<div class="item-info">' +
        '<a href="#" class="item-name">' + item.name + '</a>' +
        '<span class="item-type">' + item.category + (item.type ? ' · ' + item.type : '') + '</span>' +
        statusLabel(item.status) +
        '<div class="item-qty">' +
          decBtn +
          '<span class="qty-val">' + item.qty + '</span>' +
          '<button class="qty-btn" data-action="inc" data-id="' + item.id + '">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="item-actions">' +
        '<div class="item-price-wrap">' +
          '<div class="item-price">' + fmt(item.price * item.qty) + '</div>' +
          (item.qty > 1 ? '<div class="item-price-unit">' + fmt(item.price) + ' cad.</div>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function summaryHTML(){
    var subtotal  = ITEMS.reduce(function(s,i){ return s + i.price * i.qty; }, 0);
    var discount  = subtotal * activeDiscount / 100;
    var total     = subtotal - discount + SHIPPING;
    var hasSoon   = ITEMS.some(function(i){ return i.status === 'soon'; });

    var deliveryBlock = hasSoon
      ? '<div class="delivery-info soon-info">' +
          '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>' +
          '<span>Uno o più articoli sono <strong>presto disponibili</strong>. Potrai ordinarli non appena arriveranno in magazzino.</span>' +
        '</div>'
      : '<div class="delivery-info">' +
          '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>' +
          '<span>Consegna stimata: <strong>3–5 giorni lavorativi</strong></span>' +
        '</div>';

    var totalPcs  = ITEMS.reduce(function(s,i){ return s + i.qty; }, 0);

    return '<div class="order-summary">' +
      '<p class="summary-title">Riepilogo ordine</p>' +
      '<div class="summary-row"><span>Subtotale (' + totalPcs + ' articol' + (totalPcs === 1 ? 'o' : 'i') + ')</span><span>' + fmt(subtotal) + '</span></div>' +
      (activeDiscount ? '<div class="summary-row" style="color:#16a34a"><span>Sconto −' + activeDiscount + '%</span><span>−' + fmt(discount) + '</span></div>' : '') +
      '<div class="summary-row"><span>Spedizione</span><span>' + fmt(SHIPPING) + '</span></div>' +
      '<hr class="summary-divider"/>' +
      '<div class="summary-total"><span>Totale</span><span>' + fmt(total) + '</span></div>' +
      deliveryBlock +
      '<div>' +
        '<div class="discount-wrap">' +
          '<input class="discount-input" id="discountCode" type="text" placeholder="Codice sconto" maxlength="20"/>' +
          '<button class="btn-activate" id="discountBtn">Attiva</button>' +
        '</div>' +
        '<p class="discount-msg" id="discountMsg"></p>' +
      '</div>' +
      '<button class="btn-checkout" id="checkoutBtn">' +
        '<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>' +
        'Procedi al checkout' +
      '</button>' +
    '</div>';
  }

  /* ── Event binding ── */
  function bindEvents(){
    /* Incrementa / decrementa / rimuovi (cestino quando qty=1) */
    document.querySelectorAll('.qty-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = +this.dataset.id;
        var item = ITEMS.find(function(i){ return i.id === id; });
        if(!item) return;
        if(this.dataset.action === 'inc') item.qty++;
        else if(item.qty > 1) item.qty--;
        else { ITEMS = ITEMS.filter(function(i){ return i.id !== id; }); }
        render();
      });
    });

    /* Codice sconto */
    var discBtn = document.getElementById('discountBtn');
    if(discBtn) discBtn.addEventListener('click', function(){
      var code = (document.getElementById('discountCode').value || '').trim().toUpperCase();
      var msg  = document.getElementById('discountMsg');
      if(DISCOUNTS[code]){
        activeDiscount = DISCOUNTS[code];
        msg.textContent = 'Sconto del ' + activeDiscount + '% applicato!';
        msg.className   = 'discount-msg ok';
      } else {
        activeDiscount  = 0;
        msg.textContent = 'Codice non valido.';
        msg.className   = 'discount-msg err';
      }
      render();
    });

    /* Enter sul campo sconto */
    var discInput = document.getElementById('discountCode');
    if(discInput) discInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter') document.getElementById('discountBtn').click();
    });

    /* Checkout */
    var ckBtn = document.getElementById('checkoutBtn');
    if(ckBtn) ckBtn.addEventListener('click', function(){
      alert('Reindirizzamento al checkout…');
    });
  }

  /* Avvio */
  render();

})();