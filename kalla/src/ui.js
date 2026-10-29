/* ===== Läxgympan: appen ===== */
(function () {
  'use strict';
  var L = Lx;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var app = $('#app');
  var RED = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  // ---------- Lagring (bara på den här plattan) ----------
  var NYCKEL = 'laxgympan.v1';
  function standard() { return { v: 2, namn: '', figur: '', namnPa: {}, vanner: '', skin: 'rosa', ljud: true, stjarnor: 0, pass: {}, missade: [] }; }
  var S = (function () {
    try { var raw = localStorage.getItem(NYCKEL); if (raw) return Object.assign(standard(), JSON.parse(raw)); } catch (e) { }
    return standard();
  })();
  function spara() { try { localStorage.setItem(NYCKEL, JSON.stringify(S)); } catch (e) { } }
  (function flytta() {
    var andrat = false;
    [['mus', 'kanin'], ['tvatt', 'panda']].forEach(function (par) {
      if (S.figur === par[0]) { S.figur = par[1]; andrat = true; }
      if (S.namnPa && S.namnPa[par[0]] !== undefined) { if (S.namnPa[par[1]] === undefined) S.namnPa[par[1]] = S.namnPa[par[0]]; delete S.namnPa[par[0]]; andrat = true; }
    });
    if ((S.v || 1) < 2) {
      S.missade = (S.missade || []).map(function (m) {
        var d = m.ref ? m.ref.split('/') : null;
        if (d && d[0] === 'kap1' && d[1] === 'del1') { var i = +d[2]; if (i === 10) return null; if (i > 10) { m.ref = 'kap1/del1/' + (i - 1); m.nyckel = m.ref; } }
        if (m.q && (m.q.gen === 'tallinje' || (m.q.figur && m.q.figur.form === 'tallinje'))) return null;
        return m;
      }).filter(Boolean);
      S.v = 2; andrat = true;
    }
    if (andrat) spara();
  })();

  var RORELSER = [
    { id: 'hopp', namn: 'Hopp', kravs: 0 }, { id: 'piruett', namn: 'Piruett', kravs: 15 }, { id: 'hjula', namn: 'Hjula', kravs: 40 },
    { id: 'volt', namn: 'Volt', kravs: 80 }, { id: 'splitt', namn: 'Splitthopp', kravs: 130 }, { id: 'band', namn: 'Bandsnurr', kravs: 200 },
    { id: 'stjarnhopp', namn: 'Stjärnhopp', kravs: 240, tid: 1000 }, { id: 'bakvolt', namn: 'Bakåtvolt', kravs: 290, tid: 1200 },
    { id: 'handstand', namn: 'Handstående', kravs: 350, tid: 2100 }, { id: 'spagat', namn: 'Spagat', kravs: 420, tid: 1900 },
    { id: 'flickflack', namn: 'Flickflack', kravs: 500, tid: 2300 }, { id: 'dubbelvolt', namn: 'Dubbelvolt', kravs: 600, tid: 1500 },
    { id: 'skruv', namn: 'Skruvvolt', kravs: 720, tid: 1500 }
  ];
  function upplasta() { return RORELSER.filter(function (r) { return S.stjarnor >= r.kravs; }); }
  var POANG = { ratt: 2, ratt2: 1, miss: 0, kunde: 2, nastan: 1, inte: 0 };
  var BEROM = ['Rätt!', 'Snyggt!', 'Klockrent!', 'Perfekt landning!', 'Tio av tio!', 'Grymt!', 'Japp, rätt!', 'Stark!'];
  var PRAT = ['Vilken läxa kör vi i dag?', 'Matte är som att hjula. Det blir lättare för varje gång!', 'Fel svar är bara träning. Då lär sig hjärnan!', 'Tryck på mig, så gör jag en rörelse!', 'Räkna på papper, så kollar jag svaret.', 'Ju fler stjärnor, desto fler rörelser lär jag mig.'];

  function kompisNamn() { var n = (S.namnPa || {})[S.figur]; return n || Gubbar.namn(figurId()); }
  function vanner() { return (S.vanner || '').split(/[,\n]/).map(function (s) { return s.trim().slice(0, 20); }).filter(Boolean).slice(0, 8); }
  function ctx() { return { lista: vanner() }; }

  // ---------- Text ----------
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function rt(s) {
    return esc(s)
      .replace(/\{([^{}\/]+)\/([^{}]+)\}/g, function (m, a, b) { return '<span class="br" role="img" aria-label="' + esc(L.brakOrd(a, b)) + '"><span>' + a + '</span><span>' + b + '</span></span>'; })
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  function rtUttryck(s) { return rt(s).replace(/\?/g, '<span class="lucka">?</span>'); }

  // ---------- Ikoner ----------
  var IK = {
    stjarna: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.1l-5.7 3 1.1-6.3L2.8 9.3l6.4-.9z" fill="var(--guld)" stroke="color-mix(in srgb,var(--guld) 60%,#000)" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    kugge: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
    tillbaka: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    kryss: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    hogtalare: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" fill-opacity=".15"/><path d="M15.5 9a4 4 0 0 1 0 6M18.2 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    penna: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.2-4.6L16.4 4.2a2 2 0 0 1 2.8 0l.6.6a2 2 0 0 1 0 2.8L8.6 18.8z" fill="var(--guld)" fill-opacity=".5"/><path d="M14.5 6l3.5 3.5"/></svg>',
    lampa: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" fill="var(--guld)" fill-opacity=".55"/></svg>',
    pil: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    bock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--ratt)"/><path d="M7 12.5l3.2 3.2L17.5 8.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    hmm: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--fel)"/><path d="M8 15.5c2.5-1.6 5.5-1.6 8 0" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="8.6" cy="9.5" r="1.4" fill="#fff"/><circle cx="15.4" cy="9.5" r="1.4" fill="#fff"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="var(--pop2)"/><path d="M12 11v6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="7.3" r="1.6" fill="#fff"/></svg>',
    radera: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5h11v14H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>',
    igen: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3M4 20v-4h4"/></svg>',
    oandlig: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 12c-2-2.6-3.6-4-5.5-4a4 4 0 0 0 0 8c1.9 0 3.5-1.4 5.5-4zm0 0c2 2.6 3.6 4 5.5 4a4 4 0 0 0 0-8c-1.9 0-3.5 1.4-5.5 4z"/></svg>',
    kolv: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v6L4.6 18.2A1.9 1.9 0 0 0 6.2 21h11.6a1.9 1.9 0 0 0 1.6-2.8L14 9V3"/><path d="M7 15h10" /><path d="M6.4 16.5h11.2l1.8 2.4a1 1 0 0 1-.8 1.6H5.4a1 1 0 0 1-.8-1.6z" fill="currentColor" fill-opacity=".3" stroke="none"/></svg>',
    glob: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" fill="currentColor" fill-opacity=".12"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/></svg>',
    karta: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="currentColor" fill-opacity=".12"/><path d="M9 4v14M15 6v14"/></svg>',
    blixt: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor" fill-opacity=".2"/></svg>'
  };

  // ---------- Ljud ----------
  var ac = null;
  function ljud(typ) {
    if (!S.ljud) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      var t = ac.currentTime;
      var ton = function (f, start, dur, form, vol) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = form || 'sine'; o.frequency.setValueAtTime(f, t + start);
        g.gain.setValueAtTime(0.0001, t + start);
        g.gain.exponentialRampToValueAtTime(vol || 0.16, t + start + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
        o.connect(g); g.connect(ac.destination); o.start(t + start); o.stop(t + start + dur + 0.05);
      };
      if (typ === 'ratt') { ton(880, 0, 0.16, 'triangle'); ton(1318.5, 0.09, 0.28, 'triangle'); }
      else if (typ === 'fel') { ton(330, 0, 0.2, 'sine', 0.12); ton(262, 0.13, 0.28, 'sine', 0.12); }
      else if (typ === 'tap') { ton(700, 0, 0.05, 'square', 0.035); }
      else if (typ === 'pil') { ton(150, 0, 0.09, 'triangle', 0.25); ton(95, 0.03, 0.12, 'sine', 0.2); }
      else if (typ === 'medalj') { [523, 659, 784, 1046].forEach(function (f, i) { ton(f, i * 0.11, 0.35, 'triangle', 0.14); }); ton(1318.5, 0.5, 0.6, 'triangle', 0.1); }
      else if (typ === 'boing') { var o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.18); g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.32); }
    } catch (e) { }
  }


  // ---------- Konfetti ----------
  var fx = $('#fx'), g2 = fx.getContext('2d'), delar = [], raf = 0, dpr = 1;
  function storlek() { dpr = Math.min(2, window.devicePixelRatio || 1); fx.width = innerWidth * dpr; fx.height = innerHeight * dpr; g2.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function konfetti(x, y, mangd, spridning) {
    if (RED.matches) mangd = Math.min(mangd, 10);
    storlek();
    var cs = getComputedStyle(document.documentElement);
    var farger = ['--rosa', '--bla', '--guld', '--ratt', '--pop'].map(function (v) { return cs.getPropertyValue(v).trim(); }).filter(Boolean);
    for (var i = 0; i < mangd; i++) {
      delar.push({ x: x + (Math.random() - 0.5) * (spridning || 0), y: y, vx: (Math.random() - 0.5) * 11, vy: -Math.random() * 11 - 4, r: Math.random() * 6.3, vr: (Math.random() - 0.5) * 0.35, w: 6 + Math.random() * 6, h: 9 + Math.random() * 9, c: farger[i % farger.length], band: Math.random() < 0.25, liv: 0, fas: Math.random() * 6 });
    }
    if (!raf) raf = requestAnimationFrame(steg);
  }
  function steg() {
    g2.clearRect(0, 0, fx.width, fx.height);
    delar = delar.filter(function (p) { return p.y < innerHeight + 40 && p.liv < 260; });
    delar.forEach(function (p) {
      p.liv++; p.vy += 0.3; p.vx *= 0.985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      g2.save(); g2.translate(p.x, p.y); g2.rotate(p.r); g2.fillStyle = p.c; g2.strokeStyle = p.c;
      if (p.band) { g2.lineWidth = 3; g2.beginPath(); for (var i = 0; i <= 12; i++) { var yy = i * 2 - 12, xx = Math.sin(i * 0.8 + p.fas + p.liv * 0.2) * 4; if (i) g2.lineTo(xx, yy); else g2.moveTo(xx, yy); } g2.stroke(); }
      else { g2.scale(1, Math.cos(p.liv * 0.12 + p.fas)); g2.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
      g2.restore();
    });
    raf = delar.length ? requestAnimationFrame(steg) : 0;
    if (!raf) g2.clearRect(0, 0, fx.width, fx.height);
  }
  function rekt(el) { if (!el) return null; var b = el.getBoundingClientRect(); return b.width ? b : null; }
  function konfettiFran(el, mangd) {
    var b = el && el.left !== undefined ? el : rekt(el);
    if (!b) return konfetti(innerWidth / 2, innerHeight / 2, mangd || 60);
    konfetti(b.left + b.width / 2, b.top + b.height / 2, mangd || 60, b.width * 0.6);
  }

  function toast(text) {
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = text;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2700);
  }

  // ---------- Figurerna ----------
  function figurId() { return S.figur || 'kanin'; }
  function kompisSVG(min, extra) { return Gubbar.figur(figurId(), min, { cls: 'huvudfigur' + (extra ? ' ' + extra : ''), label: esc(kompisNamn()) }); }
  function miniKompis() { return Gubbar.huvud(figurId()); }
  function ovriga() { return Gubbar.LISTA.filter(function (g) { return g.id !== figurId(); }); }
  function figurVal(akt) {
    return '<div class="figur-val">' + Gubbar.LISTA.map(function (g) {
      return '<button class="figur-knapp" data-act="' + akt + '" data-f="' + g.id + '" aria-pressed="' + (S.figur === g.id) + '">' + Gubbar.figur(g.id, 'glad', { band: false, label: g.namn }) + '<span>' + esc((S.namnPa || {})[g.id] || g.namn) + '</span></button>';
    }).join('') + '</div>';
  }
  var blinkTimer = 0;
  function startaBlink() {
    clearTimeout(blinkTimer);
    var tick = function () {
      $$('.kompis').forEach(function (k) { k.classList.add('blink'); setTimeout(function () { k.classList.remove('blink'); }, 130); });
      blinkTimer = setTimeout(tick, 2600 + Math.random() * 2600);
    };
    blinkTimer = setTimeout(tick, 1800);
  }
  function rorelse(id, el) {
    (el ? [el] : $$('.kompis.huvudfigur')).forEach(function (k) {
      clearTimeout(k._rt);
      RORELSER.concat([{ id: 'tap' }, { id: 'hmm' }]).forEach(function (r) { k.classList.remove('r-' + r.id); });
      void k.getBoundingClientRect();
      k.classList.add('r-' + id);
      var info = RORELSER.filter(function (r) { return r.id === id; })[0];
      k._rt = setTimeout(function () { k.classList.remove('r-' + id); }, (info && info.tid) || 1700);
    });
    if (id !== 'tap' && id !== 'hmm') ljud('boing');
  }
  function minSpel(min, ms) {
    $$('.kompis').forEach(function (k) { k.setAttribute('data-min', min); });
    if (ms) setTimeout(function () { $$('.kompis').forEach(function (k) { k.setAttribute('data-min', 'glad'); }); }, ms);
  }
  function slumpRorelse() { var u = upplasta(); return u[Math.floor(Math.random() * u.length)].id; }

  // ---------- Medaljer ----------
  var METALL = { guld: ['#FFD54F', '#D99A14', 'Guld'], silver: ['#EEF1F6', '#9AA3B6', 'Silver'], brons: ['#F3B482', '#B26B36', 'Brons'] };
  function medaljSVG(typ, stor) {
    var m = METALL[typ] || METALL.brons;
    return '<svg viewBox="0 0 60 100" aria-hidden="true"><path d="M8 0 H26 L36 50 L22 54 Z" fill="var(--pop)"/><path d="M52 0 H34 L24 50 L38 54 Z" fill="var(--pop2)"/>' +
      '<circle cx="30" cy="72" r="' + (stor ? 23 : 22) + '" fill="' + m[0] + '" stroke="' + m[1] + '" stroke-width="3"/><circle cx="30" cy="72" r="15" fill="none" stroke="' + m[1] + '" stroke-width="1.5" opacity=".7"/>' +
      '<path d="M30 61.5l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z" fill="' + m[1] + '" opacity=".85"/><ellipse cx="22" cy="63" rx="5" ry="3" fill="#fff" opacity=".5" transform="rotate(-30 22 63)"/></svg>';
  }

  // ---------- Figurer ----------
  function figurSVG(f) {
    var s = '', i, j, n;
    if (f.form === 'rutor') {
      var c = 56, w = f.kol * c, h = f.rader * c;
      for (i = 0; i < f.rader; i++) for (j = 0; j < f.kol; j++) { n = i * f.kol + j; s += '<rect class="fig-del' + (f.fargade.indexOf(n) >= 0 ? ' farg' : '') + '" x="' + (j * c) + '" y="' + (i * c) + '" width="' + c + '" height="' + c + '"/>'; }
      return '<svg viewBox="-4 -4 ' + (w + 8) + ' ' + (h + 8) + '" width="' + (w + 8) + '" role="img" aria-label="En figur med ' + (f.rader * f.kol) + ' rutor">' + s + '</svg>';
    }
    if (f.form === 'cirkel') {
      var r = 76, cx = 80, cy = 80;
      for (i = 0; i < f.delar; i++) {
        var a1 = -Math.PI / 2 + i * 2 * Math.PI / f.delar, a2 = a1 + 2 * Math.PI / f.delar;
        s += '<path class="fig-del' + (f.fargade.indexOf(i) >= 0 ? ' farg' : '') + '" d="M' + cx + ' ' + cy + ' L' + (cx + r * Math.cos(a1)).toFixed(2) + ' ' + (cy + r * Math.sin(a1)).toFixed(2) + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r * Math.cos(a2)).toFixed(2) + ' ' + (cy + r * Math.sin(a2)).toFixed(2) + ' Z"/>';
      }
      return '<svg viewBox="0 0 160 160" width="170" role="img" aria-label="En cirkel i ' + f.delar + ' delar">' + s + '</svg>';
    }
    if (f.form === 'triangel') {
      var R = f.rader, W = 240, sid = W / R, hh = sid * Math.sqrt(3) / 2, idx = 0, P = function (x, y) { return x.toFixed(1) + ' ' + y.toFixed(1); };
      for (i = 0; i < R; i++) {
        for (j = 0; j < 2 * i + 1; j++) {
          var k = Math.floor(j / 2), y0 = i * hh, y1 = (i + 1) * hh, d;
          if (j % 2 === 0) d = 'M' + P(W / 2 - i * sid / 2 + k * sid, y0) + ' L' + P(W / 2 - (i + 1) * sid / 2 + k * sid, y1) + ' L' + P(W / 2 - (i + 1) * sid / 2 + (k + 1) * sid, y1) + ' Z';
          else d = 'M' + P(W / 2 - i * sid / 2 + k * sid, y0) + ' L' + P(W / 2 - i * sid / 2 + (k + 1) * sid, y0) + ' L' + P(W / 2 - (i + 1) * sid / 2 + (k + 1) * sid, y1) + ' Z';
          s += '<path class="fig-del' + (f.fargade.indexOf(idx) >= 0 ? ' farg' : '') + '" d="' + d + '"/>'; idx++;
        }
      }
      return '<svg viewBox="-4 -4 ' + (W + 8) + ' ' + (R * hh + 8).toFixed(1) + '" width="250" role="img" aria-label="En triangel delad i ' + idx + ' små trianglar">' + s + '</svg>';
    }
    if (f.form === 'rektangel') {
      var ru = 30, rw = f.b * ru, rh = f.h * ru, rut = '';
      for (i = 1; i < f.b; i++) rut += '<line x1="' + (i * ru) + '" y1="0" x2="' + (i * ru) + '" y2="' + rh + '" class="fig-rut"/>';
      for (j = 1; j < f.h; j++) rut += '<line x1="0" y1="' + (j * ru) + '" x2="' + rw + '" y2="' + (j * ru) + '" class="fig-rut"/>';
      return '<svg viewBox="-56 -10 ' + (rw + 70) + ' ' + (rh + 46) + '" width="' + Math.min(420, rw + 70) + '" role="img" aria-label="En rektangel som är ' + f.b + ' cm lång och ' + f.h + ' cm bred">' +
        '<rect class="fig-del farg-ljus" x="0" y="0" width="' + rw + '" height="' + rh + '"/>' + rut + '<rect class="fig-kant" x="0" y="0" width="' + rw + '" height="' + rh + '"/>' +
        '<text class="tl-text" x="' + (rw / 2) + '" y="' + (rh + 28) + '">' + f.b + ' cm</text><text class="tl-text" x="-30" y="' + (rh / 2 + 6) + '">' + f.h + ' cm</text></svg>';
    }
    if (f.form === 'stapel') {
      var max = Math.max.apply(null, f.data.map(function (d) { return d[1]; })), steg = max > 10 ? 2 : 1, topp = Math.ceil(max / steg) * steg + steg;
      var VW2 = 460, VH2 = 280, x0 = 44, y0 = 236, hojd = 200, bredd = (VW2 - x0 - 10) / f.data.length, Y = function (v) { return y0 - v / topp * hojd; };
      for (i = 0; i <= topp; i += steg) s += '<line class="fig-rut" x1="' + x0 + '" y1="' + Y(i).toFixed(1) + '" x2="' + (VW2 - 6) + '" y2="' + Y(i).toFixed(1) + '"/><text class="st-axel" x="' + (x0 - 10) + '" y="' + (Y(i) + 5).toFixed(1) + '">' + i + '</text>';
      f.data.forEach(function (d, k) {
        var bx = x0 + k * bredd + bredd * 0.18, bw = bredd * 0.64;
        s += '<rect class="st-stapel s' + (k % 4) + '" x="' + bx.toFixed(1) + '" y="' + Y(d[1]).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (y0 - Y(d[1])).toFixed(1) + '" rx="5"/>';
        s += '<text class="tl-text" x="' + (bx + bw / 2).toFixed(1) + '" y="' + (y0 + 26) + '">' + esc(d[0]) + '</text>';
      });
      s += '<line class="tl-linje" x1="' + x0 + '" y1="' + y0 + '" x2="' + (VW2 - 6) + '" y2="' + y0 + '"/>';
      return '<svg viewBox="0 -8 ' + VW2 + ' ' + VH2 + '" width="' + VW2 + '" role="img" aria-label="Stapeldiagram: ' + esc(f.rubrik || '') + '. ' + f.data.map(function (d) { return d[0] + ' ' + d[1]; }).join(', ') + '">' + s + '</svg>';
    }
    if (f.form === 'tallinje') {
      var VW = 680, m0 = 30, y = 92, sp = f.till - f.fran, X = function (v) { return m0 + (v - f.fran) / sp * (VW - 2 * m0 - 20); };
      s += '<line class="tl-linje" x1="' + (m0 - 10) + '" y1="' + y + '" x2="' + (VW - 14) + '" y2="' + y + '"/><path class="tl-pil" d="M' + (VW - 4) + ' ' + y + ' l-16 -8 v16 z" style="fill:var(--ink)"/>';
      var tot = sp * f.delar;
      for (i = 0; i <= tot; i++) {
        var v = f.fran + i / f.delar, x = X(v), stor = i % f.delar === 0;
        s += '<line class="tl-streck" x1="' + x.toFixed(1) + '" y1="' + (y - (stor ? 14 : 7)) + '" x2="' + x.toFixed(1) + '" y2="' + (y + (stor ? 14 : 7)) + '"/>';
        if (stor) s += '<text class="tl-text" x="' + x.toFixed(1) + '" y="' + (y + 38) + '">' + L.fmt(v) + '</text>';
      }
      f.pilar.forEach(function (p) {
        var px = X(p.varde);
        s += '<path class="tl-pil" d="M' + px.toFixed(1) + ' ' + (y - 16) + ' l-9 -14 h6 v-18 h6 v18 h6 z"/>';
        if (p.namn) s += '<text class="tl-pilnamn" x="' + px.toFixed(1) + '" y="' + (y - 56) + '">' + esc(p.namn) + '</text>';
      });
      return '<svg viewBox="0 0 ' + VW + ' 140" style="min-width:520px" role="img" aria-label="En tallinje från ' + f.fran + ' till ' + f.till + '">' + s + '</svg>';
    }
    return '';
  }

  // ---------- Pilkastningstavla ----------
  var RINGAR = [{ r: 120, v: 1, f: '#3B7FD9', t: '#fff' }, { r: 94, v: 5, f: '#E5484D', t: '#fff' }, { r: 68, v: 20, f: '#2FA36B', t: '#fff' }, { r: 42, v: 25, f: '#FFC531', t: '#3A2A00' }, { r: 18, v: 50, f: '#FF5C9E', t: '#fff' }];
  function tavlaSVG(pilar) {
    var s = '';
    RINGAR.forEach(function (rg, i) {
      s += '<circle cx="130" cy="130" r="' + rg.r + '" fill="' + rg.f + '" stroke="#1D2250" stroke-width="2.5"/>';
      var inre = RINGAR[i + 1] ? RINGAR[i + 1].r : 0, ly = 130 - (rg.r + inre) / 2;
      s += '<text x="130" y="' + (ly + 6).toFixed(1) + '" text-anchor="middle" style="font:800 ' + (i === 4 ? 15 : 18) + 'px var(--display)" fill="' + rg.t + '">' + rg.v + '</text>';
    });
    pilar.forEach(function (p) {
      s += '<g class="pilen"><line x1="' + p.x + '" y1="' + p.y + '" x2="' + (p.x + 16) + '" y2="' + (p.y - 16) + '" stroke="#1D2250" stroke-width="4" stroke-linecap="round"/><path d="M' + (p.x + 14) + ' ' + (p.y - 22) + ' l8 0 l0 -8 z" fill="var(--rosa)"/><circle cx="' + p.x + '" cy="' + p.y + '" r="5" fill="#1D2250" stroke="#fff" stroke-width="2"/></g>';
    });
    return '<svg class="tavla" id="tavla" viewBox="0 0 260 260" role="img" aria-label="Piltavla. Tryck på en ring för att kasta en pil.">' + s + '</svg>';
  }

  // ---------- Navigering ----------
  var vy = 'hem', aktivtSet = null, P = null, inst = false, nollstallFraga = false;
  function hittaSet(id) { return LAXOR.filter(function (s) { return s.id === id; })[0]; }
  function passNyckel(setId, passId) { return setId + '/' + passId; }
  function fastaPass(set) { return set.pass.filter(function (p) { return p.fragor || p.karta || p.huvudstader; }); }
  function amnesNamn(a) { return { matte: 'Matte', no: 'NO', geo: 'Geografi' }[a] || 'Matte'; }

  function visa(ny) {
    if (vy === 'spel' && ny !== 'spel') stoppaSpel();
    vy = ny;
    render();
  }
  function render() {
    document.documentElement.setAttribute('data-skin', S.skin || 'rosa');
    var html = vy === 'hem' ? vyHem() : vy === 'set' ? vySet() : vy === 'pass' ? vyPass() : vy === 'spel' ? vySpel() : vy === 'utforska' ? vyUtforska() : vyKlar();
    app.innerHTML = html + (inst ? vyInst() : '');
    startaBlink();
    if (vy === 'pass') efterPass();
    if (vy === 'klar') efterKlar();
    if (vy === 'spel') efterSpel();
    if (vy === 'hem') setTimeout(function () { $$('.hang:not(.tom)').forEach(function (h, i) { setTimeout(function () { h.classList.add('dangla'); }, i * 90); }); }, 250);
  }

  // ---------- Vy: Hem ----------
  function vyHem() {
    var medaljer = Object.keys(S.pass).map(function (k) { return { k: k, p: S.pass[k] }; }).filter(function (x) { return x.p.medalj; }).sort(function (a, b) { return (b.p.senast || 0) - (a.p.senast || 0); }).slice(0, 7);
    var rack = medaljer.length ? medaljer.map(function (x) {
      var d = x.k.split('/'), set = hittaSet(d[0]), pass = set && set.pass.filter(function (p) { return p.id === d[1]; })[0];
      var namn = (set ? set.titel : '') + (pass ? ', ' + pass.titel : '');
      return '<button class="hang" data-act="medalj" aria-label="' + esc(METALL[x.p.medalj][2] + ': ' + namn) + '">' + medaljSVG(x.p.medalj) + '</button>';
    }).join('') : [0, 1, 2].map(function () { return '<span class="hang tom" aria-hidden="true"><svg viewBox="0 0 60 100"><path d="M8 0 H26 L36 50 L22 54 Z M52 0 H34 L24 50 L38 54 Z" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="4 4"/><circle cx="30" cy="72" r="20" fill="none" stroke="var(--line)" stroke-width="3" stroke-dasharray="5 5"/></svg></span>'; }).join('');

    var bubbla, harNamn = !!(S.namnPa || {})[S.figur];
    if (!S.figur) {
      bubbla = '<div class="pratbubbla"><span>Hej! <strong>Vem vill du träna med?</strong> Tryck på en kompis.</span></div>';
    } else if (!harNamn) {
      bubbla = '<div class="pratbubbla"><form data-form="kompis"><span>Hej! <strong>Vad heter jag?</strong></span><input id="onb-kompis" type="text" maxlength="16" placeholder="Skriv namnet" autocomplete="off"><button class="knapp" type="submit">Klar</button></form></div>';
    } else if (!S.namn) {
      bubbla = '<div class="pratbubbla"><form data-form="namn"><span>Jag heter ' + esc(kompisNamn()) + '! <strong>Vad heter du?</strong></span><input id="onb-namn" type="text" maxlength="20" placeholder="Ditt namn" autocomplete="off"><button class="knapp" type="submit">Klar</button></form></div>';
    } else {
      bubbla = '<div class="pratbubbla" id="prat">' + esc(PRAT[Math.floor(Math.random() * PRAT.length)]) + '</div>';
    }
    var u = upplasta(), nasta = RORELSER.filter(function (r) { return S.stjarnor < r.kravs; })[0];
    var andra = S.figur ? ovriga() : [];
    var apor = andra.filter(function (g) { return g.apa; }), publik = andra.filter(function (g) { return !g.apa; });
    var apa = function (g, sida) { return '<button class="hangare ' + sida + '" data-act="gunga" aria-label="' + esc((S.namnPa || {})[g.id] || g.namn) + ' hänger i räcket">' + Gubbar.hangare(g.id) + '</button>'; };
    var pub = function (g) { return '<button class="publik-fig" data-act="publik" aria-label="' + esc((S.namnPa || {})[g.id] || g.namn) + '">' + Gubbar.figur(g.id, 'glad', { band: false, cls: 'publik-svg', label: esc(g.namn) }) + '</button>'; };
    var rorelser = RORELSER.map(function (r) { return S.stjarnor >= r.kravs ? '<button class="rorelse" data-act="rorelse" data-r="' + r.id + '">' + r.namn + '</button>' : '<span class="rorelse last">' + r.namn + ' · ' + r.kravs + '</span>'; }).join('');

    var kort = LAXOR.map(function (set) {
      var fasta = fastaPass(set), klara = fasta.filter(function (p) { return S.pass[passNyckel(set.id, p.id)]; }).length;
      var andel = fasta.length ? klara / fasta.length : 0, omk = 2 * Math.PI * 22;
      var ny = !fasta.some(function (p) { return S.pass[passNyckel(set.id, p.id)]; });
      return '<button class="laxkort" data-act="oppna" data-set="' + set.id + '">' +
        '<span class="amnesruta ' + set.amne + '">' + (set.amne === 'no' ? IK.kolv : set.amne === 'geo' ? IK.glob : '<span aria-hidden="true">÷</span>') + '</span>' +
        '<span><span class="rad"><span class="chip ' + set.amne + '">' + amnesNamn(set.amne) + '</span>' + (set.ny && ny ? '<span class="chip ny">Ny</span>' : '') + '</span><h3>' + esc(set.titel) + '</h3><p>' + esc(set.under) + (ny ? '' : ' · ' + klara + ' av ' + fasta.length + ' pass klara') + '</p></span>' +
        '<svg class="ring" viewBox="0 0 54 54" aria-label="' + klara + ' av ' + fasta.length + ' pass klara"><circle class="bak" cx="27" cy="27" r="22" fill="none" stroke-width="6"/><circle class="fram" cx="27" cy="27" r="22" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + omk.toFixed(1) + '" stroke-dashoffset="' + (omk * (1 - andel)).toFixed(1) + '" transform="rotate(-90 27 27)"/><text x="27" y="31.5" text-anchor="middle">' + klara + '/' + fasta.length + '</text></svg>' +
        '</button>';
    }).join('');
    if (S.missade.length) {
      kort = '<button class="laxkort" data-act="igen"><span class="amnesruta igen">' + IK.igen + '</span><span><span class="rad"><span class="chip papper">Öva igen</span></span><h3>Kluriga frågor</h3><p>' + S.missade.length + ' ' + (S.missade.length === 1 ? 'fråga' : 'frågor') + ' som var svåra förra gången</p></span><span class="kor" style="font:800 18px var(--display);color:var(--pop-deep)">Kör!</span></button>' + kort;
    }

    return '<div class="vy"><div class="inre">' +
      '<header class="topp"><div class="halsning"><h1>Hej' + (S.namn ? ' <em>' + esc(S.namn) + '</em>' : '') + '!</h1><p>Dags att träna hjärnan.</p></div>' +
      '<button class="stjarnor" data-act="stjarnor" aria-label="' + S.stjarnor + ' stjärnor">' + IK.stjarna + '<span id="antal-stjarnor">' + S.stjarnor + '</span></button>' +
      '<button class="ikon-knapp" data-act="inst" aria-label="Inställningar">' + IK.kugge + '</button></header>' +
      '<div class="hem-grid">' +
        '<section class="scen" aria-label="Din kompis">' +
          '<div class="rack' + (apor.length ? ' med-apor' : '') + '">' + (apor[0] ? apa(apor[0], 'v') : '') + '<div class="rack-hangen">' + rack + '</div>' + (apor[1] ? apa(apor[1], 'h') : '') + (medaljer.length ? '' : '<p class="rack-text">Här hänger dina medaljer.</p>') + '</div>' +
          (S.figur ? '<div class="kompis-scen">' + bubbla + '<div class="scen-golv"><div class="publik v">' + publik.slice(0, 2).map(pub).join('') + '</div><button class="kompis-knapp" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG() + '</button><div class="publik h">' + publik.slice(2).map(pub).join('') + '</div></div><div class="matta"></div><div class="namnskylt">' + esc(kompisNamn()) + '</div></div>' :
            '<div class="kompis-scen">' + bubbla + figurVal('valj-figur') + '</div>') +
          '<div class="rorelser" aria-label="Rörelser">' + rorelser + '</div>' +
          '<p class="nasta-rorelse">' + (nasta ? (nasta.kravs - S.stjarnor) + ' stjärnor kvar till ' + nasta.namn + '.' : 'Alla rörelser är upplåsta!') + '</p>' +
        '</section>' +
        '<section class="laxor"><h2>Dina läxor</h2>' + kort + '</section>' +
      '</div></div></div>';
  }

  // ---------- Vy: Läxa ----------
  function vySet() {
    var set = hittaSet(aktivtSet), nr = 0;
    var lista = set.pass.map(function (p) {
      var res = S.pass[passNyckel(set.id, p.id)], gen = !!(p.gen || p.pool || p.utforska);
      if (!gen) nr++;
      var antalF = p.fragor ? p.fragor.length : p.karta ? (p.antal || GEO.regioner[p.karta].lander.length) : (p.antal || 0);
      var under = p.under || (antalF + ' frågor');
      if (!gen && p.under && !p.karta) under += ' · ' + antalF + ' frågor';
      if (!gen && !p.under) under = antalF + (p.karta ? ' länder' : ' frågor');
      return '<li><button class="station' + (gen ? ' gen' : '') + (res ? ' klar' : '') + '" data-act="starta" data-set="' + set.id + '" data-pass="' + p.id + '">' +
        '<span class="nr">' + (gen ? (p.utforska ? IK.glob : p.pool ? IK.blixt : IK.oandlig) : nr) + '</span>' +
        '<span><h3>' + esc(p.titel) + '</h3><p>' + esc(under) + '</p></span>' +
        (p.utforska ? '<span class="kor">Öppna ' + IK.pil.replace('<svg', '<svg style="width:20px;height:20px"') + '</span>' : res && res.medalj ? '<span class="mini-medalj" aria-label="' + METALL[res.medalj][2] + '">' + medaljSVG(res.medalj) + '</span>' : '<span class="kor">Kör ' + IK.pil.replace('<svg', '<svg style="width:20px;height:20px"') + '</span>') +
        '</button></li>';
    }).join('');
    return '<div class="vy"><div class="inre">' +
      '<header class="setvy-topp"><button class="ikon-knapp" data-act="hem" aria-label="Tillbaka">' + IK.tillbaka + '</button><div><span class="chip ' + set.amne + '">' + amnesNamn(set.amne) + '</span><h1>' + esc(set.titel) + '</h1><p>' + esc(set.under) + '</p></div></header>' +
      '<ol class="stationer">' + lista + '</ol></div></div>';
  }

  // ---------- Pass ----------
  function hamtaRef(ref) {
    var d = ref.split('/'), set = hittaSet(d[0]); if (!set) return null;
    var p = set.pass.filter(function (x) { return x.id === d[1]; })[0]; if (!p || !p.fragor || !p.fragor[+d[2]]) return null;
    return Object.assign({}, p.fragor[+d[2]], { ref: ref, amne: set.amne });
  }
  function nivaOrdning(arr) {
    if (!arr.some(function (q) { return q.niva; })) return arr;
    return arr.map(function (q, i) { return [q, i]; }).sort(function (a, b) { return ((a[0].niva || 2) - (b[0].niva || 2)) || (a[1] - b[1]); }).map(function (x) { return x[0]; });
  }
  function startaPass(setId, passId) {
    var fragor, set = hittaSet(setId), pass;
    if (setId === 'igen') {
      fragor = L.blanda(Math.random, S.missade.slice(0, 8).map(function (m) { return m.ref ? hamtaRef(m.ref) : m.q; }).filter(Boolean));
      pass = { id: 'igen', titel: 'Öva igen' };
    } else {
      pass = set.pass.filter(function (p) { return p.id === passId; })[0];
      if (pass.utforska) { aktivtSet = setId; U.vald = null; return visa('utforska'); }
      if (pass.karta) fragor = nivaOrdning(kartFragor(pass.karta, pass.antal));
      else if (pass.huvudstader) fragor = huvudstadsFragor(pass.antal || 10);
      else if (pass.gen) fragor = nivaOrdning(L.genPass(pass.gen, pass.antal || 8, ctx()).map(function (q) { q.amne = set.amne; return q; }));
      else if (pass.pool) {
        var alla = [];
        set.pass.forEach(function (p) { if (p.fragor) p.fragor.forEach(function (q, i) { if (q.typ !== 'kort') alla.push(Object.assign({}, q, { ref: passNyckel(set.id, p.id) + '/' + i, amne: set.amne })); }); });
        fragor = L.blanda(Math.random, alla).slice(0, pass.antal || 10);
      } else fragor = nivaOrdning(L.blanda(Math.random, pass.fragor.map(function (q, i) { return Object.assign({}, q, { ref: passNyckel(setId, passId) + '/' + i, amne: set.amne }); })));
    }
    if (!fragor.length) { toast('Det finns inga frågor att öva på just nu.'); return visa('hem'); }
    if (setId !== 'igen') aktivtSet = setId;
    P = { setId: setId, passId: passId, titel: pass.titel, fragor: fragor, i: 0, resultat: [], stjarnorIPass: 0, rorelserFore: upplasta().length };
    nyFraga();
    visa('pass');
  }
  function nyFraga() {
    var q = P.fragor[P.i];
    P.q = q; P.geo = null; P.forsok = 0; P.ledtrad = false; P.klar = false; P.utfall = null; P.besked = null; P.faltStatus = null; P.losning = false;
    P.svar = q.typ === 'svar' ? q.falt.map(function () { return ''; }) : null;
    P.aktivt = 0; P.ordning = []; P.pilar = []; P.valda = []; P.kortVisat = false; P.not = '';
    if (q.typ === 'val') P.alt = q.fast ? L.range(q.alt.length) : L.blanda(Math.random, L.range(q.alt.length));
    if (q.typ === 'ordna') { var b; do { b = L.blanda(Math.random, L.range(q.items.length)); } while (b.every(function (v, i) { return v === i; })); P.blandning = b; }
  }

  function vyPass() {
    var q = P.q, n = P.fragor.length, andel = P.i / n;
    var prickar = P.fragor.map(function (_, i) { return '<i class="' + (P.resultat[i] ? ({ ratt: 'ratt', kunde: 'ratt', ratt2: 'ratt2', nastan: 'ratt2', miss: 'miss', inte: 'miss' })[P.resultat[i]] : '') + '"></i>'; }).join('');
    var amne = q.amne || 'matte';
    var meta = '<span class="chip ' + amne + '">' + amnesNamn(amne) + '</span>' + (q.typ === 'karta' ? '<span class="chip papper">' + IK.karta + esc(REGIONNAMN[q.region]) + '</span>' : '') +
      (q.niva ? '<span class="chip niva n' + q.niva + '">' + ['', 'Lätt', 'Lagom', 'Klurig'][q.niva] + '</span>' : '') +
      (q.papper ? '<span class="chip papper">' + IK.penna + 'Räkna på papper</span>' : '') +
      (q.typ === 'kort' ? '<span class="chip papper">' + IK.penna + 'Förklara med egna ord</span>' : '') +
      '<button class="liten-kompis" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG() + '</button>';
    return '<div class="vy"><div class="inre">' +
      '<header class="pass-topp"><button class="ikon-knapp" data-act="avbryt" aria-label="Avsluta passet">' + IK.kryss + '</button>' +
        '<div class="bom" role="progressbar" aria-valuemin="0" aria-valuemax="' + n + '" aria-valuenow="' + P.i + '" aria-label="Fråga ' + (P.i + 1) + ' av ' + n + '"><div class="bom-yta"><div class="bom-fyll" style="width:' + (andel * 100).toFixed(1) + '%"></div></div><div class="bom-prickar">' + prickar + '</div><div class="bom-kompis hoppa" style="left:' + (4 + andel * 92).toFixed(1) + '%">' + miniKompis() + '</div></div>' +
        '<span class="raknare">' + (P.i + 1) + '/' + n + '</span></header>' +
      '<div class="pass-grid' + (q.typ === 'karta' ? ' bred' : '') + '"><article class="fraga-kort in" id="fraga" data-ref="' + esc(q.ref || '') + '">' +
        '<div class="fraga-meta">' + meta + '</div>' +
        '<h2 class="fraga-text">' + rt(q.text) + '</h2>' +
        (q.uttryck ? '<div class="uttryck">' + rtUttryck(q.uttryck) + '</div>' : '') +
        (q.figur ? '<div class="figur">' + figurSVG(q.figur) + '</div>' : '') +
        '<div id="svar-yta"></div><div class="aterkoppling" id="aterkoppling" aria-live="polite"></div><div class="knapp-rad" id="knapp-rad"></div>' +
      '</article>' +
      '<aside class="pass-kompis"><button class="kompis-knapp" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG() + '</button><div class="matta"></div></aside></div>' +
      '</div></div>';
  }
  function efterPass() { ritaInteraktion(); }

  function ritaInteraktion() {
    var q = P.q, yta = $('#svar-yta'), ak = $('#aterkoppling'), kr = $('#knapp-rad');
    if (!yta) return;
    // Svarsytan
    if (q.typ === 'val') {
      yta.innerHTML = '<div class="alternativ">' + P.alt.map(function (ai, pos) {
        var cls = P.valda.indexOf(ai) >= 0 ? ' fel' : (P.klar && ai === q.ratt ? ' ratt' : '');
        return '<button class="alt' + cls + '" data-act="val" data-i="' + ai + '"' + (P.klar || P.valda.indexOf(ai) >= 0 ? ' disabled' : '') + '><span class="bokstav">' + 'ABCDE'[pos] + '</span><span>' + rt(q.alt[ai]) + '</span></button>';
      }).join('') + '</div>';
    } else if (q.typ === 'svar') {
      var harTal = q.falt.some(function (f) { return f.typ !== 'text'; }), harBrak = q.falt.some(function (f) { return f.typ === 'brak'; });
      var falt = q.falt.map(function (f, i) {
        var st = P.faltStatus && P.faltStatus[i] ? (P.faltStatus[i].format ? '' : P.faltStatus[i].ok ? ' ok' : ' nej') : '';
        var etikett = '<span class="etikett">' + (f.etikett ? rt(f.etikett) : (q.falt.length > 1 ? '' : 'Ditt svar')) + '</span>';
        if (f.typ === 'text') return '<label class="falt' + st + '">' + etikett + '<input id="falt-' + P.i + '-' + i + '" data-text="' + i + '" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" value="' + esc(P.svar[i]) + '"' + (P.klar ? ' disabled' : '') + ' enterkeyhint="done"></label>';
        var v = P.svar[i];
        var visas = v ? esc(v.replace('.', ',').replace('-', '−')).replace(/(\d+)\/(\d*)/, function (m, a, b) { return '<span class="br"><span>' + a + '</span><span>' + (b || '&nbsp;') + '</span></span>'; }) : '<span class="tomt">?</span>';
        return '<button class="falt' + (i === P.aktivt && !P.klar ? ' aktiv' : '') + st + '" data-act="falt" data-i="' + i + '" aria-label="' + esc(L.talbart(f.etikett || 'Svar')) + ': ' + esc(v || 'tomt') + '"' + (P.klar ? ' disabled' : '') + '>' + etikett + '<span class="ruta"><span>' + visas + '</span>' + (f.enhet ? '<span class="enhet">' + esc(f.enhet) + '</span>' : '') + '</span></button>';
      }).join('');
      var tangenter = '';
      if (harTal && !P.klar) {
        var tk = ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', 'del'];
        if (harBrak) tk = ['7', '8', '9', '/', '4', '5', '6', ',', '1', '2', '3', 'del', '0'];
        else if (q.minus) tk = ['7', '8', '9', '-', '4', '5', '6', ',', '1', '2', '3', 'del', '0'];
        var fyra = harBrak || !!q.minus;
        tangenter = '<div class="tangenter' + (fyra ? ' med-snedstreck' : '') + '">' + tk.map(function (k) {
          if (k === 'del') return '<button class="tangent extra" data-act="tangent" data-k="del" aria-label="Sudda">' + IK.radera + '</button>';
          return '<button class="tangent' + (k === '/' || k === ',' || k === '-' ? ' extra' : '') + '" data-act="tangent" data-k="' + k + '"' + (k === '0' && fyra ? ' style="grid-column:span 4"' : '') + ' aria-label="' + (k === '/' ? 'Bråkstreck' : k === ',' ? 'Komma' : k === '-' ? 'Minus' : k) + '">' + (k === '-' ? '−' : k) + '</button>';
        }).join('') + '</div>';
      }
      yta.innerHTML = '<div class="falten">' + falt + '</div>' + tangenter;
    } else if (q.typ === 'ordna') {
      var platser = q.items.map(function (_, pos) { var it = P.ordning[pos]; return it === undefined ? '<span class="plats" aria-label="Tom plats"></span>' : '<button class="plats fylld" data-act="ordna-bort" data-pos="' + pos + '"' + (P.klar ? ' disabled' : '') + '>' + rt(q.items[it]) + '</button>'; }).join('');
      var pool = P.blandning.filter(function (i) { return P.ordning.indexOf(i) < 0; }).map(function (i) { return '<button class="bricka" data-act="ordna-ta" data-i="' + i + '">' + rt(q.items[i]) + '</button>'; }).join('');
      yta.innerHTML = '<div class="ordna"><div class="ordna-rad"><span class="rand">' + esc(q.etiketter[0]) + '</span>' + platser + '<span class="rand">' + esc(q.etiketter[1]) + '</span></div><div class="ordna-pool">' + (P.klar ? '' : pool) + '</div></div>';
    } else if (q.typ === 'pil') {
      var sum = P.pilar.reduce(function (a, p) { return a + p.v; }, 0);
      yta.innerHTML = '<div class="pilkast">' + tavlaSVG(P.pilar) + '<div class="pil-info"><div class="pil-summa">' + sum + ' <small>av ' + q.mal + ' poäng · ' + P.pilar.length + ' av ' + q.pilar + ' pilar</small></div><div class="traffar">' + P.pilar.map(function (p) { return '<span>' + p.v + '</span>'; }).join('') + '</div>' +
        (P.klar ? '' : '<div class="pil-knappar"><button class="knapp sek" data-act="pil-angra"' + (P.pilar.length ? '' : ' disabled') + '>Ångra pil</button><button class="knapp sek" data-act="pil-rensa"' + (P.pilar.length ? '' : ' disabled') + '>Börja om</button></div>') + '</div></div>';
    } else if (q.typ === 'karta') {
      var G2 = P.geo || {}, klass = {}, etik = [];
      if (G2.fel) { klass[G2.fel] = 'fel'; etik.push(G2.fel); }
      if (G2.ratt) { klass[G2.ratt] = 'ratt'; etik.push(G2.ratt); }
      if (G2.info && !klass[G2.info]) { klass[G2.info] = 'vald'; etik.push(G2.info); }
      yta.innerHTML = '<div class="geo-karta fraga" data-mal="' + q.land + '">' + kartaSVG(q.region, { klass: klass, etiketter: etik, hs: G2.info }) + '</div>' +
        (q.hsFraga && G2.steg ? hsRuta(q) : '') +
        (G2.info ? faktakort(G2.info) + '<p class="geo-tips">' + IK.lampa + '<span>Tryck på andra länder för att se fakta om dem.</span></p>' : G2.steg === 'hs' ? '' : '<p class="geo-tips">' + IK.lampa + '<span>Tryck på kartan där du tror att <b>' + esc(GEOFAKTA[q.land].namn) + '</b> ligger.</span></p>');
    } else if (q.typ === 'kort') {
      if (!P.kortVisat) yta.innerHTML = '<p class="kort-hjalp">' + IK.lampa + '<span>Tänk ut ett svar med egna ord. Säg det högt eller skriv det på papper. Tryck sedan på <b>Visa svaret</b>.</span></p>';
      else yta.innerHTML = '<div class="kort-svar">' + rt(q.svar) + '</div>' + (P.klar ? '' : '<p style="font-weight:600">Hur gick det?</p><div class="bedom"><button class="kunde" data-act="kort-bedom" data-v="kunde">Jag kunde det!<small>2 stjärnor</small></button><button class="nastan" data-act="kort-bedom" data-v="nastan">Nästan<small>1 stjärna</small></button><button class="inte" data-act="kort-bedom" data-v="inte">Inte än<small>Den kommer igen</small></button></div>');
    }
    // Återkoppling
    var h = '';
    if (P.besked) {
      var b = P.besked;
      if (b.typ === 'ratt') h += '<div class="besked ratt">' + IK.bock + '<span><strong>' + esc(b.text) + '</strong>' + (b.note ? '<br><span>' + rt(b.note) + '</span>' : '') + '</span>' + (b.plus ? '<span class="plus">+' + b.plus + IK.stjarna + '</span>' : '') + '</div>';
      else if (b.typ === 'fel') h += '<div class="besked fel">' + IK.hmm + '<span>' + rt(b.text) + '</span></div>';
      else h += '<div class="besked info">' + IK.info + '<span>' + rt(b.text) + '</span></div>';
    }
    if (P.ledtrad && q.ledtrad && !P.klar) h += '<div class="ledtradsruta">' + IK.lampa + '<span><b>Ledtråd:</b> ' + rt(q.ledtrad) + '</span></div>';
    if (P.losning && q.losning) {
      h += '<div class="losning"><h3>' + (P.utfall === 'miss' ? 'Så här kan man tänka' : 'Så här räknar man') + '</h3><ol>' + q.losning.map(function (s) { return '<li><span>' + rt(s) + '</span></li>'; }).join('') + '</ol>' +
        (P.utfall === 'miss' && L.facit(q) ? '<p class="facit">Rätt svar: ' + rt(L.facit(q)) + '</p>' : '') + '</div>';
    }
    if (q.visaLand && P.klar) h += '<div class="geo-karta mini">' + kartaSVG(geoRegion(q.visaLand), { klass: (function () { var o = {}; o[q.visaLand] = 'ratt'; return o; })(), etiketter: [q.visaLand], hs: q.visaLand }) + '</div>' + faktakort(q.visaLand);
    ak.innerHTML = h;
    var pr = $$('.bom-prickar i')[P.i];
    if (pr && P.utfall) pr.className = ({ ratt: 'ratt', kunde: 'ratt', ratt2: 'ratt2', nastan: 'ratt2', miss: 'miss', inte: 'miss' })[P.utfall] || '';
    // Knappar
    var k = '';
    if (!P.klar) {
      if (q.ledtrad && !P.ledtrad && q.typ !== 'kort' && !(q.typ === 'karta' && P.geo)) k += '<button class="knapp tips" data-act="ledtrad">' + IK.lampa + 'Ledtråd</button>';
      if (q.typ === 'svar' || q.typ === 'ordna' || q.typ === 'pil') k += '<button class="knapp" data-act="ratta">' + (P.forsok ? 'Rätta igen' : 'Rätta') + '</button>';
      if (q.typ === 'kort' && !P.kortVisat) k += '<button class="knapp" data-act="kort-visa">Visa svaret</button>';
    } else {
      if (!P.losning && q.losning && q.typ !== 'kort') k += '<button class="knapp sek" data-act="visa-losning">Visa hur man räknar</button>';
      k += '<button class="knapp nasta" data-act="nasta">' + (P.i + 1 < P.fragor.length ? 'Nästa' : 'Klar!') + IK.pil + '</button>';
    }
    kr.innerHTML = k;
  }

  function skaka() { var f = $('#fraga'); if (!f) return; f.classList.remove('in', 'skaka'); void f.offsetWidth; f.classList.add('skaka'); }
  function laggTillStjarnor(n) {
    if (!n) return;
    S.stjarnor += n; P.stjarnorIPass += n; spara();
  }
  function nyckelFor(q) { return q.ref || ('gen:' + q.text + '|' + (q.uttryck || '') + '|' + JSON.stringify(q.figur || '') + '|' + JSON.stringify(q.falt || q.alt || q.items || q.mal || '')); }
  function laggTillMissad(q) {
    var n = nyckelFor(q);
    if (S.missade.some(function (m) { return m.nyckel === n; })) return;
    S.missade.unshift(q.ref ? { nyckel: n, ref: q.ref } : { nyckel: n, q: q });
    S.missade = S.missade.slice(0, 30); spara();
  }
  function taBortMissad(q) { var n = nyckelFor(q); S.missade = S.missade.filter(function (m) { return m.nyckel !== n; }); spara(); }

  function lyckat(note, elFran) {
    var fran = rekt(elFran);
    var p = (P.forsok === 0 && !P.ledtrad) ? 2 : 1;
    P.klar = true; P.utfall = p === 2 ? 'ratt' : 'ratt2'; P.resultat[P.i] = P.utfall;
    laggTillStjarnor(p);
    if (P.setId === 'igen') taBortMissad(P.q);
    P.besked = { typ: 'ratt', text: BEROM[Math.floor(Math.random() * BEROM.length)], note: note, plus: p };
    ljud('ratt');
    ritaInteraktion();
    konfettiFran(fran || $('.besked.ratt'), p === 2 ? 70 : 40);
    minSpel('jubel', 1400); rorelse(slumpRorelse());
  }
  function misslyckat(res) {
    P.forsok++;
    if (P.forsok === 1) {
      P.ledtrad = true;
      var txt = 'Inte riktigt än. Här är en ledtråd. Försök igen!';
      if (res && res.sum !== undefined) txt = 'Summan blev ' + res.sum + ', inte ' + P.q.mal + '. Här är en ledtråd.';
      if (P.q.typ === 'svar' && P.q.falt.length > 1 && res && res.falt) { var r = res.falt.filter(function (x) { return x.ok; }).length; if (r) txt = r + ' av ' + P.q.falt.length + ' är rätt. Ändra de röda rutorna. Här är en ledtråd.'; }
      P.besked = { typ: 'fel', text: txt };
      ljud('fel'); minSpel('hmm', 1500); rorelse('hmm'); skaka();
    } else {
      P.klar = true; P.utfall = 'miss'; P.resultat[P.i] = 'miss'; P.losning = true;
      laggTillMissad(P.q);
      P.besked = { typ: 'info', text: 'Bra kämpat! Den här frågan kommer tillbaka senare, så får du öva mer på den.' };
      ljud('fel');
    }
    ritaInteraktion();
  }
  function ratta() {
    var q = P.q; if (P.klar) return;
    var svar = q.typ === 'svar' ? P.svar : q.typ === 'ordna' ? P.ordning.slice() : P.pilar.map(function (p) { return p.v; });
    var res = L.kolla(q, svar);
    if (res.format) { P.besked = { typ: 'info', text: res.msg }; P.faltStatus = res.falt || null; ritaInteraktion(); skaka(); return; }
    P.faltStatus = res.falt || null;
    if (res.ok) return lyckat(res.note, $('#knapp-rad .knapp'));
    misslyckat(res);
  }
  function nasta() {
    if (P.i + 1 >= P.fragor.length) return avsluta();
    var gjorda = P.i + 1;
    P.i++; nyFraga();
    if (gjorda % 3 === 0) { P.mittSpel = true; visa('spel'); return; }
    render();
  }
  function avsluta() {
    var poang = P.resultat.reduce(function (s, u) { return s + (POANG[u] || 0); }, 0), max = P.fragor.length * 2, andel = max ? poang / max : 0;
    var medalj = andel >= 0.9 ? 'guld' : andel >= 0.7 ? 'silver' : 'brons', rank = { brons: 1, silver: 2, guld: 3 };
    if (P.setId !== 'igen') {
      var key = passNyckel(P.setId, P.passId), prev = S.pass[key];
      S.pass[key] = { medalj: !prev || rank[medalj] > rank[prev.medalj] ? medalj : prev.medalj, bast: Math.max(andel, prev ? prev.bast : 0), senast: Date.now(), ggr: (prev ? prev.ggr : 0) + 1 };
    }
    spara();
    var u = upplasta();
    P.slut = { poang: poang, max: max, andel: andel, medalj: medalj, ratt: P.resultat.filter(function (x) { return x === 'ratt' || x === 'kunde'; }).length, nya: u.slice(P.rorelserFore) };
    visa('klar');
  }

  // ---------- Vy: Klar ----------
  function vyKlar() {
    var s = P.slut, bas = 5 + s.andel * 5;  // domarna ger 5,0–10,0
    var domare = ovriga().slice(0, 3);
    var dom = [0, 1, 2].map(function (i) { var d = s.andel === 1 ? 10 : Math.max(0, Math.min(10, bas + (Math.random() * 0.3 - 0.15))), g = domare[i]; return '<div class="domare-plats">' + (g ? '<span class="domare-fig">' + Gubbar.figur(g.id, 'jubel', { band: false, cls: 'domar-svg', label: esc(g.namn) }) + '</span>' : '') + '<div class="tavla-domare"><span>' + esc(g ? ((S.namnPa || {})[g.id] || g.namn) : 'Domare ' + (i + 1)) + '</span><b>' + L.fmtN(Math.round(d * 10) / 10, 1) + '</b></div></div>'; }).join('');
    var rubrik = { guld: 'Guld!', silver: 'Silver!', brons: 'Brons!' }[s.medalj];
    var under = { guld: 'Perfekt landning! Du kan det här.', silver: 'Snyggt jobbat! Nästan hela vägen.', brons: 'Bra kämpat! Kör igen, så blir det ännu bättre.' }[s.medalj];
    var set = hittaSet(P.setId), harOva = set && set.pass.some(function (p) { return p.gen; }) && !(set.pass.filter(function (p) { return p.id === P.passId; })[0] || {}).gen;
    var ny = s.nya.length ? '<div class="ny-rorelse">' + esc(kompisNamn()) + ' har lärt sig en ny rörelse: <strong>' + esc(s.nya[s.nya.length - 1].namn) + '</strong>! Tryck på ' + esc(kompisNamn()) + ' för att se den.</div>' : '';
    return '<div class="vy"><div class="inre klar">' +
      '<button class="klar-medalj" data-act="medalj" aria-label="' + METALL[s.medalj][2] + '">' + medaljSVG(s.medalj, true) + '</button>' +
      '<h1>' + rubrik + '</h1><p class="under">' + esc(P.titel ? (P.setId === 'igen' ? 'Öva igen' : (set ? set.titel + ', ' : '') + P.titel) : '') + ' är klart. ' + esc(under) + '</p>' +
      '<div class="domare" aria-label="Domarnas poäng">' + dom + '</div>' +
      '<div class="klar-stats"><span>' + IK.stjarna + '+' + P.stjarnorIPass + ' stjärnor</span><span>' + s.ratt + ' av ' + P.fragor.length + ' rätt direkt</span></div>' + ny +
      '<button class="kompis-knapp" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG('jubel') + '</button>' +
      (P.spelat ? '' : '<button class="knapp spel-knapp" data-act="spel-slut">' + IK.stjarna + 'Bonusspel: ' + SPELNAMN[spelTyp()] + '</button>') +
      '<div class="klar-knappar"><button class="knapp sek" data-act="hem">Till start</button><button class="knapp sek" data-act="kor-igen">Kör igen</button>' + (harOva ? '<button class="knapp" data-act="ova-mer">Träna mer på samma sak</button>' : '') + '</div>' +
      '</div></div>';
  }
  function efterKlar() {
    ljud('medalj');
    setTimeout(function () { konfetti(innerWidth * 0.25, innerHeight * 0.3, 60, 120); konfetti(innerWidth * 0.75, innerHeight * 0.3, 60, 120); }, 600);
    setTimeout(function () { rorelse(P.slut.nya.length ? P.slut.nya[P.slut.nya.length - 1].id : slumpRorelse()); }, 1500);
  }

  /*GEO*/
  /*SPEL*/

  // ---------- Vy: Inställningar ----------
  function vyInst() {
    return '<div class="overlay" data-act="inst-bakgrund"><div class="panel" role="dialog" aria-modal="true" aria-labelledby="inst-rubrik">' +
      '<h2 id="inst-rubrik">Inställningar</h2>' +
      '<label for="s-namn">Ditt namn<input id="s-namn" type="text" maxlength="20" value="' + esc(S.namn) + '" autocomplete="off"></label>' +
      '<div><p style="font-weight:600;margin-bottom:8px">Huvudfigur</p>' + figurVal('byt-figur') + '</div>' +
      '<label for="s-kompis">Huvudfigurens namn<input id="s-kompis" type="text" maxlength="16" value="' + esc((S.namnPa || {})[S.figur] || '') + '" placeholder="' + esc(Gubbar.namn(figurId())) + '" autocomplete="off"></label>' +
      '<label for="s-vanner">Kompisar i textuppgifterna<small>Skriv några namn med komma emellan. De dyker upp i de nya mattefrågorna. Namnen stannar på den här plattan.</small><input id="s-vanner" type="text" maxlength="160" value="' + esc(S.vanner) + '" placeholder="Till exempel: Saga, Elsa, Maja" autocomplete="off"></label>' +
      '<div><p style="font-weight:600;margin-bottom:8px">Färger</p><div class="teman">' + [['rosa', 'Rosa'], ['ljusbla', 'Ljusblå'], ['randig', 'Blårandig'], ['dif', 'Blå, gul och röd']].map(function (t) { return '<button class="tema ' + t[0] + '" data-act="skin" data-s="' + t[0] + '" aria-pressed="' + (S.skin === t[0]) + '"><i></i>' + t[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="vaxel"><span>Ljud</span><button data-act="vaxla" data-k="ljud" aria-pressed="' + !!S.ljud + '" aria-label="Ljud"></button></div>' +
      '<div class="farozon">' + (nollstallFraga ? '<p><b>Är du säker?</b> Alla stjärnor, medaljer och rörelser försvinner.</p><div class="rad"><button class="knapp" data-act="nollstall-ja">Ja, börja om</button><button class="knapp sek" data-act="nollstall-nej">Nej</button></div>' : '<p>Vill du börja om från noll? Stjärnor och medaljer nollställs.</p><div class="rad"><button class="knapp sek" data-act="nollstall">Börja om från noll</button></div>') + '</div>' +
      '<button class="knapp" data-act="inst-stang">Klar</button></div></div>';
  }
  function sparaInst() {
    var a = $('#s-namn'), b = $('#s-kompis'), c = $('#s-vanner');
    if (a) S.namn = a.value.trim().slice(0, 20);
    if (b && S.figur) { S.namnPa = S.namnPa || {}; S.namnPa[S.figur] = b.value.trim().slice(0, 16); }
    if (c) S.vanner = c.value.slice(0, 160);
    spara();
  }

  // ---------- Händelser ----------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'inst-bakgrund' && e.target !== el) return;
    switch (act) {
      case 'oppna': ljud('tap'); aktivtSet = el.getAttribute('data-set'); visa('set'); break;
      case 'hem': ljud('tap'); visa('hem'); break;
      case 'starta': ljud('tap'); startaPass(el.getAttribute('data-set'), el.getAttribute('data-pass')); break;
      case 'igen': ljud('tap'); startaPass('igen', 'igen'); break;
      case 'avbryt': ljud('tap'); visa(P && P.setId !== 'igen' ? 'set' : 'hem'); break;
      case 'kor-igen': startaPass(P.setId, P.passId); break;
      case 'geo-region': U.region = el.getAttribute('data-r'); if (U.vald && GEO.regioner[U.region].lander.indexOf(U.vald) < 0 && U.region !== 'alla') U.vald = null; ljud('tap'); render(); break;
      case 'geo-tillbaka': ljud('tap'); visa('set'); break;
      case 'geo-hs': geoHsSvar(+el.getAttribute('data-i')); break;
      case 'spel-start': ljud('tap'); spelStart(); break;
      case 'spel-slut': ljud('tap'); if (P) P.mittSpel = false; visa('spel'); break;
      case 'spel-avsluta': { var mitt = SPEL && SPEL.mitt; if (SPEL && SPEL.startad && !SPEL.slut) { S.stjarnor += SPEL.stj; spara(); } visa(mitt ? 'pass' : 'hem'); break; }
      case 'spel-tillbaka': ljud('tap'); visa('pass'); break;
      case 'ova-mer': { var set = hittaSet(P.setId), g = set.pass.filter(function (p) { return p.gen; }); startaPass(set.id, g[g.length - 1].id); break; }
      case 'kompis': rorelse(slumpRorelse()); minSpel('jubel', 1200); { var pr = $('#prat'); if (pr) pr.textContent = PRAT[Math.floor(Math.random() * PRAT.length)]; } break;
      case 'rorelse': rorelse(el.getAttribute('data-r')); minSpel('jubel', 1200); break;
      case 'medalj': ljud('tap'); el.classList.remove('dangla'); void el.offsetWidth; el.classList.add('dangla'); break;
      case 'stjarnor': ljud('boing'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); konfettiFran(el, 24); break;
      case 'valj-figur': S.figur = el.getAttribute('data-f'); spara(); ljud('ratt'); render(); setTimeout(function () { rorelse('hopp'); minSpel('jubel', 1300); }, 100); break;
      case 'byt-figur': sparaInst(); S.figur = el.getAttribute('data-f'); spara(); ljud('tap'); render(); break;
      case 'gunga': ljud('boing'); el.classList.remove('gungar'); void el.offsetWidth; el.classList.add('gungar'); break;
      case 'publik': { var sv = $('svg', el); ljud('boing'); rorelse(Math.random() < 0.5 ? 'hopp' : 'tap', sv); sv.setAttribute('data-min', 'jubel'); setTimeout(function () { sv.setAttribute('data-min', 'glad'); }, 1200); break; }
      case 'inst': inst = true; nollstallFraga = false; render(); setTimeout(function () { var f = $('#s-namn'); if (f) f.focus(); }, 50); break;
      case 'inst-bakgrund': case 'inst-stang': sparaInst(); inst = false; render(); break;
      case 'skin': sparaInst(); S.skin = el.getAttribute('data-s'); spara(); render(); break;
      case 'vaxla': sparaInst(); { var k = el.getAttribute('data-k'); S[k] = !S[k]; spara(); render(); } break;
      case 'nollstall': sparaInst(); nollstallFraga = true; render(); break;
      case 'nollstall-nej': nollstallFraga = false; render(); break;
      case 'nollstall-ja': { var beh = { namn: S.namn, figur: S.figur, namnPa: S.namnPa, vanner: S.vanner, skin: S.skin, ljud: S.ljud }; S = Object.assign(standard(), beh); spara(); nollstallFraga = false; inst = false; toast('Klart! Allt är nollställt.'); render(); break; }
      // Pass
      case 'val': {
        var i = +el.getAttribute('data-i'); if (P.klar || P.valda.indexOf(i) >= 0) return;
        if (i === P.q.ratt) { lyckat(null, el); }
        else { P.valda.push(i); if (P.q.alt.length - P.valda.length <= 1) P.forsok = Math.max(P.forsok, 1); misslyckat(); }
        break;
      }
      case 'falt': { var fi = +el.getAttribute('data-i'); if (P.faltStatus && P.faltStatus[fi] && !P.faltStatus[fi].ok && !P.faltStatus[fi].format) { P.svar[fi] = ''; P.faltStatus[fi] = null; } P.aktivt = fi; ljud('tap'); ritaInteraktion(); break; }
      case 'tangent': skriv(el.getAttribute('data-k')); break;
      case 'ratta': ratta(); break;
      case 'ledtrad': P.ledtrad = true; P.ledtradVisad = true; ljud('tap'); ritaInteraktion(); break;
      case 'visa-losning': P.losning = true; ritaInteraktion(); break;
      case 'nasta': ljud('tap'); nasta(); break;
      case 'ordna-ta': if (!P.klar) { P.ordning.push(+el.getAttribute('data-i')); ljud('tap'); ritaInteraktion(); } break;
      case 'ordna-bort': if (!P.klar) { P.ordning.splice(+el.getAttribute('data-pos'), 1); ljud('tap'); ritaInteraktion(); } break;
      case 'pil-angra': P.pilar.pop(); ritaInteraktion(); break;
      case 'pil-rensa': P.pilar = []; ritaInteraktion(); break;
      case 'kort-visa': P.kortVisat = true; ljud('tap'); ritaInteraktion(); break;
      case 'kort-bedom': {
        var v = el.getAttribute('data-v'); P.klar = true; P.utfall = v; P.resultat[P.i] = v; laggTillStjarnor(POANG[v]);
        if (v === 'inte') { laggTillMissad(P.q); P.besked = { typ: 'info', text: 'Bra att du är ärlig! Kortet kommer tillbaka senare.' }; minSpel('hmm', 1200); }
        else { if (P.setId === 'igen') taBortMissad(P.q); P.besked = { typ: 'ratt', text: v === 'kunde' ? BEROM[Math.floor(Math.random() * BEROM.length)] : 'Bra! Snart sitter det.', plus: POANG[v] }; ljud('ratt'); minSpel('jubel', 1200); rorelse(v === 'kunde' ? slumpRorelse() : 'tap'); }
        ritaInteraktion();
        if (v === 'kunde') konfettiFran($('.besked.ratt'), 50);
        break;
      }
    }
  });

  // Kartor: tryck på ett land
  document.addEventListener('pointerdown', function (e) {
    var k = e.target.closest && e.target.closest('.geo-karta'); if (!k || k.classList.contains('mini')) return;
    if (vy === 'pass' && P && P.q && P.q.typ === 'karta') { e.preventDefault(); geoTryck(e.clientX, e.clientY, k); return; }
    if (vy === 'utforska') { var kod = landVid(e.clientX, e.clientY); if (kod && GEOFAKTA[kod]) { U.vald = kod; ljud('tap'); render(); } }
  });

  // Pilkastning: tryck på tavlan
  document.addEventListener('pointerdown', function (e) {
    var sv = e.target.closest && e.target.closest('#tavla'); if (!sv || !P || P.klar || P.q.typ !== 'pil') return;
    if (P.pilar.length >= P.q.pilar) { toast('Alla ' + P.q.pilar + ' pilar är kastade. Tryck på Rätta.'); return; }
    var pt = sv.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var p = pt.matrixTransform(sv.getScreenCTM().inverse()), d = Math.hypot(p.x - 130, p.y - 130), v = null;
    for (var i = RINGAR.length - 1; i >= 0; i--) if (d <= RINGAR[i].r) { v = RINGAR[i].v; break; }
    if (v === null) { toast('Pilen missade tavlan. Försök igen!'); return; }
    P.pilar.push({ v: v, x: Math.round(p.x), y: Math.round(p.y) }); ljud('pil'); ritaInteraktion();
  });

  function skriv(k) {
    if (!P || P.klar || P.q.typ !== 'svar') return;
    var f = P.q.falt[P.aktivt]; if (!f || f.typ === 'text') return;
    var v = P.svar[P.aktivt] || '';
    if (k === 'del') v = v.slice(0, -1);
    else if (k === ',' ) { if (v.indexOf(',') < 0 && v.indexOf('/') < 0) v = (v || '0') + ','; }
    else if (k === '/') { if (v && v.indexOf('/') < 0 && v.indexOf(',') < 0) v += '/'; }
    else if (k === '-') { v = v.charAt(0) === '-' ? v.slice(1) : '-' + v; }
    else if (v.length < 9) v += k;
    P.svar[P.aktivt] = v;
    if (P.faltStatus) P.faltStatus[P.aktivt] = null;
    ljud('tap'); ritaInteraktion();
  }

  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.hasAttribute && t.hasAttribute('data-text') && P) { P.svar[+t.getAttribute('data-text')] = t.value; }
  });
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target.getAttribute('data-form');
    if (f === 'kompis') { var v = ($('#onb-kompis').value || '').trim().slice(0, 16); if (!v) { toast('Skriv ett namn först.'); return; } S.namnPa = S.namnPa || {}; S.namnPa[S.figur] = v; spara(); ljud('ratt'); render(); setTimeout(function () { rorelse('hopp'); minSpel('jubel', 1300); }, 100); }
    if (f === 'namn') { var n = ($('#onb-namn').value || '').trim().slice(0, 20); if (!n) { toast('Skriv ditt namn först.'); return; } S.namn = n; spara(); ljud('ratt'); render(); setTimeout(function () { rorelse('hopp'); konfettiFran($('.kompis-knapp'), 50); }, 100); }
  });
  document.addEventListener('keydown', function (e) {
    if (inst && e.key === 'Escape') { sparaInst(); inst = false; render(); return; }
    if (vy === 'spel' && SPEL && SPEL.igang && SPEL.typ === 'hopp' && (e.key === ' ' || e.key === 'ArrowUp')) { hoppa(); e.preventDefault(); return; }
    if (vy !== 'pass' || !P) return;
    var t = e.target;
    if (t && t.tagName === 'INPUT') { if (e.key === 'Enter' && !P.klar) { e.preventDefault(); ratta(); } return; }
    if (P.klar && e.key === 'Enter') { e.preventDefault(); nasta(); return; }
    if (P.q.typ === 'svar') {
      if (/^[0-9]$/.test(e.key)) { skriv(e.key); e.preventDefault(); }
      else if (e.key === ',' || e.key === '.') { skriv(','); e.preventDefault(); }
      else if (e.key === '/') { skriv('/'); e.preventDefault(); }
      else if (e.key === 'Backspace') { skriv('del'); e.preventDefault(); }
      else if (e.key === 'Enter') { ratta(); e.preventDefault(); }
      else if (e.key === 'Tab' && P.q.falt.length > 1) { P.aktivt = (P.aktivt + 1) % P.q.falt.length; ritaInteraktion(); e.preventDefault(); }
    }
  });
  window.addEventListener('resize', function () { if (raf) storlek(); if (vy === 'spel' && SPEL) { storlekSpel(false); ritaSpel(); placeraFigur(); } });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && vy === 'spel' && SPEL && SPEL.igang && !SPEL.slut) {
      SPEL.pausad = true; SPEL.igang = false; cancelAnimationFrame(SPEL.raf);
      var o = $('#spel-overlay'); if (o) { o.innerHTML = '<div class="spel-ruta"><h2>Paus</h2><p>Spelet väntar på dig.</p><button class="knapp" data-act="spel-start">Fortsätt</button></div>'; o.hidden = false; }
    }
  });

  render();
})();
