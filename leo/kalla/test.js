// Kontrollerar frågegeneratorerna: node test.js
// 1) Varje generator ger alltid en giltig fråga (rätt svar finns bland alternativen, inga dubbletter, text att läsa upp)
// 2) Ordningen slumpas: det rätta svaret hamnar inte alltid på samma plats, och ett pass har inte samma ordning två gånger
const fs = require('fs'), vm = require('vm');
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/src/innehall.js', 'utf8'), ctx);
const Leo = ctx.Leo;
let fel = 0, n = 0;
function kolla(ok, msg) { n++; if (!ok) { fel++; if (fel < 30) console.log('FEL:', msg); } }
function nyckel(a) { return JSON.stringify(a.form ? [a.form, a.farg] : a.bild ? [a.bild.e, a.bild.n] : a.e ? [a.e, a.skala || 1, a.text || ''] : a.text); }

Object.keys(Leo.G).forEach(g => {
  const platser = {};
  for (let i = 0; i < 2000; i++) {
    const niva = 1 + (i % 3), q = Leo.G[g](Math.random, niva);
    kolla(q.text && q.tal, g + ': saknar text/tal');
    if (q.typ === 'val') {
      kolla(q.alt.length >= 2 && q.alt.length <= 4, g + ': ' + q.alt.length + ' alternativ');
      kolla(q.ratt >= 0 && q.ratt < q.alt.length, g + ': ratt utanför');
      const nycklar = q.alt.map(nyckel);
      kolla(new Set(nycklar).size === nycklar.length, g + ': dubbla alternativ ' + nycklar.join(' | '));
      q.alt.forEach(a => kolla(a.tal !== undefined, g + ': alternativ utan tal'));
      platser[q.ratt] = (platser[q.ratt] || 0) + 1;
    } else if (q.typ === 'tryck') {
      kolla(q.mal >= 1 && q.mal <= q.bild.n, g + ': mal ' + q.mal + ' av ' + q.bild.n);
    } else if (q.typ === 'bygg') {
      kolla(q.items.length >= 2 && q.items.length <= 5, g + ': items ' + q.items.length);
    } else kolla(false, g + ': okänd typ ' + q.typ);
  }
  const p = Object.values(platser);
  if (p.length) kolla(p.length >= 2 && Math.min(...p) > 2000 / (p.length * 4), g + ': rätt svar hamnar snett ' + JSON.stringify(platser));
});

// Pass: rätt antal, aldrig samma generator två gånger i rad, slumpad ordning
Leo.BANOR.forEach(b => {
  for (let niva = 1; niva <= 3; niva++) {
    const ordningar = new Set();
    for (let i = 0; i < 50; i++) {
      const pass = Leo.genPass(Math.random, b.id, niva, 8);
      kolla(pass.length === 8, b.id + ': passlängd');
      for (let j = 1; j < pass.length; j++) kolla(pass[j].gen !== pass[j - 1].gen, b.id + ': samma generator två gånger i rad');
      pass.forEach(q => kolla(b.gen[niva].indexOf(q.gen) >= 0, b.id + ': fel generator ' + q.gen));
      ordningar.add(pass.map(q => q.gen).join(','));
    }
    kolla(ordningar.size > 40, b.id + ' nivå ' + niva + ': bara ' + ordningar.size + ' olika ordningar av 50');
  }
});
console.log(n + ' kontroller, ' + fel + ' fel');
process.exit(fel ? 1 : 0);
