// Kontroll av Hinderhoppet: går varje bana att klara utan att bli träffad,
// även om man bara kan trycka med ungefär en tiondels sekunds precision?
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/src/spel.js', 'utf8');
const block = src.slice(src.indexOf('/*HOPP-START*/'), src.indexOf('/*HOPP-SLUT*/'));
const HOPP = new Function(block + '; return HOPP;')();

function slump(seed) { let a = seed >>> 0 || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function bana(W, H, seed, tid) {
  const skala = clamp(H / 800, 0.7, 1.3), skalaX = clamp(W / 800, 0.6, 1.3);
  const fw = clamp(W * 0.22, 90, 150), fh = fw * 196 / 240, mark = H - 46 * skala, x = W * 0.2;
  const rnd = slump(seed), dt = 1 / 60, ram = [];
  let t = 0, nasta = 0.9, saker = [];
  for (let f = 0; t < tid; f++) {
    t += dt;
    const fart = HOPP.fart(t) * skalaX;
    nasta -= dt;
    if (nasta <= 0) {
      const m = HOPP.monster(t, rnd);
      m.hinder.forEach(o => saker.push(o.typ === 'boll'
        ? { typ: 'boll', x: W + 40 + o.dx * skalaX, r: o.r * skala, hojd: fh * 0.86 + o.r * skala + 16 * skala }
        : { typ: o.typ, x: W + 40 + o.dx * skalaX, w: o.w * skalaX, h: o.h * skala }));
      nasta = m.paus;
    }
    saker.forEach(o => { o.x -= fart * dt; });
    saker = saker.filter(o => (o.typ === 'boll' ? o.x + o.r : o.x + o.w) > -40);
    ram.push(saker.filter(o => Math.abs(o.x - x) < 260).map(o => ({ ...o })));
  }
  return { ram, skala, fw, fh, mark, x, antal: 0 };
}
function traff(b, y, hinder) {
  const hb = { x1: b.x - b.fw * 0.16, x2: b.x + b.fw * 0.16, y1: y - b.fh * 0.86, y2: y - b.fh * 0.08 };
  for (const o of hinder) {
    if (o.typ === 'boll') {
      const cy = b.mark - o.hojd, px = clamp(o.x, hb.x1, hb.x2), py = clamp(cy, hb.y1, hb.y2);
      if (Math.hypot(o.x - px, cy - py) < o.r * 0.85) return true;
    } else if (o.x + 4 < hb.x2 && o.x + o.w - 4 > hb.x1 && b.mark - o.h + 4 < hb.y2 && b.mark > hb.y1) return true;
  }
  return false;
}
// Finns det något sätt att trycka (bara var N:e bildruta, med given fas) som klarar hela banan?
function klarbar(b, steg, fas) {
  const g = HOPP.g * b.skala, v0 = Math.sqrt(2 * HOPP.g * HOPP.hojd) * b.skala, dt = 1 / 60;
  let st = new Map([[`${b.mark}|0|0`, { y: b.mark, vy: 0, h: 0 }]]);
  for (let f = 0; f < b.ram.length; f++) {
    const ny = new Map(), kanTrycka = (f + fas) % steg === 0;
    for (const s of st.values()) {
      const val = [s];
      if (kanTrycka && s.h < 2) val.push({ y: s.y, vy: -v0 * (s.h ? HOPP.andra : 1), h: s.h + 1 });
      for (const a of val) {
        let vy = a.vy + g * dt, y = a.y + vy * dt, h = a.h;
        if (y >= b.mark) { y = b.mark; vy = 0; h = 0; }
        if (traff(b, y, b.ram[f])) continue;
        const k = `${Math.round(y)}|${Math.round(vy / 4)}|${h}`;
        if (!ny.has(k)) ny.set(k, { y, vy, h });
      }
    }
    if (!ny.size) return f / 60;
    st = ny;
  }
  return -1;
}
const skarmar = [['Platta stående', 800, 1150], ['Platta liggande', 1280, 640], ['Liten skärm', 420, 700]];
let fel = 0, banor = 0;
for (const [namn, W, H] of skarmar) {
  let hinder = 0, bollar = 0, omojliga = 0;
  for (let seed = 1; seed <= 120; seed++) {
    const b = bana(W, H, seed, 30);
    banor++;
    // Räkna hinder (unika) grovt via spawn-simulering
    const r = slump(seed); let t = 0, n = 0.9;
    while (t < 30) { t += 1 / 60; n -= 1 / 60; if (n <= 0) { const m = HOPP.monster(t, r); hinder++; if (m.hinder[0].typ === 'boll') bollar++; n = m.paus; } }
    for (const fas of [0, 2, 4]) {
      const res = klarbar(b, 6, fas);
      if (res >= 0) { omojliga++; fel++; if (omojliga <= 3) console.log(`  ${namn}: bana ${seed} (fas ${fas}) går inte att klara vid ${res.toFixed(2)} s`); break; }
    }
  }
  console.log(`${namn}: ${(hinder / 120).toFixed(1)} hinder per 30 s, varav ${(bollar / 120).toFixed(1)} bollar. Omöjliga banor: ${omojliga} av 120.`);
}
console.log(`Fart: ${HOPP.fart(0)} → ${HOPP.fart(30)} px/s (förut 300 → 510).`);
console.log(fel ? `FEL: ${fel} banor går inte att klara` : `Alla ${banor} banor går att klara med tryck var tiondels sekund.`);
process.exit(fel ? 1 : 0);
