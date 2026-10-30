/* ===== Lekgympan (Leo, 5 år): frågorna =====
   Allt är slumpat: vilken fråga, vilka saker, vilket svar som är rätt och var svaren hamnar.
   Grund: Lpfö 18 (förskolans läroplan) – antal, ordning, talbegrepp, former, mönster, färger, bokstäver,
   språkljud och tidig läsning – och upplägget i Albert Junior (bildstöd, uppläst instruktion, korta pass).
   Varje fråga: { typ: 'val'|'bygg'|'tryck', text, tal (det som läses upp), bild, alt, ratt, ... } */
var Leo = (function () {
  'use strict';

  function blanda(rnd, arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function range(n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; }
  function slump(rnd, arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function tal(rnd, lo, hi) { return lo + Math.floor(rnd() * (hi - lo + 1)); }
  // Tar n olika saker ur en lista, med en given sak först (den rätta) om fast anges
  function valAlt(rnd, pool, ratt, n, lika) {
    lika = lika || function (a, b) { return a === b; };
    var alt = [ratt], kand = blanda(rnd, pool.filter(function (x) { return !lika(x, ratt); }));
    while (alt.length < n && kand.length) alt.push(kand.shift());
    var ordning = blanda(rnd, range(alt.length));
    return { alt: ordning.map(function (i) { return alt[i]; }), ratt: ordning.indexOf(0) };
  }

  // ---------- Bildbank (emoji som Android ritar själv) ----------
  var SAKER = [
    { e: '⚽', ett: 'boll', flera: 'bollar' }, { e: '🏒', ett: 'klubba', flera: 'klubbor' }, { e: '🥅', ett: 'mål', flera: 'mål' },
    { e: '🍗', ett: 'nugget', flera: 'nuggets' }, { e: '🍬', ett: 'godis', flera: 'godisar' }, { e: '🍭', ett: 'klubba', flera: 'slickepinnar' },
    { e: '⭐', ett: 'stjärna', flera: 'stjärnor' }, { e: '🍎', ett: 'äpple', flera: 'äpplen' }, { e: '🐸', ett: 'groda', flera: 'grodor' },
    { e: '🚗', ett: 'bil', flera: 'bilar' }, { e: '🎈', ett: 'ballong', flera: 'ballonger' }, { e: '🏆', ett: 'pokal', flera: 'pokaler' },
    { e: '🧸', ett: 'nalle', flera: 'nallar' }, { e: '🍓', ett: 'jordgubbe', flera: 'jordgubbar' }, { e: '🦁', ett: 'lejon', flera: 'lejon' }
  ];
  var FARGER = [
    { id: 'rod', namn: 'röd', den: 'röda', hex: '#E53935' }, { id: 'bla', namn: 'blå', den: 'blåa', hex: '#1E88E5' },
    { id: 'gron', namn: 'grön', den: 'gröna', hex: '#43A047' }, { id: 'gul', namn: 'gul', den: 'gula', hex: '#FDD835' },
    { id: 'orange', namn: 'orange', den: 'orangea', hex: '#FB8C00' }, { id: 'lila', namn: 'lila', den: 'lila', hex: '#8E24AA' },
    { id: 'rosa', namn: 'rosa', den: 'rosa', hex: '#F48FB1' }, // ljusrosa, så att den inte förväxlas med röd { id: 'svart', namn: 'svart', den: 'svarta', hex: '#263238' },
    { id: 'vit', namn: 'vit', den: 'vita', hex: '#FAFAFA' }, { id: 'brun', namn: 'brun', den: 'bruna', hex: '#8D6E63' }
  ];
  var FORMER = [
    { id: 'cirkel', namn: 'cirkel', den: 'cirkeln' }, { id: 'kvadrat', namn: 'fyrkant', den: 'fyrkanten' }, { id: 'triangel', namn: 'triangel', den: 'triangeln' },
    { id: 'rektangel', namn: 'rektangel', den: 'rektangeln' }, { id: 'stjarna', namn: 'stjärna', den: 'stjärnan' }, { id: 'hjarta', namn: 'hjärta', den: 'hjärtat' },
    { id: 'oval', namn: 'oval', den: 'ovalen' }, { id: 'hexagon', namn: 'sexkant', den: 'sexkanten' }
  ];
  // Ord som börjar på varje bokstav (bild + ord). Uttalet av bokstavsljudet läses upp av appen.
  var ORD = [
    { o: 'APA', e: '🐒' }, { o: 'BOLL', e: '⚽' }, { o: 'CYKEL', e: '🚲' }, { o: 'DRAKE', e: '🐉' }, { o: 'ELEFANT', e: '🐘' }, { o: 'FISK', e: '🐟' },
    { o: 'GODIS', e: '🍬' }, { o: 'HUND', e: '🐶' }, { o: 'IGELKOTT', e: '🦔' }, { o: 'JORDGUBBE', e: '🍓' }, { o: 'KATT', e: '🐱' }, { o: 'LEJON', e: '🦁' },
    { o: 'MÅL', e: '🥅' }, { o: 'NALLE', e: '🧸' }, { o: 'ORM', e: '🐍' }, { o: 'PINGVIN', e: '🐧' }, { o: 'RAKET', e: '🚀' }, { o: 'SOL', e: '☀️' },
    { o: 'TÅG', e: '🚂' }, { o: 'UGGLA', e: '🦉' }, { o: 'VAL', e: '🐳' }, { o: 'ZEBRA', e: '🦓' }, { o: 'ÄPPLE', e: '🍎' }, { o: 'ÖGA', e: '👁️' },
    { o: 'FOTBOLL', e: '⚽' }, { o: 'HOCKEY', e: '🏒' }, { o: 'KRAM', e: '🤗' }, { o: 'GLASS', e: '🍦' }, { o: 'BANAN', e: '🍌' }, { o: 'BIL', e: '🚗' },
    { o: 'HUS', e: '🏠' }, { o: 'BUSS', e: '🚌' }, { o: 'KO', e: '🐄' }, { o: 'GRIS', e: '🐷' }, { o: 'RÄV', e: '🦊' }, { o: 'MUS', e: '🐭' },
    { o: 'ROS', e: '🌹' }, { o: 'SKO', e: '👟' }, { o: 'HATT', e: '🎩' }, { o: 'ÄGG', e: '🥚' }, { o: 'BOK', e: '📖' }, { o: 'TÅRTA', e: '🎂' },
    { o: 'BJÖRN', e: '🐻' }, { o: 'KANIN', e: '🐰' }, { o: 'MOLN', e: '☁️' }, { o: 'MÅNE', e: '🌙' }, { o: 'STJÄRNA', e: '⭐' }, { o: 'POKAL', e: '🏆' }
  ];
  var LASORD = ORD.filter(function (w) { return w.o.length <= 4 && w.o.indexOf('CKEY') < 0; }); // korta ord att läsa och bygga
  var RIM = [[{ o: 'KATT', e: '🐱' }, { o: 'HATT', e: '🎩' }], [{ o: 'BIL', e: '🚗' }, { o: 'PIL', e: '🏹' }], [{ o: 'HUS', e: '🏠' }, { o: 'MUS', e: '🐭' }], [{ o: 'SOL', e: '☀️' }, { o: 'STOL', e: '🪑' }],
    [{ o: 'GRIS', e: '🐷' }, { o: 'RIS', e: '🍚' }], [{ o: 'KO', e: '🐄' }, { o: 'SKO', e: '👟' }], [{ o: 'HAND', e: '✋' }, { o: 'SAND', e: '🏖️' }], [{ o: 'TÅG', e: '🚂' }, { o: 'VÅG', e: '🌊' }]];
  // Alla bilder är emoji som finns i Android 10 och senare (Unicode 12), så att de syns på äldre plattor.
  var BOKSTAVER = 'ABCDEFGHIJKLMNOPRSTUVÅÄÖ'.split('');
  var SIFFERORD = ['noll', 'ett', 'två', 'tre', 'fyra', 'fem', 'sex', 'sju', 'åtta', 'nio', 'tio', 'elva', 'tolv', 'tretton', 'fjorton', 'femton', 'sexton', 'sjutton', 'arton', 'nitton', 'tjugo'];
  function sifferord(n) { return SIFFERORD[n] || String(n); }
  function bokstavsnamn(b) { return b; } // läses upp som bokstavens namn av talsyntesen

  // ---------- Hur stora tal, beroende på nivå (1–3) ----------
  function maxTal(niva) { return niva >= 3 ? 20 : niva === 2 ? 10 : 5; }

  // ---------- Räkna och siffror ----------
  var G = {};
  G.rakna = function (rnd, niva) {
    var s = slump(rnd, SAKER), n = tal(rnd, 1, Math.min(10, maxTal(niva)));
    var pool = range(Math.min(10, maxTal(niva))).map(function (i) { return i + 1; });
    var v = valAlt(rnd, pool, n, 3);
    return { typ: 'val', text: 'Hur många ' + s.flera + ' ser du?', tal: 'Hur många ' + s.flera + ' ser du? Räkna och tryck på rätt siffra.',
      bild: { typ: 'saker', e: s.e, n: n }, alt: v.alt.map(function (x) { return { text: String(x), tal: sifferord(x), stor: true }; }), ratt: v.ratt, ljud: 'ratt' };
  };
  G.siffra = function (rnd, niva) {
    var m = maxTal(niva), n = tal(rnd, niva === 1 ? 1 : 0, m);
    var v = valAlt(rnd, range(m + 1), n, niva === 1 ? 3 : 4);
    return { typ: 'val', text: 'Tryck på siffran ' + n, tal: 'Tryck på siffran ' + sifferord(n) + '.',
      alt: v.alt.map(function (x) { return { text: String(x), tal: sifferord(x), stor: true }; }), ratt: v.ratt };
  };
  G.tryck = function (rnd, niva) {
    var s = slump(rnd, SAKER), n = tal(rnd, 2, Math.min(10, maxTal(niva))), antal = niva === 1 ? 6 : 10;
    return { typ: 'tryck', text: 'Tryck på ' + sifferord(n) + ' ' + s.flera, tal: 'Tryck på ' + sifferord(n) + ' ' + s.flera + '. Räkna högt medan du trycker, och tryck sedan på bocken.',
      bild: { typ: 'saker', e: s.e, n: antal }, mal: n, e: s.e };
  };
  G.flest = function (rnd, niva) {
    var a = slump(rnd, SAKER), b = slump(rnd, SAKER.filter(function (x) { return x.e !== a.e; }));
    var m = Math.min(8, maxTal(niva)), na = tal(rnd, 1, m), nb; do { nb = tal(rnd, 1, m); } while (nb === na);
    var fler = rnd() < 0.5, v = blanda(rnd, [{ s: a, n: na }, { s: b, n: nb }]);
    var ratt = v[0].n === (fler ? Math.max(na, nb) : Math.min(na, nb)) ? 0 : 1;
    return { typ: 'val', text: 'Vilka är det ' + (fler ? 'flest' : 'minst') + ' av?', tal: 'Vilka är det ' + (fler ? 'flest' : 'minst') + ' av? Tryck på rutan.',
      alt: v.map(function (x) { return { bild: { typ: 'saker', e: x.s.e, n: x.n }, tal: sifferord(x.n) + ' ' + x.s.flera }; }), ratt: ratt, bred: true };
  };
  G.efter = function (rnd, niva) {
    var m = maxTal(niva), fore = rnd() < 0.35 && niva > 1, n = fore ? tal(rnd, 2, m) : tal(rnd, 1, m - 1), svar = fore ? n - 1 : n + 1;
    var v = valAlt(rnd, range(m + 1), svar, 3);
    return { typ: 'val', text: 'Vilken siffra kommer ' + (fore ? 'före' : 'efter') + ' ' + n + '?', tal: 'Vilken siffra kommer ' + (fore ? 'före' : 'efter') + ' ' + sifferord(n) + '?',
      bild: { typ: 'talrad', m: m, n: n }, alt: v.alt.map(function (x) { return { text: String(x), tal: sifferord(x), stor: true }; }), ratt: v.ratt };
  };
  G.plus = function (rnd, niva) {
    var s = slump(rnd, SAKER), m = niva >= 3 ? 10 : 5, a = tal(rnd, 1, m - 1), b = tal(rnd, 1, m - a), svar = a + b;
    var v = valAlt(rnd, range(m + 1).map(function (i) { return i + 1; }), svar, 3);
    return { typ: 'val', text: a + ' ' + (a === 1 ? s.ett : s.flera) + ' och ' + b + ' till. Hur många blir det?', tal: sifferord(a) + ' ' + (a === 1 ? s.ett : s.flera) + ', och ' + sifferord(b) + ' till. Hur många blir det tillsammans?',
      bild: { typ: 'plus', e: s.e, a: a, b: b }, alt: v.alt.map(function (x) { return { text: String(x), tal: sifferord(x), stor: true }; }), ratt: v.ratt };
  };
  G.ordning = function (rnd, niva) {
    var m = maxTal(niva), start = tal(rnd, 1, Math.max(1, m - 3)), n = niva === 1 ? 3 : 4, items = range(n).map(function (i) { return start + i; });
    return { typ: 'bygg', text: 'Lägg siffrorna i rätt ordning', tal: 'Lägg siffrorna i rätt ordning. Börja med den minsta.', items: items.map(function (x) { return { text: String(x), tal: sifferord(x) }; }), stor: true };
  };

  // ---------- Bokstäver ----------
  G.borjar = function (rnd, niva) {
    var w = slump(rnd, ORD), b = w.o.charAt(0);
    var v = valAlt(rnd, BOKSTAVER, b, niva === 1 ? 3 : 4);
    return { typ: 'val', text: 'Vilken bokstav börjar ' + w.o + ' på?', tal: 'Vilken bokstav börjar ' + w.o.toLowerCase() + ' på?',
      bild: { typ: 'bild', e: w.e, text: niva >= 2 ? w.o : '' }, alt: v.alt.map(function (x) { return { text: x, tal: x, stor: true, bokstav: true }; }), ratt: v.ratt };
  };
  G.hitta = function (rnd, niva) {
    var b = slump(rnd, BOKSTAVER), liten = niva >= 2 && rnd() < 0.5;
    var v = valAlt(rnd, BOKSTAVER, b, niva === 1 ? 3 : 4);
    return { typ: 'val', text: 'Tryck på bokstaven ' + b, tal: 'Tryck på bokstaven ' + b + '.',
      alt: v.alt.map(function (x) { return { text: liten ? x.toLowerCase() : x, tal: x, stor: true, bokstav: true }; }), ratt: v.ratt };
  };
  G.storliten = function (rnd) {
    var b = slump(rnd, BOKSTAVER.filter(function (x) { return 'CKOPSUVWXZ'.indexOf(x) < 0; })); // bokstäver som ser olika ut som stora och små
    var v = valAlt(rnd, BOKSTAVER, b, 3);
    return { typ: 'val', text: 'Vilken är lilla ' + b + '?', tal: 'Här är stora ' + b + '. Vilken är lilla ' + b + '?',
      bild: { typ: 'bokstav', text: b }, alt: v.alt.map(function (x) { return { text: x.toLowerCase(), tal: 'lilla ' + x, stor: true, bokstav: true }; }), ratt: v.ratt };
  };
  G.namn = function (rnd) {
    var namn = 'LEO', i = tal(rnd, 0, namn.length - 1), b = namn.charAt(i);
    var v = valAlt(rnd, BOKSTAVER, b, 3);
    return { typ: 'val', text: 'Vilken bokstav fattas i LEO?', tal: 'Vilken bokstav fattas i ditt namn?',
      bild: { typ: 'bokstav', text: namn.split('').map(function (c, j) { return j === i ? '_' : c; }).join('') }, alt: v.alt.map(function (x) { return { text: x, tal: x, stor: true, bokstav: true }; }), ratt: v.ratt };
  };
  G.byggnamn = function (rnd) {
    return { typ: 'bygg', text: 'Bygg ditt namn', tal: 'Bygg ditt namn med bokstäverna.', items: 'LEO'.split('').map(function (c) { return { text: c, tal: c }; }), stor: true, bokstav: true };
  };

  // ---------- Former, färger och mönster ----------
  G.form = function (rnd, niva) {
    var f = slump(rnd, FORMER.slice(0, niva === 1 ? 5 : FORMER.length)), farg = slump(rnd, FARGER.slice(0, 7));
    var v = valAlt(rnd, FORMER.slice(0, niva === 1 ? 5 : FORMER.length), f, niva === 1 ? 3 : 4, function (a, b) { return a.id === b.id; });
    return { typ: 'val', text: 'Tryck på ' + f.den, tal: 'Tryck på ' + f.den + '.',
      alt: v.alt.map(function (x) { return { form: x.id, farg: farg.hex, tal: x.namn }; }), ratt: v.ratt };
  };
  G.farg = function (rnd, niva) {
    var pool = FARGER.slice(0, niva === 1 ? 6 : FARGER.length), c = slump(rnd, pool), s = slump(rnd, [{ id: 'cirkel', namn: 'bollen' }, { id: 'kvadrat', namn: 'rutan' }, { id: 'stjarna', namn: 'stjärnan' }, { id: 'hjarta', namn: 'hjärtat' }]);
    var v = valAlt(rnd, pool, c, niva === 1 ? 3 : 4, function (a, b) { return a.id === b.id; });
    return { typ: 'val', text: 'Tryck på den ' + c.den + ' ' + s.namn, tal: 'Tryck på den ' + c.den + ' ' + s.namn + '.',
      alt: v.alt.map(function (x) { return { form: s.id, farg: x.hex, tal: x.namn }; }), ratt: v.ratt };
  };
  G.formfarg = function (rnd) {
    var f = slump(rnd, FORMER.slice(0, 5)), c = slump(rnd, FARGER.slice(0, 6));
    // Fyra olika rutor: rätt, samma form i annan färg, samma färg i annan form, och en helt annan – så att båda orden behövs
    var f2 = slump(rnd, FORMER.slice(0, 5).filter(function (x) { return x.id !== f.id; })), c2 = slump(rnd, FARGER.slice(0, 6).filter(function (x) { return x.id !== c.id; }));
    var f3 = slump(rnd, FORMER.slice(0, 5).filter(function (x) { return x.id !== f.id && x.id !== f2.id; })), c3 = slump(rnd, FARGER.slice(0, 6).filter(function (x) { return x.id !== c.id && x.id !== c2.id; }));
    var v = valAlt(rnd, [{ form: f, farg: c }, { form: f, farg: c2 }, { form: f2, farg: c }, { form: f3, farg: c3 }], { form: f, farg: c }, 4, function (a, b) { return a.form.id === b.form.id && a.farg.id === b.farg.id; });
    return { typ: 'val', text: 'Tryck på den ' + c.den + ' ' + f.den, tal: 'Tryck på den ' + c.den + ' ' + f.den + '.',
      alt: v.alt.map(function (x) { return { form: x.form.id, farg: x.farg.hex, tal: x.farg.namn + ' ' + x.form.namn }; }), ratt: v.ratt };
  };
  G.monster = function (rnd, niva) {
    var former = blanda(rnd, FORMER.slice(0, 5)).slice(0, niva >= 3 ? 3 : 2), farger = blanda(rnd, FARGER.slice(0, 6)).slice(0, former.length);
    var enheter = former.map(function (f, i) { return { form: f.id, farg: farger[i].hex, tal: farger[i].namn + ' ' + f.namn }; });
    var monster = niva >= 2 && rnd() < 0.5 ? [0, 0, 1] : enheter.length === 3 ? [0, 1, 2] : [0, 1];
    var rad = [], k = 0; while (rad.length < (niva === 1 ? 4 : 6)) { rad.push(enheter[monster[k % monster.length]]); k++; }
    var svar = enheter[monster[k % monster.length]];
    var v = valAlt(rnd, enheter, svar, Math.min(3, enheter.length), function (a, b) { return a.tal === b.tal; });
    if (v.alt.length < 3) { var extra = { form: slump(rnd, FORMER.slice(5)).id, farg: slump(rnd, FARGER.slice(6)).hex, tal: 'en annan' }; v.alt.push(extra); }
    return { typ: 'val', text: 'Vad kommer sen i mönstret?', tal: 'Titta på mönstret. Vad kommer sen?', bild: { typ: 'monster', rad: rad }, alt: v.alt, ratt: v.ratt };
  };
  G.storst = function (rnd) {
    var s = slump(rnd, SAKER), storst = rnd() < 0.5, st = blanda(rnd, [1, 1.7, 2.6]);
    var ratt = st.indexOf(storst ? 2.6 : 1);
    return { typ: 'val', text: 'Tryck på den ' + (storst ? 'största' : 'minsta') + ' ' + (s.ett === 'mål' ? 'målet' : s.ett + 'en'), tal: 'Tryck på den ' + (storst ? 'största' : 'minsta') + '.',
      alt: st.map(function (x) { return { e: s.e, skala: x, tal: x === 2.6 ? 'stor' : x === 1 ? 'liten' : 'mellan' }; }), ratt: ratt };
  };

  // ---------- Läsa ----------
  G.ordbild = function (rnd, niva) {
    var pool = LASORD.filter(function (w) { return niva === 1 ? w.o.length <= 3 : true; }), w = slump(rnd, pool);
    var v = valAlt(rnd, pool, w, 3, function (a, b) { return a.e === b.e || a.o === b.o; });
    return { typ: 'val', text: 'Vad står det?', tal: 'Ljuda bokstäverna. Vad står det? Tryck på rätt bild.',
      bild: { typ: 'ord', text: w.o }, alt: v.alt.map(function (x) { return { e: x.e, tal: x.o.toLowerCase() }; }), ratt: v.ratt, lasa: w.o };
  };
  G.bildord = function (rnd, niva) {
    var pool = LASORD.filter(function (w) { return niva === 1 ? w.o.length <= 3 : true; }), w = slump(rnd, pool);
    var v = valAlt(rnd, pool, w, 3, function (a, b) { return a.e === b.e || a.o === b.o; });
    return { typ: 'val', text: 'Vilket ord är ' + w.o + '?', tal: 'Här är en ' + w.o.toLowerCase() + '. Vilket ord står det ' + w.o.toLowerCase() + ' på?',
      bild: { typ: 'bild', e: w.e }, alt: v.alt.map(function (x) { return { text: x.o, tal: x.o.toLowerCase(), ord: true }; }), ratt: v.ratt };
  };
  G.bygg = function (rnd, niva) {
    var pool = LASORD.filter(function (w) { return niva === 1 ? w.o.length <= 3 : w.o.length <= 4; }), w = slump(rnd, pool);
    return { typ: 'bygg', text: 'Bygg ordet ' + w.o, tal: 'Bygg ordet ' + w.o.toLowerCase() + '. Tryck på bokstäverna i rätt ordning.',
      bild: { typ: 'bild', e: w.e }, items: w.o.split('').map(function (c) { return { text: c, tal: c }; }), bokstav: true, stor: true };
  };
  G.rim = function (rnd) {
    var par = slump(rnd, RIM), i = tal(rnd, 0, 1), w = par[i], svar = par[1 - i];
    var andra = blanda(rnd, LASORD.filter(function (x) { return x.o.slice(-2) !== w.o.slice(-2); })).slice(0, 2);
    var v = valAlt(rnd, [svar].concat(andra), svar, 3, function (a, b) { return a.o === b.o; });
    return { typ: 'val', text: 'Vad rimmar på ' + w.o + '?', tal: 'Vad rimmar på ' + w.o.toLowerCase() + '?',
      bild: { typ: 'bild', e: w.e, text: w.o }, alt: v.alt.map(function (x) { return { e: x.e, text: x.o, tal: x.o.toLowerCase() }; }), ratt: v.ratt };
  };
  G.slutar = function (rnd) {
    var w = slump(rnd, LASORD), b = w.o.charAt(w.o.length - 1);
    var v = valAlt(rnd, BOKSTAVER, b, 3);
    return { typ: 'val', text: 'Vilken bokstav slutar ' + w.o + ' på?', tal: 'Vilken bokstav slutar ' + w.o.toLowerCase() + ' på? Lyssna på sista ljudet.',
      bild: { typ: 'bild', e: w.e, text: w.o }, alt: v.alt.map(function (x) { return { text: x, tal: x, stor: true, bokstav: true }; }), ratt: v.ratt };
  };

  // ---------- Banorna ----------
  var BANOR = [
    { id: 'rakna', titel: 'Räkna', under: 'Siffror och antal', e: '⚽', gen: { 1: ['rakna', 'siffra', 'tryck', 'flest', 'efter'], 2: ['rakna', 'siffra', 'tryck', 'flest', 'efter', 'plus', 'ordning'], 3: ['rakna', 'siffra', 'tryck', 'flest', 'efter', 'plus', 'ordning'] } },
    { id: 'bokstaver', titel: 'Bokstäver', under: 'Ljud och bokstäver', e: '🔤', gen: { 1: ['borjar', 'hitta', 'namn', 'byggnamn'], 2: ['borjar', 'hitta', 'namn', 'storliten', 'slutar'], 3: ['borjar', 'hitta', 'storliten', 'slutar', 'bygg'] } },
    { id: 'former', titel: 'Former och färger', under: 'Former, färger, mönster', e: '🔺', gen: { 1: ['form', 'farg', 'storst', 'monster'], 2: ['form', 'farg', 'formfarg', 'monster', 'storst'], 3: ['form', 'farg', 'formfarg', 'monster'] } },
    { id: 'lasa', titel: 'Läsa', under: 'Korta ord', e: '📖', gen: { 1: ['bildord', 'ordbild', 'bygg', 'borjar'], 2: ['bildord', 'ordbild', 'bygg', 'rim'], 3: ['ordbild', 'bygg', 'rim', 'slutar'] } },
    { id: 'mix', titel: 'Blandat', under: 'Lite av allt', e: '🌟', gen: { 1: ['rakna', 'siffra', 'borjar', 'hitta', 'form', 'farg', 'bildord', 'tryck'], 2: ['rakna', 'flest', 'efter', 'borjar', 'storliten', 'formfarg', 'monster', 'ordbild', 'bygg', 'tryck'], 3: ['plus', 'ordning', 'slutar', 'bygg', 'rim', 'monster', 'formfarg', 'flest', 'efter', 'tryck'] } }
  ];
  function bana(id) { return BANOR.filter(function (b) { return b.id === id; })[0]; }

  // Ett pass: n frågor, slumpad blandning av banans generatorer utan att samma kommer två gånger i rad
  function genPass(rnd, banaId, niva, n) {
    var b = bana(banaId), lista = b.gen[Math.max(1, Math.min(3, niva))], ut = [], sist = '';
    for (var i = 0; i < n; i++) {
      var kand = lista.filter(function (g) { return g !== sist; }), g = slump(rnd, kand), q;
      for (var f = 0; f < 6; f++) { q = G[g](rnd, niva); if (!ut.some(function (x) { return samma(x, q); })) break; }
      q.gen = g; q.bana = banaId; ut.push(q); sist = g;
    }
    return ut;
  }
  function samma(a, b) { return a.gen === b.gen && a.text === b.text && JSON.stringify(a.alt || a.items) === JSON.stringify(b.alt || b.items); }

  return { BANOR: BANOR, bana: bana, genPass: genPass, G: G, blanda: blanda, range: range, sifferord: sifferord, FORMER: FORMER, FARGER: FARGER, SAKER: SAKER, ORD: ORD };
})();
