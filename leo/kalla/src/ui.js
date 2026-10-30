/* ===== Lekgympan: appen (Leo, 5 år) =====
   Samma uppbyggnad som Läxgympan (vyer, stjärnor, rörelser, bonusspel) men utan läsning som krav:
   allt läses upp med talsyntes, svaren är stora bilder, och rätt svar gör att det går vidare av sig självt. */
(function () {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var app = $('#app');
  var RED = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };

  // ---------- Lagring (bara på den här plattan) ----------
  var NYCKEL = 'lekgympan.v1';
  function standard() { return { v: 1, namn: 'Leo', figur: '', namnPa: {}, skin: 'gron', ljud: true, rost: true, niva: 'auto', stjarnor: 0, pass: {}, nastaSpel: 'regn', dag: '', dagar: 0, svarade: 0 }; }
  var S = (function () {
    try { var raw = localStorage.getItem(NYCKEL); if (raw) return Object.assign(standard(), JSON.parse(raw)); } catch (e) { }
    return standard();
  })();
  function spara() { try { localStorage.setItem(NYCKEL, JSON.stringify(S)); } catch (e) { } }

  var RORELSER = [
    { id: 'hopp', namn: 'Hopp', kravs: 0 }, { id: 'piruett', namn: 'Piruett', kravs: 10 }, { id: 'hjula', namn: 'Hjula', kravs: 25 },
    { id: 'volt', namn: 'Volt', kravs: 45 }, { id: 'splitt', namn: 'Splitthopp', kravs: 70 }, { id: 'band', namn: 'Bollsnurr', kravs: 100 },
    { id: 'stjarnhopp', namn: 'Stjärnhopp', kravs: 140, tid: 1000 }, { id: 'bakvolt', namn: 'Bakåtvolt', kravs: 190, tid: 1200 },
    { id: 'handstand', namn: 'Handstående', kravs: 250, tid: 2100 }, { id: 'spagat', namn: 'Spagat', kravs: 320, tid: 1900 },
    { id: 'flickflack', namn: 'Flickflack', kravs: 400, tid: 2300 }, { id: 'dubbelvolt', namn: 'Dubbelvolt', kravs: 500, tid: 1500 },
    { id: 'skruv', namn: 'Skruvvolt', kravs: 620, tid: 1500 }
  ];
  function upplasta() { return RORELSER.filter(function (r) { return S.stjarnor >= r.kravs; }); }
  var POANG = { ratt: 2, ratt2: 1, miss: 0 };
  var BEROM = ['Rätt!', 'Snyggt!', 'Mål!', 'Grymt!', 'Japp, rätt!', 'Vilken stjärna!', 'Kanon!', 'Du kan det här!'];
  var PRAT = ['Vad vill du leka i dag?', 'Tryck på mig, så gör jag ett trick!', 'Ju fler stjärnor, desto fler trick lär jag mig.', 'Räkna högt, så blir det lättare!', 'Fel svar är bara träning!', 'Efter fyra frågor blir det ett spel!'];
  var ANTAL_FRAGOR = 8, SPEL_EFTER = 4;

  function kompisNamn() { var n = (S.namnPa || {})[S.figur]; return n || Gubbar.namn(figurId()); }
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function idag() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }

  // ---------- Ikoner ----------
  var IK = {
    stjarna: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.1l-5.7 3 1.1-6.3L2.8 9.3l6.4-.9z" fill="var(--guld)" stroke="color-mix(in srgb,var(--guld) 60%,#000)" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    kugge: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
    kryss: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    hogtalare: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" fill-opacity=".2"/><path d="M15.5 9a4 4 0 0 1 0 6M18.2 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    pil: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    bock: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    radera: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5h11v14H9l-6-7z"/><path d="M12.5 9.5l5 5M17.5 9.5l-5 5"/></svg>',
    sol: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="var(--guld)"/><g stroke="var(--guld)" stroke-width="2.2" stroke-linecap="round"><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></g></svg>'
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
      else if (typ === 'plopp') { ton(520, 0, 0.07, 'triangle', 0.12); ton(780, 0.05, 0.1, 'triangle', 0.1); }
      else if (typ === 'medalj') { [523, 659, 784, 1046].forEach(function (f, i) { ton(f, i * 0.11, 0.35, 'triangle', 0.14); }); ton(1318.5, 0.5, 0.6, 'triangle', 0.1); }
      else if (typ === 'boing') { var o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(900, t + 0.18); g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3); o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.32); }
    } catch (e) { }
  }

  // ---------- Röst (talsyntes på plattan, svenska) ----------
  var rostKo = 0;
  function rost() { return S.rost && 'speechSynthesis' in window; }
  function svenskRost() {
    try { var v = speechSynthesis.getVoices().filter(function (x) { return /^sv/i.test(x.lang); }); return v.filter(function (x) { return /google|natural|neural/i.test(x.name); })[0] || v[0] || null; } catch (e) { return null; }
  }
  function saga(text, fordrojning, langsamt) {
    if (!rost() || !text) return;
    clearTimeout(rostKo);
    rostKo = setTimeout(function () {
      try {
        speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'sv-SE'; u.rate = langsamt ? 0.75 : 0.92; u.pitch = 1.05;
        var v = svenskRost(); if (v) u.voice = v;
        speechSynthesis.speak(u);
      } catch (e) { }
    }, fordrojning || 0);
  }
  function tyst() { clearTimeout(rostKo); try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { } }
  if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () { speechSynthesis.getVoices(); }; } catch (e) { } }

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
  function figurId() { return S.figur || 'lejon'; }
  function kompisSVG(min, extra) { return Gubbar.figur(figurId(), min, { cls: 'huvudfigur' + (extra ? ' ' + extra : ''), label: esc(kompisNamn()) }); }
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

  // ---------- Former och bilder ----------
  function formSVG(id, farg, px) {
    var d = {
      cirkel: '<circle cx="50" cy="50" r="40"/>', kvadrat: '<rect x="12" y="12" width="76" height="76" rx="6"/>', triangel: '<path d="M50 10 L92 86 L8 86 Z"/>',
      rektangel: '<rect x="6" y="26" width="88" height="48" rx="5"/>', stjarna: '<path d="M50 6l12.4 26.6 29.2 3.4-21.6 20 5.8 28.8L50 70.6 24.2 84.8 30 56 8.4 36l29.2-3.4z"/>',
      hjarta: '<path d="M50 88S12 64 12 36c0-12 9-20 19-20 8 0 14 4 19 11 5-7 11-11 19-11 10 0 19 8 19 20 0 28-38 52-38 52z"/>',
      oval: '<ellipse cx="50" cy="50" rx="44" ry="28"/>', hexagon: '<path d="M30 10 L70 10 L92 50 L70 90 L30 90 L8 50 Z"/>'
    }[id] || d.cirkel;
    return '<svg class="form" viewBox="0 0 100 100"' + (px ? ' style="width:' + px + 'px;height:' + px + 'px"' : '') + ' aria-hidden="true"><g fill="' + farg + '" stroke="var(--kontur)" stroke-width="4" stroke-linejoin="round">' + d + '</g></svg>';
  }
  function emoji(e, cls) { return '<span class="emoji' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + e + '</span>'; }
  function sakerHTML(e, n, cls) { var s = ''; for (var i = 0; i < n; i++) s += emoji(e); return '<div class="saker n' + n + (cls ? ' ' + cls : '') + '">' + s + '</div>'; }
  function bildHTML(b) {
    if (!b) return '';
    if (b.typ === 'saker') return '<div class="bild">' + sakerHTML(b.e, b.n, 'stor') + '</div>';
    if (b.typ === 'plus') return '<div class="bild plus">' + sakerHTML(b.e, b.a) + '<span class="plustecken">+</span>' + sakerHTML(b.e, b.b) + '</div>';
    if (b.typ === 'bild') return '<div class="bild">' + emoji(b.e, 'jatte') + (b.text ? '<div class="ordet">' + esc(b.text) + '</div>' : '') + '</div>';
    if (b.typ === 'bokstav') return '<div class="bild"><div class="ordet jatte">' + esc(b.text) + '</div></div>';
    if (b.typ === 'ord') return '<div class="bild"><div class="ordet jatte">' + b.text.split('').map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</div></div>';
    if (b.typ === 'talrad') { var s = ''; for (var i = 1; i <= b.m; i++) s += '<span class="' + (i === b.n ? 'nu' : '') + '">' + i + '</span>'; return '<div class="bild"><div class="talrad">' + s + '</div></div>'; }
    if (b.typ === 'monster') return '<div class="bild"><div class="monster">' + b.rad.map(function (x) { return formSVG(x.form, x.farg, 52); }).join('') + '<span class="lucka-form">?</span></div></div>';
    return '';
  }
  function altHTML(a, i, extra) {
    var inre;
    if (a.form) inre = formSVG(a.form, a.farg);
    else if (a.bild) inre = sakerHTML(a.bild.e, a.bild.n);
    else if (a.e) inre = emoji(a.e, 'alt-emoji') + (a.text ? '<span class="alt-ord">' + esc(a.text) + '</span>' : '');
    else inre = '<span class="alt-text' + (a.ord ? ' ord' : '') + '">' + esc(a.text) + '</span>';
    var st = a.skala ? ' style="font-size:' + (a.skala * 34) + 'px"' : '';
    return '<button class="alt' + (a.stor ? ' stor' : '') + (a.bild ? ' grupp' : '') + (a.e ? ' med-emoji' : '') + (a.form ? ' formruta' : '') + (extra || '') + '" data-act="val" data-i="' + i + '" aria-label="' + esc(a.tal || a.text || '') + '"' + st + '>' + inre + '</button>';
  }

  // ---------- Vyer ----------
  var vy = 'hem', P = null, inst = false, nollstallFraga = false, nastaTimer = 0;
  function visa(ny) {
    if (vy === 'spel' && ny !== 'spel') stoppaSpel();
    clearTimeout(nastaTimer); tyst();
    vy = ny;
    render();
  }
  function render() {
    document.documentElement.setAttribute('data-skin', S.skin || 'gron');
    var html = vy === 'hem' ? vyHem() : vy === 'pass' ? vyPass() : vy === 'spel' ? vySpel() : vyKlar();
    app.innerHTML = html + (inst ? vyInst() : '');
    startaBlink();
    if (vy === 'pass') efterPass();
    if (vy === 'klar') efterKlar();
    if (vy === 'spel') efterSpel();
    if (vy === 'hem') setTimeout(function () { $$('.hang:not(.tom)').forEach(function (h, i) { setTimeout(function () { h.classList.add('dangla'); }, i * 90); }); }, 250);
  }

  function nivaFor(banaId) { if (S.niva !== 'auto') return +S.niva; var p = S.pass[banaId]; return p && p.niva ? p.niva : 1; }

  // ---------- Vy: Hem ----------
  function vyHem() {
    var medaljer = Object.keys(S.pass).map(function (k) { return { k: k, p: S.pass[k] }; }).filter(function (x) { return x.p.medalj; }).sort(function (a, b) { return (b.p.senast || 0) - (a.p.senast || 0); }).slice(0, 7);
    var rack = medaljer.length ? medaljer.map(function (x) {
      var b = Leo.bana(x.k);
      return '<button class="hang" data-act="medalj" aria-label="' + esc(METALL[x.p.medalj][2] + ': ' + (b ? b.titel : '')) + '">' + medaljSVG(x.p.medalj) + '</button>';
    }).join('') : [0, 1, 2].map(function () { return '<span class="hang tom" aria-hidden="true"><svg viewBox="0 0 60 100"><path d="M8 0 H26 L36 50 L22 54 Z M52 0 H34 L24 50 L38 54 Z" fill="none" stroke="var(--line)" stroke-width="2" stroke-dasharray="4 4"/><circle cx="30" cy="72" r="20" fill="none" stroke="var(--line)" stroke-width="3" stroke-dasharray="5 5"/></svg></span>'; }).join('');

    var bubbla = !S.figur ? '<div class="pratbubbla"><span>Hej! <strong>Vem vill du leka med?</strong> Tryck på en kompis.</span></div>'
      : '<div class="pratbubbla" id="prat">' + esc(PRAT[Math.floor(Math.random() * PRAT.length)]) + '</div>';
    var nasta = RORELSER.filter(function (r) { return S.stjarnor < r.kravs; })[0];
    var andra = S.figur ? ovriga() : [];
    var apor = andra.filter(function (g) { return g.apa; }), publik = andra.filter(function (g) { return !g.apa; });
    var apa = function (g, sida) { return '<button class="hangare ' + sida + '" data-act="gunga" aria-label="' + esc((S.namnPa || {})[g.id] || g.namn) + ' hänger i räcket">' + Gubbar.hangare(g.id) + '</button>'; };
    var pub = function (g) { return '<button class="publik-fig" data-act="publik" aria-label="' + esc((S.namnPa || {})[g.id] || g.namn) + '">' + Gubbar.figur(g.id, 'glad', { band: false, cls: 'publik-svg', label: esc(g.namn) }) + '</button>'; };
    var rorelser = RORELSER.map(function (r) { return S.stjarnor >= r.kravs ? '<button class="rorelse" data-act="rorelse" data-r="' + r.id + '">' + r.namn + '</button>' : '<span class="rorelse last">' + r.namn + ' · ' + r.kravs + '</span>'; }).join('');

    var kort = Leo.BANOR.map(function (b, i) {
      var p = S.pass[b.id], niva = nivaFor(b.id);
      return '<button class="laxkort bana" data-act="bana" data-b="' + b.id + '" style="animation-delay:' + (i * 0.05) + 's">' +
        '<span class="amnesruta">' + emoji(b.e) + '</span>' +
        '<span><h3>' + esc(b.titel) + '</h3><p>' + esc(b.under) + ' · nivå ' + niva + (p ? ' · ' + p.ggr + ' ' + (p.ggr === 1 ? 'gång' : 'gånger') : '') + '</p></span>' +
        (p && p.medalj ? '<span class="mini-medalj" aria-label="' + METALL[p.medalj][2] + '">' + medaljSVG(p.medalj) + '</span>' : '<span class="kor">' + IK.pil + '</span>') +
        '</button>';
    }).join('');
    var dag = S.dag === idag() ? '<span class="chip dag klar">' + IK.sol + 'Dagens stjärnor tagna!</span>' : '<span class="chip dag">' + IK.sol + 'Dagens stjärnor: klara en bana i dag = +5</span>';

    return '<div class="vy"><div class="inre">' +
      '<header class="topp"><div class="halsning"><h1>Hej <em>' + esc(S.namn || 'Leo') + '</em>!</h1><p>Dags att leka och lära.</p></div>' +
      '<button class="stjarnor" data-act="stjarnor" aria-label="' + S.stjarnor + ' stjärnor">' + IK.stjarna + '<span id="antal-stjarnor">' + S.stjarnor + '</span></button>' +
      '<button class="ikon-knapp" data-act="inst" aria-label="Inställningar">' + IK.kugge + '</button></header>' +
      '<div class="hem-grid">' +
        '<section class="scen" aria-label="Din kompis">' +
          '<div class="rack' + (apor.length ? ' med-apor' : '') + '">' + (apor[0] ? apa(apor[0], 'v') : '') + '<div class="rack-hangen">' + rack + '</div>' + (apor[1] ? apa(apor[1], 'h') : '') + (medaljer.length ? '' : '<p class="rack-text">Här hänger dina medaljer.</p>') + '</div>' +
          (S.figur ? '<div class="kompis-scen">' + bubbla + '<div class="scen-golv"><div class="publik v">' + publik.slice(0, 2).map(pub).join('') + '</div><button class="kompis-knapp" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG() + '</button><div class="publik h">' + publik.slice(2).map(pub).join('') + '</div></div><div class="matta"></div><div class="namnskylt">' + esc(kompisNamn()) + '</div></div>' :
            '<div class="kompis-scen">' + bubbla + figurVal('valj-figur') + '</div>') +
          '<div class="rorelser" aria-label="Trick">' + rorelser + '</div>' +
          '<p class="nasta-rorelse">' + (nasta ? (nasta.kravs - S.stjarnor) + ' stjärnor kvar till ' + nasta.namn + '.' : 'Alla trick är upplåsta!') + '</p>' +
        '</section>' +
        '<section class="laxor"><h2>Välj en bana</h2>' + dag + kort + '</section>' +
      '</div></div></div>';
  }

  // ---------- Pass ----------
  function startaPass(banaId) {
    var niva = nivaFor(banaId);
    P = { bana: banaId, niva: niva, titel: Leo.bana(banaId).titel, fragor: Leo.genPass(Math.random, banaId, niva, ANTAL_FRAGOR), i: 0, resultat: [], stjarnorIPass: 0, rorelserFore: upplasta().length };
    nyFraga();
    visa('pass');
  }
  function nyFraga() {
    var q = P.fragor[P.i];
    P.q = q; P.forsok = 0; P.klar = false; P.utfall = null; P.besked = null; P.visaRatt = false;
    P.valda = []; P.tryckta = []; P.ordning = [];
    if (q.typ === 'bygg') { var b; do { b = Leo.blanda(Math.random, Leo.range(q.items.length)); } while (q.items.length > 1 && b.every(function (v, i) { return v === i; })); P.blandning = b; }
  }
  function vyPass() {
    var q = P.q, n = P.fragor.length, andel = P.i / n;
    var prickar = P.fragor.map(function (_, i) { return '<i class="' + (P.resultat[i] || '') + '"></i>'; }).join('');
    var kompisHar = '<button class="liten-kompis" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG() + '</button>';
    return '<div class="vy"><div class="inre">' +
      '<header class="pass-topp"><button class="ikon-knapp" data-act="avbryt" aria-label="Avsluta">' + IK.kryss + '</button>' +
      '<div class="bom" aria-label="Fråga ' + (P.i + 1) + ' av ' + n + '"><div class="bom-yta"><div class="bom-fyll" style="width:' + (andel * 100).toFixed(1) + '%"></div></div><div class="bom-prickar">' + prickar + '</div><div class="bom-kompis" id="bom-kompis" style="left:' + (8 + andel * 84) + '%">' + Gubbar.huvud(figurId()) + '</div></div>' +
      '<span class="raknare">' + (P.i + 1) + '/' + n + '</span>' +
      '<span class="stjarnor liten" aria-label="' + S.stjarnor + ' stjärnor">' + IK.stjarna + '<span id="antal-stjarnor">' + S.stjarnor + '</span></span></header>' +
      '<div class="pass-grid"><article class="fraga-kort in" id="fraga" aria-live="polite">' +
        '<div class="fraga-meta"><span class="chip bana-chip">' + emoji(Leo.bana(P.bana).e) + esc(P.titel) + '</span>' + kompisHar + '<button class="ikon-knapp las" data-act="saga" aria-label="Läs upp frågan igen">' + IK.hogtalare + '</button></div>' +
        '<p class="fraga-text">' + esc(q.text) + '</p>' + (q.typ === 'tryck' ? '' : bildHTML(q.bild)) +
        '<div id="interaktion"></div><div class="aterkoppling" id="aterkoppling"></div><div class="knapp-rad" id="knapp-rad"></div>' +
      '</article>' +
      '<aside class="pass-kompis"><button class="kompis-knapp" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG() + '</button><div class="matta"></div></aside></div>' +
      '</div></div>';
  }
  function efterPass() { ritaInteraktion(); saga(P.q.tal || P.q.text, 350); }
  function ritaInteraktion() {
    var q = P.q, yta = $('#interaktion'), ak = $('#aterkoppling'), kr = $('#knapp-rad'); if (!yta) return;
    if (q.typ === 'val') {
      yta.innerHTML = '<div class="alternativ' + (q.alt.length === 4 ? ' fyra' : '') + (q.bred ? ' bred' : '') + '">' + q.alt.map(function (a, i) {
        var cls = '';
        if (i === q.ratt && (P.utfall === 'ratt' || P.utfall === 'ratt2' || P.visaRatt)) cls = ' ratt';
        else if (P.valda.indexOf(i) >= 0) cls = ' fel';
        return altHTML(a, i, cls + (P.klar || P.valda.indexOf(i) >= 0 ? ' las' : ''));
      }).join('') + '</div>';
    } else if (q.typ === 'tryck') {
      var s = '';
      for (var i = 0; i < q.bild.n; i++) s += '<button class="sak' + (P.tryckta.indexOf(i) >= 0 ? ' vald' : '') + '" data-act="tryck-sak" data-i="' + i + '"' + (P.klar ? ' disabled' : '') + ' aria-label="' + (P.tryckta.indexOf(i) >= 0 ? 'vald' : 'inte vald') + '">' + emoji(q.e) + '</button>';
      yta.innerHTML = '<div class="tryckyta"><div class="saker tryck n' + q.bild.n + '">' + s + '</div><div class="tryck-rad"><span class="raknad" id="raknad">' + P.tryckta.length + '</span>' + (P.klar ? '' : '<button class="knapp klar-knapp" data-act="tryck-klar" aria-label="Klar">' + IK.bock + '</button>') + '</div></div>';
    } else if (q.typ === 'bygg') {
      var platser = q.items.map(function (_, pos) { var it = P.ordning[pos]; var vis = P.visaRatt ? q.items[pos] : (it === undefined ? null : q.items[it]); return vis === null ? '<span class="plats" aria-label="Tom plats"></span>' : '<button class="plats fylld' + (P.visaRatt ? ' ratt' : '') + '" data-act="bygg-bort" data-pos="' + pos + '"' + (P.klar ? ' disabled' : '') + '>' + esc(vis.text) + '</button>'; }).join('');
      var pool = P.visaRatt ? '' : P.blandning.filter(function (i) { return P.ordning.indexOf(i) < 0; }).map(function (i) { return '<button class="bricka" data-act="bygg-ta" data-i="' + i + '"' + (P.klar ? ' disabled' : '') + '>' + esc(q.items[i].text) + '</button>'; }).join('');
      yta.innerHTML = '<div class="ordna' + (q.stor ? ' stor' : '') + '"><div class="ordna-rad">' + platser + '</div><div class="ordna-pool">' + pool + '</div></div>';
    }
    var b = P.besked, h = '';
    if (b) h = '<div class="besked ' + b.typ + '">' + (b.typ === 'ratt' ? '<span class="emoji" aria-hidden="true">🎉</span><strong>' + esc(b.text) + '</strong>' : '<span class="emoji" aria-hidden="true">' + (b.typ === 'fel' ? '🤔' : '💪') + '</span><span>' + esc(b.text) + '</span>') + (b.plus ? '<span class="plus">+' + b.plus + IK.stjarna + '</span>' : '') + '</div>';
    ak.innerHTML = h;
    kr.innerHTML = P.klar ? '<button class="knapp nasta" data-act="nasta" aria-label="' + (P.i + 1 < P.fragor.length ? 'Nästa' : 'Klar') + '">' + (P.i + 1 < P.fragor.length ? 'Nästa' : 'Klar!') + IK.pil + '</button>' : '';
  }
  function skaka() { var f = $('#fraga'); if (!f) return; f.classList.remove('in', 'skaka'); void f.offsetWidth; f.classList.add('skaka'); }
  function laggTillStjarnor(n) { if (!n) return; S.stjarnor += n; P.stjarnorIPass += n; spara(); var el = $('#antal-stjarnor'); if (el) el.textContent = S.stjarnor; }
  function planeraNasta(ms) { clearTimeout(nastaTimer); nastaTimer = setTimeout(function () { if (vy === 'pass' && P && P.klar) nasta(); }, ms); }

  function lyckat(elFran) {
    var fran = rekt(elFran), p = P.forsok === 0 ? 2 : 1;
    P.klar = true; P.utfall = p === 2 ? 'ratt' : 'ratt2'; P.resultat[P.i] = P.utfall; S.svarade++;
    laggTillStjarnor(p);
    var txt = BEROM[Math.floor(Math.random() * BEROM.length)];
    P.besked = { typ: 'ratt', text: txt, plus: p };
    ljud('ratt'); ritaInteraktion();
    konfettiFran(fran || $('.besked.ratt'), p === 2 ? 70 : 40);
    minSpel('jubel', 1400); rorelse(slumpRorelse());
    saga(txt + (P.q.lasa ? ' Det står ' + P.q.lasa.toLowerCase() + '.' : ''), 150);
    planeraNasta(2200);
  }
  function misslyckat(sagt) {
    P.forsok++;
    if (P.forsok === 1) {
      P.besked = { typ: 'fel', text: 'Försök igen!' };
      ljud('fel'); minSpel('hmm', 1500); rorelse('hmm'); skaka();
      saga((sagt ? sagt + '. ' : '') + 'Nej, inte den. Försök igen!', 100);
    } else {
      P.klar = true; P.utfall = 'miss'; P.resultat[P.i] = 'miss'; P.visaRatt = true; S.svarade++; spara();
      P.besked = { typ: 'info', text: 'Bra kämpat! Så här var det.' };
      ljud('fel');
      var q = P.q, facit = q.typ === 'val' ? (q.alt[q.ratt].tal || q.alt[q.ratt].text) : q.typ === 'tryck' ? Leo.sifferord(q.mal) : q.items.map(function (x) { return x.tal; }).join(', ');
      saga('Bra kämpat! Rätt svar var ' + facit + '.', 100);
      planeraNasta(3200);
    }
    ritaInteraktion();
  }
  function nasta() {
    clearTimeout(nastaTimer); tyst();
    if (P.i + 1 >= P.fragor.length) return avsluta();
    var gjorda = P.i + 1;
    P.i++; nyFraga();
    if (gjorda === SPEL_EFTER) { P.mittSpel = true; visa('spel'); return; }
    render();
  }
  function avsluta() {
    var poang = P.resultat.reduce(function (s, u) { return s + (POANG[u] || 0); }, 0), max = P.fragor.length * 2, andel = max ? poang / max : 0;
    var medalj = andel >= 0.9 ? 'guld' : andel >= 0.65 ? 'silver' : 'brons', rank = { brons: 1, silver: 2, guld: 3 };
    var prev = S.pass[P.bana] || {}, niva = P.niva;
    var nyNiva = medalj === 'guld' ? Math.min(3, niva + 1) : medalj === 'brons' ? Math.max(1, niva - 1) : niva;
    S.pass[P.bana] = { medalj: !prev.medalj || rank[medalj] > rank[prev.medalj] ? medalj : prev.medalj, bast: Math.max(andel, prev.bast || 0), senast: Date.now(), ggr: (prev.ggr || 0) + 1, niva: nyNiva };
    var dagbonus = 0;
    if (S.dag !== idag()) { S.dag = idag(); S.dagar = (S.dagar || 0) + 1; dagbonus = 5; S.stjarnor += 5; P.stjarnorIPass += 5; }
    spara();
    var u = upplasta();
    P.slut = { poang: poang, max: max, andel: andel, medalj: medalj, ratt: P.resultat.filter(function (x) { return x === 'ratt'; }).length, nya: u.slice(P.rorelserFore), dagbonus: dagbonus, nyNiva: nyNiva > niva };
    visa('klar');
  }

  // ---------- Vy: Klar ----------
  function vyKlar() {
    var s = P.slut, domare = ovriga().slice(0, 3), bas = 5 + s.andel * 5;
    var dom = [0, 1, 2].map(function (i) { var d = s.andel === 1 ? 10 : Math.max(0, Math.min(10, bas + (Math.random() * 0.3 - 0.15))), g = domare[i]; return '<div class="domare-plats">' + (g ? '<span class="domare-fig">' + Gubbar.figur(g.id, 'jubel', { band: false, cls: 'domar-svg', label: esc(g.namn) }) + '</span>' : '') + '<div class="tavla-domare"><span>' + esc(g ? ((S.namnPa || {})[g.id] || g.namn) : 'Domare') + '</span><b>' + String(Math.round(d * 10) / 10).replace('.', ',') + '</b></div></div>'; }).join('');
    var rubrik = { guld: 'Guld!', silver: 'Silver!', brons: 'Brons!' }[s.medalj];
    var under = { guld: 'Du kan det här! Nästa gång blir det lite klurigare.', silver: 'Snyggt jobbat! Nästan hela vägen.', brons: 'Bra kämpat! Kör igen, så blir det ännu bättre.' }[s.medalj];
    var ny = s.nya.length ? '<div class="ny-rorelse">' + esc(kompisNamn()) + ' har lärt sig ett nytt trick: <strong>' + esc(s.nya[s.nya.length - 1].namn) + '</strong>! Tryck på ' + esc(kompisNamn()) + ' för att se det.</div>' : '';
    return '<div class="vy"><div class="inre klar">' +
      '<button class="klar-medalj" data-act="medalj" aria-label="' + METALL[s.medalj][2] + '">' + medaljSVG(s.medalj, true) + '</button>' +
      '<h1>' + rubrik + '</h1><p class="under">' + esc(P.titel) + ' är klar. ' + esc(under) + '</p>' +
      '<div class="domare" aria-label="Domarnas poäng">' + dom + '</div>' +
      '<div class="klar-stats"><span>' + IK.stjarna + '+' + P.stjarnorIPass + ' stjärnor</span><span>' + s.ratt + ' av ' + P.fragor.length + ' rätt direkt</span>' + (s.dagbonus ? '<span>' + IK.sol + 'Dagens stjärnor +' + s.dagbonus + '</span>' : '') + '</div>' + ny +
      '<button class="kompis-knapp" data-act="kompis" aria-label="Tryck på ' + esc(kompisNamn()) + '">' + kompisSVG('jubel') + '</button>' +
      (P.spelat ? '' : '<button class="knapp spel-knapp" data-act="spel-slut">' + IK.stjarna + 'Bonusspel: ' + SPELNAMN[spelTyp()] + '</button>') +
      '<div class="klar-knappar"><button class="knapp sek" data-act="hem">Till start</button><button class="knapp sek" data-act="kor-igen">Kör igen</button></div>' +
      '</div></div>';
  }
  function efterKlar() {
    ljud('medalj');
    var s = P.slut;
    saga({ guld: 'Guld! Vilken stjärna du är!', silver: 'Silver! Snyggt jobbat!', brons: 'Brons! Bra kämpat!' }[s.medalj] + ' Du fick ' + P.stjarnorIPass + ' stjärnor.' + (s.nya.length ? ' ' + kompisNamn() + ' har lärt sig ett nytt trick!' : ''), 900);
    setTimeout(function () { konfetti(innerWidth * 0.25, innerHeight * 0.3, 60, 120); konfetti(innerWidth * 0.75, innerHeight * 0.3, 60, 120); }, 600);
    setTimeout(function () { rorelse(s.nya.length ? s.nya[s.nya.length - 1].id : slumpRorelse()); }, 1500);
  }

  /*SPEL*/

  // ---------- Vy: Inställningar (för en vuxen) ----------
  function vyInst() {
    return '<div class="overlay" data-act="inst-bakgrund"><div class="panel" role="dialog" aria-modal="true" aria-labelledby="inst-rubrik">' +
      '<h2 id="inst-rubrik">Inställningar</h2>' +
      '<label for="s-namn">Barnets namn<input id="s-namn" type="text" maxlength="20" value="' + esc(S.namn) + '" autocomplete="off"></label>' +
      '<div><p style="font-weight:600;margin-bottom:8px">Kompis</p>' + figurVal('byt-figur') + '</div>' +
      '<label for="s-kompis">Kompisens namn<input id="s-kompis" type="text" maxlength="16" value="' + esc((S.namnPa || {})[S.figur] || '') + '" placeholder="' + esc(Gubbar.namn(figurId())) + '" autocomplete="off"></label>' +
      '<div><p style="font-weight:600;margin-bottom:8px">Svårighet<small style="font-weight:400;color:var(--muted)"> – Auto: guld ger nästa nivå, brons går ner ett steg</small></p><div class="teman">' + [['auto', 'Auto'], ['1', 'Nivå 1 (1–5)'], ['2', 'Nivå 2 (1–10)'], ['3', 'Nivå 3 (1–20)']].map(function (t) { return '<button class="tema" data-act="niva" data-n="' + t[0] + '" aria-pressed="' + (String(S.niva) === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div></div>' +
      '<div><p style="font-weight:600;margin-bottom:8px">Färger</p><div class="teman">' + [['gron', 'Grön plan'], ['bla', 'Blå is'], ['rod', 'Röd och gul']].map(function (t) { return '<button class="tema ' + t[0] + '" data-act="skin" data-s="' + t[0] + '" aria-pressed="' + (S.skin === t[0]) + '"><i></i>' + t[1] + '</button>'; }).join('') + '</div></div>' +
      '<div class="vaxel"><span>Ljudeffekter</span><button data-act="vaxla" data-k="ljud" aria-pressed="' + !!S.ljud + '" aria-label="Ljudeffekter"></button></div>' +
      '<div class="vaxel"><span>Uppläst röst<small style="display:block;font-weight:400;color:var(--muted)">' + ('speechSynthesis' in window ? (svenskRost() ? 'Svensk röst: ' + esc(svenskRost().name) : 'Ingen svensk röst hittad – lägg till svenska under Inställningar → Text-till-tal på plattan') : 'Plattan saknar talsyntes') + '</small></span><button data-act="vaxla" data-k="rost" aria-pressed="' + !!S.rost + '" aria-label="Uppläst röst"></button></div>' +
      '<p style="color:var(--muted);font-size:15px">' + S.svarade + ' frågor besvarade totalt. ' + (S.dagar || 0) + ' ' + (S.dagar === 1 ? 'dag' : 'dagar') + ' med dagens stjärnor.</p>' +
      '<div class="farozon">' + (nollstallFraga ? '<p><b>Är du säker?</b> Alla stjärnor, medaljer och trick försvinner.</p><div class="rad"><button class="knapp" data-act="nollstall-ja">Ja, börja om</button><button class="knapp sek" data-act="nollstall-nej">Nej</button></div>' : '<p>Vill du börja om från noll? Stjärnor och medaljer nollställs.</p><div class="rad"><button class="knapp sek" data-act="nollstall">Börja om från noll</button></div>') + '</div>' +
      '<button class="knapp" data-act="inst-stang">Klar</button></div></div>';
  }
  function sparaInst() {
    var a = $('#s-namn'), b = $('#s-kompis');
    if (a) S.namn = a.value.trim().slice(0, 20) || 'Leo';
    if (b && S.figur) { S.namnPa = S.namnPa || {}; S.namnPa[S.figur] = b.value.trim().slice(0, 16); }
    spara();
  }

  // ---------- Händelser ----------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]'); if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'inst-bakgrund' && e.target !== el) return;
    switch (act) {
      case 'bana': ljud('tap'); tyst(); startaPass(el.getAttribute('data-b')); break;
      case 'hem': ljud('tap'); visa('hem'); break;
      case 'avbryt': ljud('tap'); visa('hem'); break;
      case 'kor-igen': startaPass(P.bana); break;
      case 'saga': ljud('tap'); saga(P.q.tal || P.q.text, 0, true); break;
      case 'spel-start': ljud('tap'); tyst(); spelStart(); break;
      case 'spel-slut': ljud('tap'); if (P) P.mittSpel = false; visa('spel'); break;
      case 'spel-avsluta': { var mitt = SPEL && SPEL.mitt; if (SPEL && SPEL.startad && !SPEL.slut) { S.stjarnor += SPEL.stj; spara(); } visa(mitt ? 'pass' : 'hem'); break; }
      case 'spel-tillbaka': ljud('tap'); visa('pass'); break;
      case 'kompis': rorelse(slumpRorelse()); minSpel('jubel', 1200); { var pr = $('#prat'); if (pr) { var t = PRAT[Math.floor(Math.random() * PRAT.length)]; pr.textContent = t; saga(t); } } break;
      case 'rorelse': rorelse(el.getAttribute('data-r')); minSpel('jubel', 1200); saga(el.textContent); break;
      case 'medalj': ljud('tap'); el.classList.remove('dangla'); void el.offsetWidth; el.classList.add('dangla'); break;
      case 'stjarnor': ljud('boing'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); konfettiFran(el, 24); saga('Du har ' + S.stjarnor + ' stjärnor!'); break;
      case 'valj-figur': S.figur = el.getAttribute('data-f'); spara(); ljud('ratt'); render(); saga('Hej! Jag heter ' + kompisNamn() + '. Vad vill du leka i dag?', 200); setTimeout(function () { rorelse('hopp'); minSpel('jubel', 1300); }, 100); break;
      case 'byt-figur': sparaInst(); S.figur = el.getAttribute('data-f'); spara(); ljud('tap'); render(); break;
      case 'gunga': ljud('boing'); el.classList.remove('gungar'); void el.offsetWidth; el.classList.add('gungar'); break;
      case 'publik': { var sv = $('svg', el); ljud('boing'); rorelse(Math.random() < 0.5 ? 'hopp' : 'tap', sv); sv.setAttribute('data-min', 'jubel'); setTimeout(function () { sv.setAttribute('data-min', 'glad'); }, 1200); break; }
      case 'inst': inst = true; nollstallFraga = false; render(); break;
      case 'inst-bakgrund': case 'inst-stang': sparaInst(); inst = false; render(); break;
      case 'skin': sparaInst(); S.skin = el.getAttribute('data-s'); spara(); render(); break;
      case 'niva': sparaInst(); S.niva = el.getAttribute('data-n') === 'auto' ? 'auto' : +el.getAttribute('data-n'); spara(); render(); break;
      case 'vaxla': sparaInst(); { var k = el.getAttribute('data-k'); S[k] = !S[k]; spara(); render(); if (k === 'rost' && S.rost) saga('Hej ' + S.namn + '!'); } break;
      case 'nollstall': sparaInst(); nollstallFraga = true; render(); break;
      case 'nollstall-nej': nollstallFraga = false; render(); break;
      case 'nollstall-ja': { var beh = { namn: S.namn, figur: S.figur, namnPa: S.namnPa, skin: S.skin, ljud: S.ljud, rost: S.rost }; S = Object.assign(standard(), beh); spara(); nollstallFraga = false; inst = false; toast('Klart! Allt är nollställt.'); render(); break; }
      // Frågor
      case 'val': {
        var i = +el.getAttribute('data-i'); if (!P || P.klar || P.valda.indexOf(i) >= 0) return;
        if (i === P.q.ratt) lyckat(el);
        else { P.valda.push(i); if (P.q.alt.length - P.valda.length <= 1) P.forsok = Math.max(P.forsok, 1); misslyckat(P.q.alt[i].tal); }
        break;
      }
      case 'tryck-sak': {
        var si = +el.getAttribute('data-i'); if (!P || P.klar) return;
        var ix = P.tryckta.indexOf(si);
        if (ix >= 0) P.tryckta.splice(ix, 1); else P.tryckta.push(si);
        ljud('plopp'); el.classList.toggle('vald', ix < 0); el.setAttribute('aria-label', ix < 0 ? 'vald' : 'inte vald');
        var r = $('#raknad'); if (r) { r.textContent = P.tryckta.length; r.classList.remove('pop'); void r.offsetWidth; r.classList.add('pop'); }
        if (ix < 0) saga(Leo.sifferord(P.tryckta.length));
        break;
      }
      case 'tryck-klar': {
        if (!P || P.klar) return;
        if (P.tryckta.length === P.q.mal) lyckat(el);
        else {
          if (P.forsok === 0) { P.forsok = 1; P.besked = { typ: 'fel', text: 'Du tryckte på ' + P.tryckta.length + '. Räkna en gång till!' }; ljud('fel'); minSpel('hmm', 1500); rorelse('hmm'); skaka(); saga('Du tryckte på ' + Leo.sifferord(P.tryckta.length) + '. Det skulle vara ' + Leo.sifferord(P.q.mal) + '. Räkna en gång till!', 100); P.tryckta = []; ritaInteraktion(); }
          else { P.forsok = 1; P.tryckta = Leo.range(P.q.mal); misslyckat(); }
        }
        break;
      }
      case 'bygg-ta': {
        if (!P || P.klar) return;
        P.ordning.push(+el.getAttribute('data-i')); ljud('tap'); saga(P.q.items[+el.getAttribute('data-i')].tal); ritaInteraktion();
        if (P.ordning.length === P.q.items.length) {
          var ok = P.ordning.every(function (v, j) { return P.q.items[v].text === P.q.items[j].text; });
          if (ok) lyckat($('.ordna-rad')); else { var f = P.forsok; P.ordning = []; if (f === 0) misslyckat(); else { P.forsok = 1; misslyckat(); } }
        }
        break;
      }
      case 'bygg-bort': if (P && !P.klar) { P.ordning.splice(+el.getAttribute('data-pos'), 1); ljud('tap'); ritaInteraktion(); } break;
      case 'nasta': ljud('tap'); nasta(); break;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (inst && e.key === 'Escape') { sparaInst(); inst = false; render(); return; }
    if (vy === 'spel' && SPEL && SPEL.igang && SPEL.typ === 'hopp' && (e.key === ' ' || e.key === 'ArrowUp')) { hoppa(); e.preventDefault(); return; }
    if (vy === 'pass' && P && P.klar && e.key === 'Enter') { e.preventDefault(); nasta(); }
  });
  window.addEventListener('resize', function () { if (raf) storlek(); if (vy === 'spel' && SPEL) { storlekSpel(false); ritaSpel(); placeraFigur(); } });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) tyst();
    if (document.hidden && vy === 'spel' && SPEL && SPEL.igang && !SPEL.slut) {
      SPEL.pausad = true; SPEL.igang = false; cancelAnimationFrame(SPEL.raf);
      var o = $('#spel-overlay'); if (o) { o.innerHTML = '<div class="spel-ruta"><h2>Paus</h2><p>Spelet väntar på dig.</p><button class="knapp" data-act="spel-start">Fortsätt</button></div>'; o.hidden = false; }
    }
  });
  // För testerna: läs det aktuella passet
  window.__lek = {
    P: function () { return P; }, S: function () { return S; },
    // Visar en viss frågetyp direkt (används av färggranskningen)
    fraga: function (gen, niva) { if (!P) startaPass('mix'); P.fragor[P.i] = Object.assign(Leo.G[gen](Math.random, niva || 2), { gen: gen }); nyFraga(); vy = 'pass'; render(); }
  };

  render();
})();
