/* ===== Läxgympan: logik (ren och testbar, inga DOM-anrop) ===== */
var Lx = (function () {
  'use strict';

  // ---------- Slump ----------
  function slump(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function heltal(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function valj(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function blanda(r, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function sgd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }

  // ---------- Ord ----------
  var TALORD = ['noll', 'en', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv', 'tretton', 'fjorton', 'femton', 'sexton', 'sjutton', 'arton', 'nitton', 'tjugo'];
  var DELNAMN = { 2: 'halv', 3: 'tredjedel', 4: 'fjärdedel', 5: 'femtedel', 6: 'sjättedel', 7: 'sjundedel', 8: 'åttondel', 9: 'niondel', 10: 'tiondel', 11: 'elftedel', 12: 'tolftedel', 20: 'tjugondel', 100: 'hundradel', 1000: 'tusendel' };
  function brakOrd(n, d) {
    var ns = String(n).trim(), ds = String(d).trim();
    var N = parseInt(ns, 10), D = parseInt(ds, 10);
    if (String(N) !== ns || String(D) !== ds || !DELNAMN[D]) return ns + ' delat med ' + ds;
    var namn = DELNAMN[D];
    if (N === 1) return D === 2 ? 'en halv' : 'en ' + namn;
    var tal = TALORD[N] || String(N);
    return tal + ' ' + (D === 2 ? 'halvor' : namn + 'ar');
  }
  function talbart(s) {
    return String(s || '')
      .replace(/\{([^{}\/]+)\/([^{}]+)\}/g, function (m, a, b) { return ' ' + brakOrd(a, b) + ' '; })
      .replace(/·/g, ' gånger ').replace(/−/g, ' minus ').replace(/=/g, ' är lika med ')
      .replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
  }
  function gen(namn) { return /[sxz]$/i.test(namn) ? namn : namn + 's'; }

  // ---------- Format ----------
  function fmt(x) {
    var v = Math.round(x * 1e6) / 1e6;
    if (v === 0) v = 0;
    var s = String(Math.abs(v));
    if (s.indexOf('e') >= 0) s = Math.abs(v).toFixed(6).replace(/\.?0+$/, '');
    var delar = s.split('.'), h = delar[0], d = delar[1];
    if (h.length > 4) h = h.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (v < 0 ? '−' : '') + h + (d ? ',' + d : '');
  }
  function fmtN(x, n) { return x.toFixed(n).replace('.', ','); }
  function br(n, d) { return '{' + n + '/' + d + '}'; }

  // ---------- Tolka svar ----------
  function parseTal(s) {
    if (s === null || s === undefined) return null;
    var t = String(s).toLowerCase().replace(/[\s ]+/g, '').replace(/[−–—]/g, '-');
    t = t.replace(/(kronor|kr|öre|kg|cm²|m²|cm|mm|dl|ml|min|m|g|l|h|st|år|poäng|grader|°c|°|%)$/, '');
    t = t.replace(',', '.');
    if (!/^-?(\d+(\.\d*)?|\.\d+)$/.test(t)) return null;
    return parseFloat(t);
  }
  function parseBrak(s) {
    if (s === null || s === undefined) return null;
    var t = String(s).replace(/[\s ]+/g, '');
    var m = t.match(/^(-?\d+)\/(\d+)$/);
    if (!m) return null;
    var n = parseInt(m[1], 10), d = parseInt(m[2], 10);
    if (d === 0) return null;
    return { n: n, d: d };
  }
  function normText(s) {
    return String(s || '').toLowerCase().replace(/[.,!?;:"'()]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[m][n];
  }

  // ---------- Rätta ----------
  function kollaFalt(f, inp) {
    var raw = (inp === null || inp === undefined ? '' : String(inp)).trim();
    if (!raw) return { ok: false, format: true, msg: 'Skriv ett svar i alla rutor först.' };
    if (f.typ === 'brak') {
      var b = parseBrak(raw);
      if (!b) return { ok: false, format: true, msg: 'Svara i bråkform, till exempel 3/4. Tryck på knappen med snedstrecket.' };
      var r = parseBrak(f.svar);
      if (b.n * r.d !== r.n * b.d) return { ok: false };
      var g = sgd(b.n, b.d);
      if (b.n !== r.n || b.d !== r.d) return { ok: true, note: br(b.n, b.d) + ' är samma sak som ' + br(r.n, r.d) + '.' };
      if (g > 1) return { ok: true, note: 'Det kan också skrivas ' + br(b.n / g, b.d / g) + '.' };
      return { ok: true };
    }
    if (f.typ === 'text') {
      var n = normText(raw);
      var godta = [f.svar].concat(f.godta || []).map(normText);
      if (godta.indexOf(n) >= 0) return { ok: true };
      for (var i = 0; i < godta.length; i++) {
        var tol = godta[i].length >= 9 ? 2 : godta[i].length >= 5 ? 1 : 0;
        if (tol && lev(n, godta[i]) <= tol) return { ok: true, note: 'Det stavas: ' + f.svar + '.' };
      }
      return { ok: false };
    }
    var v = parseTal(raw);
    if (v === null) {
      if (parseBrak(raw)) return { ok: false, format: true, msg: 'Svara med ett tal i decimalform, till exempel 0,25.' };
      return { ok: false, format: true, msg: 'Svara med ett tal, till exempel 12 eller 0,5.' };
    }
    return { ok: Math.abs(v - parseTal(f.svar)) < 1e-9 };
  }

  function kolla(q, svar) {
    if (q.typ === 'val') return { ok: svar === q.ratt };
    if (q.typ === 'ordna') {
      var okO = Array.isArray(svar) && svar.length === q.items.length && svar.every(function (v, i) { return v === i; });
      if (Array.isArray(svar) && svar.length < q.items.length) return { ok: false, format: true, msg: 'Lägg alla talen i rad först.' };
      return { ok: okO };
    }
    if (q.typ === 'pil') {
      var sum = svar.reduce(function (a, b) { return a + b; }, 0);
      if (svar.length !== q.pilar) return { ok: false, format: true, msg: 'Kasta ' + q.pilar + ' pilar först. Du har kastat ' + svar.length + '.' };
      return { ok: sum === q.mal, sum: sum };
    }
    if (q.typ === 'svar') {
      var res = q.falt.map(function (f, i) { return kollaFalt(f, svar[i]); });
      var form = null;
      for (var k = 0; k < res.length; k++) if (res[k].format) { form = res[k]; break; }
      if (form) return { ok: false, format: true, msg: form.msg, falt: res };
      return { ok: res.every(function (x) { return x.ok; }), falt: res, note: res.map(function (x) { return x.note; }).filter(Boolean).join(' ') };
    }
    return { ok: false };
  }

  function facitFalt(f) {
    if (f.typ === 'brak') { var p = f.svar.split('/'); return br(p[0], p[1]); }
    if (f.typ === 'text') return f.svar;
    return fmt(parseTal(f.svar)) + (f.enhet ? ' ' + f.enhet : '');
  }
  function facit(q) {
    if (q.typ === 'val') return q.alt[q.ratt];
    if (q.typ === 'ordna') return q.items.join(',  ');
    if (q.typ === 'svar') {
      return q.falt.map(function (f) {
        var e = f.etikett || '';
        if (!e) return facitFalt(f);
        return /=\s*$/.test(e) ? e + ' ' + facitFalt(f) : e + ': ' + facitFalt(f);
      }).join('   ');
    }
    return '';
  }

  // ---------- Namn i textuppgifter ----------
  var NAMN = ['Saga', 'Elsa', 'Maja', 'Alva', 'Noah', 'Ella', 'Vera', 'Liam', 'Ines', 'Milo', 'Wilma', 'Hugo'];
  function namnen(r, c, k) {
    var egna = blanda(r, (c && c.lista) || []);
    var ovriga = blanda(r, NAMN).filter(function (n) { return egna.indexOf(n) < 0; });
    return egna.concat(ovriga).slice(0, k);
  }

  // ---------- Generatorer: liknande frågor ----------
  var G = {};

  G.jamfor = function (r) {
    var typ = heltal(r, 0, 2), A, B, a, b, steg, ledtrad, t, h;
    if (typ === 0 || typ === 2) {
      t = heltal(r, 2, 9); h = heltal(r, 11, t * 10 - 1); if (h % 10 === 0) h += 1;
      a = t * 10; b = h;
      if (typ === 0) {
        A = fmt(t / 10); B = fmt(h / 100);
        ledtrad = 'Lägg till en nolla så att båda talen får två decimaler. Jämför sedan.';
        steg = ['Skriv talen med två decimaler: ' + fmtN(t / 10, 2) + ' och ' + fmtN(h / 100, 2) + '.', (t * 10) + ' hundradelar är mer än ' + h + ' hundradelar.', 'Störst är ' + A + '.'];
      } else {
        A = br(t, 10); B = br(h, 100);
        ledtrad = 'Skriv ' + A + ' som hundradelar.';
        steg = [A + ' = ' + br(t * 10, 100), (t * 10) + ' hundradelar är mer än ' + h + ' hundradelar.', 'Störst är ' + A + '.'];
      }
    } else {
      var nd = valj(r, [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [9, 10]]);
      var fh = nd[0] * (100 / nd[1]);
      do { h = fh + valj(r, [-1, 1]) * heltal(r, 3, 15); } while (h <= 0 || h >= 100);
      a = fh; b = h; A = br(nd[0], nd[1]); B = fmt(h / 100);
      ledtrad = 'Gör om ' + A + ' till decimalform först. Förläng så att det står 100 under strecket.';
      steg = [A + ' = ' + br(fh, 100) + ' = ' + fmtN(fh / 100, 2), 'Jämför ' + fmtN(fh / 100, 2) + ' och ' + fmtN(h / 100, 2) + '.', 'Störst är ' + (fh > h ? A : B) + '.'];
    }
    var alt = r() < 0.5 ? [B, A] : [A, B];
    var storst = a > b ? A : B;
    return { typ: 'val', text: 'Vilket tal är störst?', alt: alt, ratt: alt.indexOf(storst), fast: true, ledtrad: ledtrad, losning: steg };
  };

  G.figur = function (r) {
    var n, k, figur;
    if (r() < 0.65) {
      var rader, kol;
      do { rader = heltal(r, 1, 3); kol = heltal(r, 2, 5); } while (rader * kol < 3);
      n = rader * kol; k = heltal(r, 1, n - 1);
      figur = { form: 'rutor', rader: rader, kol: kol, fargade: blanda(r, range(n)).slice(0, k) };
    } else {
      n = valj(r, [2, 3, 4, 5, 6, 8]); k = heltal(r, 1, n - 1);
      figur = { form: 'cirkel', delar: n, fargade: range(k) };
    }
    var dec = 100 % n === 0;
    var falt = [{ etikett: 'Bråkform', typ: 'brak', svar: k + '/' + n }];
    if (dec) falt.push({ etikett: 'Decimalform', typ: 'tal', svar: fmt(k / n) });
    var losning = ['Räkna alla lika stora delar: ' + n + '. Det blir nämnaren, talet under strecket.', 'Räkna de färgade delarna: ' + k + '. Det blir täljaren, talet över strecket.', 'Andelen är ' + br(k, n) + '.'];
    if (dec) losning.push(br(k, n) + ' = ' + br(k * 100 / n, 100) + ' = ' + fmt(k / n));
    return { typ: 'svar', text: 'Hur stor andel av figuren är färgad? Svara i bråkform' + (dec ? ' och decimalform.' : '.'), figur: figur, falt: falt, ledtrad: 'Hur många lika stora delar finns det totalt? Hur många av dem är färgade?', losning: losning };
  };

  G.brak_dec = function (r) {
    var val = valj(r, ['14', '14', '34', '12', '15', '25', '35', '45', 't', 't', 'h', 'h']);
    var n, d;
    if (val === 't') { d = 10; n = heltal(r, 1, 9); }
    else if (val === 'h') { d = 100; n = valj(r, [heltal(r, 1, 9), heltal(r, 11, 99)]); if (n % 10 === 0) n += 1; }
    else { n = +val[0]; d = +val[1]; }
    var v = n / d, ordform = (d === 10 || d === 100) && n < 20 && r() < 0.45;
    var text = ordform ? 'Skriv ' + brakOrd(n, d) + ' i decimalform.' : 'Skriv ' + br(n, d) + ' i decimalform.';
    var losning;
    if (d === 10 || d === 100) {
      losning = [br(n, d) + ' betyder ' + brakOrd(n, d) + '.', d === 10 ? 'Tiondelar står på första platsen efter kommat.' : 'Hundradelar står på andra platsen efter kommat.', br(n, d) + ' = ' + fmt(v)];
    } else {
      var k = 100 / d;
      losning = ['Förläng så att det står 100 under strecket: ' + br(n, d) + ' = ' + br(n * k, 100), br(n * k, 100) + ' betyder ' + brakOrd(n * k, 100) + '.', br(n, d) + ' = ' + fmt(v)];
    }
    return { typ: 'svar', text: text, falt: [{ typ: 'tal', svar: fmt(v) }], ledtrad: (d === 10 || d === 100) ? 'Tiondelar är en decimal. Hundradelar är två decimaler.' : 'Gör om bråket så att det står 10 eller 100 under strecket.', losning: losning };
  };

  G.dec_brak = function (r) {
    var pl = valj(r, [1, 2, 2, 3]), D = Math.pow(10, pl), n;
    if (pl === 1) n = heltal(r, 1, 9);
    else if (pl === 2) n = valj(r, [heltal(r, 1, 9), heltal(r, 11, 99)]);
    else n = valj(r, [heltal(r, 1, 9), heltal(r, 11, 99), heltal(r, 101, 999)]);
    if (n % 10 === 0) n += 1;
    var dec = fmt(n / D), plats = ['', 'tiondels', 'hundradels', 'tusendels'][pl];
    return { typ: 'svar', text: 'Skriv ' + dec + ' i bråkform.', falt: [{ typ: 'brak', svar: n + '/' + D }], ledtrad: 'En decimal betyder tiondelar, två decimaler hundradelar och tre decimaler tusendelar.', losning: [dec + ' har ' + (pl === 1 ? 'en decimal' : TALORD[pl] + ' decimaler') + '. Den sista siffran står på ' + plats + 'platsen.', 'Det är ' + brakOrd(n, D) + '.', dec + ' = ' + br(n, D)] };
  };

  G.kronor = function (r) {
    var kr = valj(r, [0, heltal(r, 1, 9), heltal(r, 10, 49)]);
    var ore = valj(r, [heltal(r, 1, 9), heltal(r, 1, 9), valj(r, [10, 20, 30, 40, 50, 60, 70, 80, 90]), valj(r, [25, 75, 35, 45, 55, 65, 85, 95])]);
    var v = (kr * 100 + ore) / 100;
    var losning = ['1 krona = 100 öre. Öre är alltså hundradelar av en krona.', ore + ' öre = ' + fmtN(ore / 100, 2) + ' kr'];
    if (kr) losning.push(kr + ' kr + ' + fmtN(ore / 100, 2) + ' kr = ' + fmtN(v, 2) + ' kr');
    if (ore % 10 === 0) losning.push('Man kan också skriva ' + fmt(v) + ' kr.');
    return { typ: 'svar', text: 'Skriv i kronor: ' + (kr ? kr + ' kr ' : '') + ore + ' öre', falt: [{ typ: 'tal', svar: fmt(v), enhet: 'kr' }], ledtrad: 'Hur många öre går det på en krona? Ska öret stå på tiondelsplatsen eller hundradelsplatsen?', losning: losning };
  };

  var AVR = [
    { namn: 'tiotal', u: 10000, gen: function (r) { return valj(r, [heltal(r, 101, 999) * 1000, heltal(r, 1001, 9999) * 100]); } },
    { namn: 'hundratal', u: 100000, gen: function (r) { return heltal(r, 101, 9999) * 1000; } },
    { namn: 'heltal', u: 1000, gen: function (r) { return valj(r, [heltal(r, 11, 999) * 100, heltal(r, 101, 9999) * 10, heltal(r, 1001, 99999)]); } },
    { namn: 'tiondelar', u: 100, gen: function (r) { return valj(r, [heltal(r, 101, 9999) * 10, heltal(r, 1001, 99999)]); } },
    { namn: 'hundradelar', u: 10, gen: function (r) { return heltal(r, 1001, 99999); } }
  ];
  var PLATS = { 10000: 'tiotalssiffran', 100000: 'hundratalssiffran', 1000: 'entalssiffran', 100: 'tiondelssiffran', 10: 'hundradelssiffran' };
  function avrundaMilli(m, u) { return Math.floor((m + u / 2) / u) * u; }
  G.avrunda = function (r) {
    var a = valj(r, AVR), m;
    do { m = a.gen(r); } while (m % a.u === 0);
    var res = avrundaMilli(m, a.u), siffra = Math.floor((m % a.u) / (a.u / 10));
    var x = fmt(m / 1000), y = fmt(res / 1000);
    return { typ: 'svar', text: 'Avrunda ' + x + ' till ' + a.namn + '.', falt: [{ typ: 'tal', svar: y }], ledtrad: 'Titta på siffran direkt till höger om den plats du avrundar till. 0–4: avrunda nedåt. 5–9: avrunda uppåt.', losning: ['Titta på siffran till höger om ' + PLATS[a.u] + '. Den är ' + siffra + '.', siffra >= 5 ? siffra + ' är 5 eller mer, så vi avrundar uppåt.' : siffra + ' är mindre än 5, så vi avrundar nedåt.', x + ' ≈ ' + y] };
  };

  G.platsvarde = function (r) {
    var s = blanda(r, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    var fria = [0, 0, 0].concat([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(function (x) { return s.indexOf(x) < 0; }));
    var tal = valj(r, fria) + ',' + s.join('');
    var namn = ['tiondels', 'hundradels', 'tusendels'], p = heltal(r, 0, 2);
    var tabell = tal + ': ' + s[0] + ' tiondelar, ' + s[1] + ' hundradelar och ' + s[2] + ' tusendelar.';
    if (r() < 0.5) {
      return { typ: 'svar', text: 'Du har talet ' + tal + '. Vilken siffra är ' + namn[p] + 'siffran?', falt: [{ typ: 'tal', svar: String(s[p]) }], ledtrad: 'Första platsen efter kommat är tiondelar, sedan kommer hundradelar och sist tusendelar.', losning: [tabell, cap(namn[p]) + 'siffran är ' + s[p] + '.'] };
    }
    var alt = [String(s[p]), '0,' + s[p], '0,0' + s[p], '0,00' + s[p]];
    return { typ: 'val', text: 'Vilket värde har siffran ' + s[p] + ' i talet ' + tal + '?', alt: alt, ratt: p + 1, fast: true, ledtrad: 'Vilken plats står siffran ' + s[p] + ' på efter kommat?', losning: [tabell, 'Siffran ' + s[p] + ' står på ' + namn[p] + 'platsen, så den är värd ' + alt[p + 1] + '.'] };
  };

  G.x_brak = function (r) {
    var d = heltal(r, 3, 12), n = heltal(r, 1, d - 1), form = heltal(r, 0, 2);
    var ekv = ['1 − x = ' + br(n, d), 'x + ' + br(n, d) + ' = 1', br(n, d) + ' = 1 − x'][form];
    return { typ: 'svar', text: 'Vilket tal är x?', uttryck: ekv, falt: [{ etikett: 'x =', typ: 'brak', svar: (d - n) + '/' + d }], ledtrad: 'Skriv 1 som ett bråk med samma nämnare: 1 = ' + br(d, d) + '.', losning: ['1 = ' + br(d, d), form === 1 ? 'x är det som fattas för att ' + br(n, d) + ' ska bli ' + br(d, d) + '.' : 'x är det man tar bort från ' + br(d, d) + ' för att få ' + br(n, d) + '.', br(d, d) + ' − ' + br(n, d) + ' = ' + br(d - n, d), 'x = ' + br(d - n, d)] };
  };

  G.tallinje = function (r) {
    var typ = valj(r, [{ fran: 0, till: 10, delar: 5 }, { fran: 0, till: 10, delar: 2 }, { fran: 0, till: 2, delar: 10 }, { fran: 0, till: 1, delar: 10 }, { fran: 0, till: 5, delar: 4 }]);
    var tot = (typ.till - typ.fran) * typ.delar, k;
    do { k = heltal(r, 1, tot - 1); } while (k % typ.delar === 0);
    var bas = typ.fran + Math.floor(k / typ.delar), kk = k % typ.delar, v = typ.fran + k / typ.delar, steg = 1 / typ.delar;
    return { typ: 'svar', text: 'Vilket tal pekar pilen på?', figur: { form: 'tallinje', fran: typ.fran, till: typ.till, delar: typ.delar, pilar: [{ namn: '', varde: v }] }, falt: [{ typ: 'tal', svar: fmt(v) }], ledtrad: 'Räkna hur många små steg det är mellan två heltal. Hur mycket är ett litet steg värt?', losning: ['Mellan två heltal finns ' + typ.delar + ' små steg.', 'Ett litet steg är ' + br(1, typ.delar) + ' = ' + fmt(steg) + '.', 'Pilen står ' + kk + ' små steg efter ' + bas + ': ' + bas + ' + ' + kk + ' · ' + fmt(steg) + ' = ' + fmt(v)] };
  };

  G.andel_kvar = function (r, c) {
    var nm = namnen(r, c, 3), dec, falt, d, n;
    if (r() < 0.5) {
      d = valj(r, [4, 5, 8, 10]); n = heltal(r, 1, d - 1);
      var mat = valj(r, [['en pizza', 'pizzan'], ['en kladdkaka', 'kladdkakan'], ['en tårta', 'tårtan'], ['en långpannekaka', 'långpannekakan']]);
      dec = 100 % d === 0;
      falt = [{ etikett: 'Bråkform', typ: 'brak', svar: (d - n) + '/' + d }];
      if (dec) falt.push({ etikett: 'Decimalform', typ: 'tal', svar: fmt((d - n) / d) });
      var los = ['Hela ' + mat[1] + ' = ' + br(d, d), br(d, d) + ' − ' + br(n, d) + ' = ' + br(d - n, d)];
      if (dec) los.push(br(d - n, d) + ' = ' + fmt((d - n) / d));
      return { typ: 'svar', papper: true, text: nm[0] + ' äter upp ' + brakOrd(n, d) + ' av ' + mat[0] + '. Hur stor andel av ' + mat[1] + ' finns kvar? Svara i bråkform' + (dec ? ' och decimalform.' : '.'), falt: falt, ledtrad: 'Hela ' + mat[1] + ' är ' + br(d, d) + '.', losning: los };
    }
    var T = valj(r, [10, 12, 20, 24, 30]), e1, e2, e3;
    do { e1 = heltal(r, 1, Math.floor(T / 3)); e2 = heltal(r, 1, Math.floor(T / 3)); e3 = heltal(r, 1, Math.floor(T / 3)); } while (e1 + e2 + e3 >= T);
    var sum = e1 + e2 + e3, kvar = T - sum, g = sgd(kvar, T);
    var frukt = valj(r, [['plommon', 'plommonen'], ['jordgubbar', 'jordgubbarna'], ['clementiner', 'clementinerna']]);
    dec = (kvar * 100) % T === 0;
    falt = [{ etikett: 'Bråkform', typ: 'brak', svar: kvar + '/' + T }];
    if (dec) falt.push({ etikett: 'Decimalform', typ: 'tal', svar: fmt(kvar / T) });
    var l2 = ['De äter ' + e1 + ' + ' + e2 + ' + ' + e3 + ' = ' + sum + ' st.', 'Kvar: ' + T + ' − ' + sum + ' = ' + kvar + ' st.', 'Andelen som finns kvar är ' + br(kvar, T) + '.'];
    if (g > 1) l2.push(br(kvar, T) + ' = ' + br(kvar / g, T / g));
    if (dec) l2.push('I decimalform: ' + fmt(kvar / T));
    return { typ: 'svar', papper: true, text: 'På ett fat ligger ' + T + ' ' + frukt[0] + '. ' + nm[0] + ' äter ' + e1 + ', ' + nm[1] + ' äter ' + e2 + ' och ' + nm[2] + ' äter ' + e3 + '. Hur stor andel av ' + frukt[1] + ' finns kvar? Svara i bråkform' + (dec ? ' och decimalform.' : '.'), falt: falt, ledtrad: 'Hur många äter de tillsammans? Hur många är kvar av alla ' + T + '?', losning: l2 };
  };

  G.ko = function (r, c) {
    var N = namnen(r, c, 1)[0], a = heltal(r, 3, 14), b = heltal(r, 3, 14);
    var plats = valj(r, ['kön till trampolinen', 'kön till bommen', 'kön till matsalen', 'kön till dansuppvisningen', 'kön till fotbollsmatchen']);
    return { typ: 'svar', papper: true, text: N + ' står i ' + plats + '. ' + N + ' är nummer ' + a + ' framifrån och nummer ' + b + ' bakifrån. Hur många står i kön?', falt: [{ typ: 'tal', svar: String(a + b - 1), enhet: 'st' }], ledtrad: 'Rita kön på papperet. Se till att du inte räknar ' + N + ' två gånger.', losning: ['Framifrån räknar du ' + a + ' personer, och ' + N + ' är den sista av dem.', 'Bakifrån räknar du ' + b + ' personer, och ' + N + ' är den första av dem.', N + ' har räknats två gånger: ' + a + ' + ' + b + ' − 1 = ' + (a + b - 1) + '.'] };
  };

  G.hiss = function (r, c) {
    var N = namnen(r, c, 1)[0], s = heltal(r, 3, 9), n = heltal(r, 1, s - 1), u = heltal(r, 2, 9), e = s - n + u, nast = r() < 0.6;
    var svar = nast ? e + 1 : e;
    var vn = function (x) { return x === 1 ? 'en våning' : TALORD[x] + ' våningar'; };
    var los = [s + ' − ' + n + ' = ' + (s - n) + '. ' + N + ' är på våning ' + (s - n) + '.', (s - n) + ' + ' + u + ' = ' + e + '. ' + N + ' är på våning ' + e + '.'];
    los.push(nast ? 'Våning ' + e + ' är näst högst. Då är den högsta våningen ' + (e + 1) + ', och huset har ' + (e + 1) + ' våningar.' : 'Våning ' + e + ' är den högsta, så huset har ' + e + ' våningar.');
    return { typ: 'svar', papper: true, text: N + ' kliver in i hissen på våning ' + s + '. Först åker ' + N + ' ner ' + vn(n) + ' och sedan upp ' + vn(u) + '. Då är ' + N + ' på ' + (nast ? 'näst högsta' : 'högsta') + ' våningen. Hur många våningar har huset?', falt: [{ typ: 'tal', svar: String(svar) }], ledtrad: 'Rita huset som en stege på papperet och följ hissen.', losning: los };
  };

  G.rest = function (r) {
    var d = heltal(r, 3, 9), q = heltal(r, 3, 9), x = heltal(r, 1, d - 1), a = d * q + x, v = heltal(r, 0, 2);
    if (v === 0) return { typ: 'svar', papper: true, text: 'Vilket tal är x?', uttryck: br(a, d) + ' = ' + q + ' rest x', falt: [{ etikett: 'x =', typ: 'tal', svar: String(x) }], ledtrad: 'Hur mycket är ' + q + ' · ' + d + '? Hur mycket fattas sedan till ' + a + '?', losning: [q + ' · ' + d + ' = ' + (q * d), a + ' − ' + (q * d) + ' = ' + x, 'x = ' + x] };
    if (v === 1) return { typ: 'svar', papper: true, text: 'Vilket tal är x?', uttryck: br(a, d) + ' = x rest ' + x, falt: [{ etikett: 'x =', typ: 'tal', svar: String(q) }], ledtrad: 'Ta bort resten först: ' + a + ' − ' + x + '. Hur många gånger går ' + d + ' i det?', losning: [a + ' − ' + x + ' = ' + (a - x), br(a - x, d) + ' = ' + q + ', för ' + q + ' · ' + d + ' = ' + (a - x), 'x = ' + q] };
    return { typ: 'svar', papper: true, text: 'Vilket tal är x?', uttryck: br(a, 'x') + ' = ' + q + ' rest ' + x, falt: [{ etikett: 'x =', typ: 'tal', svar: String(d) }], ledtrad: 'Ta bort resten först: ' + a + ' − ' + x + '. Vilket tal gånger ' + q + ' blir det?', losning: [a + ' − ' + x + ' = ' + (a - x), q + ' · x = ' + (a - x), q + ' · ' + d + ' = ' + (a - x) + ', så x = ' + d] };
  };

  G.uppstallning = function (r) {
    var v = valj(r, ['mult', 'div', 'sub', 'add']), a, b;
    if (v === 'mult') {
      a = heltal(r, 112, 989); b = heltal(r, 3, 9);
      var delar = [Math.floor(a / 100) * 100, Math.floor((a % 100) / 10) * 10, a % 10].filter(function (x) { return x > 0; });
      return { typ: 'svar', papper: true, text: 'Räkna ut.', uttryck: b + ' · ' + a, falt: [{ typ: 'tal', svar: String(a * b) }], ledtrad: 'Dela upp ' + a + ' i hundratal, tiotal och ental. Multiplicera var för sig.', losning: [a + ' = ' + delar.join(' + '), delar.map(function (x) { return b + ' · ' + x; }).join(' + '), '= ' + delar.map(function (x) { return b * x; }).join(' + '), '= ' + fmt(a * b)] };
    }
    if (v === 'div') {
      b = heltal(r, 2, 9);
      var q = heltal(r, Math.max(11, Math.ceil(100 / b)), Math.floor(999 / b));
      a = b * q;
      var h = Math.floor(q / 100) * 100, t = Math.floor((q % 100) / 10) * 10, o = q % 10;
      var kv = [h, t, o].filter(function (x) { return x > 0; });
      return { typ: 'svar', papper: true, text: 'Räkna ut.', uttryck: br(a, b), falt: [{ typ: 'tal', svar: String(q) }], ledtrad: 'Dela upp ' + a + ' i delar som är lätta att dela med ' + b + '.', losning: [a + ' = ' + kv.map(function (x) { return b * x; }).join(' + '), kv.map(function (x) { return br(b * x, b) + ' = ' + x; }).join(',  '), kv.join(' + ') + ' = ' + q] };
    }
    if (v === 'sub') {
      do { a = heltal(r, 300, 999); b = heltal(r, 101, a - 50); } while (!((a % 10) < (b % 10) || (Math.floor(a / 10) % 10) < (Math.floor(b / 10) % 10)));
      var A = [a % 10, Math.floor(a / 10) % 10, Math.floor(a / 100)], B = [b % 10, Math.floor(b / 10) % 10, Math.floor(b / 100)];
      var namnK = ['Ental', 'Tiotal', 'Hundratal'], st = [], lan = 0;
      for (var i = 0; i < 3; i++) {
        var ai = A[i] - lan, pre = lan ? 'Efter växlingen är det ' + ai + ' kvar. ' : '';
        lan = 0;
        if (i === 2 && ai === B[i] && ai === 0) { continue; }
        if (ai < B[i]) { st.push(namnK[i] + ': ' + pre + ai + ' − ' + B[i] + ' går inte. Växla: ' + (ai + 10) + ' − ' + B[i] + ' = ' + (ai + 10 - B[i]) + '.'); lan = 1; }
        else st.push(namnK[i] + ': ' + pre + ai + ' − ' + B[i] + ' = ' + (ai - B[i]) + '.');
      }
      st.push('Svar: ' + a + ' − ' + b + ' = ' + (a - b));
      return { typ: 'svar', papper: true, text: 'Räkna ut.', uttryck: a + ' − ' + b, falt: [{ typ: 'tal', svar: String(a - b) }], ledtrad: 'Ställ upp talen under varandra. Börja med entalen. Går det inte, får du växla.', losning: st };
    }
    do { a = heltal(r, 120, 899); b = heltal(r, 101, 999 - a); } while (!((a % 10) + (b % 10) >= 10 || (Math.floor(a / 10) % 10) + (Math.floor(b / 10) % 10) >= 10));
    var A2 = [a % 10, Math.floor(a / 10) % 10, Math.floor(a / 100)], B2 = [b % 10, Math.floor(b / 10) % 10, Math.floor(b / 100)];
    var nk = ['Ental', 'Tiotal', 'Hundratal'], s2 = [], minne = 0;
    for (var j = 0; j < 3; j++) {
      var sum = A2[j] + B2[j] + minne, txt = A2[j] + ' + ' + B2[j] + (minne ? ' + 1 (minnessiffran)' : '') + ' = ' + sum;
      if (sum >= 10 && j < 2) { s2.push(nk[j] + ': ' + txt + '. Skriv ' + (sum - 10) + ' och lägg 1 i minnet.'); minne = 1; }
      else { s2.push(nk[j] + ': ' + txt + '.'); minne = 0; }
    }
    s2.push('Svar: ' + a + ' + ' + b + ' = ' + fmt(a + b));
    return { typ: 'svar', papper: true, text: 'Räkna ut.', uttryck: a + ' + ' + b, falt: [{ typ: 'tal', svar: String(a + b) }], ledtrad: 'Ställ upp talen under varandra. Börja med entalen och glöm inte minnessiffran.', losning: s2 };
  };

  G.talfoljd = function (r) {
    var typ = heltal(r, 0, 3), f = [], beskr, i, s, d;
    if (typ === 0) { s = heltal(r, 1, 30); d = heltal(r, 3, 25); for (i = 0; i < 6; i++) f.push(s + i * d); beskr = 'Talen ökar med ' + d + ' varje gång.'; }
    else if (typ === 1) { d = heltal(r, 3, 15); s = heltal(r, 5 * d + 1, 5 * d + 60); for (i = 0; i < 6; i++) f.push(s - i * d); beskr = 'Talen minskar med ' + d + ' varje gång.'; }
    else if (typ === 2) { s = heltal(r, 1, 5); var k = valj(r, [2, 2, 3]); for (i = 0; i < 6; i++) f.push(s * Math.pow(k, i)); beskr = 'Talen blir ' + (k === 2 ? 'dubbelt så stora' : 'tre gånger så stora') + ' varje gång.'; }
    else { var upp = r() < 0.5, x = heltal(r, 60, 120); f.push(x); for (i = 1; i < 6; i++) { x = upp ? x + i : x - i; f.push(x); } beskr = upp ? 'Talen ökar med 1, sedan 2, sedan 3 och så vidare.' : 'Talen minskar med 1, sedan 2, sedan 3 och så vidare.'; }
    var luckor = valj(r, [[3, 5], [2, 4], [3, 4], [2, 5]]);
    var vis = f.map(function (v, j) { return luckor.indexOf(j) >= 0 ? '?' : fmt(v); }).join(',   ');
    return { typ: 'svar', text: 'Vilka tal ska stå i stället för frågetecknen?', uttryck: vis, falt: [{ etikett: 'Första ?', typ: 'tal', svar: String(f[luckor[0]]) }, { etikett: 'Andra ?', typ: 'tal', svar: String(f[luckor[1]]) }], ledtrad: 'Titta på hur mycket talen ändras från ett tal till nästa.', losning: [beskr, 'Det ger ' + fmt(f[luckor[0]]) + ' och ' + fmt(f[luckor[1]]) + '.', 'Hela följden: ' + f.map(fmt).join(', ')] };
  };

  G.dubbelt = function (r, c) {
    var nm = namnen(r, c, 2), A = nm[0], B = nm[1], ggr = valj(r, [2, 2, 3]), k = heltal(r, 4, 30), T = k * (ggr + 1);
    var gt = ggr === 2 ? 'dubbelt' : 'tre gånger';
    var mall = valj(r, [
      { t: A + ' och ' + B + ' gör tillsammans ' + T + ' hjulningar. ' + B + ' gör ' + gt + ' så många som ' + A + '. Hur många hjulningar gör var och en?', e: 'st' },
      { t: A + ' och ' + B + ' bär tillsammans ' + T + ' kg ved. ' + B + ' bär ' + gt + ' så mycket som ' + A + '. Hur många kilogram bär var och en?', e: 'kg' },
      { t: A + ' och ' + B + ' gör tillsammans ' + T + ' mål på fotbollsträningen. ' + B + ' gör ' + gt + ' så många mål som ' + A + '. Hur många mål gör var och en?', e: 'st' }
    ]);
    return { typ: 'svar', papper: true, text: mall.t, falt: [{ etikett: A, typ: 'tal', svar: String(k), enhet: mall.e }, { etikett: B, typ: 'tal', svar: String(ggr * k), enhet: mall.e }], ledtrad: 'Rita ' + gen(A) + ' del som en ruta och ' + gen(B) + ' del som ' + TALORD[ggr] + ' lika stora rutor.', losning: [A + ' får 1 del och ' + B + ' får ' + ggr + ' delar. Tillsammans blir det ' + (ggr + 1) + ' delar.', '1 del = ' + br(T, ggr + 1) + ' = ' + k, A + ': ' + k + '.  ' + B + ': ' + ggr + ' · ' + k + ' = ' + (ggr * k) + '.', 'Kolla: ' + k + ' + ' + (ggr * k) + ' = ' + T] };
  };

  G.handla = function (r, c) {
    var N = namnen(r, c, 1)[0], n, w, p, m, cost, P;
    do { n = heltal(r, 2, 5); w = heltal(r, 1, 3); p = heltal(r, 9, 25); m = heltal(r, 1, n - 1); cost = m * w * p; P = cost < 100 ? 100 : cost < 200 ? 200 : 0; } while (!P || cost < 20);
    var W = n * w, vara = valj(r, [['äpplen', 'äpplena'], ['päron', 'päronen'], ['potatis', 'potatisen'], ['apelsiner', 'apelsinerna']]);
    return { typ: 'svar', papper: true, text: cap(TALORD[n]) + ' lika tunga påsar med ' + vara[0] + ' väger tillsammans ' + W + ' kg. ' + cap(vara[1]) + ' kostar ' + p + ' kr per kilogram. ' + N + ' köper ' + (m === 1 ? 'en påse' : TALORD[m] + ' påsar') + '. Hur mycket får ' + N + ' tillbaka om ' + N + ' betalar med en ' + (P === 100 ? 'hundralapp' : 'tvåhundralapp') + '?', falt: [{ typ: 'tal', svar: String(P - cost), enhet: 'kr' }], ledtrad: 'Ta ett steg i taget. Hur mycket väger en påse?', losning: ['En påse väger ' + br(W, n) + ' = ' + w + ' kg.', (m === 1 ? 'En påse' : cap(TALORD[m]) + ' påsar') + ' väger ' + m + ' · ' + w + ' = ' + (m * w) + ' kg.', 'Det kostar ' + (m * w) + ' · ' + p + ' = ' + cost + ' kr.', 'Tillbaka: ' + P + ' − ' + cost + ' = ' + (P - cost) + ' kr.'] };
  };

  G.siffror = function (r) {
    var s = blanda(r, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
    var asc = s.slice().sort(function (a, b) { return a - b; }), desc = asc.slice().reverse();
    var v = valj(r, ['minsta', 'näst minsta', 'största', 'näst största']);
    var byt = function (a) { var b = a.slice(); var t = b[3]; b[3] = b[4]; b[4] = t; return b; };
    var svar = (v === 'minsta' ? asc : v === 'näst minsta' ? byt(asc) : v === 'största' ? desc : byt(desc)).join('');
    var min = v.indexOf('minsta') >= 0;
    var los = [min ? 'Sortera siffrorna från minst till störst: ' + fmt(+asc.join('')) + ' är det minsta talet.' : 'Sortera siffrorna från störst till minst: ' + fmt(+desc.join('')) + ' är det största talet.'];
    if (v.indexOf('näst') === 0) los.push('Det ' + v + ' talet får man genom att byta plats på de två sista siffrorna.');
    los.push('Svar: ' + fmt(+svar));
    return { typ: 'svar', papper: true, text: 'Använd alla siffrorna ' + s.join(', ') + ' en gång var. Skriv det ' + v + ' tal som går.', falt: [{ typ: 'tal', svar: svar }], ledtrad: min ? 'Det minsta talet får man när de minsta siffrorna står först.' : 'Det största talet får man när de största siffrorna står först.', losning: los };
  };

  G.ordna_brak = function (r) {
    var items, ledtrad, losning;
    if (r() < 0.6) {
      var d = blanda(r, [2, 3, 4, 5, 6, 8, 10, 12, 100]).slice(0, 5).sort(function (a, b) { return a - b; });
      items = d.map(function (x) { return br(1, x); });
      ledtrad = 'Ju fler delar det hela delas i, desto mindre blir varje del.';
      losning = ['Alla bråk har 1 i täljaren. Då är det nämnaren som avgör.', 'Ju större nämnare, desto mindre del.', items.join(',  ')];
    } else {
      var D = valj(r, [6, 8, 10, 12]);
      var tal = blanda(r, range(D - 1).map(function (x) { return x + 1; })).slice(0, 5).sort(function (a, b) { return b - a; });
      items = tal.map(function (x) { return br(x, D); });
      ledtrad = 'Alla har samma nämnare. Jämför täljarna, talen över strecket.';
      losning = ['Alla bråk har ' + D + ' i nämnaren. Då är det täljaren som avgör.', 'Ju större täljare, desto större tal.', items.join(',  ')];
    }
    return { typ: 'ordna', text: 'Skriv talen i storleksordning. Börja med det största.', items: items, etiketter: ['Störst', 'Minst'], ledtrad: ledtrad, losning: losning };
  };

  var TAVLA = [1, 5, 20, 25, 50];
  G.pil = function (r, c) {
    var N = namnen(r, c, 1)[0], n = heltal(r, 3, 6), traff = [], i;
    for (i = 0; i < n; i++) traff.push(valj(r, TAVLA));
    traff.sort(function (a, b) { return b - a; });
    var mal = traff.reduce(function (a, b) { return a + b; }, 0);
    return { typ: 'pil', text: N + ' kastar ' + n + ' pilar och alla träffar tavlan. ' + N + ' får ' + mal + ' poäng. Hur kan pilarna ha träffat?', pilar: n, mal: mal, varden: TAVLA, ledtrad: 'Titta på sista siffran i ' + mal + '. Vilka ringar behövs för att summan ska sluta så?', losning: ['Ett sätt: ' + traff.join(' + ') + ' = ' + mal + '.', 'Det kan finnas fler sätt som också är rätt.'] };
  };

  G.storst = function (r) {
    var kand = [], sett = {};
    var fr = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10], [9, 10], [5, 4], [3, 2]];
    while (kand.length < 5) {
      var x;
      if (r() < 0.4) { var p = valj(r, fr); x = { vis: br(p[0], p[1]), h: p[0] * 100 / p[1] }; }
      else { var h = valj(r, [heltal(r, 5, 99), heltal(r, 101, 199), heltal(r, 1, 19) * 10]); x = { vis: fmt(h / 100), h: h }; }
      if (!sett[x.h]) { sett[x.h] = 1; kand.push(x); }
    }
    var max = r() < 0.5, mal = kand.reduce(function (a, b) { return (max ? b.h > a.h : b.h < a.h) ? b : a; });
    return { typ: 'val', text: 'Vilket av talen är ' + (max ? 'störst' : 'minst') + '?', alt: kand.map(function (k) { return k.vis; }), ratt: kand.indexOf(mal), fast: true, ledtrad: 'Skriv alla talen som decimaltal med två decimaler. Då blir de lätta att jämföra.', losning: ['Med två decimaler: ' + kand.map(function (k) { return fmtN(k.h / 100, 2); }).join(',  '), (max ? 'Störst' : 'Minst') + ' är ' + mal.vis + '.'] };
  };


  // ---------- Generatorer: Femmans matte (Lgr22 åk 4–6) ----------
  G.procent = function (r) {
    var val = valj(r, [[50, 2], [25, 4], [10, 10], [75, 4], [20, 5]]), p = val[0], d = val[1];
    var N = p === 10 ? 10 * heltal(r, 3, 40) : d * heltal(r, 2, 25), svar = N * p / 100, del = N / d;
    var bra = { 50: 'hälften', 25: 'en fjärdedel', 10: 'en tiondel', 75: 'tre fjärdedelar', 20: 'en femtedel' }[p];
    var los = [p + ' % = ' + br(p, 100) + ' = ' + bra + '.'];
    if (p === 75) los.push('En fjärdedel av ' + N + ' är ' + br(N, 4) + ' = ' + del + '.', 'Tre fjärdedelar är 3 · ' + del + ' = ' + svar + '.');
    else los.push(cap(bra) + ' av ' + N + ' är ' + br(N, d) + ' = ' + svar + '.');
    los.push('Svar: ' + fmt(svar) + ' kr');
    return { typ: 'svar', niva: p === 50 ? 1 : (p === 75 || p === 20) ? 3 : 2, text: 'Hur mycket är ' + p + ' % av ' + N + ' kr?', falt: [{ typ: 'tal', svar: fmt(svar), enhet: 'kr' }], ledtrad: p + ' % är samma sak som ' + bra + '.', losning: los };
  };
  G.brak_av = function (r) {
    var d = valj(r, [2, 3, 4, 5, 10]), n = d === 2 ? 1 : heltal(r, 1, d - 1), k = heltal(r, 2, 9), N = d * k;
    var sak = valj(r, [['kulor', 'st'], ['klistermärken', 'st'], ['kronor', 'kr'], ['minuter', 'min']]);
    var vad = d === 2 ? 'hälften' : brakOrd(n, d);
    var los = d === 2 ? ['Hälften av ' + N + ' är ' + br(N, 2) + ' = ' + k + '.'] : ['En ' + DELNAMN[d] + ' av ' + N + ' är ' + br(N, d) + ' = ' + k + '.'];
    if (n > 1) los.push(cap(TALORD[n]) + ' ' + DELNAMN[d] + 'ar är ' + n + ' · ' + k + ' = ' + (n * k) + '.');
    return { typ: 'svar', niva: n === 1 ? 1 : 2, text: 'Hur mycket är ' + vad + ' av ' + N + ' ' + sak[0] + '?', falt: [{ typ: 'tal', svar: String(n * k), enhet: sak[1] }], ledtrad: 'Dela först ' + N + ' i ' + d + ' lika stora delar.', losning: los };
  };
  var ENHETER = [
    { fr: 'm', till: 'cm', f: 100 }, { fr: 'kg', till: 'g', f: 1000 }, { fr: 'l', till: 'dl', f: 10 }, { fr: 'km', till: 'm', f: 1000 },
    { fr: 'h', till: 'min', f: 60 }, { fr: 'cm', till: 'mm', f: 10 }, { fr: 'l', till: 'ml', f: 1000 }
  ];
  G.enhet = function (r) {
    var e = valj(r, ENHETER), bakat = r() < 0.4, dec = !bakat && e.f !== 60 && r() < 0.4;
    var a = dec ? heltal(r, 11, 49) / 10 : heltal(r, 2, 9);
    if (e.f === 60) a = valj(r, [1, 2, 3, 0.5, 1.5]);
    var fran = bakat ? e.till : e.fr, till = bakat ? e.fr : e.till, varde = bakat ? a * e.f : a, svar = bakat ? a : a * e.f;
    return { typ: 'svar', niva: dec || bakat ? 2 : 1, text: 'Hur många ' + till + ' är ' + fmt(varde) + ' ' + fran + '?', falt: [{ typ: 'tal', svar: fmt(svar), enhet: till }], ledtrad: '1 ' + e.fr + ' = ' + e.f + ' ' + e.till + '.', losning: ['1 ' + e.fr + ' = ' + e.f + ' ' + e.till + '.', bakat ? fmt(varde) + ' ' + e.till + ' = ' + br(fmt(varde), e.f) + ' ' + e.fr + ' = ' + fmt(svar) + ' ' + e.fr : fmt(varde) + ' · ' + e.f + ' = ' + fmt(svar) + ', alltså ' + fmt(svar) + ' ' + e.till + '.'] };
  };
  G.omkrets_area = function (r) {
    var b = heltal(r, 2, 9), h = heltal(r, 2, 7), area = r() < 0.5;
    if (b === h) b++;
    return { typ: 'svar', niva: area ? 1 : 2, text: 'Rektangeln är ' + b + ' cm lång och ' + h + ' cm bred. Hur stor är ' + (area ? 'arean' : 'omkretsen') + '?', figur: { form: 'rektangel', b: b, h: h }, falt: [{ typ: 'tal', svar: String(area ? b * h : 2 * (b + h)), enhet: area ? 'cm²' : 'cm' }], ledtrad: area ? 'Arean är längden gånger bredden.' : 'Omkretsen är alla fyra sidor tillsammans.', losning: area ? ['Area = längd · bredd', b + ' · ' + h + ' = ' + (b * h), 'Svar: ' + (b * h) + ' cm²'] : ['Omkrets = alla sidor tillsammans', b + ' + ' + h + ' + ' + b + ' + ' + h + ' = ' + (2 * (b + h)), 'Svar: ' + (2 * (b + h)) + ' cm'] };
  };
  function grader(x) { return (x < 0 ? '−' : '') + Math.abs(x) + ' °C'; }
  G.negativa = function (r) {
    var v = heltal(r, 0, 2), a, d;
    if (v === 0) { a = heltal(r, -9, -1); d = heltal(r, 2, 12); return { typ: 'svar', niva: 1, text: 'Termometern visar ' + grader(a) + '. Det blir ' + d + ' grader varmare. Vad visar termometern nu?', falt: [{ typ: 'tal', svar: String(a + d), enhet: '°C' }], ledtrad: 'Räkna uppåt på termometern från ' + grader(a) + '. Använd minus-knappen om svaret är under noll.', losning: [grader(a) + ' + ' + d + ' grader', 'Svar: ' + grader(a + d)], minus: true }; }
    if (v === 1) { a = heltal(r, 1, 8); d = heltal(r, a + 1, a + 9); return { typ: 'svar', niva: 2, text: 'Det är ' + grader(a) + '. Det blir ' + d + ' grader kallare. Vad visar termometern nu?', falt: [{ typ: 'tal', svar: String(a - d), enhet: '°C' }], ledtrad: 'Först ' + a + ' grader ner till 0. Hur många grader är det kvar att gå ner?', losning: [a + ' grader ner ger 0 °C.', 'Sedan ' + (d - a) + ' grader till under noll.', 'Svar: ' + grader(a - d)], minus: true }; }
    a = heltal(r, 1, 9); d = -heltal(r, 1, 9);
    return { typ: 'svar', niva: 3, text: 'På dagen var det ' + grader(a) + ' och på natten ' + grader(d) + '. Hur många grader skiljer det?', falt: [{ typ: 'tal', svar: String(a - d), enhet: 'grader' }], ledtrad: 'Räkna från ' + grader(d) + ' upp till 0, och sedan upp till ' + grader(a) + '.', losning: ['Från ' + grader(d) + ' till 0 °C är ' + (-d) + ' grader.', 'Från 0 °C till ' + grader(a) + ' är ' + a + ' grader.', (-d) + ' + ' + a + ' = ' + (a - d) + ' grader'] };
  };
  G.lagesmatt = function (r) {
    var v = valj(r, ['typvarde', 'median', 'medel']), tal = [], svar, los, x;
    if (v === 'typvarde') {
      var t = heltal(r, 2, 9);
      while (tal.length < 3) { x = heltal(r, 1, 15); if (x !== t && tal.indexOf(x) < 0) tal.push(x); }
      tal = blanda(r, tal.concat([t, t])); svar = t;
      los = ['Typvärdet är det tal som finns flest gånger.', t + ' finns två gånger. De andra talen finns bara en gång.', 'Typvärde: ' + t];
    } else if (v === 'median') {
      while (tal.length < 5) { x = heltal(r, 1, 20); if (tal.indexOf(x) < 0) tal.push(x); }
      var sort = tal.slice().sort(function (a, b) { return a - b; }); svar = sort[2];
      los = ['Medianen är talet i mitten när talen står i storleksordning.', 'I ordning: ' + sort.join(', '), 'Medianen är ' + svar + '.'];
    } else {
      var n = valj(r, [3, 4]), m = heltal(r, 4, 12), sista;
      do { tal = []; for (var i = 0; i < n - 1; i++) tal.push(m + heltal(r, -3, 3)); sista = m * n - tal.reduce(function (a, b) { return a + b; }, 0); } while (sista < 1 || sista > 25);
      tal.push(sista); tal = blanda(r, tal); svar = m;
      los = ['Medelvärde = summan delat med antalet tal.', 'Summa: ' + tal.join(' + ') + ' = ' + (m * n), br(m * n, n) + ' = ' + m];
    }
    var namn = { typvarde: 'typvärdet', median: 'medianen', medel: 'medelvärdet' }[v];
    return { typ: 'svar', niva: v === 'medel' ? 3 : 2, text: 'Vad är ' + namn + ' av talen?', uttryck: tal.join(',   '), falt: [{ typ: 'tal', svar: String(svar) }], ledtrad: { typvarde: 'Vilket tal finns flest gånger?', median: 'Skriv talen i storleksordning. Vilket står i mitten?', medel: 'Lägg ihop alla tal. Dela sedan med hur många tal det är.' }[v], losning: los };
  };
  G.ekvation = function (r) {
    var v = heltal(r, 0, 2), x = heltal(r, 2, 15), a;
    if (v === 0) { a = heltal(r, 3, 20); return { typ: 'svar', niva: 1, text: 'Vilket tal är x?', uttryck: 'x + ' + a + ' = ' + (x + a), falt: [{ etikett: 'x =', typ: 'tal', svar: String(x) }], ledtrad: 'Vilket tal plus ' + a + ' blir ' + (x + a) + '? Du kan räkna ' + (x + a) + ' − ' + a + '.', losning: ['x = ' + (x + a) + ' − ' + a, 'x = ' + x, 'Kolla: ' + x + ' + ' + a + ' = ' + (x + a)] }; }
    if (v === 1) { a = heltal(r, 3, 20); return { typ: 'svar', niva: 2, text: 'Vilket tal är x?', uttryck: 'x − ' + a + ' = ' + x, falt: [{ etikett: 'x =', typ: 'tal', svar: String(x + a) }], ledtrad: 'Vilket tal minus ' + a + ' blir ' + x + '? Räkna ' + x + ' + ' + a + '.', losning: ['x = ' + x + ' + ' + a, 'x = ' + (x + a), 'Kolla: ' + (x + a) + ' − ' + a + ' = ' + x] }; }
    a = heltal(r, 2, 9); x = heltal(r, 2, 10);
    return { typ: 'svar', niva: 2, text: 'Vilket tal är x?', uttryck: a + ' · x = ' + (a * x), falt: [{ etikett: 'x =', typ: 'tal', svar: String(x) }], ledtrad: a + ' gånger vilket tal blir ' + (a * x) + '? Tänk på ' + a + ':ans tabell.', losning: ['x = ' + br(a * x, a), 'x = ' + x, 'Kolla: ' + a + ' · ' + x + ' = ' + (a * x)] };
  };
  G.monster = function (r) {
    var start = heltal(r, 3, 6), d = heltal(r, 2, 4), n = heltal(r, 5, 8);
    var f = function (k) { return start + d * (k - 1); };
    return { typ: 'svar', niva: 3, papper: true, text: 'Figur 1 är byggd av ' + f(1) + ' stickor, figur 2 av ' + f(2) + ' och figur 3 av ' + f(3) + '. Hur många stickor behövs till figur ' + n + '?', falt: [{ typ: 'tal', svar: String(f(n)), enhet: 'st' }], ledtrad: 'Hur många stickor kommer till för varje ny figur?', losning: ['För varje ny figur kommer ' + d + ' stickor till.', 'Figur ' + n + ': ' + f(1) + ' + ' + (n - 1) + ' · ' + d + ' = ' + f(n)] };
  };
  G.gange10 = function (r) {
    var k = valj(r, [10, 100, 1000]), del = r() < 0.4, dec = r() < 0.5;
    var a = dec ? heltal(r, 12, 98) / 10 : heltal(r, 3, 95);
    if (del) { var tal = Math.round(a * k), svarD = tal / k; return { typ: 'svar', niva: dec ? 3 : 2, text: 'Räkna ut.', uttryck: fmt(tal) + ' / ' + k, falt: [{ typ: 'tal', svar: fmt(svarD) }], ledtrad: 'När man delar med ' + k + ' flyttar siffrorna ' + TALORD[String(k).length - 1] + ' steg åt höger, alltså mot de mindre talen.', losning: ['Dela med ' + k + ': siffrorna flyttar ' + TALORD[String(k).length - 1] + ' steg.', fmt(tal) + ' / ' + k + ' = ' + fmt(svarD)] }; }
    return { typ: 'svar', niva: dec ? 2 : 1, text: 'Räkna ut.', uttryck: fmt(a) + ' · ' + k, falt: [{ typ: 'tal', svar: fmt(Math.round(a * k * 1e6) / 1e6) }], ledtrad: 'När man multiplicerar med ' + k + ' flyttar siffrorna ' + TALORD[String(k).length - 1] + ' steg åt vänster, alltså mot de större talen.', losning: ['Gånger ' + k + ': siffrorna flyttar ' + TALORD[String(k).length - 1] + ' steg.', fmt(a) + ' · ' + k + ' = ' + fmt(Math.round(a * k * 1e6) / 1e6)] };
  };
  G.proportion = function (r, c) {
    var vara = valj(r, [['glassar', 'glassarna'], ['biobiljetter', 'biljetterna'], ['pennor', 'pennorna'], ['bullar', 'bullarna']]), styck = heltal(r, 3, 15), a = heltal(r, 2, 5), b;
    do { b = heltal(r, 2, 8); } while (b === a);
    return { typ: 'svar', niva: 3, papper: true, text: a + ' ' + vara[0] + ' kostar ' + (a * styck) + ' kr. Hur mycket kostar ' + b + ' ' + vara[0] + '?', falt: [{ typ: 'tal', svar: String(b * styck), enhet: 'kr' }], ledtrad: 'Räkna först ut vad en kostar.', losning: ['En kostar ' + br(a * styck, a) + ' = ' + styck + ' kr.', b + ' kostar ' + b + ' · ' + styck + ' = ' + (b * styck) + ' kr.'] };
  };

  function genPass(lista, antal, c, seed) {
    var r = slump(seed === undefined ? (Date.now() ^ Math.floor(Math.random() * 1e9)) : seed);
    var ordning = [];
    while (ordning.length < antal) ordning = ordning.concat(blanda(r, lista));
    var sett = {}, ut = [];
    ordning.slice(0, antal).forEach(function (g, i) {
      var q, forsok = 0;
      do { q = G[g](r, c || {}); forsok++; } while (sett[q.text + (q.uttryck || '')] && forsok < 6);
      sett[q.text + (q.uttryck || '')] = 1;
      q.id = 'gen-' + g + '-' + i; q.gen = g;
      ut.push(q);
    });
    return ut;
  }

  return {
    slump: slump, heltal: heltal, valj: valj, blanda: blanda, sgd: sgd, range: range,
    fmt: fmt, fmtN: fmtN, br: br, brakOrd: brakOrd, talbart: talbart, TALORD: TALORD,
    parseTal: parseTal, parseBrak: parseBrak, normText: normText, lev: lev,
    kollaFalt: kollaFalt, kolla: kolla, facit: facit, avrundaMilli: avrundaMilli,
    G: G, genPass: genPass, TAVLA: TAVLA, DELNAMN: DELNAMN
  };
})();
if (typeof module !== 'undefined') module.exports = Lx;
