/* ============================================================
   Metzler PLP — Briefkästen
   Client-side rendering, live filtering, chips, load-more
   ============================================================ */
(function () {
  'use strict';

  var IMG = 'Product%20Image/image%2068.png';
  var PAGE = 12; // products per page; page 1 = 2 rows + banner + 2 rows

  /* ---- Color system (swatch rendering) — order matches the live website ---- */
  var COLORS = {
    anthrazit:   { label: 'Anthrazit',    css: '#383E42', count: 71 },
    braun:       { label: 'Braun',        css: '#5A3B29', count: 6 },
    edelstahl:   { label: 'Edelstahl',    css: 'linear-gradient(135deg,#e9ebee,#a7adb4 55%,#d6d9dd)', count: 11 },
    eisenglimmer:{ label: 'Eisenglimmer', css: 'linear-gradient(135deg,#3a3d40,#23262a)', count: 46 },
    grau:        { label: 'Grau',         css: '#B9BCC0', count: 44 },
    schwarz:     { label: 'Schwarz',      css: '#1A171B', count: 40 },
    weiss:       { label: 'Weiß',         css: '#FFFFFF', count: 32 },
    wunschfarbe: { label: 'Wunschfarbe',  css: 'conic-gradient(from 90deg,#e53935,#fb8c00,#fdd835,#43a047,#1e88e5,#8e24aa,#e53935)', count: 4 }
  };

  /* ---- Facet definitions (label + count). No price, no sort. ---- */
  var FACETS = {
    marke: { items: [
      { key: 'metzler', label: 'Metzler', count: 64 }
    ]},
    faecher: { title: 'faecher', items: [
      { key: '1', label: '1 Fach', count: 64 },
      { key: '2', label: '2 Fächer', count: 9 },
      { key: '3', label: '3 Fächer & mehr', count: 7 }
    ]},
    zeitung: { title: 'zeitung', items: [
      { key: 'integriert', label: 'Integriert', count: 63 },
      { key: 'optional', label: 'Optional', count: 9 },
      { key: 'ohne', label: 'Ohne', count: 8 }
    ]},
    montage: { title: 'montage', items: [
      { key: 'aufputz', label: 'Aufputz', count: 41 },
      { key: 'unterputz', label: 'Unterputz', count: 12 },
      { key: 'stand', label: 'Standmontage', count: 14 },
      { key: 'zaun', label: 'Zaunmontage', count: 8 }
    ]}
  };

  /* Human-readable labels for chips */
  var LABELS = {};
  Object.keys(COLORS).forEach(function (k) { LABELS['color:' + k] = COLORS[k].label; });
  Object.keys(FACETS).forEach(function (g) {
    FACETS[g].items.forEach(function (it) { LABELS[g + ':' + it.key] = it.label; });
  });

  /* ---- Subcategory rail ---- */
  var SUBCATS = [
    { t: 'Einfamilien-Briefkasten', n: 80 },
    { t: 'Briefkasten ohne Gravur', n: 22 },
    { t: 'Standbriefkästen', n: 14 },
    { t: 'Mit Klingel & Sprechanlage', n: 11 },
    { t: 'Mehrfamilien-Anlagen', n: 9 },
    { t: 'Unterputz-Briefkästen', n: 12 },
    { t: 'Anlagen-Konfigurator', n: null, cta: true }
  ];

  /* ---- Product catalogue (single placeholder image for all) ---- */
  var PRODUCTS = [
    { id:'siebert', name:'Briefkasten aus hochwertigem Stahl | Siebert', line:'Bestseller', price:89.99, uvp:null, rating:5, reviews:657,
      badge:{type:'best', text:'Bestseller'}, colors:['anthrazit','weiss','grau','schwarz'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'aufputz' },
    { id:'ebenhard', name:'Briefkasten mit austauschbarem Namensschild | Ebenhard', line:'Beliebt', price:89.99, uvp:null, rating:5, reviews:219,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'aufputz' },
    { id:'hermann', name:'Briefkasten mit Lasergravur | Hermann', line:null, price:99.99, uvp:117.99, rating:5, reviews:142,
      badge:{type:'sale', text:'−15 %'}, colors:['anthrazit','weiss','grau','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'aufputz' },
    { id:'moris', name:'Briefkasten aus Edelstahl | personalisiert | Moris', line:'Edelstahl V4A', price:149.00, uvp:null, rating:4.5, reviews:25,
      badge:null, colors:['edelstahl','anthrazit','weiss','wunschfarbe'], faecher:'1', material:'edelstahl', zeitung:'optional', montage:'aufputz' },
    { id:'lessing', name:'Standbriefkasten mit Zeitungsfach | Lessing', line:null, price:199.00, uvp:null, rating:5, reviews:38,
      badge:null, colors:['anthrazit','eisenglimmer','schwarz'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'stand' },
    { id:'gienger', name:'Briefkasten Design | Modell G | Gienger', line:null, price:99.99, uvp:null, rating:5, reviews:31,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'1', material:'stahl', zeitung:'ohne', montage:'aufputz' },
    { id:'schneider', name:'Durchwurf-Briefkasten | Mauerdurchwurf | Schneider', line:null, price:120.00, uvp:null, rating:5, reviews:2,
      badge:null, colors:['anthrazit','edelstahl'], faecher:'1', material:'edelstahl', zeitung:'ohne', montage:'durchwurf' },
    { id:'lepo', name:'Briefkasten Anthrazit RAL 7016 | Lepo 2', line:null, price:149.00, uvp:175.00, rating:4.5, reviews:64,
      badge:{type:'sale', text:'−15 %'}, colors:['anthrazit','schwarz','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'aufputz' },
    { id:'zaun', name:'Zaunbriefkasten | personalisiert mit Gravur', line:null, price:149.00, uvp:null, rating:5, reviews:18,
      badge:null, colors:['anthrazit','weiss','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'optional', montage:'zaun' },
    { id:'flora', name:'Briefkasten mit Blumenkasten | personalisiert | Flora', line:null, price:159.00, uvp:null, rating:4.5, reviews:12,
      badge:null, colors:['anthrazit','weiss','braun','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'aufputz' },
    { id:'castor', name:'Unterputz-Briefkasten aus Edelstahl | Castor', line:'Edelstahl V2A', price:179.00, uvp:null, rating:5, reviews:21,
      badge:null, colors:['edelstahl','anthrazit'], faecher:'1', material:'edelstahl', zeitung:'optional', montage:'unterputz' },
    { id:'trias', name:'Mehrfamilien-Briefkastenanlage | 3 Parteien | Trias', line:null, price:349.00, uvp:399.00, rating:5, reviews:9,
      badge:{type:'sale', text:'−12 %'}, colors:['anthrazit','grau','edelstahl'], faecher:'3', material:'stahl', zeitung:'ohne', montage:'stand' },
    { id:'vossberg', name:'Briefkasten mit Klingel & Sprechanlage | Vossberg', line:'2-in-1', price:299.00, uvp:null, rating:4.5, reviews:27,
      badge:{type:'best', text:'Bestseller'}, colors:['anthrazit','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'aufputz' },
    { id:'duo', name:'Doppel-Briefkasten | 2 Parteien | Duo', line:null, price:229.00, uvp:null, rating:5, reviews:15,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'2', material:'stahl', zeitung:'integriert', montage:'aufputz' },
    { id:'klar', name:'Briefkasten mit Acrylglas-Front | Klar', line:null, price:139.00, uvp:null, rating:4.5, reviews:8,
      badge:null, colors:['schwarz','anthrazit'], faecher:'1', material:'acrylglas', zeitung:'ohne', montage:'aufputz' },
    { id:'nordkap', name:'Edelstahl-Briefkasten V4A | Küste | Nordkap', line:'Salzwasserfest', price:219.00, uvp:null, rating:5, reviews:11,
      badge:null, colors:['edelstahl'], faecher:'1', material:'edelstahl', zeitung:'integriert', montage:'stand' },
    { id:'kompakt', name:'Kompakt-Briefkasten ohne Gravur | Basic', line:null, price:69.99, uvp:84.99, rating:4.5, reviews:96,
      badge:{type:'sale', text:'−18 %'}, colors:['weiss','anthrazit','grau','schwarz','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'ohne', montage:'aufputz' },
    { id:'quartett', name:'Briefkastenanlage | 4 Parteien | Quartett', line:null, price:459.00, uvp:null, rating:5, reviews:6,
      badge:null, colors:['anthrazit','grau','edelstahl'], faecher:'3', material:'stahl', zeitung:'ohne', montage:'unterputz' }
  ];

  var TOTAL = 80; // catalogue headline figure

  /* ---- State ---- */
  var active = { color: [], marke: [], zeitung: [], faecher: [], montage: [] };
  var page = 1;

  /* ---- Helpers ---- */
  function $(s, ctx) { return (ctx || document).querySelector(s); }
  function euro(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function stars(rating) {
    var html = '';
    for (var i = 0; i < 5; i++) html += '<span class="star is-full">★</span>';
    return '<span class="pcard__stars" aria-label="5 von 5 Sternen">' + html + '</span>';
  }

  function colorRow(keys) {
    var max = 3, html = '';
    keys.slice(0, max).forEach(function (k) {
      var c = COLORS[k]; if (!c) return;
      html += '<span class="pcard__sw" title="' + c.label + '" style="background:' + c.css + '"></span>';
    });
    if (keys.length > max) html += '<a class="pcard__more" href="#">+' + (keys.length - max) + ' weitere</a>';
    return '<div class="pcard__colors">' + html + '</div>';
  }

  /* ---- Build subcategory rail ---- */
  function buildSubnav() {
    var track = $('#subTrack'); if (!track) return;
    SUBCATS.forEach(function (s) {
      var a = el('a', 'subtile' + (s.cta ? ' subtile--cta' : ''));
      a.href = '#grid';
      a.innerHTML =
        '<span class="subtile__thumb"><img src="' + IMG + '" alt="" loading="lazy"></span>' +
        '<span class="subtile__text">' +
          '<span class="subtile__label">' + s.t + '</span>' +
          (s.n != null
            ? '<span class="subtile__count">' + s.n + ' Modelle</span>'
            : '<span class="subtile__count subtile__count--cta">Jetzt konfigurieren</span>') +
        '</span>';
      track.appendChild(a);
    });
  }

  /* ---- Build filter controls (checkbox rows — matches the live website) ---- */
  function optionRow(group, key, label, count, swatchCss, plainCount) {
    var id = 'f-' + group + '-' + key;
    var row = el('label', 'fopt');
    row.setAttribute('for', id);
    var countText = plainCount ? count : '(' + count + ')';
    row.innerHTML =
      '<input type="checkbox" id="' + id + '" data-group="' + group + '" data-key="' + key + '">' +
      '<span class="fopt__box" aria-hidden="true"></span>' +
      '<span class="fopt__label">' + label + '</span>' +
      '<span class="fopt__count">' + countText + '</span>' +
      (swatchCss ? '<span class="fopt__swatch" style="background:' + swatchCss + '"></span>' : '');
    row.querySelector('input').addEventListener('change', function () { toggle(group, key); });
    return row;
  }

  function buildColorGroup() {
    var wrap = $('#facet-color'); if (!wrap) return;
    Object.keys(COLORS).forEach(function (key) {
      var c = COLORS[key];
      wrap.appendChild(optionRow('color', key, c.label, c.count, c.css, false));
    });
  }

  function buildFacetGroup(group) {
    var wrap = $('#facet-' + group); if (!wrap) return;
    var plain = group === 'marke'; /* live shows Marke count without parentheses */
    FACETS[group].items.forEach(function (it) {
      wrap.appendChild(optionRow(group, it.key, it.label, it.count, null, plain));
    });
  }

  /* ---- Toggle a filter value ---- */
  function toggle(group, key) {
    var arr = active[group];
    var i = arr.indexOf(key);
    if (i === -1) arr.push(key); else arr.splice(i, 1);
    page = 1;
    syncControls();
    render();
  }

  function clearAll() {
    Object.keys(active).forEach(function (g) { active[g] = []; });
    page = 1;
    syncControls();
    render();
  }

  /* Reflect state onto controls (checkbox rows) */
  function syncControls() {
    document.querySelectorAll('.fopt input').forEach(function (cb) {
      cb.checked = active[cb.getAttribute('data-group')].indexOf(cb.getAttribute('data-key')) !== -1;
    });
  }

  /* ---- Filtering ---- */
  function matches(p) {
    if (active.color.length && !active.color.some(function (c) { return p.colors.indexOf(c) !== -1; })) return false;
    if (active.marke.length && active.marke.indexOf('metzler') === -1) return false; /* all products are Metzler */
    if (active.faecher.length && active.faecher.indexOf(p.faecher) === -1) return false;
    if (active.zeitung.length && active.zeitung.indexOf(p.zeitung) === -1) return false;
    if (active.montage.length && active.montage.indexOf(p.montage) === -1) return false;
    return true;
  }

  function activeCount() {
    return Object.keys(active).reduce(function (n, g) { return n + active[g].length; }, 0);
  }

  /* ---- Product card ---- */
  function card(p) {
    var c = el('article', 'pcard');
    var badge = p.badge ? '<span class="pcard__badge pcard__badge--' + p.badge.type + '">' + p.badge.text + '</span>' : '';
    var priceBlock =
      (p.uvp ? '<span class="pcard__uvp">' + euro(p.uvp) + '</span>' : '') +
      '<span class="pcard__ab">ab</span> ' +
      '<span class="pcard__price' + (p.uvp ? ' pcard__price--sale' : '') + '">' + euro(p.price) + '</span>';

    c.innerHTML =
      '<div class="pcard__media">' +
        badge +
        '<img class="pcard__img" src="' + IMG + '" alt="' + p.name + '" loading="lazy">' +
      '</div>' +
      '<div class="pcard__body">' +
        '<div class="pcard__top">' +
          '<span class="pcard__brand">Metzler</span>' +
          '<span class="pcard__rating">' + stars(p.rating) + '<span class="pcard__reviews">(' + p.reviews + ')</span></span>' +
        '</div>' +
        '<h3 class="pcard__title"><a href="#">' + p.name + '</a></h3>' +
        '<div class="pcard__pricerow">' + priceBlock + '</div>' +
        colorRow(p.colors) +
      '</div>';
    return c;
  }

  /* ---- In-grid promo banner (spans the full grid width) ---- */
  function bannerEl() {
    var b = el('a', 'pgrid__banner');
    b.href = '#grid';
    b.setAttribute('aria-label', 'Original Metzler Briefkästen');
    b.innerHTML =
      '<picture>' +
        '<source media="(max-width: 767px)" srcset="Banner/image%2076.png">' +
        '<img src="Banner/image%2074.png" alt="Original Metzler Briefkästen — Vergleichssieger bei Vergleich.org. Langlebig & wetterfest, minimalistisches Design, sicheres Schließsystem, individuelle Gravur, flexibel montierbar." loading="lazy">' +
      '</picture>';
    return b;
  }

  /* ---- Active filter chips ---- */
  function renderChips() {
    var wrap = $('#activeChips'); wrap.innerHTML = '';
    var n = activeCount();
    Object.keys(active).forEach(function (g) {
      active[g].forEach(function (key) {
        var chip = el('button', 'chip');
        chip.type = 'button';
        chip.innerHTML = (LABELS[g + ':' + key] || key) + ' <svg><use href="#i-x"/></svg>';
        chip.addEventListener('click', function () { toggle(g, key); });
        wrap.appendChild(chip);
      });
    });
    $('#clearAll').hidden = n === 0;
  }

  /* ---- Main render ---- */
  function render() {
    var grid = $('#productGrid');
    var filtered = PRODUCTS.filter(matches);
    var totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
    if (page > totalPages) page = totalPages;

    grid.innerHTML = '';
    var start = (page - 1) * PAGE;
    var pageItems2 = filtered.slice(start, start + PAGE);
    // On page 1 (unfiltered), drop the promo banner into the grid so that
    // exactly 2 rows (6 products) of the page follow it.
    var bannerAt = (page === 1 && activeCount() === 0 && pageItems2.length > 6)
      ? pageItems2.length - 6 : -1;
    pageItems2.forEach(function (p, i) {
      if (i === bannerAt) grid.appendChild(bannerEl());
      grid.appendChild(card(p));
    });

    // Count + empty state
    var displayTotal = activeCount() === 0 ? TOTAL : filtered.length;
    $('#resultCount').textContent = displayTotal + ' Artikel';
    $('#emptyState').hidden = filtered.length !== 0;
    grid.hidden = filtered.length === 0;

    renderPagination(totalPages);
    renderChips();
  }

  /* ---- Pagination (live-style numbered pages + arrows) ---- */
  function goTo(p) {
    page = p;
    render();
    var top = $('#grid').getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function pageItems(total) {
    var items = [];
    if (total <= 7) { for (var i = 1; i <= total; i++) items.push(i); return items; }
    items.push(1);
    var s = Math.max(2, page - 1), e = Math.min(total - 1, page + 1);
    if (s > 2) items.push('…');
    for (var j = s; j <= e; j++) items.push(j);
    if (e < total - 1) items.push('…');
    items.push(total);
    return items;
  }

  function pgArrow(rel) {
    var b = el('button', 'pg-arrow pg-arrow--' + rel);
    b.type = 'button';
    b.setAttribute('aria-label', rel === 'next' ? 'Nächste Seite' : 'Vorherige Seite');
    b.innerHTML = '<svg><use href="#i-chevron-right"/></svg>';
    b.addEventListener('click', function () { goTo(rel === 'next' ? page + 1 : page - 1); });
    return b;
  }

  function renderPagination(totalPages) {
    var nav = $('#pagination'); nav.innerHTML = '';
    if (totalPages <= 1) { nav.hidden = true; return; }
    nav.hidden = false;

    if (page > 1) nav.appendChild(pgArrow('prev'));

    pageItems(totalPages).forEach(function (it) {
      if (it === '…') { nav.appendChild(el('span', 'pg-btn pg-btn--more', '…')); return; }
      var b = el('button', 'pg-btn' + (it === page ? ' is-active' : ''), String(it));
      b.type = 'button';
      if (it === page) b.setAttribute('aria-current', 'page');
      else b.addEventListener('click', function () { goTo(it); });
      nav.appendChild(b);
    });

    if (page < totalPages) nav.appendChild(pgArrow('next'));
  }

  /* ---- Mobile filter drawer ---- */
  function wireDrawer() {
    var panel = $('#filters'), backdrop = $('#filtersBackdrop');
    function open() { panel.classList.add('is-open'); backdrop.hidden = false; document.body.style.overflow = 'hidden'; }
    function close() { panel.classList.remove('is-open'); backdrop.hidden = true; document.body.style.overflow = ''; }
    $('#openFilters').addEventListener('click', open);
    $('#closeFilters').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---- Subcategory rail arrows ---- */
  function wireSubnav() {
    var track = $('#subTrack');
    var section = document.querySelector('.subnav');
    function updateState() {
      var max = track.scrollWidth - track.clientWidth;
      var noScroll = max <= 8;
      section.classList.toggle('is-start', noScroll || track.scrollLeft <= 8);
      section.classList.toggle('is-end', noScroll || track.scrollLeft >= max - 8);
    }
    document.querySelectorAll('[data-sub-scroll]').forEach(function (b) {
      b.addEventListener('click', function () {
        var dir = b.getAttribute('data-sub-scroll') === 'next' ? 1 : -1;
        track.scrollBy({ left: dir * track.clientWidth * 0.7, behavior: 'smooth' });
      });
    });
    track.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
    updateState();
    requestAnimationFrame(updateState);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateState);
    window.addEventListener('load', updateState);
  }

  /* ---- SEO "Mehr lesen" toggle ---- */
  function wireSeo() {
    var text = $('#seoText'), btn = $('#seoToggle');
    if (!text || !btn) return;
    btn.addEventListener('click', function () {
      var open = text.classList.toggle('is-open');
      btn.textContent = open ? 'Weniger lesen' : 'Mehr lesen';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---- Init ---- */
  buildSubnav();
  buildColorGroup();
  buildFacetGroup('marke');
  buildFacetGroup('zeitung');
  buildFacetGroup('faecher');
  buildFacetGroup('montage');
  wireDrawer();
  wireSubnav();
  wireSeo();
  $('#clearAll').addEventListener('click', clearAll);
  $('#emptyReset').addEventListener('click', clearAll);
  render();
})();
