  // ---------- Geografi: Europas länder ----------
  // Invånare: Eurostat 1 jan 2025 (EU-länder och kandidatländer), SSB, Hagstofa, BFS, ONS (mitten av 2024),
  // Belstat (1 jan 2026), Rosstat (1 jan 2025), Kosovos folkräkning 2024. Ukraina: osäkert på grund av kriget.
  var GEOFAKTA = {
    SE: { namn: 'Sverige', hs: 'Stockholm', inv: 10587700, sprak: 'svenska' },
    NO: { namn: 'Norge', hs: 'Oslo', inv: 5594340, sprak: 'norska' },
    DK: { namn: 'Danmark', hs: 'Köpenhamn', inv: 5992700, sprak: 'danska' },
    FI: { namn: 'Finland', hs: 'Helsingfors', inv: 5636000, sprak: 'finska och svenska' },
    IS: { namn: 'Island', hs: 'Reykjavik', inv: 389444, sprak: 'isländska' },
    GB: { namn: 'Storbritannien', hs: 'London', inv: 69281400, sprak: 'engelska' },
    IE: { namn: 'Irland', hs: 'Dublin', inv: 5439900, sprak: 'iriska och engelska' },
    FR: { namn: 'Frankrike', hs: 'Paris', inv: 68635900, sprak: 'franska' },
    BE: { namn: 'Belgien', hs: 'Bryssel', inv: 11900100, sprak: 'nederländska, franska och tyska' },
    NL: { namn: 'Nederländerna', hs: 'Amsterdam', inv: 18044000, sprak: 'nederländska' },
    LU: { namn: 'Luxemburg', hs: 'Luxemburg', inv: 682000, sprak: 'luxemburgiska, franska och tyska' },
    DE: { namn: 'Tyskland', hs: 'Berlin', inv: 83577100, sprak: 'tyska' },
    PL: { namn: 'Polen', hs: 'Warszawa', inv: 36497500, sprak: 'polska' },
    CZ: { namn: 'Tjeckien', hs: 'Prag', inv: 10909500, sprak: 'tjeckiska' },
    SK: { namn: 'Slovakien', hs: 'Bratislava', inv: 5419500, sprak: 'slovakiska' },
    AT: { namn: 'Österrike', hs: 'Wien', inv: 9197200, sprak: 'tyska' },
    CH: { namn: 'Schweiz', hs: 'Bern', inv: 9048900, sprak: 'tyska, franska, italienska och rätoromanska' },
    HU: { namn: 'Ungern', hs: 'Budapest', inv: 9539500, sprak: 'ungerska' },
    ES: { namn: 'Spanien', hs: 'Madrid', inv: 49078000, sprak: 'spanska' },
    PT: { namn: 'Portugal', hs: 'Lissabon', inv: 10749600, sprak: 'portugisiska' },
    IT: { namn: 'Italien', hs: 'Rom', inv: 58934200, sprak: 'italienska' },
    GR: { namn: 'Grekland', hs: 'Aten', inv: 10409500, sprak: 'grekiska' },
    MT: { namn: 'Malta', hs: 'Valletta', inv: 574300, sprak: 'maltesiska och engelska' },
    CY: { namn: 'Cypern', hs: 'Nicosia', inv: 979900, sprak: 'grekiska och turkiska' },
    SI: { namn: 'Slovenien', hs: 'Ljubljana', inv: 2130900, sprak: 'slovenska' },
    HR: { namn: 'Kroatien', hs: 'Zagreb', inv: 3874400, sprak: 'kroatiska' },
    BA: { namn: 'Bosnien och Hercegovina', hs: 'Sarajevo', inv: 3406568, sprak: 'bosniska, kroatiska och serbiska' },
    RS: { namn: 'Serbien', hs: 'Belgrad', inv: 6567783, sprak: 'serbiska' },
    ME: { namn: 'Montenegro', hs: 'Podgorica', inv: 623327, sprak: 'montenegrinska' },
    AL: { namn: 'Albanien', hs: 'Tirana', inv: 2363314, sprak: 'albanska' },
    MK: { namn: 'Nordmakedonien', hs: 'Skopje', inv: 1822612, sprak: 'makedonska och albanska' },
    XK: { namn: 'Kosovo', hs: 'Pristina', inv: 1602515, sprak: 'albanska och serbiska' },
    BG: { namn: 'Bulgarien', hs: 'Sofia', inv: 6437400, sprak: 'bulgariska' },
    RO: { namn: 'Rumänien', hs: 'Bukarest', inv: 19036400, sprak: 'rumänska' },
    MD: { namn: 'Moldavien', hs: 'Chișinău', inv: 2381325, sprak: 'rumänska' },
    UA: { namn: 'Ukraina', hs: 'Kyiv', inv: 0, invText: 'Ingen vet exakt på grund av kriget, men ungefär 30–35 miljoner', sprak: 'ukrainska' },
    BY: { namn: 'Belarus', hs: 'Minsk', inv: 9056080, sprak: 'belarusiska och ryska' },
    RU: { namn: 'Ryssland', hs: 'Moskva', inv: 146028325, sprak: 'ryska' },
    EE: { namn: 'Estland', hs: 'Tallinn', inv: 1370000, sprak: 'estniska' },
    LV: { namn: 'Lettland', hs: 'Riga', inv: 1856900, sprak: 'lettiska' },
    LT: { namn: 'Litauen', hs: 'Vilnius', inv: 2890700, sprak: 'litauiska' },
    TR: { namn: 'Turkiet', hs: 'Ankara', inv: 85664944, sprak: 'turkiska' }
  };
  var REGIONNAMN = { alla: 'Hela Europa', norden: 'Norden', vast: 'Västeuropa', mellan: 'Mellaneuropa', syd: 'Sydeuropa', balkan: 'Balkan', ost: 'Östeuropa och Baltikum' };
  var GEO_LEDTRAD = {
    IS: 'Island är en ö långt ut i havet, nordväst om Storbritannien.',
    MT: 'Malta är en pytteliten ö mitt i Medelhavet, söder om Italien.',
    CY: 'Cypern är en ö långt österut i Medelhavet, söder om Turkiet.'
  };
  function geoNamn(k) { return GEOFAKTA[k] ? GEOFAKTA[k].namn : ''; }
  function geoGen(n) { return /[sxz]$/i.test(n) ? n : n + 's'; }
  function oxford(arr) { return arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + ' och ' + arr[arr.length - 1]; }
  function geoRegion(k) { var r = ['norden', 'vast', 'mellan', 'syd', 'balkan', 'ost']; for (var i = 0; i < r.length; i++) if (GEO.regioner[r[i]].lander.indexOf(k) >= 0) return r[i]; return 'alla'; }
  function grannar(k) { return (GEO.lander[k].grannar || []).filter(function (x) { return GEOFAKTA[x]; }).map(geoNamn); }
  function invText(k) {
    var f = GEOFAKTA[k], n = f.inv;
    if (!n) return f.invText;
    if (n >= 20e6) return 'cirka ' + Math.round(n / 1e6) + ' miljoner';
    if (n >= 1e6) return 'cirka ' + L.fmtN(Math.round(n / 1e5) / 10, 1) + ' miljoner';
    return 'cirka ' + L.fmt(Math.round(n / 10000) * 10000);
  }
  function jamfor(k) {
    var n = GEOFAKTA[k].inv, sv = GEOFAKTA.SE.inv;
    if (k === 'SE') return 'Här bor du!';
    if (!n) return '';
    var r = n / sv;
    if (r >= 2.5) return 'Ungefär ' + Math.round(r) + ' gånger så många som i Sverige.';
    if (r >= 1.6) return 'Ungefär dubbelt så många som i Sverige.';
    if (r >= 1.12) return 'Lite fler än i Sverige.';
    if (r >= 0.88) return 'Ungefär lika många som i Sverige.';
    if (r >= 0.65) return 'Lite färre än i Sverige.';
    if (r >= 0.4) return 'Ungefär hälften så många som i Sverige.';
    return 'I Sverige bor det ungefär ' + Math.round(1 / r) + ' gånger så många.';
  }
  function geoLedtrad(k) {
    if (GEO_LEDTRAD[k]) return GEO_LEDTRAD[k];
    var g = grannar(k);
    return g.length ? GEOFAKTA[k].namn + ' gränsar till ' + oxford(g) + '.' : GEOFAKTA[k].namn + ' ligger i ' + REGIONNAMN[geoRegion(k)] + '.';
  }

  // Kartan som SVG. o.klass = {kod: 'ratt'|'fel'|'vald'}, o.etiketter = [kod], o.hs = kod (visa huvudstaden)
  function kartaSVG(region, o) {
    o = o || {};
    var R = GEO.regioner[region] || GEO.regioner.alla, vb = R.vb, akt = R.lander, s = '', fs = vb[2] * 0.032, klass = o.klass || {};
    s += '<rect class="geo-hav" x="' + (vb[0] - 40) + '" y="' + (vb[1] - 40) + '" width="' + (vb[2] + 80) + '" height="' + (vb[3] + 80) + '"/>';
    s += '<g class="geo-bg">' + GEO.bakgrund.map(function (d) { return '<path d="' + d + '"/>'; }).join('') + '</g><g class="geo-lander">';
    Object.keys(GEO.lander).forEach(function (k) {
      if (klass[k]) return;
      s += '<path class="geo-land' + (akt.indexOf(k) >= 0 ? ' aktiv' : '') + '" data-land="' + k + '" d="' + GEO.lander[k].d + '"/>';
    });
    // markerade länder ritas sist så att kanterna syns
    Object.keys(klass).forEach(function (k) { if (GEO.lander[k]) s += '<path class="geo-land aktiv ' + klass[k] + '" data-land="' + k + '" d="' + GEO.lander[k].d + '"/>'; });
    s += '</g><g class="geo-mark">';
    Object.keys(klass).forEach(function (k) {
      var L2 = GEO.lander[k]; if (!L2) return;
      var b = L2.box, storlek = Math.max(b[2] - b[0], b[3] - b[1]);
      if (storlek < vb[2] * 0.06) s += '<circle class="geo-ring ' + klass[k] + '" cx="' + L2.mitt[0] + '" cy="' + L2.mitt[1] + '" r="' + Math.max(storlek * 0.8, vb[2] * 0.03).toFixed(1) + '"/>';
    });
    if (o.hs && GEO.lander[o.hs]) {
      var h = GEO.lander[o.hs].hs;
      s += '<path class="geo-hs" transform="translate(' + h[0] + ' ' + h[1] + ') scale(' + (fs / 14).toFixed(3) + ')" d="M0 -10 L2.9 -3.1 L9.5 -3.1 L4.2 1.2 L6.2 8 L0 4 L-6.2 8 L-4.2 1.2 L-9.5 -3.1 L-2.9 -3.1 Z"/>';
      s += '<text class="geo-hs-text" x="' + (h[0] + fs * 0.7).toFixed(1) + '" y="' + (h[1] - fs * 0.5).toFixed(1) + '" style="font-size:' + (fs * 0.8).toFixed(1) + 'px">' + esc(GEOFAKTA[o.hs].hs) + '</text>';
    }
    (o.etiketter || []).forEach(function (k) {
      var L3 = GEO.lander[k]; if (!L3) return;
      var halv = fs * 0.32 * geoNamn(k).length, hsNara = o.hs === k && Math.abs(L3.hs[0] - L3.mitt[0]) < halv + fs * 3 && Math.abs(L3.hs[1] - L3.mitt[1]) < fs * 1.6;
      s += '<text class="geo-etikett ' + (klass[k] || '') + '" x="' + L3.mitt[0] + '" y="' + (L3.mitt[1] + (hsNara ? fs * 1.6 : fs * 0.35)).toFixed(1) + '" style="font-size:' + fs.toFixed(1) + 'px">' + esc(geoNamn(k)) + '</text>';
    });
    s += '</g>';
    return '<svg class="geo-svg" viewBox="' + vb.join(' ') + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Karta: ' + esc(REGIONNAMN[region] || '') + '">' + s + '</svg>';
  }
  function faktakort(k) {
    var f = GEOFAKTA[k], g = grannar(k);
    return '<div class="geo-fakta" aria-live="polite"><h3>' + esc(f.namn) + '</h3><dl>' +
      '<div><dt>Huvudstad</dt><dd>' + IK.stjarna + esc(f.hs) + '</dd></div>' +
      '<div><dt>Invånare</dt><dd>' + esc(invText(k)) + (jamfor(k) ? '<small>' + esc(jamfor(k)) + '</small>' : '') + '</dd></div>' +
      '<div><dt>Språk</dt><dd>' + esc(cap1(f.sprak)) + '</dd></div>' +
      '<div><dt>Grannländer i Europa</dt><dd>' + (g.length ? esc(oxford(g)) : 'Inga. ' + esc(f.namn) + ' är omgivet av hav.') + '</dd></div>' +
      '</dl></div>';
  }
  function cap1(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

  // Vilket land trycker fingret på? Letar runt fingret om man träffar havet precis bredvid.
  function landVid(x, y) {
    var el = document.elementFromPoint(x, y), k = el && el.getAttribute && el.getAttribute('data-land');
    if (k) return k;
    for (var r = 6; r <= 18; r += 6) for (var a = 0; a < 12; a++) {
      var e2 = document.elementFromPoint(x + r * Math.cos(a * Math.PI / 6), y + r * Math.sin(a * Math.PI / 6));
      var k2 = e2 && e2.getAttribute && e2.getAttribute('data-land');
      if (k2) return k2;
    }
    return null;
  }
  // Små länder räknas som rätt om man trycker alldeles intill dem
  function naraLitet(kod, x, y) {
    var el = document.querySelector('.geo-karta [data-land="' + kod + '"]'); if (!el) return false;
    var b = el.getBoundingClientRect(); if (Math.min(b.width, b.height) >= 30) return false;
    var dx = Math.max(b.left - x, 0, x - b.right), dy = Math.max(b.top - y, 0, y - b.bottom);
    return Math.hypot(dx, dy) <= 18;
  }

  // Frågor: "Var ligger …?" för en region, och huvudstadsfrågor
  // Länder vars huvudstad man bör kunna i Sverige: grannländerna i Norden och Europas stora länder
  var VIKTIGA = ['SE', 'NO', 'DK', 'FI', 'IS', 'DE', 'FR', 'GB', 'ES', 'IT', 'PL', 'RU', 'UA', 'NL', 'GR', 'PT', 'TR'];
  function hsAlternativ(k, sak) {
    var f = GEOFAKTA[k], reg = geoRegion(k), pool = Object.keys(GEOFAKTA).filter(function (x) { return x !== k && GEOFAKTA[x].hs !== f.hs && GEOFAKTA[x].namn !== f.hs; });
    var nara = L.blanda(Math.random, pool.filter(function (x) { return geoRegion(x) === reg; })).slice(0, 2);
    var kanda = L.blanda(Math.random, pool.filter(function (x) { return VIKTIGA.indexOf(x) >= 0; }));
    var valda = nara.slice();
    kanda.concat(L.blanda(Math.random, pool)).forEach(function (x) { if (valda.length < 3 && valda.indexOf(x) < 0) valda.push(x); });
    var hamta = function (x) { return sak === 'land' ? GEOFAKTA[x].namn : GEOFAKTA[x].hs; };
    var alt = [hamta(k)].concat(valda.map(hamta)), ord = L.blanda(Math.random, [0, 1, 2, 3]);
    return { alt: ord.map(function (j) { return alt[j]; }), ratt: ord.indexOf(0) };
  }
  function kartFragor(region, antal) {
    var koder = GEO.regioner[region].lander.filter(function (k) { return GEOFAKTA[k]; });
    koder = L.blanda(Math.random, koder);
    if (antal) koder = koder.slice(0, antal);
    return koder.map(function (k) {
      var yta = GEO.lander[k].yta, niva = region === 'alla' ? (yta >= 8000 ? 1 : yta >= 1500 ? 2 : 3) : 0;
      var q = { typ: 'karta', land: k, region: region, amne: 'geo', text: 'Var ligger ' + GEOFAKTA[k].namn + '?', ledtrad: geoLedtrad(k) };
      if (niva) q.niva = niva;
      if (VIKTIGA.indexOf(k) >= 0) q.hsFraga = hsAlternativ(k, 'hs');
      return q;
    });
  }
  function huvudstadsFragor(antal) {
    var alla = Object.keys(GEOFAKTA), koder = L.blanda(Math.random, alla).slice(0, antal);
    return koder.map(function (k, i) {
      var f = GEOFAKTA[k], reg = geoRegion(k);
      var fragaHs = i % 2 === 0, a = hsAlternativ(k, fragaHs ? 'hs' : 'land');
      return {
        typ: 'val', amne: 'geo', visaLand: k, fast: true, alt: a.alt, ratt: a.ratt,
        text: fragaHs ? 'Vilken är ' + geoGen(f.namn) + ' huvudstad?' : 'Vilket land har huvudstaden ' + f.hs + '?',
        ledtrad: fragaHs ? 'Huvudstaden börjar på bokstaven ' + f.hs.charAt(0) + '.' : f.hs + ' ligger i ' + REGIONNAMN[reg] + '.'
      };
    });
  }

  // Svar på en kartfråga
  function geoTryck(x, y, malEl) {
    var q = P.q;
    if (P.klar) { var k0 = landVid(x, y); if (k0 && GEOFAKTA[k0]) { P.geo.info = k0; ljud('tap'); ritaInteraktion(); } return; }
    if (P.geo && P.geo.steg === 'hs') return;
    var kod = naraLitet(q.land, x, y) ? q.land : landVid(x, y);
    if (!kod) { P.besked = { typ: 'info', text: 'Där är det hav. Försök igen!' }; ritaInteraktion(); return; }
    if (!GEOFAKTA[kod]) { P.besked = { typ: 'info', text: 'Det där landet är inte med i spelet. Försök igen!' }; ritaInteraktion(); return; }
    if (kod === q.land) {
      if (!q.hsFraga) {
        P.geo = { ratt: kod, info: kod };
        lyckat(GEOFAKTA[kod].namn + ' har grönt nu. Huvudstaden är ' + GEOFAKTA[kod].hs + '.', malEl);
        return;
      }
      // Rätt land. Nu kommer en fråga om huvudstaden innan fakta visas.
      var p = (P.forsok === 0 && !P.ledtrad) ? 2 : 1;
      P.utfall = p === 2 ? 'ratt' : 'ratt2'; P.resultat[P.i] = P.utfall; laggTillStjarnor(p);
      P.geo = { ratt: kod, steg: 'hs' };
      P.besked = { typ: 'ratt', text: BEROM[Math.floor(Math.random() * BEROM.length)], note: 'Nu en fråga till om ' + GEOFAKTA[kod].namn + '.', plus: p };
      ljud('ratt'); minSpel('jubel', 1200); rorelse(slumpRorelse());
      var fran = malEl && malEl.getBoundingClientRect();
      ritaInteraktion(); konfettiFran(fran, 40);
      return;
    }
    P.forsok++; P.utfall = 'miss'; P.resultat[P.i] = 'miss';
    laggTillMissad(q);
    if (q.hsFraga) { P.geo = { ratt: q.land, fel: kod, steg: 'hs' }; }
    else { P.klar = true; P.geo = { ratt: q.land, fel: kod, info: q.land }; }
    P.besked = { typ: 'fel', text: 'Det där är ' + geoNamn(kod) + '. ' + geoNamn(q.land) + ' är landet som lyser grönt.' + (q.hsFraga ? ' Kan du huvudstaden?' : '') };
    ljud('fel'); minSpel('hmm', 1400); rorelse('hmm');
    ritaInteraktion();
  }

  // Svar på huvudstadsfrågan efter kartan
  function geoHsSvar(i) {
    var q = P.q, f = GEOFAKTA[q.land]; if (!P.geo || P.geo.steg !== 'hs') return;
    var ratt = i === q.hsFraga.ratt;
    P.geo.steg = 'klar'; P.geo.hsVal = i; P.geo.info = q.land; P.klar = true;
    if (ratt) {
      laggTillStjarnor(1);
      if (P.setId === 'igen' && P.utfall !== 'miss') taBortMissad(q);
      P.besked = { typ: 'ratt', text: 'Rätt!', note: geoGen(f.namn) + ' huvudstad är ' + f.hs + '.', plus: 1 };
      ljud('ratt'); minSpel('jubel', 1200);
      ritaInteraktion(); konfettiFran($('.geo-hsfraga .alt.ratt'), 40);
    } else {
      if (P.utfall === 'ratt' || P.utfall === 'ratt2') { P.utfall = 'ratt2'; P.resultat[P.i] = 'ratt2'; }
      var a = hsAlternativ(q.land, 'hs');
      S.missade = S.missade.filter(function (m) { return !(m.q && m.q.hsMiss === q.land); });
      laggTillMissad({ typ: 'val', amne: 'geo', hsMiss: q.land, visaLand: q.land, fast: true, alt: a.alt, ratt: a.ratt, text: 'Vilken är ' + geoGen(f.namn) + ' huvudstad?', ledtrad: 'Huvudstaden börjar på bokstaven ' + f.hs.charAt(0) + '.' });
      P.besked = { typ: 'fel', text: geoGen(f.namn) + ' huvudstad är ' + f.hs + '. Den frågan kommer tillbaka i Öva igen.' };
      ljud('fel'); minSpel('hmm', 1200);
      ritaInteraktion();
    }
  }
  function hsRuta(q) {
    var G = P.geo || {}, f = GEOFAKTA[q.land], klar = G.steg === 'klar';
    return '<div class="geo-hsfraga" data-r="' + q.hsFraga.ratt + '"><h3>Vad heter ' + esc(geoGen(f.namn)) + ' huvudstad?</h3><div class="alternativ fyra">' +
      q.hsFraga.alt.map(function (a, i) {
        var cls = klar ? (i === q.hsFraga.ratt ? ' ratt' : i === G.hsVal ? ' fel' : '') : '';
        return '<button class="alt' + cls + '" data-act="geo-hs" data-i="' + i + '"' + (klar ? ' disabled' : '') + '><span class="bokstav">' + 'ABCD'[i] + '</span><span>' + esc(a) + '</span></button>';
      }).join('') + '</div></div>';
  }

  // Vy: Utforska kartan
  var U = { region: 'alla', vald: null };
  function vyUtforska() {
    var set = hittaSet(aktivtSet) || hittaSet('europa');
    var chips = ['alla', 'norden', 'vast', 'mellan', 'syd', 'balkan', 'ost'].map(function (r) { return '<button class="geo-region' + (U.region === r ? ' aktiv' : '') + '" data-act="geo-region" data-r="' + r + '" aria-pressed="' + (U.region === r) + '">' + REGIONNAMN[r] + '</button>'; }).join('');
    var klass = {}; if (U.vald) klass[U.vald] = 'vald';
    return '<div class="vy"><div class="inre">' +
      '<header class="setvy-topp"><button class="ikon-knapp" data-act="geo-tillbaka" aria-label="Tillbaka">' + IK.tillbaka + '</button><div><span class="chip geo">Geografi</span><h1>Utforska kartan</h1><p>Tryck på ett land, så får du veta mer om det.</p></div></header>' +
      '<div class="geo-regioner">' + chips + '</div>' +
      '<div class="geo-utforska"><div class="geo-karta utforska">' + kartaSVG(U.region, { klass: klass, hs: U.vald, etiketter: U.vald ? [U.vald] : [] }) + '</div>' +
      (U.vald ? faktakort(U.vald) : '<p class="geo-tips">' + IK.lampa + '<span>Tryck på ett land på kartan. Välj en del av Europa ovanför för att zooma in.</span></p>') + '</div>' +
      '</div></div>';
  }
