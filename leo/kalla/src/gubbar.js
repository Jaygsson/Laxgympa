/* ===== Lekgympan: Leos figurer =====
   Samma skelett och samma API som Lovas gubbar.js (Gubbar.LISTA, figur, huvud, hangare, namn, arApa), så att
   alla rörelser i style.css och bonusspelen i spel.js fungerar oförändrade. Figurerna är nya: sportgosedjur.
   Skelett: huvud runt (80,66), axlar i (60,112) och (100,112), höfter i (71,144) och (89,144), fötter vid y≈180. */
var Gubbar = (function () {
  'use strict';
  var K = 'var(--kontur)', uid = 0;
  var LISTA = [
    { id: 'lejon', namn: 'Lejonet' }, { id: 'hund', namn: 'Hunden' }, { id: 'bjorn', namn: 'Björnen' },
    { id: 'pingvin', namn: 'Pingvinen' }, { id: 'groda', namn: 'Grodan', apa: true }, { id: 'apa', namn: 'Apan', apa: true }
  ];
  var BODY = 'M58 108 C64 98 96 98 102 108 L106 146 C98 154 62 154 54 146 Z';

  function munnar(y, bred, tunga) {
    var w = bred || 9;
    return '<path class="m m-glad" d="M' + (80 - w) + ' ' + y + ' Q80 ' + (y + 8) + ' ' + (80 + w) + ' ' + y + '" fill="none" stroke="' + K + '" stroke-width="2.6" stroke-linecap="round"/>' +
      (tunga ? '<ellipse class="m m-glad" cx="80" cy="' + (y + 5) + '" rx="3.4" ry="2.5" fill="#F49AB8"/>' : '') +
      '<g class="m m-jubel"><path d="M' + (80 - w - 1) + ' ' + (y - 1) + ' Q80 ' + (y + 17) + ' ' + (80 + w + 1) + ' ' + (y - 1) + ' Z" fill="' + K + '" stroke="' + K + '" stroke-width="2" stroke-linejoin="round"/><ellipse cx="80" cy="' + (y + 8) + '" rx="4.5" ry="2.8" fill="#F49AB8"/></g>' +
      '<path class="m m-hmm" d="M' + (80 - w + 2) + ' ' + (y + 4) + ' Q80 ' + (y) + ' ' + (80 + w - 2) + ' ' + (y + 4) + '" fill="none" stroke="' + K + '" stroke-width="2.6" stroke-linecap="round"/>';
  }
  function ogon(x1, x2, y, rx, ry, farg) {
    return '<g class="k-ogon"><ellipse cx="' + x1 + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + (farg || K) + '"/><ellipse cx="' + x2 + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + (farg || K) + '"/>' +
      '<circle cx="' + (x1 + rx * 0.4) + '" cy="' + (y - ry * 0.4) + '" r="' + Math.max(1.6, rx * 0.38) + '" fill="#fff"/><circle cx="' + (x2 + rx * 0.4) + '" cy="' + (y - ry * 0.4) + '" r="' + Math.max(1.6, rx * 0.38) + '" fill="#fff"/></g>';
  }
  function morrhar(op) { return '<g stroke="' + K + '" stroke-width="1.6" stroke-linecap="round" opacity="' + (op || .55) + '"><path d="M58 80 L42 76M58 85 L42 87M102 80 L118 76M102 85 L118 87"/></g>'; }
  function fluff(cx, cy, r, farg, n) {
    var p = '', i;
    for (i = 0; i <= n; i++) {
      var a = (i / n) * Math.PI * 2, rr = i % 2 ? r : r + 5;
      p += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) + ' ';
    }
    return '<path d="' + p + 'Z" fill="' + farg + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>';
  }
  function siffra(txt, farg, y) { return '<text x="80" y="' + (y || 134) + '" text-anchor="middle" font-family="Grandstander,Arial Black,sans-serif" font-weight="800" font-size="22" fill="' + farg + '" stroke="' + K + '" stroke-width="1" paint-order="stroke">' + txt + '</text>'; }

  // ---------- Huvuden ----------
  var HUVUD = {
    lejon: function () {
      var man = '#E0801B', pals = '#F7C04A', nos = '#FBE4A6';
      return fluff(80, 66, 40, man, 20) + '<circle cx="52" cy="44" r="9" fill="' + pals + '" stroke="' + K + '" stroke-width="3"/><circle cx="108" cy="44" r="9" fill="' + pals + '" stroke="' + K + '" stroke-width="3"/>' +
        '<circle cx="80" cy="68" r="31" fill="' + pals + '" stroke="' + K + '" stroke-width="3"/>' +
        '<ellipse cx="80" cy="84" rx="18" ry="12" fill="' + nos + '"/>' +
        '<path d="M60 44 Q70 36 80 46 Q90 36 100 44" fill="none" stroke="' + man + '" stroke-width="5" stroke-linecap="round"/>' +
        ogon(68, 92, 63, 4.8, 6) + '<path d="M62 54 Q68 50 73 55 M87 55 Q92 50 98 54" fill="none" stroke="' + K + '" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M74 76 L86 76 L80 82 Z" fill="' + K + '"/>' + munnar(86, 8, false) + morrhar(.45);
    },
    hund: function () {
      var b = '#C98A55', ljus = '#FFF1DC', hjalm = '#2F6FD6';
      return '<g transform="rotate(14 52 60)"><ellipse cx="52" cy="78" rx="12" ry="26" fill="' + b + '" stroke="' + K + '" stroke-width="3"/></g>' +
        '<g transform="rotate(-14 108 60)"><ellipse cx="108" cy="78" rx="12" ry="26" fill="' + b + '" stroke="' + K + '" stroke-width="3"/></g>' +
        '<circle cx="80" cy="70" r="31" fill="' + b + '" stroke="' + K + '" stroke-width="3"/>' +
        '<path d="M62 76 Q80 60 98 76 Q96 100 80 100 Q64 100 62 76 Z" fill="' + ljus + '"/>' +
        '<ellipse cx="66" cy="60" rx="8" ry="9" fill="' + ljus + '"/>' +
        // hockeyhjälm med galler
        '<path d="M46 62 Q46 22 80 22 Q114 22 114 62 L106 58 Q104 36 80 34 Q56 36 54 58 Z" fill="' + hjalm + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M50 56 Q80 50 110 56" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>' +
        '<path d="M52 66 L108 66 M52 74 L108 74 M62 60 L62 80 M80 60 L80 80 M98 60 L98 80" fill="none" stroke="#B8C7E6" stroke-width="2.2" opacity=".9" stroke-linecap="round"/>' +
        ogon(69, 91, 65, 4.6, 5.8) + '<ellipse cx="80" cy="82" rx="6" ry="4.6" fill="' + K + '"/>' + munnar(90, 8, true);
    },
    bjorn: function () {
      var b = '#8D5A2B', nos = '#E5B98A';
      return '<circle cx="54" cy="44" r="12" fill="' + b + '" stroke="' + K + '" stroke-width="3"/><circle cx="54" cy="44" r="6" fill="' + nos + '"/>' +
        '<circle cx="106" cy="44" r="12" fill="' + b + '" stroke="' + K + '" stroke-width="3"/><circle cx="106" cy="44" r="6" fill="' + nos + '"/>' +
        '<circle cx="80" cy="68" r="34" fill="' + b + '" stroke="' + K + '" stroke-width="3"/>' +
        '<ellipse cx="80" cy="84" rx="19" ry="13" fill="' + nos + '"/>' +
        // pannband (innebandy)
        '<path d="M48 54 Q80 44 112 54 L112 60 Q80 50 48 60 Z" fill="#FF7A1A" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        ogon(68, 92, 66, 4.5, 5.5) + '<ellipse cx="80" cy="79" rx="6.5" ry="4.8" fill="' + K + '"/>' + munnar(88, 8, false);
    },
    pingvin: function () {
      var sv = '#232B45', vit = '#FFFFFF', nabb = '#FF9A1F';
      return '<circle cx="80" cy="68" r="34" fill="' + sv + '" stroke="' + K + '" stroke-width="3"/>' +
        '<path d="M58 62 Q66 46 80 52 Q94 46 102 62 Q104 92 80 99 Q56 92 58 62 Z" fill="' + vit + '"/>' +
        '<path d="M46 50 Q80 40 114 50 L114 58 Q80 48 46 58 Z" fill="#E53935" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M110 52 L124 44 L120 60 Z" fill="#E53935" stroke="' + K + '" stroke-width="2" stroke-linejoin="round"/>' +
        ogon(69, 91, 66, 4.6, 6) +
        '<path d="M70 78 L90 78 L80 90 Z" fill="' + nabb + '" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<g class="m m-glad"><path d="M72 79 L88 79" stroke="' + K + '" stroke-width="1.6"/></g><g class="m m-jubel"><path d="M70 78 L90 78 L80 86 Z" fill="#B24A10"/></g><g class="m m-hmm"></g>';
    },
    groda: function () {
      var g = '#5CC24A', ljus = '#C9F2A6';
      return '<circle cx="63" cy="40" r="13" fill="' + g + '" stroke="' + K + '" stroke-width="3"/><circle cx="97" cy="40" r="13" fill="' + g + '" stroke="' + K + '" stroke-width="3"/>' +
        '<ellipse cx="80" cy="70" rx="36" ry="30" fill="' + g + '" stroke="' + K + '" stroke-width="3"/>' +
        '<ellipse cx="80" cy="84" rx="24" ry="12" fill="' + ljus + '"/>' +
        '<circle cx="63" cy="41" r="8.5" fill="#fff" stroke="' + K + '" stroke-width="2"/><circle cx="97" cy="41" r="8.5" fill="#fff" stroke="' + K + '" stroke-width="2"/>' +
        ogon(64, 98, 42, 4, 4.6) +
        '<circle cx="72" cy="66" r="2.4" fill="' + K + '"/><circle cx="88" cy="66" r="2.4" fill="' + K + '"/>' +
        '<circle cx="54" cy="78" r="5" fill="#F49AB8" opacity=".7"/><circle cx="106" cy="78" r="5" fill="#F49AB8" opacity=".7"/>' +
        munnar(84, 14, false);
    },
    apa: function () {
      var b = '#7A4A22', ans = '#F0C9A0', ansikte = 'M56 60 Q58 42 80 50 Q102 42 104 60 Q106 76 96 80 Q100 98 80 101 Q60 98 64 80 Q54 76 56 60 Z';
      return '<circle cx="42" cy="68" r="12" fill="' + b + '" stroke="' + K + '" stroke-width="3"/><circle cx="42" cy="68" r="6.5" fill="' + ans + '"/><circle cx="118" cy="68" r="12" fill="' + b + '" stroke="' + K + '" stroke-width="3"/><circle cx="118" cy="68" r="6.5" fill="' + ans + '"/>' +
        fluff(80, 66, 35, b, 26) +
        '<path d="' + ansikte + '" fill="' + ans + '" stroke="' + K + '" stroke-width="2"/>' +
        // keps bak och fram
        '<path d="M50 48 Q52 24 80 24 Q108 24 110 48 Q80 40 50 48 Z" fill="#E53935" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/><path d="M48 48 L116 48 L118 54 L46 54 Z" fill="#B71C1C" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        ogon(69, 91, 64, 4.4, 5) +
        '<path d="M76 80 L80 84 L84 80" stroke="' + K + '" stroke-width="2" stroke-linecap="round" fill="none"/>' + munnar(90, 9, true);
    }
  };

  // ---------- Kroppar ----------
  function ben(farg, strumpa, sko) {
    var s = '';
    [[63, 'k-ben-v', 68], [82, 'k-ben-h', 92]].forEach(function (b) {
      s += '<g class="' + b[1] + '"><rect x="' + b[0] + '" y="138" width="15" height="38" rx="7.5" fill="' + farg + '" stroke="' + K + '" stroke-width="3"/>' +
        (strumpa ? '<rect x="' + (b[0] + 1.5) + '" y="158" width="12" height="14" fill="' + strumpa + '"/>' : '') +
        '<ellipse cx="' + b[2] + '" cy="177" rx="11" ry="6" fill="' + sko + '" stroke="' + K + '" stroke-width="3"/></g>';
    });
    return s;
  }
  function arm(cls, x1, y1, x2, y2, farg, hand) {
    return '<g class="' + cls + '"><path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + K + '" stroke-width="15" stroke-linecap="round"/><path d="M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + '" stroke="' + farg + '" stroke-width="9" stroke-linecap="round"/>' +
      (hand ? '<circle cx="' + x2 + '" cy="' + y2 + '" r="7" fill="' + hand + '" stroke="' + K + '" stroke-width="2.5"/>' : '') + '</g>';
  }
  function kropp(fill, monster) {
    var id = 'kb' + (++uid);
    return '<defs><clipPath id="' + id + '"><path d="' + BODY + '"/></clipPath></defs><path d="' + BODY + '" fill="' + fill + '"/>' +
      (monster ? '<g clip-path="url(#' + id + ')">' + monster + '</g>' : '') +
      '<path d="' + BODY + '" fill="none" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>';
  }
  function shorts(farg) { return '<path d="M56 140 L104 140 L103 156 L84 157 L80 151 L76 157 L57 156 Z" fill="' + farg + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>'; }
  var KROPP = {
    lejon: function () {
      var p = '#F7C04A';
      return { bak: '<path d="M62 148 C34 150 26 128 40 112" stroke="' + K + '" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M62 148 C34 150 26 128 40 112" stroke="' + p + '" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="40" cy="110" r="7" fill="#E0801B" stroke="' + K + '" stroke-width="2.5"/>',
        ben: ben(p, '#FFFFFF', '#1B1B1B'), kropp: kropp('#1E9E5A', '<rect x="50" y="96" width="60" height="7" fill="#fff"/><path d="M60 98 L72 112 L88 112 L100 98 Z" fill="#fff" opacity=".9"/>' + siffra('10', '#fff')) + shorts('#FFFFFF'), armar: [p, p] };
    },
    hund: function () {
      var b = '#C98A55';
      return { bak: '', ben: ben(b, '#1F4FB0', '#1B1B1B'), kropp: kropp('#2F6FD6', '<rect x="48" y="118" width="64" height="8" fill="#fff"/><rect x="48" y="128" width="64" height="4" fill="#fff" opacity=".7"/>' + siffra('9', '#fff', 115)) + shorts('#1F4FB0'), armar: [b, '#FFFFFF'] };
    },
    bjorn: function () {
      var b = '#8D5A2B';
      return { bak: '', ben: ben(b, '#1B1B1B', '#1B1B1B'), kropp: kropp('#FF7A1A', '<path d="M54 100 L72 100 L72 150 L54 150 Z" fill="#1B1B1B" opacity=".85"/>' + siffra('7', '#1B1B1B')) + shorts('#1B1B1B'), armar: [b, b] };
    },
    pingvin: function () {
      var sv = '#232B45';
      return { bak: '', ben: ben(sv, null, '#FF9A1F'), kropp: kropp(sv, '<ellipse cx="80" cy="124" rx="19" ry="24" fill="#fff"/><ellipse cx="80" cy="124" rx="13" ry="18" fill="#FFD23F" opacity=".35"/>' + siffra('1', '#E53935', 132)) + shorts('#E53935'), armar: [sv, sv] };
    },
    groda: function () {
      var g = '#5CC24A';
      return { bak: '', ben: ben(g, null, '#3E8F32'), kropp: kropp(g, '<ellipse cx="80" cy="126" rx="18" ry="22" fill="#C9F2A6"/><path d="M80 112 l3.5 7 7.5 1 -5.5 5.2 1.3 7.5 -6.8-3.6 -6.8 3.6 1.3-7.5 -5.5-5.2 7.5-1z" fill="#FFD23F" stroke="' + K + '" stroke-width="1.5"/>'), armar: [g, '#C9F2A6'], lang: true };
    },
    apa: function () {
      var b = '#7A4A22';
      return { bak: '<path d="M60 146 C32 150 20 126 34 102" stroke="' + K + '" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M60 146 C32 150 20 126 34 102" stroke="' + b + '" stroke-width="7" stroke-linecap="round" fill="none"/>',
        ben: ben(b, null, '#F0C9A0'), kropp: kropp('#FFD23F', '<circle cx="80" cy="122" r="12" fill="#fff"/><circle cx="80" cy="122" r="9" fill="#E53935" opacity=".9"/>') + shorts('#E53935'), armar: [b, '#F0C9A0'], lang: true };
    }
  };

  function bollSVG() {
    // Fotboll i handen (motsvarar Lovas gymnastikband)
    // Yttre gruppen (k-band) är den som Lovas "Bandsnurr" vrider runt handen. Bollens egen snurr ligger på en inre grupp,
    // annars krockar de två rotationerna och bollen far iväg i en stor cirkel.
    return '<g class="k-band"><g><circle cx="138" cy="96" r="13" fill="#fff" stroke="' + K + '" stroke-width="2.5"/><path d="M138 86 l6 4.5 -2.3 7 -7.4 0 -2.3 -7z" fill="' + K + '"/><path d="M126 92 l4 -4 M150 92 l-4 -4 M131 106 l3 -5 M145 106 l-3 -5" stroke="' + K + '" stroke-width="2" stroke-linecap="round"/>' +
      '<animateTransform attributeName="transform" type="rotate" from="0 138 96" to="360 138 96" dur="2.4s" repeatCount="indefinite"/></g></g>';
  }

  function figur(id, min, opt) {
    opt = opt || {};
    if (!HUVUD[id]) id = 'lejon';
    var k = KROPP[id](), lang = k.lang;
    var av = lang ? [60, 112, 36, 160] : [60, 112, 40, 136], ah = lang ? [100, 112, 128, 94] : [100, 112, 122, 102];
    var armH = '<g class="k-arm-h"><path d="M' + ah[0] + ' ' + ah[1] + ' L' + ah[2] + ' ' + ah[3] + '" stroke="' + K + '" stroke-width="15" stroke-linecap="round"/><path d="M' + ah[0] + ' ' + ah[1] + ' L' + ah[2] + ' ' + ah[3] + '" stroke="' + k.armar[0] + '" stroke-width="9" stroke-linecap="round"/>' +
      (opt.band !== false ? bollSVG() : '') + '<circle cx="' + ah[2] + '" cy="' + ah[3] + '" r="7" fill="' + k.armar[1] + '" stroke="' + K + '" stroke-width="2.5"/></g>';
    return '<svg class="kompis' + (opt.cls ? ' ' + opt.cls : '') + '" viewBox="-40 0 240 196" data-min="' + (min || 'glad') + '" role="img" aria-label="' + (opt.label || 'Kompisen') + '">' +
      '<ellipse class="k-skugga" cx="80" cy="184" rx="40" ry="6" fill="var(--skugga)"/>' +
      '<g class="k-hel">' + k.bak + k.ben + k.kropp + arm('k-arm-v', av[0], av[1], av[2], av[3], k.armar[0], k.armar[1]) + armH +
      '<g class="k-huvud">' + HUVUD[id]() + '</g></g>' +
      '<g class="k-effekt" aria-hidden="true"><path d="M20 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="var(--guld)"/><path d="M140 18 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="var(--pop)"/><path d="M150 70 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="var(--guld)"/></g>' +
      '<text class="k-fraga" x="132" y="34" aria-hidden="true">?</text></svg>';
  }
  function huvud(id) {
    if (!HUVUD[id]) id = 'lejon';
    return '<svg viewBox="28 2 104 112" aria-hidden="true">' + HUVUD[id]().replace(/class="m m-(jubel|hmm)"/g, 'style="display:none"').replace(/class="m m-glad"/g, '') + '</svg>';
  }
  function hangare(id) {
    var k = KROPP[id](), f = k.armar[0], h = k.armar[1];
    var arm = function (x1, y1, x2, y2) { return '<path d="M' + x1 + ' ' + y1 + ' Q' + ((x1 + x2) / 2 + (x1 < 80 ? -10 : 10)) + ' ' + ((y1 + y2) / 2) + ' ' + x2 + ' ' + y2 + '" stroke="' + K + '" stroke-width="17" stroke-linecap="round" fill="none"/><path d="M' + x1 + ' ' + y1 + ' Q' + ((x1 + x2) / 2 + (x1 < 80 ? -10 : 10)) + ' ' + ((y1 + y2) / 2) + ' ' + x2 + ' ' + y2 + '" stroke="' + f + '" stroke-width="11" stroke-linecap="round" fill="none"/>'; };
    return '<svg class="hangare-svg" viewBox="20 0 120 250" aria-hidden="true">' +
      arm(68, 150, 56, 10) + arm(92, 150, 104, 10) + '<circle cx="56" cy="10" r="8" fill="' + h + '" stroke="' + K + '" stroke-width="2.5"/><circle cx="104" cy="10" r="8" fill="' + h + '" stroke="' + K + '" stroke-width="2.5"/>' +
      '<path d="M72 182 Q66 210 62 228" stroke="' + K + '" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M72 182 Q66 210 62 228" stroke="' + f + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
      '<path d="M88 182 Q94 210 98 228" stroke="' + K + '" stroke-width="15" stroke-linecap="round" fill="none"/><path d="M88 182 Q94 210 98 228" stroke="' + f + '" stroke-width="9" stroke-linecap="round" fill="none"/>' +
      '<ellipse cx="60" cy="232" rx="10" ry="7" fill="' + h + '" stroke="' + K + '" stroke-width="2.5"/><ellipse cx="100" cy="232" rx="10" ry="7" fill="' + h + '" stroke="' + K + '" stroke-width="2.5"/>' +
      '<ellipse cx="80" cy="160" rx="22" ry="30" fill="' + f + '" stroke="' + K + '" stroke-width="3"/>' +
      '<g transform="translate(0 50)">' + HUVUD[id]().replace(/class="m m-(jubel|hmm)"/g, 'style="display:none"').replace(/class="m m-glad"/g, '') + '</g></svg>';
  }
  return { LISTA: LISTA, figur: figur, huvud: huvud, hangare: hangare, namn: function (id) { var g = LISTA.filter(function (x) { return x.id === id; })[0]; return g ? g.namn : 'Kompisen'; }, arApa: function (id) { return id === 'groda' || id === 'apa'; } };
})();
