"""Klickar igenom Lekgympan i en riktig webbläsare: väljer kompis, kör alla banor med rätt svar
(och några med fel svar så att 'försök igen' och facit visas), bonusspelen, och tar skärmbilder till shots/."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
URL = (HERE / 'lekgympan-fristaende.html').as_uri()
SHOT = HERE / 'shots'; SHOT.mkdir(exist_ok=True)
fel = []

def run():
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={'width': 800, 'height': 1280}, device_scale_factor=1, has_touch=True, reduced_motion='reduce')
        pg = ctx.new_page()
        pg.on('console', lambda m: fel.append('console ' + m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: fel.append('pageerror: ' + str(e)))
        pg.goto(URL); pg.wait_for_timeout(500)
        pg.screenshot(path=str(SHOT / '1-hem-ny.png'))
        pg.click('[data-act="valj-figur"][data-f="lejon"]'); pg.wait_for_timeout(400)
        pg.screenshot(path=str(SHOT / '2-hem.png'))

        def P(): return pg.evaluate('window.__lek.P()')

        def svara(ratt, info):
            q = P()['q']
            if q['typ'] == 'val':
                valda = P()['valda']
                i = q['ratt'] if ratt else [k for k in range(len(q['alt'])) if k != q['ratt'] and k not in valda][0]
                pg.click('[data-act="val"][data-i="%d"]' % i)
            elif q['typ'] == 'tryck':
                for k in range(q['mal'] if ratt else max(1, q['mal'] - 1)):
                    pg.click('[data-act="tryck-sak"][data-i="%d"]' % k)
                pg.click('[data-act="tryck-klar"]')
            elif q['typ'] == 'bygg':
                items = q['items']; bl = P()['blandning']
                ordning = list(range(len(items))) if ratt else bl
                for pos in ordning:
                    # hitta brickan med rätt text (vid rätt svar) eller bara nästa i poolen
                    if ratt:
                        pg.locator('[data-act="bygg-ta"]', has_text=items[pos]['text']).first.click()
                    else:
                        pg.locator('[data-act="bygg-ta"]').first.click()
                    pg.wait_for_timeout(60)
            pg.wait_for_timeout(150)

        def kor_bana(bana, ratt_alla, tag):
            pg.click('[data-act="bana"][data-b="%s"]' % bana); pg.wait_for_timeout(300)
            for i in range(8):
                pg.screenshot(path=str(SHOT / ('%s-%s-%d.png' % (tag, bana, i + 1))))
                ratt = ratt_alla or (i % 2 == 0)
                svara(ratt, bana)
                if not ratt:
                    # andra försöket: svara fel igen så facit visas (tryck/bygg sköter sig själva)
                    if not P()['klar']:
                        pg.screenshot(path=str(SHOT / ('%s-%s-%d-fel.png' % (tag, bana, i + 1))))
                        svara(False, bana)
                if not P()['klar']:
                    fel.append('Frågan blev inte klar: ' + bana + ' ' + P()['q']['gen'])
                    pg.screenshot(path=str(SHOT / ('fel-%d.png' % len(fel)))); return
                pg.click('[data-act="nasta"]'); pg.wait_for_timeout(200)
                if pg.locator('#spelplan').count():
                    pg.screenshot(path=str(SHOT / ('%s-%s-spel.png' % (tag, bana))))
                    pg.click('[data-act="spel-start"]'); pg.wait_for_timeout(1200)
                    pg.click('[data-act="spel-avsluta"]'); pg.wait_for_timeout(300)
            if not pg.locator('.klar-medalj').count():
                fel.append('Ingen klar-vy efter ' + bana); pg.screenshot(path=str(SHOT / ('fel-%d.png' % len(fel)))); return
            pg.screenshot(path=str(SHOT / ('%s-%s-klar.png' % (tag, bana))))
            if pg.locator('[data-act="spel-slut"]').count():
                pg.click('[data-act="spel-slut"]'); pg.wait_for_timeout(300)
                pg.click('[data-act="spel-start"]'); pg.wait_for_timeout(1500)
                pg.screenshot(path=str(SHOT / ('%s-%s-bonus.png' % (tag, bana))))
                pg.click('[data-act="spel-avsluta"]'); pg.wait_for_timeout(300)
            else:
                pg.click('[data-act="hem"]'); pg.wait_for_timeout(300)

        for bana in ['rakna', 'bokstaver', 'former', 'lasa', 'mix']:
            kor_bana(bana, True, '3')
        # Nivå 2 och 3 (guld lyfter nivån), och en körning med fel svar
        for bana in ['rakna', 'bokstaver', 'former', 'lasa', 'mix']:
            kor_bana(bana, True, '4')
        for bana in ['rakna', 'bokstaver', 'former', 'lasa', 'mix']:
            kor_bana(bana, False, '5')
        pg.screenshot(path=str(SHOT / '6-hem-efter.png'))
        pg.click('[data-act="inst"]'); pg.wait_for_timeout(300)
        pg.screenshot(path=str(SHOT / '7-installningar.png'))
        pg.click('[data-act="skin"][data-s="bla"]'); pg.click('[data-act="inst-stang"]'); pg.wait_for_timeout(300)
        pg.screenshot(path=str(SHOT / '8-hem-bla.png'))
        S = pg.evaluate('window.__lek.S()')
        print('stjärnor:', S['stjarnor'], 'nivåer:', {k: v['niva'] for k, v in S['pass'].items()})
        b.close()

run()
print(len(fel), 'fel')
for f in fel[:20]: print(' -', f)
sys.exit(1 if fel else 0)
