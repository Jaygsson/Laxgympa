// Bygger Europakartan till Läxgympan från Natural Earth 1:50m (paketet world-atlas).
// Ut: ../src/geo-data.js med SVG-vägar, rutor, mittpunkter, huvudstäder, grannar och regionvyer.
const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const simp = require('topojson-simplify');
const d3 = require('d3-geo');

const topo = JSON.parse(fs.readFileSync(path.join(__dirname, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));
const W = 1000, H = 860;

const KOD = {
  'Sweden': 'SE', 'Norway': 'NO', 'Denmark': 'DK', 'Finland': 'FI', 'Iceland': 'IS', 'United Kingdom': 'GB', 'Ireland': 'IE',
  'France': 'FR', 'Belgium': 'BE', 'Netherlands': 'NL', 'Luxembourg': 'LU', 'Germany': 'DE', 'Poland': 'PL', 'Czechia': 'CZ',
  'Slovakia': 'SK', 'Austria': 'AT', 'Switzerland': 'CH', 'Hungary': 'HU', 'Spain': 'ES', 'Portugal': 'PT', 'Italy': 'IT',
  'Greece': 'GR', 'Malta': 'MT', 'Cyprus': 'CY', 'N. Cyprus': 'CY', 'Slovenia': 'SI', 'Croatia': 'HR', 'Bosnia and Herz.': 'BA',
  'Serbia': 'RS', 'Montenegro': 'ME', 'Albania': 'AL', 'Macedonia': 'MK', 'North Macedonia': 'MK', 'Kosovo': 'XK', 'Bulgaria': 'BG',
  'Romania': 'RO', 'Moldova': 'MD', 'Ukraine': 'UA', 'Belarus': 'BY', 'Russia': 'RU', 'Estonia': 'EE', 'Latvia': 'LV',
  'Lithuania': 'LT', 'Turkey': 'TR', 'Türkiye': 'TR'
};
// Huvudstäder (longitud, latitud). Stockholm, Köpenhamn, Lissabon och Reykjavik är flyttade en bit in från kusten så att stjärnan hamnar på land på den förenklade kartan.
const HUVUDSTAD = {
  SE: [17.95, 59.35], NO: [10.75, 59.91], DK: [12.45, 55.68], FI: [24.94, 60.17], IS: [-21.9, 64.15], GB: [-0.13, 51.51],
  IE: [-6.26, 53.35], FR: [2.35, 48.86], BE: [4.35, 50.85], NL: [4.90, 52.37], LU: [6.13, 49.61], DE: [13.40, 52.52],
  PL: [21.01, 52.23], CZ: [14.42, 50.08], SK: [17.11, 48.15], AT: [16.37, 48.21], CH: [7.45, 46.95], HU: [19.04, 47.50],
  ES: [-3.70, 40.42], PT: [-9.15, 38.75], IT: [12.50, 41.90], GR: [23.73, 37.98], MT: [14.51, 35.90], CY: [33.36, 35.17],
  SI: [14.51, 46.06], HR: [15.98, 45.81], BA: [18.41, 43.86], RS: [20.46, 44.79], ME: [19.26, 42.44], AL: [19.82, 41.33],
  MK: [21.43, 41.99], XK: [21.17, 42.66], BG: [23.32, 42.70], RO: [26.10, 44.43], MD: [28.86, 47.01], UA: [30.52, 50.45],
  BY: [27.56, 53.90], RU: [37.62, 55.76], EE: [24.75, 59.44], LV: [24.11, 56.95], LT: [25.28, 54.69], TR: [32.85, 39.93]
};
const REGIONER = {
  norden: ['SE', 'NO', 'DK', 'FI', 'IS'],
  vast: ['GB', 'IE', 'FR', 'BE', 'NL', 'LU'],
  mellan: ['DE', 'PL', 'CZ', 'SK', 'AT', 'CH', 'HU'],
  syd: ['ES', 'PT', 'IT', 'GR', 'MT', 'CY', 'TR'],
  balkan: ['SI', 'HR', 'BA', 'RS', 'ME', 'AL', 'MK', 'XK', 'BG', 'RO'],
  ost: ['EE', 'LV', 'LT', 'BY', 'UA', 'MD', 'RU']
};

// Förenkla lite så att filen blir lagom stor, men behåll formen
let t = simp.presimplify(topo);
t = simp.simplify(t, 0.0025);
const geoms = t.objects.countries.geometries;
const namn = geoms.map(g => g.properties.name);
const saknas = Object.keys(KOD).filter(n => !namn.includes(n) && !['North Macedonia', 'Türkiye'].includes(n));
if (saknas.length) console.log('Hittar inte i kartdatan:', saknas);

// Projektion: Lambert ytriktig azimutal, samma idé som EU:s kartsystem ETRS89-LAEA (centrum 10°Ö, 52°N)
const ram = { type: 'Polygon', coordinates: [[[-24, 34], [45, 34], [45, 71.5], [-24, 71.5], [-24, 34]]] };
const ytor = [];
for (let lat = 34; lat <= 71.5; lat += 2.5) for (let lon = -24; lon <= 45; lon += 3) ytor.push([lon, lat]);
const proj = d3.geoAzimuthalEqualArea().rotate([-10, -52]).fitExtent([[10, 10], [W - 10, H - 10]], { type: 'MultiPoint', coordinates: [[-24, 63], [45, 56], [20, 34.5], [25, 71.2], [-10, 36]] });
proj.clipExtent([[0, 0], [W, H]]);
const vag = d3.geoPath(proj).digits(1);

const lander = {}, bakgrund = [];
const grupper = {};
geoms.forEach((g, i) => {
  const kod = KOD[g.properties.name];
  if (kod) (grupper[kod] = grupper[kod] || []).push(g);
});
for (const [kod, gs] of Object.entries(grupper)) {
  const f = gs.length > 1 ? { type: 'Feature', geometry: topojson.merge(t, gs) } : topojson.feature(t, gs[0]);
  const d = vag(f);
  if (!d) { console.log('Tom väg för', kod); continue; }
  const b = vag.bounds(f), c = vag.centroid(f), yta = vag.area(f);
  // Inre punkt: den punkt i landet som ligger längst från gränsen (för etiketter och test)
  const N = 36, inne = [], ute = [];
  for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
    const x = b[0][0] + (b[1][0] - b[0][0]) * i / N, y = b[0][1] + (b[1][1] - b[0][1]) * j / N;
    const ll = proj.invert([x, y]);
    (ll && d3.geoContains(f, ll) && x > 2 && y > 2 && x < W - 2 && y < H - 2 ? inne : ute).push([x, y]);
  }
  // kanter räknas som "ute" så att punkten hamnar en bit in
  let bast = inne[0] || c, bastD = -1;
  for (const p of inne) { let m = 1e9; for (const q of ute) { const dd = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (dd < m) m = dd; } if (m > bastD) { bastD = m; bast = p; } }
  lander[kod] = { d, box: b.flat().map(v => Math.round(v * 10) / 10), c: c.map(v => Math.round(v * 10) / 10), mitt: bast.map(v => Math.round(v * 10) / 10), yta: Math.round(yta), hs: proj(HUVUDSTAD[kod]).map(v => Math.round(v * 10) / 10) };
}
geoms.forEach(g => {
  if (KOD[g.properties.name]) return;
  const d = vag(topojson.feature(t, g));
  if (d && d.length > 10) bakgrund.push(d);
});

// Grannar (delar gräns)
const nb = topojson.neighbors(geoms);
const grannar = {};
geoms.forEach((g, i) => {
  const kod = KOD[g.properties.name]; if (!kod) return;
  nb[i].forEach(j => { const k2 = KOD[geoms[j].properties.name]; if (k2 && k2 !== kod) { (grannar[kod] = grannar[kod] || new Set()).add(k2); } });
});
for (const k of Object.keys(lander)) lander[k].grannar = [...(grannar[k] || [])].sort();

// Regionvyer: ruta runt regionens länder med marginal, i samma form som kartan
function vy(koder, marg) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  koder.forEach(k => { const b = lander[k].box; x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]); });
  let w = x1 - x0, h = y1 - y0; const mx = w * marg, my = h * marg; x0 -= mx; x1 += mx; y0 -= my; y1 += my; w = x1 - x0; h = y1 - y0;
  const ratio = W / H;
  if (w / h > ratio) { const nh = w / ratio; y0 -= (nh - h) / 2; h = nh; } else { const nw = h * ratio; x0 -= (nw - w) / 2; w = nw; }
  return [x0, y0, w, h].map(v => Math.round(v));
}
const regioner = {};
for (const [r, koder] of Object.entries(REGIONER)) regioner[r] = { lander: koder, vb: vy(koder.filter(k => k !== 'RU'), 0.12) };
regioner.ost.vb = vy(['EE', 'LV', 'LT', 'BY', 'UA', 'MD'], 0.35);
regioner.syd.vb = vy(['ES', 'PT', 'IT', 'GR', 'MT', 'CY'], 0.08);
regioner.alla = { lander: Object.values(REGIONER).flat(), vb: [0, 0, W, H] };

const ut = 'var GEO = ' + JSON.stringify({ w: W, h: H, lander, bakgrund, regioner }) + ';\nif (typeof module !== "undefined") module.exports = GEO;\n';
fs.writeFileSync(path.join(__dirname, '../src/geo-data.js'), ut);
console.log('Länder:', Object.keys(lander).length, '| bakgrundsländer:', bakgrund.length, '| storlek:', Math.round(ut.length / 1024), 'kB');
const sma = Object.entries(lander).map(([k, v]) => [k, Math.round(Math.max(v.box[2] - v.box[0], v.box[3] - v.box[1]))]).sort((a, b) => a[1] - b[1]).slice(0, 10);
console.log('Minsta länder (största mått i kartenheter):', sma.map(x => x.join(' ')).join(', '));
