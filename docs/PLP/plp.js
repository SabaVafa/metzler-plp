/* ============================================================
   Metzler PLP — Briefkästen
   Client-side rendering, live filtering, chips, load-more
   ============================================================ */
(function () {
  'use strict';

  var IMG = 'Product%20Image/einfamilien-briefkasten.png';
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
    material: { title: 'material', items: [
      { key: 'edelstahl', label: 'Edelstahl', count: 47 },
      { key: 'stahl',     label: 'Galvanisierter Stahl', count: 31 },
      { key: 'acrylglas', label: 'Acrylglas-Front', count: 11 },
      { key: 'holz',      label: 'Holzoptik', count: 2 }
    ]},
    faecher: { title: 'faecher', items: [
      { key: '1', label: '1 Fach', count: 64 },
      { key: '2', label: '2 Fächer', count: 10 },
      { key: '3', label: '3 Fächer', count: 6 }
    ]},
    zeitung: { title: 'zeitung', items: [
      { key: 'integriert', label: 'Mit Zeitungsfach', count: 63 },
      { key: 'optional', label: 'Optional erhältlich', count: 9 },
      { key: 'ohne', label: 'Ohne Zeitungsfach', count: 8 }
    ]},
    montage: { title: 'montage', items: [
      { key: 'wand', label: 'Wandmontage', count: 49 },
      { key: 'stand', label: 'Standmontage', count: 14 },
      { key: 'unterputz', label: 'Unterputzmontage', count: 10 },
      { key: 'durchwurf', label: 'Mauerdurchwurf', count: 2 }
    ]},
    zusatz: { title: 'zusatz', items: [
      { key: 'paket', label: 'Mit Paketfach', count: 9 },
      { key: 'klingel', label: 'Mit Funkklingel', count: 11 },
      { key: 'sprech', label: 'Mit Sprechanlage', count: 7 },
      { key: 'blumenkasten', label: 'Mit Blumenkasten', count: 2 }
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
    { t: 'Einfamilien-Briefkasten', n: 80, img: 'Product%20Image/einfamilien-briefkasten.png' },
    { t: 'Briefkasten ohne Gravur', n: 22, img: 'Product%20Image/briefkasten-ohne-gravur.webp' },
    { t: 'Standbriefkästen', n: 14, img: 'Product%20Image/standbriefkaesten.webp' },
    { t: 'Mit Klingel & Sprechanlage', n: 11, img: 'Product%20Image/briefkasten-klingel-sprechanlage.webp' },
    { t: 'Mehrfamilien-Anlagen', n: 9, img: 'Product%20Image/mehrfamilien-briefkaesten.webp' },
    { t: 'Unterputz-Briefkästen', n: 12, img: 'Product%20Image/unterputz-briefkaesten.webp' },
    { t: 'Anlagen-Konfigurator', n: null, cta: true, img: 'Product%20Image/Briefkastenanlage/konfigurator-tile.png' }
  ];

  /* ---- Product catalogue (single placeholder image for all) ---- */
  var PRODUCTS = [
    { id:'siebert', name:'Briefkasten aus hochwertigem Stahl | Siebert', line:'Bestseller', price:89.99, uvp:null, rating:5, reviews:657,
      badge:null, colors:['anthrazit','weiss','grau','schwarz'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand', seitentuer:true },
    { id:'ebenhard', name:'Briefkasten mit austauschbarem Namensschild | Ebenhard', line:'Beliebt', price:89.99, uvp:null, rating:5, reviews:219,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand' },
    { id:'ebenhard-v2a', name:'Briefkasten mit gebürsteter V2A-Edelstahl-Front | Ebenhard', line:null, price:119.00, uvp:null, rating:5, reviews:64,
      badge:null, colors:['anthrazit','weiss','grau','eisenglimmer','schwarz','edelstahl','wunschfarbe'], faecher:'1', material:'edelstahl', zeitung:'integriert', montage:'wand' },
    { id:'hermann', name:'Briefkasten mit Lasergravur | Hermann', line:null, price:99.99, uvp:117.99, rating:5, reviews:142,
      badge:{type:'sale', text:'−15 %'}, colors:['anthrazit','weiss','grau','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand', seitentuer:true },
    { id:'moris', name:'Briefkasten aus Edelstahl | personalisiert | Moris', line:'Edelstahl V4A', price:149.00, uvp:null, rating:4.5, reviews:25,
      badge:null, colors:['edelstahl','anthrazit','weiss','wunschfarbe'], faecher:'1', material:'edelstahl', zeitung:'optional', montage:'wand', paket:true },
    { id:'lessing', name:'Standbriefkasten mit Zeitungsfach | Lessing', line:null, price:199.00, uvp:null, rating:5, reviews:38,
      badge:null, colors:['anthrazit','eisenglimmer','schwarz'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'stand', paket:true },
    { id:'gienger', name:'Briefkasten Design | Modell G | Gienger', line:null, price:99.99, uvp:null, rating:5, reviews:31,
      badge:null, colors:['anthrazit','weiss','grau'], faecher:'1', material:'stahl', zeitung:'ohne', montage:'wand' },
    { id:'schneider', name:'Durchwurf-Briefkasten | Mauerdurchwurf | Schneider', line:null, price:120.00, uvp:null, rating:5, reviews:2,
      badge:null, colors:['anthrazit','edelstahl'], faecher:'1', material:'edelstahl', zeitung:'ohne', montage:'durchwurf' },
    { id:'lepo', name:'Briefkasten Anthrazit RAL 7016 | Lepo 2', line:null, price:149.00, uvp:175.00, rating:4.5, reviews:64,
      badge:{type:'sale', text:'−15 %'}, colors:['anthrazit','schwarz','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand', seitentuer:true },
    { id:'zaun', name:'Zaunbriefkasten | personalisiert mit Gravur', line:null, price:149.00, uvp:null, rating:5, reviews:18,
      badge:null, colors:['anthrazit','weiss','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'optional', montage:'wand' },
    { id:'flora', name:'Briefkasten mit Blumenkasten | personalisiert | Flora', line:null, price:159.00, uvp:null, rating:4.5, reviews:12,
      badge:null, colors:['anthrazit','weiss','braun','wunschfarbe'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand', blumenkasten:true },
    { id:'castor', name:'Unterputz-Briefkasten aus Edelstahl | Castor', line:'Edelstahl V2A', price:179.00, uvp:null, rating:5, reviews:21,
      badge:null, colors:['edelstahl','anthrazit'], faecher:'1', material:'edelstahl', zeitung:'optional', montage:'unterputz' },
    { id:'trias', name:'Mehrfamilien-Briefkastenanlage | 3 Parteien | Trias', line:null, price:349.00, uvp:399.00, rating:5, reviews:9,
      badge:{type:'sale', text:'−12 %'}, colors:['anthrazit','grau','eisenglimmer'], faecher:'3', material:'stahl', zeitung:'ohne', montage:'stand', paket:true, klingel:true, sprech:true },
    { id:'vossberg', name:'Briefkasten mit Klingel & Sprechanlage | Vossberg', line:'2-in-1', price:299.00, uvp:null, rating:4.5, reviews:27,
      badge:null, colors:['anthrazit','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'integriert', montage:'wand', paket:true, klingel:true, sprech:true },
    { id:'duo', name:'Doppel-Briefkasten | 2 Parteien | Duo', line:null, price:229.00, uvp:null, rating:5, reviews:15,
      badge:null, colors:['anthrazit','weiss','grau','schwarz'], faecher:'2', material:'stahl', zeitung:'integriert', montage:'wand' },
    /* Zweifamilien depth (live-shop research, /briefkasten-zweifamilienhaus__2 = 17 Artikel):
       wall-mount ohne Zeitungsfach (BK212), Sichtfenster (Cube, Acrylglas) and rostfreies
       V4A-Edelstahl (Stencil) all exist for 2 Fächer — these three keep the advisor's
       dataset-gates offering the full real option set for Zweifamilienhäuser. */
    { id:'bk212', name:'Zweifach Briefkasten | austauschbare Namensschilder | BK212 vertikal', line:null, price:179.00, uvp:null, rating:5, reviews:17,
      badge:null, colors:['anthrazit'], faecher:'2', material:'stahl', zeitung:'ohne', montage:'wand' },
    { id:'cube', name:'Standbriefkasten Mehrfamilienhaus mit Sichtfenster | Cube', line:null, price:289.00, uvp:null, rating:5, reviews:2,
      badge:null, colors:['anthrazit'], faecher:'2', material:'acrylglas', zeitung:'integriert', montage:'stand' },
    { id:'stencil2', name:'Edelstahl Standbriefkasten Mehrfamilienhaus | Stencil', line:'Edelstahl V4A', price:299.00, uvp:null, rating:5, reviews:1,
      badge:null, colors:['anthrazit','edelstahl'], faecher:'2', material:'edelstahl', zeitung:'integriert', montage:'stand' },
    { id:'hoffmann-edelstahl', name:'Edelstahl Standbriefkasten Mehrfamilienhaus | Stahlkorpus & gebürstete Edelstahl-Front | Hoffmann', line:null, price:359.00, uvp:null, rating:5, reviews:11,
      badge:null, colors:['anthrazit','edelstahl','eisenglimmer','grau','schwarz','weiss'], faecher:'2', material:'stahl', zeitung:'integriert', montage:'stand' },
    { id:'vdm10-zf', name:'Standbriefkasten mit Video-Türsprechanlage für Zweifamilienhaus | VDM10 | Anthrazit RAL 7016', line:'Video-Türsprechanlage', price:1351.50, uvp:1590.00, rating:5, reviews:3,
      badge:{type:'sale', text:'−15 %'}, colors:['anthrazit','weiss','grau','schwarz','eisenglimmer'], faecher:'2', material:'stahl', zeitung:'integriert', montage:'stand', klingel:true, sprech:true },
    { id:'klar', name:'Briefkasten mit Acrylglas-Front | Klar', line:null, price:139.00, uvp:null, rating:4.5, reviews:8,
      badge:null, colors:['schwarz','anthrazit'], faecher:'1', material:'acrylglas', zeitung:'ohne', montage:'wand' },
    { id:'anton2', name:'Briefkasten Holzoptik Eiche | personalisiert mit Gravur | Anton 2', line:null, price:99.99, uvp:null, rating:5, reviews:20,
      badge:null, colors:['anthrazit','braun'], faecher:'1', material:'holz', zeitung:'integriert', montage:'wand' },
    { id:'nordkap', name:'Edelstahl-Briefkasten V4A | Küste | Nordkap', line:'Salzwasserfest', price:219.00, uvp:null, rating:5, reviews:11,
      badge:null, colors:['edelstahl'], faecher:'1', material:'edelstahl', zeitung:'integriert', montage:'stand', paket:true },
    { id:'kompakt', name:'Kompakt-Briefkasten ohne Gravur | Basic', line:null, price:69.99, uvp:84.99, rating:4.5, reviews:96,
      badge:{type:'sale', text:'−18 %'}, colors:['weiss','anthrazit','grau','schwarz','eisenglimmer'], faecher:'1', material:'stahl', zeitung:'ohne', montage:'wand' },
    { id:'quartett', name:'Briefkastenanlage | 4 Parteien | Quartett', line:null, price:459.00, uvp:null, rating:5, reviews:6,
      badge:null, colors:['anthrazit','grau','schwarz','eisenglimmer'], faecher:'3', material:'stahl', zeitung:'ohne', montage:'unterputz', paket:true, klingel:true }
  ];

  var TOTAL = 80; // catalogue headline figure

  /* ---- State ---- */
  var active = { color: [], zeitung: [], faecher: [], montage: [], zusatz: [], material: [], door: [] };
  var page = 1;
  var advisorChips = false;   /* true while the active filters were set by the KI advisor → don't echo them as toolbar chips */

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
    advisorChips = false;   /* user is now filtering manually → toolbar chips return */
    var arr = active[group];
    var i = arr.indexOf(key);
    if (i === -1) arr.push(key); else arr.splice(i, 1);
    page = 1;
    updateFacets(group);
    syncControls();
    render();
  }

  function clearAll() {
    advisorChips = false;
    Object.keys(active).forEach(function (g) { active[g] = []; });
    page = 1;
    updateFacets();
    syncControls();
    render();
  }

  /* Reflect state onto controls (checkbox rows) */
  function syncControls() {
    document.querySelectorAll('.fopt input').forEach(function (cb) {
      cb.checked = active[cb.getAttribute('data-group')].indexOf(cb.getAttribute('data-key')) !== -1;
    });
  }

  /* ---- Filtering ----
     matchesWith(p, a) tests a product against an arbitrary active-selection
     object; matches(p) uses the live one. The indirection lets the facet engine
     compute per-option counts by overriding a single group. */
  function matchesWith(p, a) {
    if (a.color.length && !a.color.some(function (c) { return p.colors.indexOf(c) !== -1; })) return false;
    if (a.faecher.length) {
      /* 'paketfach' is a separate attribute (parcel compartment), not a fach count —
         match it against p.paket; the count keys ('1'/'2'/'3') match p.faecher. */
      var fOk = a.faecher.some(function (k) {
        return k === 'paketfach' ? !!p.paket : p.faecher === k;
      });
      if (!fOk) return false;
    }
    if (a.zeitung.length && a.zeitung.indexOf(p.zeitung) === -1) return false;
    if (a.montage.length && a.montage.indexOf(p.montage) === -1) return false;
    if (a.door && a.door.length && !a.door.some(function (v) { return p.montage === 'wand' && (v === 'seite' ? !!p.seitentuer : true); })) return false;   /* Öffnungsrichtung — Aufputz only; 'seite' needs the side-hinge flag */
    if (a.material && a.material.length && a.material.indexOf(p.material) === -1) return false;   /* sidebar Material facet + advisor (Witterung/Optik/Sichtfenster) */
    if (a.zusatz.length) {
      /* Extra functions — boolean attributes on the product (p.klingel / p.sprech).
         OR within the group; a "klingel+sprech" key requires BOTH (combined unit). */
      var zOk = a.zusatz.some(function (k) {
        return k.indexOf('+') !== -1 ? k.split('+').every(function (x) { return !!p[x]; }) : !!p[k];
      });
      if (!zOk) return false;
    }
    return true;
  }
  function matches(p) { return matchesWith(p, active); }

  /* ---- Dynamic facets ------------------------------------------------------
     When at least one filter is selected, every facet recomputes against the
     current selection: each option shows the real number of matching products
     and options with none are hidden (e.g. picking Unterputz leaves only the
     colours actually available wall-recessed). With no filter active the curated
     "live-mirror" counts are restored and all options shown. Only sidebar groups
     participate (material is advisor-only, not rendered). */
  var FACET_GROUPS = ['color', 'material', 'zeitung', 'faecher', 'montage', 'zusatz'];
  function facetKeys(group) {
    return group === 'color' ? Object.keys(COLORS) : FACETS[group].items.map(function (it) { return it.key; });
  }
  function curatedCount(group, key) {
    if (group === 'color') return (COLORS[key] && COLORS[key].count) || 0;
    var items = (FACETS[group] && FACETS[group].items) || [];
    for (var i = 0; i < items.length; i++) if (items[i].key === key) return items[i].count;
    return 0;
  }
  /* How many products match if this single option were the only choice in its
     group (the group's own current selection is ignored — standard facet count). */
  function optionCount(group, value) {
    var a = {};
    Object.keys(active).forEach(function (g) { a[g] = (g === group) ? [value] : active[g]; });
    return PRODUCTS.filter(function (p) { return matchesWith(p, a); }).length;
  }
  function setFacetRow(group, key, n, hide) {
    var input = document.getElementById('f-' + group + '-' + key);
    var row = input && input.closest('.fopt');
    if (!row) return;
    var cnt = row.querySelector('.fopt__count');
    if (cnt) cnt.textContent = '(' + n + ')';
    row.hidden = hide;
  }
  /* Drop selections that became impossible in combination with the others.
     keepGroup is the group the user just touched — its choice wins, so conflicts
     are resolved by dropping the incompatible values from the OTHER groups. */
  function pruneActive(keepGroup) {
    for (var pass = 0; pass < 6; pass++) {
      var changed = false;
      FACET_GROUPS.forEach(function (group) {
        if (group === keepGroup) return;
        active[group].slice().forEach(function (key) {
          if (optionCount(group, key) === 0) {
            var i = active[group].indexOf(key);
            if (i !== -1) { active[group].splice(i, 1); changed = true; }
          }
        });
      });
      if (!changed) break;
    }
  }
  function facetContainer(group) {
    var body = document.getElementById('facet-' + group);
    return body ? body.closest('.facet') : null;
  }
  function refreshFacetDisplay() {
    var dynamic = activeCount() > 0;
    FACET_GROUPS.forEach(function (group) {
      var avail = 0, anySelected = false;
      facetKeys(group).forEach(function (key) {
        var selected = active[group].indexOf(key) !== -1;
        if (selected) anySelected = true;
        if (!dynamic) { setFacetRow(group, key, curatedCount(group, key), false); avail++; return; }
        var n = optionCount(group, key);
        setFacetRow(group, key, n, n === 0 && !selected);
        if (n > 0 || selected) avail++;
      });
      /* Redundant one-choice: a group offering ≤1 selectable option can't narrow
         anything, so hide the whole facet — unless the user has a pick there (so
         they can still see/clear it). */
      var box = facetContainer(group);
      if (box) box.hidden = (avail <= 1 && !anySelected);
    });
  }
  /* User-driven refresh (sidebar toggle / clear): prune impossible picks first.
     keepGroup (the just-toggled group) is preserved during conflict resolution. */
  function updateFacets(keepGroup) {
    if (activeCount() > 0) pruneActive(keepGroup);
    refreshFacetDisplay();
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
        '<source media="(max-width: 767px)" srcset="Banner/promo-briefkasten-mobile.png">' +
        '<img src="Banner/promo-briefkasten-desktop.png" alt="Original Metzler Briefkästen — Vergleichssieger bei Vergleich.org. Langlebig & wetterfest, minimalistisches Design, sicheres Schließsystem, individuelle Gravur, flexibel montierbar." loading="lazy">' +
      '</picture>';
    return b;
  }

  /* ---- Active filter chips ---- */
  function renderChips() {
    var wrap = $('#activeChips'); wrap.innerHTML = '';
    if (advisorChips) { $('#clearAll').hidden = true; return; }   /* KI-applied filters live in the advisor card, not the toolbar */
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

    /* Needs-based questions (not a mirror of the manual filters). Each option maps to a
       catalogue attribute the recommendation engine reads:
         group color/colorset/material/faecher/zeitung/montage/zusatz → filters + ranks
         group 'pref' → noted preference (Beschriftung), not filtered
         neutral:true → "no preference" (adds no filter). Steps are skippable.
       Availability follows the live shop (edelstahl-tuerklingel.de/briefkasten):
       facet options are dataset-gated via gateHide — an option shows only while
       ≥1 product consistent with the earlier answers satisfies it; the one
       remaining hardcoded wohnIs() rule is pure curation (Zaun = single-family
       only, all live Zaunbriefkästen are 1er). */
    var QUIZ = [
      { q: 'Für welche Wohnsituation suchen Sie einen Briefkasten?', opts: [
        { label: 'Einfamilienhaus',  sub: 'für einen Haushalt',     group: 'faecher', value: '1', chip: 'Einfamilienhaus' },
        { label: 'Zweifamilienhaus', sub: 'für zwei Haushalte',     group: 'faecher', value: '2', chip: 'Zweifamilienhaus' },
        { label: 'Mehrfamilienhaus', sub: 'für mehrere Parteien',   group: 'faecher', value: '3', chip: 'Mehrfamilienhaus' }
      ]},
      /* Montage options are dataset-gated (live-shop parity): each mounting kind is
         offered only if the chosen Wohnsituation has such a model — Zweifamilien keeps
         Wand (Duo) + Stand, Mehrfamilien keeps Stand (Trias) + Unterputz (Quartett).
         Only "Am Zaun" stays curated to single-family (all Zaunbriefkästen are 1er). */
      { q: 'Wo möchten Sie Ihren Briefkasten anbringen?',
        info: '<h4>Montagearten</h4><dl><dt>An der Hauswand</dt><dd>aufgeschraubt – die häufigste und einfachste Lösung</dd><dt>Freistehend</dt><dd>mit Standfuß, unabhängig von einer Wand (z. B. an der Grundstücksgrenze)</dd><dt>Unterputz</dt><dd>flächenbündig in die Wand eingelassen, Entnahme wie üblich von vorne</dd><dt>Mauerdurchwurf</dt><dd>durch die Wand geführt: Einwurf außen, Post bequem von innen im Haus entnehmen</dd></dl>', infoLabel: 'Montagearten erklärt',
        opts: [
        { label: 'An der Hauswand',          sub: 'klassische Wandmontage',         group: 'montage', value: 'wand',      chip: 'Wandmontage', hideWhen: gateHide },
        { label: 'Freistehend mit Standfuß', sub: 'z. B. am Weg oder in der Einfahrt', group: 'montage', value: 'stand',  chip: 'Standmontage', hideWhen: gateHide },
        { label: 'Am Zaun',                  sub: 'als Zaunbriefkasten',            group: 'montage', value: 'stand',      chip: 'Zaunmontage', hideWhen: function () { return wohnIs('2') || wohnIs('3') || gateHide.call(this); } },
        { label: 'Unterputz – bündig in der Wand', sub: 'flächenbündig eingelassen, Entnahme von vorne', group: 'montage', value: 'unterputz', chip: 'Unterputz', hideWhen: gateHide },
        { label: 'Mauerdurchwurf',                 sub: 'Einwurf außen, Post bequem von innen entnehmen', group: 'montage', value: 'durchwurf', chip: 'Mauerdurchwurf', hideWhen: gateHide }
      ]},
      /* Paketfach/Zeitungsfach are dataset-gated: e.g. Mehrfamilien keeps "Auch
         Pakete" (Trias/Quartett anlagen have one) but loses "Zeitungen & Post";
         after picking Unterputz the whole step collapses and auto-skips — exactly
         how the live shop's facets behave. */
      { q: 'Was soll neben Briefpost noch hineinpassen?', opts: [
        { label: 'Auch Pakete',      sub: 'sicheres Paketfach für DHL, Hermes & Co.',           group: 'faecher', value: 'paketfach', chip: 'Paketfach', hideWhen: gateHide },
        { label: 'Zeitungen & Post', sub: 'mit integriertem Zeitungsfach, beidseitig befüllbar', group: 'zeitung', value: 'integriert', chip: 'Zeitungsfach', hideWhen: gateHide },
        { label: 'Nur Briefkasten',  sub: 'reine Briefpost – kein Extra-Fach nötig',            neutral: true, exclusive: true }   /* valid for every Wohnsituation — the live shop sells zf models ohne Zeitungsfach (BK212) */
      ]},
      /* Every Zusatz is dataset-gated (live-shop "intercom facets only where such
         products exist"): Klingel-options survive for Zwei-/Mehrfamilien via the
         anlagen (VDM10/Trias/Quartett); Sichtfenster & Blumenkasten drop out there
         automatically because only 1er models carry them. */
      { q: 'Welche Zusatzfunktion wünschen Sie sich?', opts: [
        { label: 'Funkklingel',              sub: 'kabellos und einfach nachrüstbar',          group: 'zusatz',   value: 'klingel',        chip: 'Funkklingel', hideWhen: gateHide },
        { label: 'Klingel mit Sprechanlage', sub: 'sehen und sprechen, wer vor der Tür steht', group: 'zusatz',   value: 'klingel+sprech', chip: 'Klingel & Sprechanlage', hideWhen: gateHide },
        { label: 'Sichtfenster',             sub: 'Ihren Posteingang auf einen Blick erkennen', group: 'material', value: 'acrylglas',     chip: 'Sichtfenster', hideWhen: gateHide },
        { label: 'Mit Blumenkasten',         sub: 'integrierter Pflanzkasten als Blickfang',   group: 'zusatz',   value: 'blumenkasten',   chip: 'Blumenkasten', hideWhen: gateHide },
        { label: 'Keine Zusatzfunktion',     sub: 'ein reiner Briefkasten',                    neutral: true }
      ]},
      /* Öffnungsrichtung — Aufputz (Wandmontage) only. Both options require montage:'wand',
         so Stand/Unterputz/Mauerdurchwurf skip this step. "Von der Seite" is offered only on
         the few wall-mount models flagged seitentuer, and never on Klingel/Sprechanlage boxes
         — so once a bell was chosen it gates out (and if only "Von oben" remains the step
         auto-skips). Recommendation images stay the shared placeholders. */
      { q: 'Wie soll sich die Klappe öffnen?',
        info: '<h4>Öffnungsrichtung</h4><dl><dt>Von oben</dt><dd>die Klappe öffnet nach unten – die klassische Bauform</dd><dt>Von der Seite</dt><dd>seitlich angeschlagene Tür; nicht mit Klingel/Sprechanlage kombinierbar</dd></dl>', infoLabel: 'Öffnungsrichtung erklärt',
        opts: [
        { label: 'Von oben',      sub: 'Klappe öffnet nach unten',   group: 'door', value: 'oben',  chip: 'Klappe oben',  hideWhen: gateHide },
        { label: 'Von der Seite', sub: 'seitlich angeschlagene Tür',  group: 'door', value: 'seite', chip: 'Tür seitlich', hideWhen: gateHide }
      ]},
      /* V4A option is dataset-gated too: when no rust-free model fits the answers
         so far (e.g. Mehrfamilien anlagen), the step is left with the neutral
         option only and auto-skips — no dead-end answers. */
      { q: 'Wie stark ist der Standort der Witterung ausgesetzt?',
        hideWhen: function () { return picks.some(function (arr) { return (arr || []).some(function (o) { return o.group === 'montage' && o.value === 'durchwurf'; }); }); },   /* Mauerdurchwurf sitzt geschützt in der Wand → Witterungsfrage entfällt */
        opts: [
        { label: 'Übliche, geschützte Lage',          sub: 'pulverbeschichteter Stahl genügt',         neutral: true },
        { label: 'Rau, exponiert oder in Küstennähe', sub: 'mit rostfreien V4A-Edelstahlleisten, salzwasserfest', group: 'material', value: 'edelstahl', chip: 'V4A-Edelstahl', hideWhen: gateHide }
      ]},
      /* Optik looks are dataset-gated like everything else: a look is offered only
         if a product consistent with ALL answers so far comes in it (so 2-/Mehr-
         familien drop Holz/Wunschfarbe, and Mehrfamilien — left with one look —
         skips the step entirely). */
      { q: 'Welche Optik passt zu Ihrem Zuhause?', opts: [
        { label: 'Klassische Farbe',     sub: 'z. B. Anthrazit, Schwarz, Weiß oder Grau',      group: 'colorset', values: ['anthrazit','braun','schwarz','eisenglimmer','weiss','grau'], chip: 'Klassische Farbe', swatch: 'linear-gradient(135deg,#1A171B,#383E42 38%,#B9BCC0 70%,#FFFFFF)', hideWhen: gateHide },
        { label: 'Edelstahl-Optik',      sub: 'gebürstete Edelstahl-Elemente, zeitlos',         group: 'colorset', values: ['edelstahl'], chip: 'Edelstahl-Optik', swatch: 'linear-gradient(135deg,#e9ebee,#a7adb4 55%,#d6d9dd)', hideWhen: function () { return doorIs('seite') || gateHide.call(this); } },
        { label: 'Natürliche Holzoptik', sub: 'Eiche oder Lärche',                             group: 'material', value: 'holz', chip: 'Holzoptik', swatch: 'linear-gradient(135deg,#b07b46,#7a5230)', hideWhen: function () { return doorIs('seite') || gateHide.call(this); } },
        { label: 'Wunschfarbe',          sub: 'individuell nach RAL',                          group: 'color', value: 'wunschfarbe', chip: 'Wunschfarbe', swatch: 'conic-gradient(from 90deg,#e53935,#fb8c00,#fdd835,#43a047,#1e88e5,#8e24aa,#e53935)', hideWhen: function () { return doorIs('seite') || gateHide.call(this); } }
      ]},
      { q: 'Wie möchten Sie Ihren Briefkasten beschriften?', opts: [
        { label: 'Lasergraviertes Namensschild', sub: 'jederzeit wechselbar', group: 'pref', value: 'Lasergravur' },
        { label: 'Namensschild mit Papiereinleger', sub: 'jederzeit wechselbar',                        group: 'pref', value: 'Namensschild' },
        { label: 'Edelstahl-Namensschild',       sub: 'hochwertig graviert',                            group: 'pref', value: 'Edelstahl-Namensschild' },
        { label: 'Ohne Beschriftung',            sub: 'neutral',                                        neutral: true }
      ]}
    ];

    var step = 0;   /* raw QUIZ index of the current step; hidden steps are jumped */
    var picks = [];   /* picks[i] = array of chosen option objects for step i (multi-select; [] = skipped) */
    var lead = { email: '', news: false };   /* optional e-mail capture (final step) */
    var STEPS = QUIZ.length;                  /* questions only — e-mail capture now lives on the result */

    /* ── Option availability + step skip (parity with kaufberater.html and with
       the live shop, edelstahl-tuerklingel.de): an option is offered only while
       at least one product consistent with the answers to all EARLIER steps
       satisfies it — zero-result options disappear (never greyed out), and a
       step left with ≤1 real option is skipped entirely. Mirrors the live
       filter behaviour where e.g. Unterputz collapses the Zeitungsfach/Klingel
       facets and Mehrfamilien drops wall-mount. ─────── */
    var IDX_WOHN = 0;
    QUIZ.forEach(function (q, i) {
      if (q.opts.some(function (o) { return o.group === 'faecher' && o.value === '1'; })) IDX_WOHN = i;
    });
    /* QUIZ index of the step an option belongs to (options are gated only by
       ANSWERED steps BEFORE their own, so going back never hides the answers
       that led here). */
    function stepOf(o) {
      for (var i = 0; i < QUIZ.length; i++) if (QUIZ[i].opts.indexOf(o) !== -1) return i;
      return QUIZ.length;
    }
    /* Products consistent with every facet answer on steps < limit (within a
       step: OR; across steps: AND; neutral/pref picks add no constraint).
       Falls back to the full catalogue if nothing matches, so the quiz never
       strands a step. */
    function poolBefore(limit) {
      var pool = PRODUCTS.filter(function (p) {
        for (var j = 0; j < limit; j++) {
          var facet = (picks[j] || []).filter(function (o) { return o.group && o.group !== 'pref'; });
          if (facet.length && !facet.some(function (o) { return sat(p, o); })) return false;
        }
        return true;
      });
      return pool.length ? pool : PRODUCTS;
    }
    /* Dataset-driven option hideWhen — `this` is the option (called as o.hideWhen()). */
    function gateHide() { var o = this; return !poolBefore(stepOf(o)).some(function (p) { return sat(p, o); }); }
    function optVisible(o) { return !(o.hideWhen && o.hideWhen()); }
    /* Has the shopper chosen the given Wohnsituation (Fächer count)? */
    function wohnIs(val) { return (picks[IDX_WOHN] || []).some(function (o) { return o.group === 'faecher' && o.value === val; }); }
    /* Has the shopper chosen a given Öffnungsrichtung? Used to keep the side-door
       path classic-colour-only (side boxes aren't offered in Edelstahl/Holz/Wunschfarbe). */
    function doorIs(val) { return picks.some(function (arr) { return (arr || []).some(function (o) { return o.group === 'door' && o.value === val; }); }); }
    /* A step is skipped when its own `hideWhen` holds OR it offers no real choice
       (a single visible option). */
    function stepHidden(i) {
      if (QUIZ[i].hideWhen && QUIZ[i].hideWhen()) return true;
      var n = 0;
      QUIZ[i].opts.forEach(function (o) { if (optVisible(o)) n++; });
      return n <= 1;
    }
    function visibleSteps() {
      var a = [];
      for (var i = 0; i < QUIZ.length; i++) if (!stepHidden(i)) a.push(i);
      return a;
    }
    function nextVisible(from) {                  /* returns QUIZ.length to signal "finish" */
      for (var i = from + 1; i < QUIZ.length; i++) if (!stepHidden(i)) return i;
      return QUIZ.length;
    }
    function prevVisible(from) {                  /* returns -1 when already at the first visible step */
      for (var i = from - 1; i >= 0; i--) if (!stepHidden(i)) return i;
      return -1;
    }

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
      var priority = ['faecher', 'zusatz', 'montage', 'zeitung', 'material', 'colorset', 'color']; /* later = dropped first */
      var sel = [], prefs = [];
      picks.forEach(function (arr, idx) {
        if (stepHidden(idx)) return;             /* skipped step (e.g. Optik on Mehrfamilien) → its picks don't filter */
        (arr || []).forEach(function (o) {       /* picks[i] is an array (multi-select) */
          if (!o || !o.group) return;            /* neutral option → no filter */
          if (o.group === 'pref') prefs.push(o); /* Beschriftung → noted, not filterable */
          else sel.push(o);                      /* real facet → filters + ranks */
        });
      });
      function setActive(list) {
        Object.keys(active).forEach(function (g) { active[g] = []; });
        list.forEach(function (o) {
          if (o.group === 'colorset') { (o.values || []).forEach(function (v) { if (active.color.indexOf(v) === -1) active.color.push(v); }); }
          else if (active[o.group] && active[o.group].indexOf(o.value) === -1) active[o.group].push(o.value);
        });
        advisorChips = true;   /* filters came from the KI → keep them out of the toolbar */
        page = 1; refreshFacetDisplay(); syncControls(); render();
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
      if (p.montage === 'stand')      return 'Product%20Image/standbriefkaesten.webp';
      if (p.faecher === '3')          return 'Product%20Image/mehrfamilien-briefkaesten.webp';
      if (p.montage === 'unterputz' || p.montage === 'durchwurf') return 'Product%20Image/unterputz-briefkaesten.webp';
      return 'Product%20Image/einfamilien-briefkasten.png';
    }
    /* Does product p satisfy a single facet pick? (mirrors matches()) */
    function sat(p, o) {
      if (o.group === 'color')    return p.colors.indexOf(o.value) !== -1;
      if (o.group === 'colorset') return (o.values || []).some(function (c) { return p.colors.indexOf(c) !== -1; });
      if (o.group === 'material') return p.material === o.value;
      if (o.group === 'faecher')  return o.value === 'paketfach' ? !!p.paket : p.faecher === o.value;
      if (o.group === 'zusatz')   return o.value.indexOf('+') !== -1 ? o.value.split('+').every(function (x) { return !!p[x]; }) : !!p[o.value];
      if (o.group === 'zeitung')  return p.zeitung === o.value;
      if (o.group === 'montage')  return p.montage === o.value;
      if (o.group === 'door')     return p.montage === 'wand' && (o.value === 'seite' ? !!p.seitentuer : true);
      return false;
    }
    function recCardHTML(p) {
      return '<a class="advisor__rec" href="#grid" data-details>' +
        '<span class="advisor__rec-thumb"><img src="' + pickImg(p) + '" alt="" loading="lazy"></span>' +
        '<span class="advisor__rec-info">' +
          '<span class="advisor__rec-name">' + p.name + '</span>' +
          '<span class="advisor__rec-price">' + fmtPrice(p.price) + (p.uvp ? '<s>' + fmtPrice(p.uvp) + '</s>' : '') + '</span>' +
        '</span>' +
        '<svg class="advisor__rec-go" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg>' +
      '</a>';
    }


    /* Markup for one question step (i = raw QUIZ index) — shared by renderStep and
       the height probe. Options gated out (hideWhen) are dropped but keep their
       original index k stable so the click handler still resolves s.opts[k]. */
    function stepInnerHTML(i) {
      var s = QUIZ[i];
      var cur = Array.isArray(picks[i]) ? picks[i] : [];
      var opts = s.opts.map(function (o, k) {
        if (o.hideWhen && o.hideWhen()) return '';   /* option not available for current picks → drop */
        var on = cur.some(function (p) { return p.label === o.label; }) ? ' is-active' : '';
        var swCss = o.swatch || (o.group === 'color' && COLORS[o.value] ? COLORS[o.value].css : null);
        var sw = swCss ? '<span class="advisor__opt-sw" style="background:' + swCss + '" aria-hidden="true"></span>' : '';
        var text = '<span class="advisor__opt-label">' + o.label + '</span>' +
          (o.sub ? '<span class="advisor__opt-sub">' + o.sub + '</span>' : '');
        // Swatch tiles lay out as [palette] [caption column]; non-swatch keep label+sub inline.
        var inner = swCss ? sw + '<span class="advisor__opt-text">' + text + '</span>' : text;
        return '<button type="button" class="advisor__opt' + on + (swCss ? ' advisor__opt--sw' : '') + '" data-opt="' + k + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
          inner +
        '</button>';
      }).join('');
      /* Progress reflects only the steps actually shown for this path (the Optik
         step drops out for Mehrfamilien), so the count stays honest as it changes. */
      var vis = visibleSteps();
      var pos = vis.indexOf(i);
      var total = vis.length;
      var isLast = pos === total - 1;
      var dots = '';
      for (var d = 0; d < total; d++) dots += '<span class="' + (d < pos ? 'is-done' : (d === pos ? 'is-current' : '')) + '"></span>';
      var info = s.info ?
        '<span class="advisor__info" data-info>' +
          '<button type="button" class="advisor__info-btn" data-info-btn aria-label="' + (s.infoLabel || 'Mehr Infos') + '">i</button>' +
          '<span class="advisor__info-pop">' + s.info + '</span>' +
        '</span>' : '';
      var qrow = info
        ? '<div class="advisor__qrow"><h3 class="advisor__q">' + s.q + '</h3>' + info + '</div>'
        : '<h3 class="advisor__q">' + s.q + '</h3>';
      return '<div class="advisor__step">' +
          '<div class="advisor__progress">' +
            '<span class="advisor__progress-dots">' + dots + '</span>' +
            '<span class="advisor__progress-label">Schritt ' + (pos + 1) + ' von ' + total + '</span>' +
          '</div>' +
          qrow +
          '<div class="advisor__opts" role="group" aria-label="' + s.q + '">' + opts + '</div>' +
          '<div class="advisor__nav">' +
            (pos > 0 ? '<button type="button" class="advisor__back" data-back><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg>Zurück</button>' : '<span></span>') +
            '<button type="button" class="advisor__forward' + (isLast ? ' advisor__forward--cta' : '') + '" data-next>' + (isLast ? 'Empfehlung anzeigen' : 'Weiter') + '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg></button>' +
          '</div>' +
        '</div>';
    }

    /* If any option's label+sub wraps to a 2nd line, stack ALL options in the step. */
    function markStacked(scope) {
      var optsEl = scope.querySelector('.advisor__opts');
      if (!optsEl) return;
      var anyWrapped = [].some.call(scope.querySelectorAll('.advisor__opt:not(.advisor__opt--sw)'), function (o) {
        var lab = o.querySelector('.advisor__opt-label'), sub = o.querySelector('.advisor__opt-sub');
        return sub && sub.getBoundingClientRect().top >= lab.getBoundingClientRect().bottom - 2;
      });
      if (anyWrapped) optsEl.classList.add('advisor__opts--stacked');
    }

    /* Fix the quiz column to the tallest QUESTION step (the result step is excluded)
       so the container does not jump as the option count changes. Measured in an
       offscreen probe so the live step (and its listeners) is never disturbed. */
    function lockQuizHeight() {
      var w = quizEl.clientWidth;
      if (!w) return;
      var probe = document.createElement('div');
      probe.className = quizEl.className;
      probe.style.cssText = 'position:absolute; left:-9999px; top:0; visibility:hidden; width:' + w + 'px;';
      quizEl.parentNode.appendChild(probe);
      var max = 0;
      for (var i = 0; i < STEPS; i++) {
        probe.innerHTML = stepInnerHTML(i);
        markStacked(probe);
        var el = probe.querySelector('.advisor__step');
        var h = el ? el.offsetHeight : 0;
        if (h > max) max = h;
      }
      probe.remove();
      if (max) quizEl.style.minHeight = max + 'px';
    }

    function renderStep() {
      if (step >= QUIZ.length) { finish(); return; }   /* after the last question → result (with e-mail capture) */
      /* Drop any pick that is no longer offered on this step (e.g. an Optik look
         picked earlier, then the shopper switched to Mehrfamilien). */
      if (Array.isArray(picks[step])) {
        picks[step] = picks[step].filter(function (o) { return !(o.hideWhen && o.hideWhen()); });
      }
      results.hidden = true; results.innerHTML = '';
      var s = QUIZ[step];
      quizEl.innerHTML = stepInnerHTML(step);
      var stepEl = quizEl.querySelector('.advisor__step');
      requestAnimationFrame(function () { stepEl.classList.add('is-in'); });
      markStacked(quizEl);

      quizEl.querySelectorAll('[data-opt]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var o = s.opts[+btn.getAttribute('data-opt')];
          if (!Array.isArray(picks[step])) picks[step] = [];
          var arr = picks[step], j, ix = -1;
          for (j = 0; j < arr.length; j++) { if (arr[j].label === o.label) { ix = j; break; } }
          if (o.exclusive) {
            /* Exclusive option (e.g. "Nur Briefkasten"): selecting it clears the rest;
               clicking it again clears it. */
            if (ix !== -1) arr.splice(ix, 1); else { arr.length = 0; arr.push(o); }
          } else {
            /* Selecting a normal option first removes any exclusive pick in this step. */
            for (j = arr.length - 1; j >= 0; j--) { if (arr[j].exclusive) arr.splice(j, 1); }
            ix = -1;
            for (j = 0; j < arr.length; j++) { if (arr[j].label === o.label) { ix = j; break; } }
            if (ix === -1) arr.push(o); else arr.splice(ix, 1);   /* toggle — multi-select, no auto-advance */
          }
          /* Re-sync every option button to the picks (exclusive toggles flip siblings). */
          quizEl.querySelectorAll('[data-opt]').forEach(function (b) {
            var bo = s.opts[+b.getAttribute('data-opt')];
            var onx = arr.some(function (p) { return p.label === bo.label; });
            b.classList.toggle('is-active', onx);
            b.setAttribute('aria-pressed', onx ? 'true' : 'false');
          });
        });
      });
      var back = quizEl.querySelector('[data-back]');
      if (back) back.addEventListener('click', function () { var p = prevVisible(step); if (p >= 0) go(function () { step = p; renderStep(); }); });
      var next = quizEl.querySelector('[data-next]');   /* Weiter advances; empty selection = skip; hidden steps are jumped */
      if (next) next.addEventListener('click', function () { if (!Array.isArray(picks[step])) picks[step] = []; go(function () { step = nextVisible(step); renderStep(); }); });

      /* Montagearten info tooltip (only on steps with s.info). */
      var infoBtn = quizEl.querySelector('[data-info-btn]');
      if (infoBtn) {
        var wrap = quizEl.querySelector('[data-info]');
        infoBtn.addEventListener('click', function (e) { e.stopPropagation(); wrap.classList.toggle('is-open'); });
        document.addEventListener('click', function () { wrap.classList.remove('is-open'); });
      }
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
        'Wir analysieren Ihre Antworten und kuratieren passende Modelle…</span>' +
        '<div class="advisor__skeleton">' + sk + sk + '</div>' +
      '</div>';
    }

    function resultHTML(res, top) {
      var headText = (res.kept.length && res.count >= 2)   /* count title only when it matches the 2 cards shown */
        ? '<strong>' + res.count + '</strong> passende Empfehlungen für Sie kuratiert'
        : 'Unsere Top-Empfehlungen für Sie';
      var cards = top.map(function (t) { return recCardHTML(t.p); }).join('');
      var chips = res.kept.map(function (o) {
        var chipText = o.chip || o.label || labelFor(o.group, o.value);
        return '<span class="advisor__chip">' + chipText +
          '<button type="button" class="advisor__chip-x" data-ai-chip-label="' + o.label + '" aria-label="Filter ' + chipText + ' entfernen">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-x"/></svg>' +
          '</button></span>';
      });
      var note = res.dropped.length
        ? '<p class="advisor__note">Kein exakter Treffer – wir zeigen Ihnen die besten Alternativen.</p>'
        : '';
      var capture =
        '<div class="advisor__capture" data-result-capture>' +
          '<p class="advisor__capture-q">Empfehlung per E-Mail erhalten?</p>' +
          '<div class="advisor__capture-row">' +
            '<div class="advisor__field">' +
              '<svg class="advisor__field-ico advisor__field-ico--mail" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>' +
              '<input type="email" class="advisor__input" data-email autocomplete="email" placeholder="E-Mail-Adresse eingeben" aria-label="E-Mail-Adresse">' +
            '</div>' +
            '<div class="advisor__capture-end">' +
              '<label class="advisor__optin">' +
                '<input type="checkbox" data-optin>' +
                '<span class="advisor__optin-box" aria-hidden="true"></span>' +
                '<span>Schicken Sie mir Metzler News &amp; Angebote.</span>' +
              '</label>' +
              '<button type="button" class="advisor__send" data-email-send aria-label="Absenden"><span class="advisor__send-label">Absenden</span><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg></button>' +
            '</div>' +
          '</div>' +
          '<p class="advisor__optin-info" data-optin-info role="status">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11.5v4.5"/><path d="M12 7.7h.01"/></svg>' +
            '<span>Wir senden Ihnen eine E-Mail mit einem Freischalt-Link für den Erhalt unseres Newsletters. Die Abmeldung ist jederzeit möglich.</span>' +
          '</p>' +
          '<p class="advisor__legal">Hinweise zum Datenschutz finden Sie <a href="#">hier</a>.</p>' +
        '</div>';
      /* Mehrfamilien → offer the Briefkastenanlagen-Konfigurator for custom / many-party setups */
      var konfig = wohnIs('3')
        ? '<a class="advisor__konfig" href="https://edelstahl-tuerklingel.de/briefkastenanlage" target="_blank" rel="noopener">' +
            '<span class="advisor__konfig-thumb"><img src="Product%20Image/Briefkastenanlage/image%206.png" alt=""></span>' +
            '<span class="advisor__konfig-txt"><strong>Mehr Parteien oder eine individuelle Anlage?</strong>Stellen Sie Ihre Mehrfamilien-Briefkastenanlage im Konfigurator zusammen.</span>' +
            '<span class="advisor__konfig-go">Konfigurator öffnen<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-chevron-right"/></svg></span>' +
          '</a>'
        : '';
      return '<div class="advisor__result">' +
        '<div class="advisor__result-head"><h3 class="advisor__result-title">' + headText + '</h3></div>' +
        '<div class="advisor__recs">' + cards + '</div>' +
        konfig +
        '<div class="advisor__aside">' +
          '<div class="advisor__summary">' +                  /* chips left · actions right, one horizontal row */
            (chips.length ? '<div class="advisor__chips">' + chips.join('') + '</div>' : '<span></span>') +
            '<div class="advisor__actions">' +
              '<button type="button" class="advisor__view" data-ai-view>' + (res.count === 1 ? 'Das Modell ansehen' : 'Alle ' + res.count + ' Modelle ansehen') + '</button>' +
              '<button type="button" class="advisor__reset" data-ai-reset>Quiz neu starten</button>' +
            '</div>' +
          '</div>' +
          note +
        '</div>' +
        capture +
        '</div>';
    }

    /* Remove every pick with this label (used by the removable result chips). */
    function removePick(label) {
      picks.forEach(function (arr) {
        if (!Array.isArray(arr)) return;
        for (var i = arr.length - 1; i >= 0; i--) {
          if (arr[i].label === label) arr.splice(i, 1);
        }
      });
    }

    /* Build + wire the result (no loader). Called after the loader, and again
       instantly when a result chip is removed → re-curate. */
    function renderResult() {
      var res = applyPicks();
      var selAll = res.kept.concat(res.dropped);
      function ratioOf(p) { return selAll.length ? selAll.filter(function (o) { return sat(p, o); }).length / selAll.length : 1; }
      var ranked = PRODUCTS.filter(matches).map(function (p) {
        return { p: p, ratio: ratioOf(p) };
      }).sort(function (a, b) { return b.ratio - a.ratio || b.p.rating - a.p.rating || b.p.reviews - a.p.reviews; });
      var top = ranked.slice(0, 2);
      if (top.length < 2) {   /* always fill 2 cards — pad with the next-best alternatives (no lone card / blank) */
        var have = top.map(function (t) { return t.p.id; });
        var fill = PRODUCTS.filter(function (p) { return have.indexOf(p.id) === -1; })
          .map(function (p) { return { p: p, ratio: ratioOf(p) }; })
          .sort(function (a, b) { return b.ratio - a.ratio || b.p.rating - a.p.rating || b.p.reviews - a.p.reviews; });
        top = top.concat(fill).slice(0, 2);
      }
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

      /* Removable filter chips — drop the filter and re-curate instantly */
      results.querySelectorAll('[data-ai-chip-label]').forEach(function (b) {
        b.addEventListener('click', function () {
          removePick(b.getAttribute('data-ai-chip-label'));
          renderResult();
        });
      });

      /* E-mail capture (on the result): submit → inline confirmation that
         auto-reverts to the pristine form after a few seconds. */
      var cap = results.querySelector('[data-result-capture]');
        if (cap) {
          var captureInner = cap.innerHTML;   /* pristine form markup, restored after the confirmation */
          var revertTimer;
          var wireCapture = function () {
            var emailEl = cap.querySelector('[data-email]');
            if (!emailEl) return;
            var optinEl = cap.querySelector('[data-optin]');
            var optinLabel = cap.querySelector('.advisor__optin');
            var optinInfo = cap.querySelector('[data-optin-info]');
            optinEl.addEventListener('change', function () {
              optinLabel.classList.toggle('is-on', optinEl.checked);
              if (optinInfo) optinInfo.classList.toggle('is-shown', optinEl.checked);   /* newsletter → double-opt-in notice */
            });
            var submitEmail = function () {
              var v = emailEl.value.trim();
              if (!v) { emailEl.focus(); return; }
              lead.email = v; lead.news = optinEl.checked;
              cap.innerHTML =
                '<div class="advisor__sent" role="status">' +
                  '<svg class="advisor__sent-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.4 12.3l2.4 2.4 4.8-5.4"/></svg>' +
                  '<p class="advisor__sent-text">Ihre Empfehlung wird an <strong>' + v + '</strong> gesendet' + (lead.news ? ' – inkl. News &amp; Angebote' : '') + '.' + (lead.news ? ' Bitte bestätigen Sie die E-Mail in Ihrem Postfach.' : '') + '</p>' +
                '</div>';
              clearTimeout(revertTimer);
              revertTimer = setTimeout(function () { cap.innerHTML = captureInner; wireCapture(); }, 4000);   /* back to the default form */
            };
            emailEl.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submitEmail(); } });
            cap.querySelector('[data-email-send]').addEventListener('click', submitEmail);
          };
          wireCapture();
        }
    }

    function finish() {
      clearTimeout(thinkTimer);
      root.classList.add('is-result');   /* hide the intro block on the result step */
      quizEl.innerHTML = '';
      results.hidden = false;
      results.innerHTML = loaderHTML();
      thinkTimer = setTimeout(renderResult, 1500);
    }

    function restart() {
      step = 0; picks = []; lead = { email: '', news: false };
      root.classList.remove('is-result');   /* bring the intro block back */
      clearAll();                 /* clears active filters + re-renders the full grid */
      results.hidden = true; results.innerHTML = '';
      renderStep();
    }

    renderStep();   /* render step 0 into the (collapsed) card */

    /* Collapsible dropdown — collapsed by default; measure the quiz on open (hidden = width 0) */
    function toggleAdvisor() {
      var open = root.classList.toggle('is-open');
      var bar = root.querySelector('.advisor__bar');
      if (bar) bar.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var st = quizEl.querySelector('.advisor__step'); if (st) st.classList.add('is-in');   /* settle entrance offset so the quiz aligns to the content top */
        lockQuizHeight();
        var f = root.querySelector('.advisor__result-title') || root.querySelector('.advisor__q');
        if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 80);
      }
    }
    root.querySelectorAll('[data-ai-toggle]').forEach(function (b) { b.addEventListener('click', toggleAdvisor); });
    var rzT;
    window.addEventListener('resize', function () { clearTimeout(rzT); if (root.classList.contains('is-open')) rzT = setTimeout(lockQuizHeight, 200); });
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
  buildFacetGroup('material');
  buildFacetGroup('zeitung');
  buildFacetGroup('faecher');
  buildFacetGroup('montage');
  buildFacetGroup('zusatz');
  updateFacets();
  wireDrawer();
  wireSubnav();
  wireFooterAccordions();
  wireAiAdvisor();
  wireSeo();
  $('#clearAll').addEventListener('click', clearAll);
  $('#emptyReset').addEventListener('click', clearAll);
  render();
})();
