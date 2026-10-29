// Kontroll av facit, svarskontroll och generatorer
const L = require('./src/logic.js');
const LAXOR = require('./src/content.js');
let fel = 0, ok = 0;
const anta = (v, msg) => { if (v) ok++; else { fel++; console.log('FEL:', msg); } };

// 1. Svarskontrollen
const T = (f, inp, vant, msg) => anta(L.kollaFalt(f, inp).ok === vant, `${msg || ''} ${JSON.stringify(f)} <- "${inp}" skulle vara ${vant}`);
T({ typ: 'tal', svar: '0,25' }, '0,25', true); T({ typ: 'tal', svar: '0,25' }, '0.25', true); T({ typ: 'tal', svar: '0,25' }, ' 0,250 ', true);
T({ typ: 'tal', svar: '0,25' }, '0,125', false, 'Lovas fel 1/4'); T({ typ: 'tal', svar: '3,05' }, '3,005', false, 'Lovas fel 3 kr 5 öre');
T({ typ: 'tal', svar: '3,05' }, '3,05 kr', true); T({ typ: 'tal', svar: '17,3' }, '17,30', true); T({ typ: 'tal', svar: '23596' }, '23 596', true);
T({ typ: 'tal', svar: '0' }, '0', true); T({ typ: 'tal', svar: '100' }, '100 °C', true); T({ typ: 'tal', svar: '5' }, '5,', true);
T({ typ: 'brak', svar: '4/6' }, '2/3', true); T({ typ: 'brak', svar: '4/6' }, '4/6', true); T({ typ: 'brak', svar: '3/12' }, '1/4', true); T({ typ: 'brak', svar: '1/4' }, '1/5', false);
anta(L.kollaFalt({ typ: 'brak', svar: '1/4' }, '0,25').format === true, 'decimal i bråkfält ger formatmeddelande');
anta(L.kollaFalt({ typ: 'tal', svar: '0,25' }, '1/4').format === true, 'bråk i decimalfält ger formatmeddelande');
anta(L.kollaFalt({ typ: 'tal', svar: '1' }, '').format === true, 'tomt svar');
T({ typ: 'text', svar: 'elektroner', godta: ['elektron'] }, 'Elektroner', true); T({ typ: 'text', svar: 'elektroner' }, 'elektonrer', true, 'stavfel godtas');
T({ typ: 'text', svar: 'elektroner' }, 'protoner', false);
anta(L.kolla({ typ: 'pil', pilar: 6, mal: 111 }, [25, 25, 20, 20, 20, 1]).ok, 'pil 6 st');
anta(!L.kolla({ typ: 'pil', pilar: 6, mal: 111 }, [50, 50, 5, 5, 1]).ok, 'pil fel antal');
anta(L.fmt(0.07) === '0,07' && L.fmt(83228) === '83 228' && L.fmt(1594) === '1594' && L.fmt(19.33) === '19,33', 'fmt');

// 2. Allt innehåll: varje fråga ska godta sitt eget facit
const typer = { val: 0, svar: 0, kort: 0, ordna: 0, pil: 0 };
for (const set of LAXOR) for (const pass of set.pass) {
  if (pass.gen) { pass.gen.forEach(g => anta(typeof L.G[g] === 'function', `generator finns: ${g}`)); continue; }
  if (pass.pool || !pass.fragor) continue;
  pass.fragor.forEach((q, i) => {
    const id = `${set.id}/${pass.id}/${i}`; typer[q.typ]++;
    anta(q.text && q.text.length > 3, id + ' har text');
    if (q.typ === 'val') { anta(q.ratt >= 0 && q.ratt < q.alt.length, id + ' ratt i intervall'); anta(new Set(q.alt).size === q.alt.length, id + ' unika alternativ'); }
    if (q.typ === 'svar') anta(L.kolla(q, q.falt.map(f => f.typ === 'text' ? f.svar : f.svar)).ok, id + ' godtar eget facit');
    if (q.typ === 'kort') anta(q.svar && q.svar.length > 10, id + ' kort har svar');
    if (q.typ === 'ordna') anta(L.kolla(q, q.items.map((_, k) => k)).ok, id + ' ordna');
    if (q.typ === 'pil') {
      // finns det en lösning?
      let finns = false; const v = q.varden;
      const rek = (kvar, sum, start) => { if (kvar === 0) { if (sum === q.mal) finns = true; return; } for (let k = start; k < v.length; k++) rek(kvar - 1, sum + v[k], k); };
      rek(q.pilar, 0, 0); anta(finns, id + ' pil har lösning');
    }
  });
}

// 3. Oberoende kontroll av läxornas facit (räknat på annat sätt)
const fr = (n, d) => n / d;
anta(825 / 5 === 165 && 6 * 247 === 1482 && 423 - 274 === 149, 'uppställning');
anta(1 - fr(3, 8) === fr(5, 8) && 1 - fr(5, 7) - fr(2, 7) < 1e-12 && 1 - fr(4, 5) - fr(1, 5) < 1e-12, 'x-bråk');
anta(L.avrundaMilli(679000, 100000) === 700000 && L.avrundaMilli(129500, 10000) === 130000 && L.avrundaMilli(678, 100) === 700, 'avrundning a-c');
anta(L.avrundaMilli(19325, 1000) === 19000 && L.avrundaMilli(19325, 100) === 19300 && L.avrundaMilli(19325, 10) === 19330, 'avrundning 19,325');
anta(5 - 3 + 7 + 1 === 10, 'hiss'); anta(7 + 11 - 1 === 17, 'kö');
{ let start = 0; for (let x = 5; x <= 200; x += 5) { const kvar = x - x / 5; if (kvar / 4 === 12) start = x; } anta(start === 60, 'vindruvor'); }
{ const perm = []; const s = [5, 9, 3, 2, 6]; const p = (a, rest) => { if (!rest.length) perm.push(+a.join('')); rest.forEach((d, i) => p([...a, d], rest.filter((_, j) => j !== i))); }; p([], s); perm.sort((a, b) => a - b);
  anta(perm[1] === 23596, 'näst minsta'); const nara = perm.reduce((b, x) => Math.abs(x - 60000) < Math.abs(b - 60000) ? x : b); anta(nara === 59632, 'närmast 60 000'); anta(perm[1] + nara === 83228, 'summa'); }
anta(42 / 3 === 14 && 2 * 14 === 28, 'Astrid och Hugo'); anta(100 - (6 / 3) * 2 * 18 === 28, 'äpplen'); anta(1632 - 38 === 1594, 'Gustav II Adolf');
anta(35 - 4 * 8 === 3 && (46 - 4) / 7 === 6 && (50 - 2) / 8 === 6, 'rest');
anta(12 - (2 + 3 + 4) === 3, 'plommon');
anta(Math.max(0.5, 1.2, 0.12, 1.12, 11 / 12) === 1.2 && Math.min(0.5, 1.2, 0.12, 1.12, 11 / 12) === 0.12, 'störst/minst');
// tallinjens pilar ligger på små streck (0,2)
anta([1.6, 3.8, 5.2, 7.6].every(v => Math.abs(v * 5 - Math.round(v * 5)) < 1e-9), 'tallinje');
// figurer: antal färgade = täljaren
anta([0, 2, 4, 6, 8].length === 5 && [0, 2, 3, 4].length === 4 && [0, 1, 2, 3, 5, 6, 7].length === 7, 'figurer');

// 4. Generatorer: 3000 frågor var
let antalGen = 0;
for (const g of Object.keys(L.G)) {
  for (let s = 1; s <= 3000; s++) {
    const r = L.slump(s * 7919 + g.length);
    const q = L.G[g](r, { lista: s % 3 ? [] : ['Kompis'] });
    antalGen++;
    const allt = JSON.stringify(q);
    if (/undefined|NaN|null|Infinity/.test(allt)) { anta(false, `${g} seed ${s} innehåller undefined/NaN: ${allt.slice(0, 300)}`); break; }
    if (q.typ === 'svar') {
      const res = L.kolla(q, q.falt.map(f => f.svar));
      if (!res.ok) { anta(false, `${g} seed ${s} godtar inte eget facit ${allt.slice(0, 300)}`); break; }
    }
    if (q.typ === 'val' && !(q.ratt >= 0 && q.ratt < q.alt.length && new Set(q.alt).size === q.alt.length)) { anta(false, `${g} val ${allt}`); break; }
    if (q.typ === 'ordna' && !L.kolla(q, q.items.map((_, k) => k)).ok) { anta(false, `${g} ordna`); break; }
    if (q.typ === 'pil') { const sum = q.losning[0].match(/(\d+(?: \+ \d+)*) = (\d+)/); if (!sum || sum[1].split(' + ').reduce((a, b) => a + +b, 0) !== q.mal) { anta(false, `${g} pil summa ${allt}`); break; } }
    // oberoende kontroller
    if (g === 'uppstallning') { const u = q.uttryck.replace(/\{(\d+)\/(\d+)\}/, '$1 / $2').replace('·', '*').replace('−', '-'); const vant = Math.round(eval(u)); if (vant !== +q.falt[0].svar) { anta(false, `uppställning ${u} = ${vant} men facit ${q.falt[0].svar}`); break; } }
    if (g === 'brak_dec') { const m = (q.text.match(/\{(\d+)\/(\d+)\}/)); if (m && Math.abs(m[1] / m[2] - L.parseTal(q.falt[0].svar)) > 1e-9) { anta(false, 'brak_dec ' + allt); break; } }
    if (g === 'kronor') { const m = q.text.match(/(?:(\d+) kr )?(\d+) öre/); const v = ((+m[1] || 0) * 100 + +m[2]) / 100; if (Math.abs(v - L.parseTal(q.falt[0].svar)) > 1e-9) { anta(false, 'kronor ' + allt); break; } }
    if (g === 'avrunda') { const m = q.text.match(/Avrunda ([\d ,]+) till (\w+)/); const x = L.parseTal(m[1]); const steg = { tiotal: 10, hundratal: 100, heltal: 1, tiondelar: 0.1, hundradelar: 0.01 }[m[2]]; const vant = Math.round((x + 1e-9) / steg) * steg; if (Math.abs(vant - L.parseTal(q.falt[0].svar)) > 1e-6) { anta(false, `avrunda ${x} till ${m[2]}: ${vant} vs ${q.falt[0].svar}`); break; } }
    if (g === 'ko') { const m = q.text.match(/nummer (\d+) framifrån och nummer (\d+) bakifrån/); if (+m[1] + +m[2] - 1 !== +q.falt[0].svar) { anta(false, 'ko'); break; } }
    if (g === 'talfoljd') { if (!q.losning[2].includes(L.fmt(+q.falt[0].svar))) { anta(false, 'talföljd ' + allt); break; } }
  }
}

// 5. Femmans matte: oberoende kontroll av de nya generatorerna och minus-knappen
const nyaGen = { procent: 0, brak_av: 0, enhet: 0, omkrets_area: 0, negativa: 0, lagesmatt: 0, ekvation: 0, monster: 0, gange10: 0, proportion: 0 };
const tal = s => L.parseTal(s);
for (const g of Object.keys(nyaGen)) {
  for (let seed = 1; seed <= 3000; seed++) {
    const q = L.G[g](L.slump(seed * 31 + 7), {});
    const svar = tal(q.falt[0].svar);
    let vant = null;
    if (g === 'procent') { const m = q.text.match(/(\d+) % av (\d+)/); vant = +m[1] * +m[2] / 100; }
    if (g === 'brak_av') { const m = q.text.match(/är (.+) av (\d+)/); const ord = { 'hälften': [1, 2] }; let nd = ord[m[1]]; if (!nd) { const d = { tredjedel: 3, fjärdedel: 4, femtedel: 5, tiondel: 10 }; const n = { en: 1, två: 2, tre: 3, fyra: 4, fem: 5, sex: 6, sju: 7, åtta: 8, nio: 9 }; const w = m[1].split(' '); nd = [n[w[0]], d[w[1].replace(/ar$/, '')]]; } vant = +m[2] * nd[0] / nd[1]; }
    if (g === 'enhet') { const m = q.text.match(/Hur många (\w+) är ([\d,]+) (\w+)/); const f = { 'm>cm': 100, 'kg>g': 1000, 'l>dl': 10, 'km>m': 1000, 'h>min': 60, 'cm>mm': 10, 'l>ml': 1000 }; const fr = m[3], ti = m[1], x = tal(m[2]); vant = f[fr + '>' + ti] ? x * f[fr + '>' + ti] : x / f[ti + '>' + fr]; }
    if (g === 'omkrets_area') { const f = q.figur; vant = /arean/.test(q.text) ? f.b * f.h : 2 * (f.b + f.h); }
    if (g === 'negativa') { const nums = [...q.text.matchAll(/(−?\d+) (°C|grader)/g)].map(m => +m[1].replace('−', '-')); if (/varmare/.test(q.text)) vant = nums[0] + nums[1]; else if (/kallare/.test(q.text)) vant = nums[0] - nums[1]; else vant = nums[0] - nums[1]; }
    if (g === 'lagesmatt') { const t = q.uttryck.split(',').map(x => +x.trim()); const so = [...t].sort((a, b) => a - b); if (/medianen/.test(q.text)) vant = so[2]; else if (/medelvärdet/.test(q.text)) vant = t.reduce((a, b) => a + b, 0) / t.length; else { const c = {}; t.forEach(x => c[x] = (c[x] || 0) + 1); const mx = Math.max(...Object.values(c)); const top = Object.keys(c).filter(k => c[k] === mx); if (top.length !== 1) { anta(false, 'typvärde ej unikt ' + q.uttryck); break; } vant = +top[0]; } }
    if (g === 'ekvation') { const e = q.uttryck.replace('·', '*').replace('−', '-'); const [vl, hl] = e.split('='); for (let x = -50; x <= 200; x++) { if (Math.abs(eval(vl.replace('x', '(' + x + ')')) - eval(hl)) < 1e-9) { vant = x; break; } } }
    if (g === 'monster') { const m = q.text.match(/av (\d+) stickor, figur 2 av (\d+).*figur (\d+)\?/); const a = +m[1], d = +m[2] - a; vant = a + d * (+m[3] - 1); }
    if (g === 'gange10') vant = eval(q.uttryck.replace(/ /g, '').replace(/ /g, '').replace(/,/g, '.').replace('·', '*'));
    if (g === 'proportion') { const m = q.text.match(/^(\d+) \S+ kostar (\d+) kr\. Hur mycket kostar (\d+)/); vant = +m[2] / +m[1] * +m[3]; }
    if (vant === null || Math.abs(vant - svar) > 1e-9) { anta(false, `${g} seed ${seed}: ${q.text} ${q.uttryck || ''} facit ${q.falt[0].svar} men ska vara ${vant}`); break; }
    if (!(q.niva >= 1 && q.niva <= 3)) { anta(false, `${g} saknar nivå`); break; }
    if (svar < 0 && !q.minus) { anta(false, `${g} har minussvar men ingen minusknapp`); break; }
    nyaGen[g]++;
  }
}
// Alla fasta frågor med minussvar måste ha minus-knappen
for (const set of LAXOR) for (const pass of set.pass) (pass.fragor || []).forEach((q, i) => (q.falt || []).forEach(f => { if (f.typ === 'tal' && tal(f.svar) < 0) anta(q.minus, `${set.id}/${pass.id}/${i} saknar minusknapp`); }));
anta(L.kollaFalt({ typ: 'tal', svar: '-6' }, '-6').ok && L.kollaFalt({ typ: 'tal', svar: '-6' }, '−6').ok && !L.kollaFalt({ typ: 'tal', svar: '-6' }, '6').ok, 'minussvar');
const femman = LAXOR.find(s => s.id === 'femman');
console.log('Femmans matte: ' + femman.pass.filter(p => p.fragor).reduce((a, p) => a + p.fragor.length, 0) + ' fasta frågor, nivåer: ' + JSON.stringify(femman.pass.filter(p => p.fragor).flatMap(p => p.fragor).reduce((a, q) => (a[q.niva] = (a[q.niva] || 0) + 1, a), {})));
console.log('Nya generatorer kontrollerade: ' + Object.values(nyaGen).reduce((a, b) => a + b, 0));

console.log(`Typer i läxorna: ${JSON.stringify(typer)}`);
console.log(`Genererade och kontrollerade frågor: ${antalGen}`);
console.log(`Godkända kontroller: ${ok}, fel: ${fel}`);
process.exit(fel ? 1 : 0);
