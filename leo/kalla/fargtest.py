"""Färggranskning av Lekgympan: python3 fargtest.py [ut-mapp]
Visar varje frågetyp och varje vy i ljust och mörkt läge och i alla tre färgteman, och i lägena
förstahandsvy, efter ett fel svar, efter facit och efter rätt svar. Mäter kontrasten enligt WCAG 2.2:
 - text: minst 4,5:1 (stor text, minst 24 px eller 18,7 px fet: 3:1)
 - former och färgrutor i svaren: fyllning eller kontur minst 3:1 mot rutan (1.4.11 icke-text-kontrast)
Tar också skärmbilder, och kör en omgång med Chromes tvingade mörka läge (Android "mörkt tema för webbplatser")
för att se att appen inte målas om av webbläsaren."""
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
URL = (HERE / 'lekgympan-fristaende.html').as_uri()
UT = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / 'fargshots'
UT.mkdir(parents=True, exist_ok=True)

MAT = r"""
() => {
  function rgba(s) { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
  function over(f, b) { const a = f.a; return { r: f.r * a + b.r * (1 - a), g: f.g * a + b.g * (1 - a), b: f.b * a + b.b * (1 - a), a: 1 }; }
  function lum(c) { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
  function kontrast(a, b) { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function bakgrund(el) {
    const lager = []; let e = el;
    while (e && e.nodeType === 1) { const cs = getComputedStyle(e); const c = rgba(cs.backgroundColor); if (c && c.a > 0) lager.push(c); if (c && c.a >= 1) break; e = e.parentElement; }
    let b = { r: 255, g: 255, b: 255, a: 1 };
    const body = rgba(getComputedStyle(document.body).backgroundColor); if (body && body.a > 0) b = over(body, b);
    for (let i = lager.length - 1; i >= 0; i--) b = over(lager[i], b);
    return b;
  }
  function opacitet(el) { let o = 1, e = el; while (e && e.nodeType === 1) { o *= parseFloat(getComputedStyle(e).opacity); e = e.parentElement; } return o; }
  function synlig(el) { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(el); return cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight * 3; }
  function namn(el) { return el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''); }
  const fel = [], ok = [];
  // Text
  document.querySelectorAll('#app *').forEach(el => {
    if (el.closest('svg') || el.closest('.emoji') || el.closest('.overlay[hidden]')) return;
    const text = Array.from(el.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
    if (!text || !synlig(el)) return;
    const cs = getComputedStyle(el), f = rgba(cs.color); if (!f) return;
    const bg = bakgrund(el), op = opacitet(el);
    const farg = over({ r: f.r, g: f.g, b: f.b, a: f.a * op }, bg);
    const k = kontrast(farg, bg), px = parseFloat(cs.fontSize), fet = parseInt(cs.fontWeight) >= 700;
    const stor = px >= 24 || (fet && px >= 18.66), krav = stor ? 3 : 4.5;
    const rad = { typ: 'text', el: namn(el), text: text.slice(0, 30), k: Math.round(k * 100) / 100, krav, px };
    (k < krav ? fel : ok).push(rad);
  });
  // Former och färgrutor i svarsalternativen
  document.querySelectorAll('#app .alt svg.form, #app .monster svg.form').forEach(sv => {
    if (!synlig(sv)) return;
    const g = sv.querySelector('g'), cs = getComputedStyle(g), bg = bakgrund(sv.parentElement), op = opacitet(sv);
    const fill = rgba(cs.fill), stroke = rgba(cs.stroke);
    const kf = fill ? kontrast(over({ ...fill, a: op }, bg), bg) : 0, ks = stroke ? kontrast(over({ ...stroke, a: op }, bg), bg) : 0;
    const k = Math.max(kf, ks);
    const rad = { typ: 'form', el: namn(sv.parentElement), text: cs.fill, k: Math.round(k * 100) / 100, kFyll: Math.round(kf * 100) / 100, krav: 3 };
    (k < 3 ? fel : ok).push(rad);
  });
  return { fel, antal: fel.length + ok.length };
}
"""

GEN = ['rakna', 'siffra', 'tryck', 'flest', 'efter', 'plus', 'ordning', 'borjar', 'hitta', 'storliten', 'namn', 'byggnamn',
       'form', 'farg', 'formfarg', 'monster', 'storst', 'ordbild', 'bildord', 'bygg', 'rim', 'slutar']

def kor(pw, lage, skins, rapport, bilder=True):
    args = ['--enable-features=WebContentsForceDark'] if lage == 'tvingat' else []
    b = pw.chromium.launch(args=args)
    ctx = b.new_context(viewport={'width': 800, 'height': 1280}, color_scheme='dark' if lage == 'mork' else 'light', reduced_motion='reduce', has_touch=True)
    for skin in skins:
        pg = ctx.new_page()
        fel_js = []
        pg.on('pageerror', lambda e: fel_js.append(str(e)))
        pg.add_init_script("localStorage.setItem('lekgympan.v1', JSON.stringify({figur:'lejon', skin:'%s', rost:false, ljud:false, stjarnor:57, dag:'x'}))" % skin)
        pg.goto(URL); pg.wait_for_timeout(300)
        tag = lage + '-' + skin

        def mat(namn):
            pg.evaluate("document.getElementById('fx').getContext('2d').clearRect(0,0,99999,99999)")
            r = pg.evaluate(MAT)
            for f in r['fel']:
                rapport.append(dict(f, lage=lage, skin=skin, vy=namn))
            if bilder: pg.screenshot(path=str(UT / (tag + '-' + namn + '.png')))
            return r

        mat('hem')
        pg.click('[data-act="inst"]'); pg.wait_for_timeout(150); mat('installningar'); pg.click('[data-act="inst-stang"]')
        for gen in GEN:
            pg.evaluate("window.__lek.fraga('%s', 2)" % gen); pg.wait_for_timeout(120)
            mat(gen + '-1')
            q = pg.evaluate('window.__lek.P().q')
            if q['typ'] == 'val':
                fela = [i for i in range(len(q['alt'])) if i != q['ratt']]
                pg.click('[data-act="val"][data-i="%d"]' % fela[0]); pg.wait_for_timeout(120); mat(gen + '-2fel')
                if len(fela) > 1 and not pg.evaluate('window.__lek.P().klar'):
                    pg.click('[data-act="val"][data-i="%d"]' % fela[1]); pg.wait_for_timeout(120)
                    if pg.evaluate('window.__lek.P().klar'): mat(gen + '-3facit')
                pg.evaluate("window.__lek.fraga('%s', 2)" % gen); pg.wait_for_timeout(100)
                q = pg.evaluate('window.__lek.P().q')
                pg.click('[data-act="val"][data-i="%d"]' % q['ratt']); pg.wait_for_timeout(120); mat(gen + '-4ratt')
            elif q['typ'] == 'tryck':
                for k in range(2): pg.click('[data-act="tryck-sak"][data-i="%d"]' % k)
                mat(gen + '-2valda')
            elif q['typ'] == 'bygg':
                pg.locator('[data-act="bygg-ta"]').first.click(); pg.wait_for_timeout(80); mat(gen + '-2halvvags')
        # Klar-vyn och spelet
        pg.evaluate("window.__lek.fraga('siffra', 1)")
        P = pg.evaluate('window.__lek.P()')
        for i in range(8):
            q = pg.evaluate('window.__lek.P().q')
            if q['typ'] == 'val': pg.click('[data-act="val"][data-i="%d"]' % q['ratt'])
            elif q['typ'] == 'tryck':
                for k in range(q['mal']): pg.click('[data-act="tryck-sak"][data-i="%d"]' % k)
                pg.click('[data-act="tryck-klar"]')
            else:
                for it in q['items']: pg.locator('[data-act="bygg-ta"]', has_text=it['text']).first.click()
            pg.click('[data-act="nasta"]'); pg.wait_for_timeout(100)
            if pg.locator('#spelplan').count():
                mat('spel-start'); pg.click('[data-act="spel-start"]'); pg.wait_for_timeout(1200); mat('spel-igang'); pg.click('[data-act="spel-avsluta"]'); pg.wait_for_timeout(150)
        pg.wait_for_timeout(300); mat('klar')
        if fel_js: rapport.append({'typ': 'js', 'lage': lage, 'skin': skin, 'text': fel_js[:3]})
        pg.close()
    b.close()

rapport = []
with sync_playwright() as pw:
    kor(pw, 'ljust', ['gron', 'bla', 'rod'], rapport)
    kor(pw, 'mork', ['gron', 'bla', 'rod'], rapport)
    kor(pw, 'tvingat', ['gron'], rapport)
(UT / 'rapport.json').write_text(json.dumps(rapport, ensure_ascii=False, indent=1))
print(len(rapport), 'brister')
from collections import Counter
for (l, s, e), n in Counter((r['lage'], r['skin'], r.get('el', '')) for r in rapport).most_common(40):
    ex = next(r for r in rapport if r['lage'] == l and r['skin'] == s and r.get('el', '') == e)
    print('%-7s %-4s %3d  %-48s ex: %-12s k=%s (krav %s) i %s' % (l, s, n, e[:48], str(ex.get('text'))[:12], ex.get('k'), ex.get('krav'), ex.get('vy')))
