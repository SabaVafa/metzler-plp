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
    faecher: { title: 'faecher', items: [
      { key: '1', label: '1 Fach', count: 64 },
      { key: '2', label: '2 Fächer', count: 9 },
      { key: '3', label: '3+ Fächer', count: 7 },
      { key: 'paketfach', label: 'Inkl. Paketfach', count: 6 }
    ]},
    zeitung: { title: 'zeitung', items: [
      { key: 'integriert', label: 'Mit Zeitungsfach', count: 63 },
      { key: 'ohne', label: 'Nur Briefkasten', count: 8 },
      { key: 'optional', label: 'Optionales Fach verfügbar', count: 9 }
    ]},
    montage: { title: 'montage', items: [
      { key: 'wand', label: 'Wandmontage', count: 49 },
      { key: 'stand', label: 'Standmontage', count: 14 },
      { key: 'unterputz', label: 'Unterputzmontage', count: 12 }
    ]},
    zusatz: { title: 'zusatz', items: [
      { key: 'klingel', label: 'Mit Klingel', count: 11 },
      { key: 'sprech', label: 'Mit Sprechanlage', count: 7 }
    ]}
  };

  /* Human-readable labels for chips */
  var LABELS = {};
  Object.keys(COLORS).forEach(function (k) { LABELS['color:' + k] = COLORS[k].label; });
  Object.keys(FACETS).forEach(function (g) {
    FACETS[g].items.forEach(function (it) { LABELS[g + ':' + it.key] = it.label; });
  });
  LABELS['zusatz:klingel+sprech'] = 'Mit Klingel & Sprechanlage';   /* advisor combined option */

  /* ---- Subcategory rail ---- */
  var SUBCATS = [
    { t: 'Einfamilien-Briefkasten', n: 80, img: 'Product%20Image/image%2068.png' },
    { t: 'Briefkasten ohne Gravur', n: 22, img: 'Product%20Image/Briefkasten%20ohne%20Gravur.webp' },
    { t: 'Standbriefkästen', n: 14, img: 'Product%20Image/Standbriefk%C3%A4sten.webp' },
    { t: 'Mit Klingel & Sprechanlage', n: 11, img: 'Product%20Image/Briefkasten%20mit%20Klingel%20%26%20Sprechanlage.webp' },
    { t: 'Mehrfamilien-Anlagen', n: 9, img: 'Product%20Image/Mehrfamilien%20Briefk%C3%A4sten.webp' },
    { t: 'Unterputz-Briefkästen', n: 12, img: 'Product%20Image/Unterputz%20Briefk%C3%A4sten.webp' },
    { t: 'Anlagen-Konfigurator', n: null, cta: true, img: 'Product%20Image/Briefkastenanlage/image%2080.png' }
  ];

  /* ---- Product catalogue (single placeholder image for all) ---- */
  var PRODUCTS = [
    { id:'siebert', name:'Briefkasten aus hochwertigem Stahl | Siebert', line:'Bestseller', price:89.99, uvp:null, rating:5, reviews:657,
      badge:null, colors:['anthrazit','weiss','grau','schwarz'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand' },
    { id:'ebenhard', name:'Briefkasten mit austauschbarem Namensschild | Ebenhard', line:'Beliebt', price:89.99, uvp:null, rating:5, reviews:219,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand' },
    { id:'hermann', name:'Briefkasten mit Lasergravur | Hermann', line:null, price:99.99, uvp:117.99, rating:5, reviews:142,
      badge:{type:'sale', text:'−15 %'}, colors:['anthrazit','weiss','grau','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand' },
    { id:'moris', name:'Briefkasten aus Edelstahl | personalisiert | Moris', line:'Edelstahl V4A', price:149.00, uvp:null, rating:4.5, reviews:25,
      badge:null, colors:['edelstahl','anthrazit','weiss','wunschfarbe'], faecher:'1', material:'edelstahl', zeitung:'optional', montage:'wand', paket:true },
    { id:'lessing', name:'Standbriefkasten mit Zeitungsfach | Lessing', line:null, price:199.00, uvp:null, rating:5, reviews:38,
      badge:null, colors:['anthrazit','eisenglimmer','schwarz'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'stand', paket:true },
    { id:'gienger', name:'Briefkasten Design | Modell G | Gienger', line:null, price:99.99, uvp:null, rating:5, reviews:31,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'1', material:'stahl', zeitung:'ohne', montage:'wand' },
    { id:'schneider', name:'Durchwurf-Briefkasten | Mauerdurchwurf | Schneider', line:null, price:120.00, uvp:null, rating:5, reviews:2,
      badge:null, colors:['anthrazit','edelstahl'], faecher:'1', material:'edelstahl', zeitung:'ohne', montage:'unterputz' },
    { id:'lepo', name:'Briefkasten Anthrazit RAL 7016 | Lepo 2', line:null, price:149.00, uvp:175.00, rating:4.5, reviews:64,
      badge:{type:'sale', text:'−15 %'}, colors:['anthrazit','schwarz','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand' },
    { id:'zaun', name:'Zaunbriefkasten | personalisiert mit Gravur', line:null, price:149.00, uvp:null, rating:5, reviews:18,
      badge:null, colors:['anthrazit','weiss','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'optional', montage:'wand' },
    { id:'flora', name:'Briefkasten mit Blumenkasten | personalisiert | Flora', line:null, price:159.00, uvp:null, rating:4.5, reviews:12,
      badge:null, colors:['anthrazit','weiss','braun','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand' },
    { id:'castor', name:'Unterputz-Briefkasten aus Edelstahl | Castor', line:'Edelstahl V2A', price:179.00, uvp:null, rating:5, reviews:21,
      badge:null, colors:['edelstahl','anthrazit'], faecher:'1', material:'edelstahl', zeitung:'optional', montage:'unterputz' },
    { id:'trias', name:'Mehrfamilien-Briefkastenanlage | 3 Parteien | Trias', line:null, price:349.00, uvp:399.00, rating:5, reviews:9,
      badge:{type:'sale', text:'−12 %'}, colors:['anthrazit','grau','edelstahl'], faecher:'3', material:'stahl', zeitung:'ohne', montage:'stand', paket:true, klingel:true, sprech:true },
    { id:'vossberg', name:'Briefkasten mit Klingel & Sprechanlage | Vossberg', line:'2-in-1', price:299.00, uvp:null, rating:4.5, reviews:27,
      badge:null, colors:['anthrazit','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand', paket:true, klingel:true, sprech:true },
    { id:'duo', name:'Doppel-Briefkasten | 2 Parteien | Duo', line:null, price:229.00, uvp:null, rating:5, reviews:15,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'2', material:'stahl', zeitung:'integriert', montage:'wand' },
    { id:'klar', name:'Briefkasten mit Acrylglas-Front | Klar', line:null, price:139.00, uvp:null, rating:4.5, reviews:8,
      badge:null, colors:['schwarz','anthrazit'], faecher:'1', material:'acrylglas', zeitung:'ohne', montage:'wand' },
    { id:'nordkap', name:'Edelstahl-Briefkasten V4A | Küste | Nordkap', line:'Salzwasserfest', price:219.00, uvp:null, rating:5, reviews:11,
      badge:null, colors:['edelstahl'], faecher:'1', material:'edelstahl', zeitung:'integriert', montage:'stand', paket:true },
    { id:'kompakt', name:'Kompakt-Briefkasten ohne Gravur | Basic', line:null, price:69.99, uvp:84.99, rating:4.5, reviews:96,
      badge:{type:'sale', text:'−18 %'}, colors:['weiss','anthrazit','grau','schwarz','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'ohne', montage:'wand' },
    { id:'quartett', name:'Briefkastenanlage | 4 Parteien | Quartett', line:null, price:459.00, uvp:null, rating:5, reviews:6,
      badge:null, colors:['anthrazit','grau','edelstahl'], faecher:'3', material:'stahl', zeitung:'ohne', montage:'unterputz', paket:true, klingel:true }
  ];

  var TOTAL = 80; // catalogue headline figure

  /* ---- State ---- */
  var active = { color: [], zeitung: [], faecher: [], montage: [], zusatz: [] };
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
        '<span class="subtile__thumb"><img src="' + (s.img || IMG) + '" alt="" loading="lazy"></span>' +
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
    FACETS[group].items.forEach(function (it) {
      wrap.appendChild(optionRow(group, it.key, it.label, it.count, null, false));
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
    if (active.faecher.length) {
      /* 'paketfach' is a separate attribute (parcel compartment), not a fach count —
         match it against p.paket; the count keys ('1'/'2'/'3') match p.faecher. */
      var fOk = active.faecher.some(function (k) {
        return k === 'paketfach' ? !!p.paket : p.faecher === k;
      });
      if (!fOk) return false;
    }
    if (active.zeitung.length && active.zeitung.indexOf(p.zeitung) === -1) return false;
    if (active.montage.length && active.montage.indexOf(p.montage) === -1) return false;
    if (active.zusatz.length) {
      /* Extra functions — boolean attributes on the product (p.klingel / p.sprech).
         OR within the group; a "klingel+sprech" key requires BOTH (combined unit). */
      var zOk = active.zusatz.some(function (k) {
        return k.indexOf('+') !== -1 ? k.split('+').every(function (x) { return !!p[x]; }) : !!p[k];
      });
      if (!zOk) return false;
    }
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

  /* ---- Subcategory rail — seamless circular carousel ---- */
  function wireSubnav() {
    var track = $('#subTrack'); if (!track) return;
    var originals = Array.prototype.slice.call(track.children);
    if (!originals.length) return;

    /* The prev arrow is hidden (CSS) until the user first advances the rail.
       Any forward move — arrow click or manual scroll — reveals it for good. */
    var subnav = track.closest('.subnav');
    function engage() { if (subnav) subnav.classList.add('is-engaged'); }

    /* Clone one full set after the originals so the rail can wrap continuously.
       Clones are decorative duplicates — hidden from AT and the tab order. */
    originals.forEach(function (node) {
      var c = node.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('tabindex', '-1');
      track.appendChild(c);
    });
    var firstClone = track.children[originals.length];
    /* exact width of one set (tiles + gaps), so the seam reset is pixel-perfect */
    function loopW() { return firstClone.offsetLeft - track.children[0].offsetLeft; }

    /* When the scroll passes the seam, shift by exactly one set — invisible
       because the duplicate cards line up identically. */
    function normalize() {
      var w = loopW();
      if (track.scrollLeft >= w) track.scrollLeft -= w;
      else if (track.scrollLeft < 0) track.scrollLeft += w;
    }
    var settle;
    track.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(normalize, 90);   /* reset only once motion settles → no mid-scroll jump */
    }, { passive: true });

    document.querySelectorAll('[data-sub-scroll]').forEach(function (b) {
      b.addEventListener('click', function () {
        engage();                             /* first arrow click reveals the prev arrow */
        var dir = b.getAttribute('data-sub-scroll') === 'next' ? 1 : -1;
        var w = loopW();
        var step = track.clientWidth * 0.7;
        /* pre-shift into the duplicate so there's always identical content to scroll into */
        if (dir === 1 && track.scrollLeft >= w) track.scrollLeft -= w;
        else if (dir === -1 && track.scrollLeft < step) track.scrollLeft += w;
        track.scrollBy({ left: dir * step, behavior: 'smooth' });
      });
    });
  }

  /* ---- Footer accordions: collapsed on mobile, expanded on tablet+ ---- */
  function wireFooterAccordions() {
    var details = document.querySelectorAll('.footer__details');
    if (!details.length) return;
    var mobileMq = window.matchMedia('(max-width: 640px)');
    function sync() {
      details.forEach(function (el) {
        if (mobileMq.matches) el.removeAttribute('open');
        else el.setAttribute('open', '');
      });
    }
    sync();
    mobileMq.addEventListener ? mobileMq.addEventListener('change', sync) : mobileMq.addListener(sync);
  }

  /* ---- KI-Kaufberater: a guided recommendation quiz. Each answer maps to a
         catalogue facet; the final step "thinks", applies the combined filters
         to narrow the grid, and summarises the recommendation. ---- */
  function wireAiAdvisor() {
    var root = document.querySelector('[data-ai]');
    if (!root) return;
    var quizEl  = root.querySelector('[data-ai-quiz]');
    var results = root.querySelector('[data-ai-results]');
    if (!quizEl) return;
    var thinkTimer;

    /* Each option maps to a catalogue facet (group = color/faecher/zeitung/zusatz/montage)
       that filters the grid, or group:'pref' for a noted preference the catalogue can't
       filter on (Gravur, Öffnungsrichtung). Steps are skippable. */
    var QUIZ = [
      { q: 'Welche Farbe bevorzugen Sie?', opts: [
        { label: 'Anthrazit',    group: 'color', value: 'anthrazit' },
        { label: 'Braun',        group: 'color', value: 'braun' },
        { label: 'Edelstahl',    group: 'color', value: 'edelstahl' },
        { label: 'Eisenglimmer', group: 'color', value: 'eisenglimmer' },
        { label: 'Grau',         group: 'color', value: 'grau' },
        { label: 'Schwarz',      group: 'color', value: 'schwarz' },
        { label: 'Weiß',         group: 'color', value: 'weiss' },
        { label: 'Wunschfarbe',  group: 'color', value: 'wunschfarbe' }
      ]},
      { q: 'Wie viele Brieffächer benötigen Sie?', opts: [
        { label: '1 Fach',          sub: 'Einfamilienhaus',  group: 'faecher', value: '1' },
        { label: '2 Fächer',        sub: 'Zweifamilienhaus', group: 'faecher', value: '2' },
        { label: '3+ Fächer',       sub: 'Mehrfamilienhaus', group: 'faecher', value: '3' },
        { label: 'Inkl. Paketfach', sub: 'für Pakete',       group: 'faecher', value: 'paketfach' }
      ]},
      { q: 'Wünschen Sie ein Zeitungsfach?', opts: [
        { label: 'Mit Zeitungsfach',          group: 'zeitung', value: 'integriert' },
        { label: 'Nur Briefkasten',           group: 'zeitung', value: 'ohne' },
        { label: 'Optionales Fach verfügbar', group: 'zeitung', value: 'optional' }
      ]},
      { q: 'Welche Montageart passt zu Ihnen?', opts: [
        { label: 'Wandmontage',      sub: 'an der Hauswand', group: 'montage', value: 'wand' },
        { label: 'Standmontage',     sub: 'frei am Weg',     group: 'montage', value: 'stand' },
        { label: 'Unterputzmontage', sub: 'in der Mauer',    group: 'montage', value: 'unterputz' }
      ]},
      { q: 'Welche Zusatzfunktion ist Ihnen wichtig?', opts: [
        { label: 'Mit Funkklingel',            group: 'zusatz', value: 'klingel' },
        { label: 'Mit Klingel & Sprechanlage', group: 'zusatz', value: 'klingel+sprech' }   /* combined: both */
      ]},
      { q: 'Welche Gravuroption wünschen Sie?', opts: [
        { label: 'Lasergravur',         group: 'pref', value: 'Lasergravur' },
        { label: 'Namensschild',        group: 'pref', value: 'Namensschild' },
        { label: 'Standard-Ausführung', group: 'pref', value: 'Standard-Ausführung' }
      ]},
      { q: 'Wie soll sich die Tür öffnen?', opts: [
        { label: 'Klappbar nach unten', group: 'pref', value: 'Klappbar nach unten' },
        { label: 'Seitlich öffnend', sub: 'Links / Rechts', group: 'pref', value: 'Seitlich öffnend' }
      ]}
    ];

    var step = 0;
    var picks = [];   /* picks[i] = chosen option object for step i */
    var lead = { email: '', news: false };   /* optional e-mail capture (final step) */
    var STEPS = QUIZ.length;                  /* questions only — e-mail capture now lives on the result */

    function labelFor(group, key) {
      if (group === 'color') return (COLORS[key] && COLORS[key].label) || key;
      var items = (FACETS[group] && FACETS[group].items) || [];
      for (var i = 0; i < items.length; i++) if (items[i].key === key) return items[i].label;
      return key;
    }
    /* Apply the picks; if the full AND-combination has no match, progressively
       relax the lowest-priority answer (colour first, household last) so the
       advisor always returns a recommendation. Returns {kept, dropped, count}. */
    function applyPicks() {
      var priority = ['faecher', 'zusatz', 'montage', 'zeitung', 'color']; /* later = dropped first */
      var sel = [], prefs = [];
      picks.forEach(function (o) {
        if (!o || !o.group) return;
        if (active[o.group]) sel.push(o);   /* real facet → filters the grid */
        else prefs.push(o);                 /* 'pref' (Gravur / Öffnung) → noted, not filterable */
      });
      function setActive(list) {
        Object.keys(active).forEach(function (g) { active[g] = []; });
        list.forEach(function (o) { if (active[o.group] && active[o.group].indexOf(o.value) === -1) active[o.group].push(o.value); });
        page = 1; syncControls(); render();
        return PRODUCTS.filter(matches).length;
      }
      var current = sel.slice(), dropped = [];
      var count = setActive(current);
      while (count === 0 && current.length) {
        var worst = 0, worstPri = -1;
        current.forEach(function (o, i) {
          var p = priority.indexOf(o.group); if (p === -1) p = 99;
          if (p > worstPri) { worstPri = p; worst = i; }
        });
        dropped.push(current[worst]);
        current.splice(worst, 1);
        count = setActive(current);
      }
      return { kept: current, dropped: dropped, count: count, prefs: prefs };
    }
    function scrollToGrid() {
      var top = $('#grid').getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }

    /* Fluid phase change: fade-and-slide the current step out, THEN run fn
       (which renders the next phase and fades it in). No instant swap. */
    function go(fn) {
      var cur = quizEl.querySelector('.advisor__step');
      if (cur) { cur.classList.remove('is-in'); cur.classList.add('is-out'); setTimeout(fn, 190); }
      else fn();
    }

    /* ── Recommendation-card helpers ── */
    function fmtPrice(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
    var MAT = { edelstahl: 'Edelstahl V4A', stahl: 'Pulverbeschichteter Stahl', acrylglas: 'Acrylglas-Front' };
    function specsOf(p) {
      return [
        MAT[p.material] || p.material,
        labelFor('faecher', p.faecher) + (p.paket ? ' · inkl. Paketfach' : ''),
        labelFor('montage', p.montage) + ' · ' + labelFor('zeitung', p.zeitung)
      ];
    }
    function pickImg(p) {
      if (p.montage === 'stand')      return 'Product%20Image/Standbriefk%C3%A4sten.webp';
      if (p.faecher === '3')          return 'Product%20Image/Mehrfamilien%20Briefk%C3%A4sten.webp';
      if (p.montage === 'unterputz')  return 'Product%20Image/Unterputz%20Briefk%C3%A4sten.webp';
      return 'Product%20Image/image%2068.png';
    }
    /* Does product p satisfy a single facet pick? (mirrors matches()) */
    function sat(p, o) {
      if (o.group === 'color')   return p.colors.indexOf(o.value) !== -1;
      if (o.group === 'faecher') return o.value === 'paketfach' ? !!p.paket : p.faecher === o.value;
      if (o.group === 'zusatz')  return o.value.indexOf('+') !== -1 ? o.value.split('+').every(function (x) { return !!p[x]; }) : !!p[o.value];
      if (o.group === 'zeitung') return p.zeitung === o.value;
      if (o.group === 'montage') return p.montage === o.value;
      return false;
    }
    function recCardHTML(p, percent) {
      return '<a class="advisor__rec" href="#grid" data-details>' +
        '<span class="advisor__rec-thumb"><img src="' + pickImg(p) + '" alt="" loading="lazy"></span>' +
        '<span class="advisor__rec-info">' +
          '<span class="advisor__match">' + percent + ' % passend für Sie</span>' +
          '<span class="advisor__rec-name">' + p.name + '</span>' +
          '<span class="advisor__rec-price">' + fmtPrice(p.price) + (p.uvp ? '<s>' + fmtPrice(p.uvp) + '</s>' : '') + '</span>' +
        '</span>' +
        '<svg class="advisor__rec-go" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg>' +
      '</a>';
    }

    /* Shared progress-dots strip (questions + the capture screen). */
    function dotsHTML() {
      var out = '';
      for (var i = 0; i < STEPS; i++) out += '<span class="' + (i < step ? 'is-done' : (i === step ? 'is-current' : '')) + '"></span>';
      return out;
    }

    function renderStep() {
      if (step >= QUIZ.length) { finish(); return; }   /* after the last question → result (with e-mail capture) */
      results.hidden = true; results.innerHTML = '';
      var s = QUIZ[step];
      var dots = dotsHTML();
      var opts = s.opts.map(function (o, i) {
        var on = (picks[step] && picks[step].label === o.label) ? ' is-active' : '';
        var sw = (o.group === 'color' && COLORS[o.value])
          ? '<span class="advisor__opt-sw" style="background:' + COLORS[o.value].css + '" aria-hidden="true"></span>' : '';
        return '<button type="button" class="advisor__opt' + on + '" data-opt="' + i + '">' +
          sw +
          '<span class="advisor__opt-label">' + o.label + '</span>' +
          (o.sub ? '<span class="advisor__opt-sub">' + o.sub + '</span>' : '') +
        '</button>';
      }).join('');
      quizEl.innerHTML =
        '<div class="advisor__step">' +
          '<div class="advisor__progress">' +
            '<span class="advisor__progress-dots">' + dots + '</span>' +
            '<span class="advisor__progress-label">Schritt ' + (step + 1) + ' von ' + STEPS + '</span>' +
          '</div>' +
          '<h3 class="advisor__q">' + s.q + '</h3>' +
          '<div class="advisor__opts">' + opts + '</div>' +
          '<div class="advisor__nav">' +
            (step > 0 ? '<button type="button" class="advisor__back" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg>Zurück</button>' : '<span></span>') +
            '<button type="button" class="advisor__skip" data-skip>Überspringen<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg></button>' +
          '</div>' +
        '</div>';
      var stepEl = quizEl.querySelector('.advisor__step');
      requestAnimationFrame(function () { stepEl.classList.add('is-in'); });

      /* Keep the 1-line / 2-line format consistent within a question: if any
         option's label+sub wraps to a second line, stack ALL options in this step. */
      var optsEl = quizEl.querySelector('.advisor__opts');
      var anyWrapped = [].some.call(quizEl.querySelectorAll('.advisor__opt'), function (o) {
        var lab = o.querySelector('.advisor__opt-label'), sub = o.querySelector('.advisor__opt-sub');
        return sub && sub.getBoundingClientRect().top >= lab.getBoundingClientRect().bottom - 2;
      });
      if (anyWrapped) optsEl.classList.add('advisor__opts--stacked');

      quizEl.querySelectorAll('[data-opt]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          picks[step] = s.opts[+btn.getAttribute('data-opt')];
          go(function () { step++; renderStep(); });   /* past the last question → capture screen */
        });
      });
      var back = quizEl.querySelector('[data-back]');
      if (back) back.addEventListener('click', function () { if (step > 0) go(function () { step--; renderStep(); }); });
      var skip = quizEl.querySelector('[data-skip]');
      if (skip) skip.addEventListener('click', function () { picks[step] = null; go(function () { step++; renderStep(); }); });
    }

    /* Premium loader: pulsing geometric wave + shimmer skeleton cards. */
    function loaderHTML() {
      var sk = '<div class="adv-sk">' +
        '<span class="adv-sk__thumb"></span>' +
        '<span class="adv-sk__lines">' +
          '<span class="adv-sk__line adv-sk__line--sm"></span>' +
          '<span class="adv-sk__line adv-sk__line--lg"></span>' +
          '<span class="adv-sk__line adv-sk__line--md"></span>' +
        '</span></div>';
      return '<div class="advisor__thinking">' +
        '<span class="advisor__thinking-head"><span class="advisor__wave"><i></i><i></i><i></i><i></i><i></i></span>' +
        'KI analysiert Ihre Antworten und kuratiert passende Modelle…</span>' +
        '<div class="advisor__skeleton">' + sk + sk + '</div>' +
      '</div>';
    }

    function resultHTML(res, top) {
      var headText = res.kept.length
        ? '<strong>' + res.count + '</strong> passende ' + (res.count === 1 ? 'Empfehlung' : 'Empfehlungen') + ' für Sie kuratiert'
        : 'Unsere Top-Empfehlungen für Sie';
      var cards = top.map(function (t, i) {
        var percent = Math.max(82, Math.round(87 + t.ratio * 12) - i);   /* premium, deterministic, strictly descending */
        return recCardHTML(t.p, percent);
      }).join('');
      var chips = res.kept.map(function (o) { return '<span class="advisor__chip">' + (o.label || labelFor(o.group, o.value)) + '</span>'; });
      var note = res.dropped.length
        ? '<p class="advisor__note">Kein exakter Treffer für <em>' + res.dropped.map(function (o) { return o.label || labelFor(o.group, o.value); }).join(', ') + '</em> – wir zeigen die besten Alternativen.</p>'
        : '';
      var prefs = res.prefs.length
        ? '<p class="advisor__note">Ihre Wünsche notiert: <em>' + res.prefs.map(function (o) { return o.value; }).join(', ') + '</em></p>'
        : '';
      var capture =
        '<div class="advisor__capture" data-result-capture>' +
          '<p class="advisor__capture-q">Empfehlung per E-Mail erhalten?</p>' +
          '<div class="advisor__capture-row">' +
            '<div class="advisor__field">' +
              '<svg class="advisor__field-ico advisor__field-ico--mail" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>' +
              '<input type="email" class="advisor__input" data-email autocomplete="email" placeholder="E-Mail-Adresse eingeben" aria-label="E-Mail-Adresse">' +
            '</div>' +
            '<label class="advisor__optin">' +
              '<input type="checkbox" data-optin>' +
              '<span class="advisor__optin-box" aria-hidden="true"></span>' +
              '<span>Schicken Sie mir Metzler News &amp; Angebote.</span>' +
            '</label>' +
            '<button type="button" class="advisor__send" data-email-send aria-label="Empfehlung senden"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg></button>' +
          '</div>' +
        '</div>';
      return '<div class="advisor__result">' +
        '<div class="advisor__result-head"><h3 class="advisor__result-title">' + headText + '</h3></div>' +
        '<div class="advisor__recs">' + cards + '</div>' +
        '<div class="advisor__aside">' +
          (chips.length ? '<div class="advisor__chips">' + chips.join('') + '</div>' : '') +
          note + prefs +
          '<div class="advisor__actions">' +
            '<button type="button" class="advisor__view" data-ai-view>' + (res.count === 1 ? 'Das Modell ansehen' : 'Alle ' + res.count + ' Modelle ansehen') + '</button>' +
            '<button type="button" class="advisor__reset" data-ai-reset>Quiz neu starten</button>' +
          '</div>' +
        '</div>' +
        capture +
        '</div>';
    }

    function finish() {
      clearTimeout(thinkTimer);
      root.classList.add('is-result');   /* hide the intro block on the result step */
      quizEl.innerHTML = '';
      results.hidden = false;
      results.innerHTML = loaderHTML();
      thinkTimer = setTimeout(function () {
        var res = applyPicks();
        var selAll = res.kept.concat(res.dropped);
        var ranked = PRODUCTS.filter(matches).map(function (p) {
          var r = selAll.length ? selAll.filter(function (o) { return sat(p, o); }).length / selAll.length : 1;
          return { p: p, ratio: r };
        }).sort(function (a, b) { return b.ratio - a.ratio; });
        var top = ranked.slice(0, 2);
        results.innerHTML = resultHTML(res, top);
        var el = results.querySelector('.advisor__result');
        requestAnimationFrame(function () { if (el) el.classList.add('is-in'); });
        results.querySelectorAll('[data-details]').forEach(function (d) {
          d.addEventListener('click', function (e) { e.preventDefault(); scrollToGrid(); });
        });
        var view = results.querySelector('[data-ai-view]');
        if (view) view.addEventListener('click', scrollToGrid);
        var reset = results.querySelector('[data-ai-reset]');
        if (reset) reset.addEventListener('click', restart);

        /* E-mail capture (now on the result): submit via Enter or the arrow → inline confirmation. */
        var cap = results.querySelector('[data-result-capture]');
        if (cap) {
          var emailEl = cap.querySelector('[data-email]');
          var optinEl = cap.querySelector('[data-optin]');
          var optinLabel = cap.querySelector('.advisor__optin');
          optinEl.addEventListener('change', function () { optinLabel.classList.toggle('is-on', optinEl.checked); });
          var submitEmail = function () {
            var v = emailEl.value.trim();
            if (!v) { emailEl.focus(); return; }
            lead.email = v; lead.news = optinEl.checked;
            cap.innerHTML =
              '<div class="advisor__sent" role="status">' +
                '<svg class="advisor__sent-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.4 12.3l2.4 2.4 4.8-5.4"/></svg>' +
                '<p class="advisor__sent-text">Ihre Empfehlung wird an <strong>' + v + '</strong> gesendet' + (lead.news ? ' – inkl. News &amp; Angebote' : '') + '.</p>' +
              '</div>';
          };
          emailEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submitEmail(); } });
          cap.querySelector('[data-email-send]').addEventListener('click', submitEmail);
        }
      }, 1500);
    }

    function restart() {
      step = 0; picks = []; lead = { email: '', news: false };
      root.classList.remove('is-result');   /* bring the intro block back */
      clearAll();                 /* clears active filters + re-renders the full grid */
      results.hidden = true; results.innerHTML = '';
      renderStep();
    }

    renderStep();
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
  buildFacetGroup('zeitung');
  buildFacetGroup('faecher');
  buildFacetGroup('montage');
  buildFacetGroup('zusatz');
  wireDrawer();
  wireSubnav();
  wireFooterAccordions();
  wireAiAdvisor();
  wireSeo();
  $('#clearAll').addEventListener('click', clearAll);
  $('#emptyReset').addEventListener('click', clearAll);
  render();
})();
