// Jämför "Akta dig!" före och efter: hur tätt det faller, och hur ofta en duktig spelare
// (en dator som flyttar fingret högst 900 px/s och bara ser 0,8 s framåt) blir träffad.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/src/spel.js', 'utf8');
const REGN = new Function(src.slice(src.indexOf('/*REGN-START*/'), src.indexOf('/*REGN-SLUT*/')) + '; return REGN;')();
function slump(seed) { let a = seed >>> 0 || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const GAMMAL = { fart: t => 190 + t * 9, paus: t => Math.max(0.3, 0.95 - t * 0.022), monster: (t, rnd) => [{ fx: rnd(), r: 15 + rnd() * 12, vx: 0, fartF: 0.85 + rnd() * 0.3 }] };

function spela(cfg, seed, tid, W = 800, H = 1150) {
  const rnd = slump(seed), skala = clamp(H / 800, 0.7, 1.3), skalaX = clamp(W / 800, 0.6, 1.3);
  const fw = clamp(W * 0.26, 90, 170), fh = fw * 196 / 240, y = H - 14, dt = 1 / 60;
  let x = W / 2, t = 0, nasta = 0.9, saker = [], traffar = 0, skydd = 0, antal = 0;
  const hb = (px) => ({ x1: px - fw * 0.16, x2: px + fw * 0.16, y1: y - fh * 0.86, y2: y - fh * 0.08 });
  const tr = (o, b) => { const cx = clamp(o.x, b.x1, b.x2), cy = clamp(o.y, b.y1, b.y2); return Math.hypot(o.x - cx, o.y - cy) < o.r * 0.85; };
  while (t < tid) {
    t += dt; skydd = Math.max(0, skydd - dt); nasta -= dt;
    if (nasta <= 0) {
      cfg.monster(t, rnd).forEach(m => { const r = m.r * skala; saker.push({ x: r + m.fx * (W - 2 * r), y: -r, r, v: cfg.fart(t) * skala * m.fartF, vx: m.vx * skalaX }); antal++; });
      nasta = cfg.paus(t);
    }
    // Spelaren: välj den plats (inom räckhåll) som är säkrast de närmaste 0,8 sekunderna
    let bast = x, bastV = -1;
    for (let kx = fw * 0.2; kx <= W - fw * 0.2; kx += 8) {
      const resa = Math.abs(kx - x) / 900; let fri = 0.8;
      for (let s = 0.05; s <= 0.8; s += 0.05) {
        const px = x + (kx - x) * Math.min(1, s / Math.max(resa, 1e-6)), b = hb(px);
        if (saker.some(o => { let ox = o.x + o.vx * s; if (ox < o.r) ox = 2 * o.r - ox; if (ox > W - o.r) ox = 2 * (W - o.r) - ox; return tr({ x: ox, y: o.y + o.v * s, r: o.r }, b); })) { fri = s; break; }
      }
      const varde = fri * 10 - Math.abs(kx - x) / W;
      if (varde > bastV) { bastV = varde; bast = kx; }
    }
    x += clamp(bast - x, -900 * dt, 900 * dt);
    const b = hb(x);
    saker = saker.filter(o => {
      o.y += o.v * dt;
      if (o.vx) { o.x += o.vx * dt; if (o.x < o.r) { o.x = o.r; o.vx = -o.vx; } else if (o.x > W - o.r) { o.x = W - o.r; o.vx = -o.vx; } }
      if (tr(o, b) && skydd <= 0) { traffar++; skydd = 1.3; return false; }
      return o.y - o.r < H + 10;
    });
  }
  return { traffar, antal };
}
function sammanfatta(namn, cfg, tid) {
  let tr = 0, an = 0, forlust = 0, felfria = 0; const N = 150;
  for (let s = 1; s <= N; s++) { const r = spela(cfg, s, tid); tr += r.traffar; an += r.antal; if (r.traffar >= 3) forlust++; if (r.traffar === 0) felfria++; }
  console.log(`${namn}: ${(an / N).toFixed(0)} saker faller på ${tid} s. Träffar i snitt: ${(tr / N).toFixed(2)}. Klarar sig utan träff: ${Math.round(felfria / N * 100)} %. Förlorar alla tre liv: ${Math.round(forlust / N * 100)} %.`);
}
sammanfatta('Förut (30 s)', GAMMAL, 30);
sammanfatta('Nu    (40 s)', REGN, 40);
