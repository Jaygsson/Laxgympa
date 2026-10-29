/* ===== Läxgympan: figurerna (ritade efter Lovas gosedjur) =====
   Alla figurer delar samma "skelett" så att rörelserna fungerar för alla:
   huvud runt (80,66), axlar i (60,112) och (100,112), höfter i (71,144) och (89,144), fötter vid y≈180. */
var Gubbar = (function () {
  'use strict';
  var K = 'var(--kontur)', uid = 0;
  var LISTA = [
    { id: 'kanin', namn: 'Kaninen' }, { id: 'docka', namn: 'Dockan' }, { id: 'hast', namn: 'Hästen' },
    { id: 'panda', namn: 'Röda pandan' }, { id: 'blaapa', namn: 'Blå apan', apa: true }, { id: 'ljusapa', namn: 'Ljusa apan', apa: true }
  ];
  var BODY = 'M58 108 C64 98 96 98 102 108 L106 146 C98 154 62 154 54 146 Z';

  function stygn(x1, y1, cx, cy, x2, y2, n) {
    var s = '';
    for (var i = 1; i < n; i++) {
      var t = i / n, x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
      s += 'M' + x.toFixed(1) + ' ' + (y - 3.5).toFixed(1) + ' L' + x.toFixed(1) + ' ' + (y + 3.5).toFixed(1) + ' ';
    }
    return '<path d="M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2 + ' ' + s + '" fill="none" stroke="' + K + '" stroke-width="2.2" stroke-linecap="round"/>';
  }
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
  function morrhar() { return '<g stroke="' + K + '" stroke-width="1.6" stroke-linecap="round" opacity=".55"><path d="M58 80 L42 76M58 85 L42 87M102 80 L118 76M102 85 L118 87"/></g>'; }
  function fluff(cx, cy, r, farg, n) {
    var p = '', i;
    for (i = 0; i <= n; i++) {
      var a = (i / n) * Math.PI * 2, rr = i % 2 ? r : r + 4.5;
      p += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) + ' ';
    }
    return '<path d="' + p + 'Z" fill="' + farg + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>';
  }

  // ---------- Huvuden ----------
  var HUVUD = {
    kanin: function () {
      var g = '#B9B5C9';
      // Långa hängande kaninöron med rosa insida, som Lovas gosedjur
      return '<g transform="rotate(32 52 46)"><ellipse cx="52" cy="78" rx="12" ry="34" fill="' + g + '" stroke="' + K + '" stroke-width="3"/><ellipse cx="52" cy="80" rx="6.5" ry="26" fill="#F7B5CD"/></g>' +
        '<g transform="rotate(-32 108 46)"><ellipse cx="108" cy="78" rx="12" ry="34" fill="' + g + '" stroke="' + K + '" stroke-width="3"/><ellipse cx="108" cy="80" rx="6.5" ry="26" fill="#F7B5CD"/></g>' +
        '<circle cx="80" cy="68" r="34" fill="' + g + '" stroke="' + K + '" stroke-width="3"/>' +
        '<ellipse cx="80" cy="83" rx="22" ry="16" fill="#FFF6EC"/>' +
        '<path d="M50 48 Q54 22 78 18 Q98 14 112 4 Q104 22 110 48 Q80 38 50 48 Z" fill="#CFCED8" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/><circle cx="112" cy="5" r="5" fill="#CFCED8" stroke="' + K + '" stroke-width="2.5"/>' +
        '<ellipse cx="68" cy="61" rx="8.5" ry="10.5" fill="#fff" stroke="' + K + '" stroke-width="2"/><ellipse cx="92" cy="61" rx="8.5" ry="10.5" fill="#fff" stroke="' + K + '" stroke-width="2"/>' +
        ogon(69, 91, 63, 4.6, 6.2) +
        '<ellipse cx="80" cy="75" rx="5.5" ry="4.2" fill="' + K + '"/>' + munnar(83, 9, false) +
        '<path d="M75.5 84.5 h9 v6.5 a1.5 1.5 0 0 1 -1.5 1.5 h-6 a1.5 1.5 0 0 1 -1.5 -1.5 z" fill="#fff" stroke="' + K + '" stroke-width="1.8"/><path d="M80 84.5 v8" stroke="' + K + '" stroke-width="1.5"/>' + morrhar();
    },
    docka: function () {
      var id = 'dk' + (++uid), lila = '#DCCDF6', svart = '#1C1830', prickar = '', x, y;
      for (y = 30; y < 106; y += 10) for (x = 40 + ((y / 10) % 2) * 5; x < 120; x += 10) prickar += '<circle cx="' + x + '" cy="' + y + '" r="1.8"/>';
      var huvud = 'M46 44 Q44 26 58 29 Q80 23 102 29 Q116 26 114 44 L112 88 Q80 108 48 88 Z';
      return '<path d="M50 46 C36 72 46 102 36 134" stroke="' + svart + '" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M50 46 C36 72 46 102 36 134" stroke="#9B6BE0" stroke-width="2.5" stroke-dasharray="5 6" fill="none"/>' +
        '<path d="M110 46 C126 74 114 104 126 136" stroke="' + svart + '" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M110 46 C126 74 114 104 126 136" stroke="#9B6BE0" stroke-width="2.5" stroke-dasharray="5 6" fill="none"/>' +
        '<defs><clipPath id="' + id + '"><path d="' + huvud + '"/></clipPath></defs>' +
        '<path d="' + huvud + '" fill="' + lila + '"/><g clip-path="url(#' + id + ')" fill="#fff" opacity=".8">' + prickar + '</g>' +
        '<path d="' + huvud + '" fill="none" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M50 34 Q60 24 70 30 M90 30 Q100 22 110 34" stroke="' + svart + '" stroke-width="7" stroke-linecap="round" fill="none"/>' +
        '<circle cx="54" cy="30" r="4.5" fill="#9B6BE0"/><circle cx="106" cy="30" r="4.5" fill="#9B6BE0"/>' +
        '<g class="k-ogon"><circle cx="65" cy="57" r="13" fill="' + svart + '"/><circle cx="59" cy="65" r="1.8" fill="#fff"/><circle cx="73" cy="66" r="1.5" fill="#fff"/><circle cx="96" cy="55" r="12" fill="' + svart + '"/><circle cx="104" cy="62" r="1.8" fill="#fff"/>' +
        '<circle cx="66" cy="57" r="8.5" fill="#F7F5F2" stroke="' + K + '" stroke-width="2"/><circle cx="63.5" cy="57" r="1.6" fill="' + K + '"/><circle cx="68.5" cy="57" r="1.6" fill="' + K + '"/>' +
        '<circle cx="95" cy="56" r="8.5" fill="#F7F5F2" stroke="' + K + '" stroke-width="2"/><circle cx="92.5" cy="56" r="1.6" fill="' + K + '"/><circle cx="97.5" cy="56" r="1.6" fill="' + K + '"/></g>' +
        '<g class="m m-glad">' + stygn(62, 80, 80, 92, 98, 80, 7) + '</g><g class="m m-jubel">' + stygn(60, 78, 80, 100, 100, 78, 8) + '</g><g class="m m-hmm">' + stygn(64, 86, 80, 82, 96, 86, 6) + '</g>';
    },
    hast: function () {
      var b = '#C98A55', svart = '#1C1830';
      return '<path d="M96 26 C122 34 128 62 122 96 M102 28 C120 44 118 70 114 100 M90 26 C108 40 112 60 108 90" stroke="' + svart + '" stroke-width="7" stroke-linecap="round" fill="none"/>' +
        '<path d="M58 36 L52 6 L76 26 Z" fill="' + b + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/><path d="M59 30 L56 14 L69 26 Z" fill="#F7B5CD"/>' +
        '<path d="M102 36 L108 6 L84 26 Z" fill="' + b + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/><path d="M101 30 L104 14 L91 26 Z" fill="#F7B5CD"/>' +
        '<path d="M47 58 Q46 26 80 24 Q114 26 113 58 L108 88 Q80 112 52 88 Z" fill="' + b + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M73 30 Q80 25 87 30 L84 74 L76 74 Z" fill="#FFFCF6"/>' +
        '<ellipse cx="80" cy="90" rx="25" ry="17" fill="#FFF9F2" stroke="' + K + '" stroke-width="3"/><ellipse cx="70" cy="89" rx="3.6" ry="2.6" fill="' + K + '"/><ellipse cx="90" cy="89" rx="3.6" ry="2.6" fill="' + K + '"/>' +
        '<path d="M76 22 Q70 32 66 42 M82 22 Q86 30 92 38 M79 22 Q78 34 80 44" stroke="' + svart + '" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<path d="M54 80 Q80 70 106 80" stroke="#F49AC1" stroke-width="6" fill="none"/><path d="M56 80 L60 42" stroke="#F49AC1" stroke-width="5"/>' +
        '<circle cx="55" cy="80" r="7" fill="#FFD6E6" stroke="' + K + '" stroke-width="1.5"/><circle cx="105" cy="80" r="7" fill="#FFD6E6" stroke="' + K + '" stroke-width="1.5"/><circle cx="60" cy="46" r="6" fill="#FFD6E6" stroke="' + K + '" stroke-width="1.5"/>' +
        ogon(66, 94, 58, 5, 6.8) + '<path d="M60 52 L57 48M100 52 L103 48" stroke="' + K + '" stroke-width="2" stroke-linecap="round"/>' +
        munnar(98, 8, false);
    },
    panda: function () {
      var r = '#D9502A', mork = '#6E2414', vit = '#FFF8F0';
      // Röd panda: rödbrun päls, vita öronkanter, vit nos och vita fläckar över ögonen, mörka "tårar" under ögonen
      return '<path d="M49 50 Q40 28 52 18 Q66 22 72 34 Z" fill="' + vit + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/><path d="M52 42 Q48 30 54 25 Q62 28 65 35 Z" fill="' + mork + '"/>' +
        '<path d="M111 50 Q120 28 108 18 Q94 22 88 34 Z" fill="' + vit + '" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/><path d="M108 42 Q112 30 106 25 Q98 28 95 35 Z" fill="' + mork + '"/>' +
        '<ellipse cx="80" cy="68" rx="37" ry="34" fill="' + r + '" stroke="' + K + '" stroke-width="3"/>' +
        '<ellipse cx="65" cy="49" rx="6.5" ry="4.5" fill="' + vit + '"/><ellipse cx="95" cy="49" rx="6.5" ry="4.5" fill="' + vit + '"/>' +
        '<path d="M47 76 Q50 62 62 70 Q72 80 80 74 Q88 80 98 70 Q110 62 113 76 Q110 98 80 101 Q50 98 47 76 Z" fill="' + vit + '"/>' +
        '<path d="M63 68 Q58 78 61 90" stroke="' + mork + '" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M97 68 Q102 78 99 90" stroke="' + mork + '" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        ogon(66, 94, 63, 5, 6.6) +
        '<ellipse cx="80" cy="80" rx="5.5" ry="4.2" fill="' + K + '"/>' + munnar(88, 8, true) + morrhar();
    },
    blaapa: function () {
      var t = '#22B6D1', l = '#C3ECF7';
      return '<circle cx="42" cy="68" r="12" fill="' + t + '" stroke="' + K + '" stroke-width="3"/><circle cx="42" cy="68" r="6.5" fill="' + l + '"/><circle cx="118" cy="68" r="12" fill="' + t + '" stroke="' + K + '" stroke-width="3"/><circle cx="118" cy="68" r="6.5" fill="' + l + '"/>' +
        fluff(80, 66, 35, t, 26) + '<path d="M60 40 Q66 50 70 40 Q76 52 82 40 Q88 52 94 42" fill="none" stroke="#7DDCEB" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M56 60 Q58 42 80 50 Q102 42 104 60 Q106 76 96 80 Q100 98 80 101 Q60 98 64 80 Q54 76 56 60 Z" fill="' + l + '" stroke="' + K + '" stroke-width="2"/>' +
        '<circle cx="69" cy="63" r="7.5" fill="#2F86E0" stroke="' + K + '" stroke-width="1.5"/><circle cx="91" cy="63" r="7.5" fill="#2F86E0" stroke="' + K + '" stroke-width="1.5"/>' +
        ogon(69, 91, 63, 3.8, 3.8) +
        '<path d="M77 81 L80 84 L83 81 M80 84 L80 87" stroke="' + K + '" stroke-width="1.8" stroke-linecap="round" fill="none"/>' + munnar(91, 8, false);
    },
    ljusapa: function () {
      var b = '#EBD6B4', gr = '#8E8F9C', ljus = '#F6E9D4', ansikte = 'M56 60 Q58 42 80 50 Q102 42 104 60 Q106 76 96 80 Q100 98 80 101 Q60 98 64 80 Q54 76 56 60 Z';
      // Samma form som blå apan: runda öron på sidorna, lurvigt huvud och ett ansikte med ögonringar, men i ljus päls med grått ansikte och vit kant
      return '<circle cx="42" cy="68" r="12" fill="' + b + '" stroke="' + K + '" stroke-width="3"/><circle cx="42" cy="68" r="6.5" fill="' + gr + '"/><circle cx="118" cy="68" r="12" fill="' + b + '" stroke="' + K + '" stroke-width="3"/><circle cx="118" cy="68" r="6.5" fill="' + gr + '"/>' +
        fluff(80, 66, 35, b, 26) + '<path d="M60 40 Q66 50 70 40 Q76 52 82 40 Q88 52 94 42" fill="none" stroke="' + ljus + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="' + ansikte + '" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="9" stroke-linejoin="round"/>' +
        '<path d="' + ansikte + '" fill="' + gr + '" stroke="' + K + '" stroke-width="2"/>' +
        '<circle cx="69" cy="63" r="7.5" fill="#8A4522" stroke="' + K + '" stroke-width="1.5"/><circle cx="91" cy="63" r="7.5" fill="#8A4522" stroke="' + K + '" stroke-width="1.5"/>' +
        ogon(69, 91, 63, 3.8, 3.8) +
        '<path d="M77 81 L80 84 L83 81 M80 84 L80 87" stroke="' + K + '" stroke-width="1.8" stroke-linecap="round" fill="none"/>' + munnar(91, 8, false);
    }
  };

  // ---------- Kroppar ----------
  function ben(farg, strumpa, sko) {
    var s = '';
    [[63, 'k-ben-v', 68], [82, 'k-ben-h', 92]].forEach(function (b) {
      s += '<g class="' + b[1] + '"><rect x="' + b[0] + '" y="138" width="15" height="38" rx="7.5" fill="' + farg + '" stroke="' + K + '" stroke-width="3"/>' +
        (strumpa ? '<rect x="' + (b[0] + 1.5) + '" y="160" width="12" height="12" fill="' + strumpa + '"/>' : '') +
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
  var KROPP = {
    kanin: function () {
      var g = '#B9B5C9';
      return { bak: '<circle cx="104" cy="146" r="11" fill="#FFF6EC" stroke="' + K + '" stroke-width="3"/>', ben: ben(g, '#FFFFFF', '#24306F'), kropp: kropp('#1F2B6B', '<rect x="60" y="96" width="8" height="60" fill="#7CC4F2"/><rect x="76" y="96" width="8" height="60" fill="#7CC4F2"/><rect x="92" y="96" width="8" height="60" fill="#7CC4F2"/>') +
        '<path d="M70 103 L80 114 L90 103" stroke="#fff" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M56 140 L104 140 L103 155 L84 157 L80 151 L76 157 L57 155 Z" fill="#1F2B6B" stroke="' + K + '" stroke-width="3" stroke-linejoin="round"/>',
        armar: ['#B9B5C9', '#FFFFFF'], arm: null };
    },
    docka: function () {
      var svart = '#1C1830', mon = '', x, y;
      for (y = 104; y < 150; y += 12) for (x = 56 + ((y - 104) / 12 % 2) * 6; x < 108; x += 12) mon += '<path d="M' + x + ' ' + (y - 5) + ' l5 5 -5 5 -5 -5z" fill="#7B4BC4"/><circle cx="' + (x + 6) + '" cy="' + y + '" r="1.5" fill="#7B4BC4"/>';
      return { bak: '', ben: ben('#EADFF7', null, svart), kropp: kropp('#F4EEFA', mon) +
        '<rect x="56" y="126" width="48" height="6" fill="#EFEFF6" stroke="' + K + '" stroke-width="1.5"/>' +
        '<path d="M48 132 Q80 124 112 132 L120 152 Q100 160 80 157 Q60 160 40 152 Z" fill="' + svart + '" stroke="' + K + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M44 150 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0 q6 6 12 0" stroke="#fff" stroke-width="1.5" fill="none" opacity=".7"/>',
        armar: [svart, '#DCCDF6'] };
    },
    hast: function () {
      var b = '#C98A55';
      return { bak: '', ben: ben(b, '#FFFCF6', '#4A3428'), kropp: kropp(b, '<path d="M72 98 Q100 104 108 140 L92 156 Q80 132 72 98 Z" fill="#FFFCF6"/>') + '<path d="M62 104 Q80 112 98 104" stroke="#F49AC1" stroke-width="5" fill="none"/>', armar: [b, '#FFFCF6'] };
    },
    panda: function () {
      var r = '#D9502A', mork = '#4A1E14', svans = 'M60 146 C30 152 14 132 22 104';
      return { bak: '<path d="' + svans + '" stroke="' + K + '" stroke-width="24" stroke-linecap="round" fill="none"/><path d="' + svans + '" stroke="' + r + '" stroke-width="18" stroke-linecap="round" fill="none"/><path d="' + svans + '" stroke="#8E2F18" stroke-width="18" stroke-dasharray="8 9" fill="none"/>',
        ben: ben(mork, null, '#2A120C'), kropp: kropp('#2C8BE6', '<path d="M30 146 L130 92 L130 110 L30 164 Z" fill="#FFD23F"/>'), armar: [mork, '#2A120C'] };
    },
    blaapa: function () {
      var t = '#22B6D1';
      return { bak: '', ben: ben(t, null, '#C3ECF7'), kropp: kropp(t, '<circle cx="70" cy="118" r="10" fill="#7DDCEB"/><circle cx="94" cy="136" r="12" fill="#7DDCEB"/><circle cx="86" cy="104" r="6" fill="#55CBE0"/>'), armar: [t, '#C3ECF7'], lang: true };
    },
    ljusapa: function () {
      var b = '#EBD6B4';
      return { bak: '', ben: ben(b, null, '#8E8F9C'), kropp: kropp(b, '<ellipse cx="80" cy="128" rx="16" ry="18" fill="#F6E9D4"/>'), armar: [b, '#8E8F9C'], lang: true };
    }
  };

  function bandSVG() {
    return '<g class="k-band"><path d="M122 102 L142 74" stroke="' + K + '" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M142 74 C156 56 166 92 178 70 S 194 62 198 82" fill="none" stroke="var(--pop2)" stroke-width="6" stroke-linecap="round">' +
      '<animate attributeName="d" dur="1.6s" repeatCount="indefinite" values="M142 74 C156 56 166 92 178 70 S 194 62 198 82;M142 74 C154 90 168 56 180 80 S 196 92 198 66;M142 74 C156 56 166 92 178 70 S 194 62 198 82"/></path></g>';
  }

  function figur(id, min, opt) {
    opt = opt || {};
    if (!HUVUD[id]) id = 'kanin';
    var k = KROPP[id](), lang = k.lang;
    var av = lang ? [60, 112, 36, 160] : [60, 112, 40, 136], ah = lang ? [100, 112, 128, 94] : [100, 112, 122, 102];
    var armH = '<g class="k-arm-h"><path d="M' + ah[0] + ' ' + ah[1] + ' L' + ah[2] + ' ' + ah[3] + '" stroke="' + K + '" stroke-width="15" stroke-linecap="round"/><path d="M' + ah[0] + ' ' + ah[1] + ' L' + ah[2] + ' ' + ah[3] + '" stroke="' + k.armar[0] + '" stroke-width="9" stroke-linecap="round"/>' +
      (opt.band !== false ? bandSVG() : '') + '<circle cx="' + ah[2] + '" cy="' + ah[3] + '" r="7" fill="' + k.armar[1] + '" stroke="' + K + '" stroke-width="2.5"/></g>';
    return '<svg class="kompis' + (opt.cls ? ' ' + opt.cls : '') + '" viewBox="-40 0 240 196" data-min="' + (min || 'glad') + '" role="img" aria-label="' + (opt.label || 'Kompisen') + '">' +
      '<ellipse class="k-skugga" cx="80" cy="184" rx="40" ry="6" fill="var(--skugga)"/>' +
      '<g class="k-hel">' + k.bak + k.ben + k.kropp + arm('k-arm-v', av[0], av[1], av[2], av[3], k.armar[0], k.armar[1]) + armH +
      '<g class="k-huvud">' + HUVUD[id]() + '</g></g>' +
      '<g class="k-effekt" aria-hidden="true"><path d="M20 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="var(--guld)"/><path d="M140 18 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="var(--pop)"/><path d="M150 70 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="var(--guld)"/></g>' +
      '<text class="k-fraga" x="132" y="34" aria-hidden="true">?</text></svg>';
  }
  function huvud(id) {
    if (!HUVUD[id]) id = 'kanin';
    return '<svg viewBox="28 2 104 112" aria-hidden="true">' + HUVUD[id]().replace(/class="m m-(jubel|hmm)"/g, 'style="display:none"').replace(/class="m m-glad"/g, '') + '</svg>';
  }
  // Apa som hänger i räcket (används för aporna när de inte är huvudfigur)
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
  return { LISTA: LISTA, figur: figur, huvud: huvud, hangare: hangare, namn: function (id) { var g = LISTA.filter(function (x) { return x.id === id; })[0]; return g ? g.namn : 'Kompisen'; }, arApa: function (id) { return id === 'blaapa' || id === 'ljusapa'; } };
})();
