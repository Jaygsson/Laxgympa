"""Klickar igenom hela appen i en riktig webbläsare: alla läxpass med rätt svar,
alla träna-mer-pass med fel svar (så att ledtråd och lösning visas), och tar skärmbilder."""
import json, math, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
URL = (HERE / 'laxgympan-fristaende.html').as_uri()
SHOT = HERE / 'shots'; SHOT.mkdir(exist_ok=True)
fel = []
slumpad = []
mittspel = []

def run():
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={'width': 800, 'height': 1280}, device_scale_factor=1, has_touch=True, reduced_motion='reduce')
        pg = ctx.new_page()
        pg.on('console', lambda m: fel.append('console ' + m.type + ': ' + m.text) if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: fel.append('pageerror: ' + str(e)))
        pg.goto(URL); pg.wait_for_timeout(600)
        pg.screenshot(path=str(SHOT / '1-hem-ny.png'))
        # Onboarding
        pg.click('[data-act="valj-figur"][data-f="hast"]'); pg.wait_for_timeout(200)
        pg.fill('#onb-kompis', 'Stjärna'); pg.click('form[data-form="kompis"] button[type=submit]')
        pg.fill('#onb-namn', 'Lova'); pg.click('form[data-form="namn"] button[type=submit]'); pg.wait_for_timeout(400)
        laxor = pg.evaluate('LAXOR')

        def nasta_finns():
            return pg.locator('[data-act="nasta"]').count() > 0

        def klicka_nasta(info):
            if not nasta_finns():
                ak = pg.locator('#aterkoppling').inner_text() if pg.locator('#aterkoppling').count() else ''
                fel.append('Ingen Nästa-knapp: ' + info + ' | ' + ak[:200].replace(chr(10), ' '))
                pg.screenshot(path=str(SHOT / ('fel-' + str(len(fel)) + '.png')))
                return False
            pg.click('[data-act="nasta"]')
            if pg.locator('#spelplan').count():
                mittspel.append(info)
                pg.click('[data-act="spel-start"]'); pg.wait_for_timeout(400)
                if len(mittspel) == 1: pg.screenshot(path=str(SHOT / 'mittspel.png'))
                pg.click('[data-act="spel-avsluta"]'); pg.wait_for_timeout(150)
                if not pg.locator('#fraga').count(): fel.append('Kom inte tillbaka till läxan efter pausspelet: ' + info)
            return True

        def tryck_tavla(varde):
            mid = {1: 107, 5: 81, 20: 55, 25: 30, 50: 0}[varde]
            box = pg.locator('#tavla').bounding_box(); s = box['width'] / 260
            pg.mouse.click(box['x'] + 130 * s, box['y'] + (130 - mid) * s)

        def skriv_falt(i, text):
            pg.click(f'[data-act="falt"][data-i="{i}"]')
            for ch in text:
                k = ',' if ch in ',.' else ch
                if ch == ' ' or ch == ' ': continue
                pg.click(f'[data-act="tangent"][data-k="{k}"]')

        def svara_ratt(q):
            t = q['typ']
            if t == 'val': pg.click(f'[data-act="val"][data-i="{q["ratt"]}"]')
            elif t == 'kort': pg.click('[data-act="kort-visa"]'); pg.click('[data-act="kort-bedom"][data-v="kunde"]')
            elif t == 'ordna':
                for i in range(len(q['items'])): pg.click(f'[data-act="ordna-ta"][data-i="{i}"]')
                pg.click('[data-act="ratta"]')
            elif t == 'pil':
                kombi = {6: [25, 25, 20, 20, 20, 1], 5: [50, 20, 20, 20, 1]}[q['pilar']]
                for v in kombi: tryck_tavla(v)
                pg.click('[data-act="ratta"]')
            elif t == 'svar':
                for i, f in enumerate(q['falt']):
                    if f['typ'] == 'text': pg.fill(f'[data-text="{i}"]', f['svar'])
                    else: skriv_falt(i, f['svar'])
                pg.click('[data-act="ratta"]')

        def svara_fel():
            # Generiskt: ge fel svar tills knappen Nästa visas
            forsok_brak = {}
            for _ in range(10):
                if nasta_finns(): return True
                if pg.locator('[data-act="val"]:not([disabled])').count():
                    pg.locator('[data-act="val"]:not([disabled])').first.click(); continue
                if pg.locator('[data-act="geo-hs"]:not([disabled])').count():
                    pg.locator('[data-act="geo-hs"]:not([disabled])').first.click(); continue
                if pg.locator('.geo-karta.fraga').count():
                    bx = pg.locator('.geo-karta.fraga svg').bounding_box()
                    pg.mouse.click(bx['x'] + bx['width'] * 0.5, bx['y'] + bx['height'] * 0.55); pg.wait_for_timeout(60)
                    if not nasta_finns(): pg.mouse.click(bx['x'] + bx['width'] * 0.45, bx['y'] + bx['height'] * 0.5)
                    continue
                if pg.locator('.ordna').count():
                    while pg.locator('[data-act="ordna-ta"]').count(): pg.locator('[data-act="ordna-ta"]').first.click()
                    pg.click('[data-act="ratta"]'); continue
                if pg.locator('#tavla').count():
                    if pg.locator('[data-act="pil-rensa"]:not([disabled])').count(): pg.click('[data-act="pil-rensa"]')
                    n = int(pg.locator('.pil-summa small').inner_text().split('av ')[2].split(' ')[0])
                    for _ in range(n): tryck_tavla(1)
                    pg.click('[data-act="ratta"]'); continue
                if pg.locator('[data-act="falt"]').count():
                    n = pg.locator('[data-act="falt"]').count()
                    for i in range(n):
                        el = pg.locator(f'[data-act="falt"][data-i="{i}"]')
                        cls = el.get_attribute('class')
                        if ' ok' in cls or ' nej' in cls: continue
                        pg.click(f'[data-act="falt"][data-i="{i}"]')
                        for _ in range(6): pg.click('[data-act="tangent"][data-k="del"]')
                        tom = 'tomt' in (el.get_attribute('aria-label') or '')
                        if forsok_brak.get(i):
                            for k in ['9', '/', '7']: pg.click(f'[data-act="tangent"][data-k="{k}"]')
                        else: pg.click('[data-act="tangent"][data-k="1"]')
                    pg.click('[data-act="ratta"]')
                    # fält som inte godtog formatet får ett bråk nästa gång
                    for i in range(n):
                        cls = pg.locator(f'[data-act="falt"][data-i="{i}"]').get_attribute('class') or ''
                        if ' ok' not in cls and ' nej' not in cls and pg.locator('.besked.info').count(): forsok_brak[i] = True
                    continue
                if pg.locator('[data-text]').count():
                    pg.locator('[data-text]').first.fill('fel'); pg.click('[data-act="ratta"]'); continue
            return nasta_finns()

        bilder = 0
        spelade = 0
        for s in laxor:
            for ps in s['pass']:
                if ps.get('pool') or ps.get('utforska'): continue
                pg.evaluate('document.querySelector("[data-act=hem]") && 0')
                pg.goto(URL); pg.wait_for_timeout(250)
                pg.click(f'[data-act="oppna"][data-set="{s["id"]}"]')
                pg.click(f'[data-act="starta"][data-set="{s["id"]}"][data-pass="{ps["id"]}"]')
                ordning = []
                if 'fragor' in ps:
                    for _i in range(len(ps['fragor'])):
                        ref = pg.get_attribute('#fraga', 'data-ref'); qi = int(ref.split('/')[2]); q = ps['fragor'][qi]
                        ordning.append(qi)
                        svara_ratt(q)
                        pg.wait_for_timeout(60)
                        if not pg.locator('.besked.ratt').count():
                            msg = pg.locator('#aterkoppling').inner_text() if pg.locator('#aterkoppling').count() else ''
                            fel.append(f'Inte godkänt: {s["id"]}/{ps["id"]}/{qi}: {q["text"][:60]} -> {msg[:120]}')
                            svara_fel()
                        if s['id'] == 'kap1' and ps['id'] == 'del1' and qi in (5, 10) and bilder < 2:
                            pg.screenshot(path=str(SHOT / f'2-fraga-{qi}.png')); bilder += 1
                        if s['id'] == 'pilkast' and qi == 3: pg.screenshot(path=str(SHOT / '3-pil.png'))
                        if not klicka_nasta(f'{s["id"]}/{ps["id"]}/{qi}'): break
                else:
                    antal_q = ps.get('antal') or (len(pg.evaluate('GEO.regioner["' + ps['karta'] + '"].lander')) if ps.get('karta') else 8)
                    for qi in range(antal_q):
                        if not svara_fel(): fel.append(f'Fastnade i {s["id"]}/{ps["id"]} fråga {qi}')
                        if s['id'] == 'kap1' and qi == 0: pg.screenshot(path=str(SHOT / '4-losning.png'))
                        if not klicka_nasta(f'{s["id"]}/{ps["id"]} gen {qi}'): break
                pg.wait_for_timeout(200)
                if ordning and sorted(ordning) != list(range(len(ps['fragor']))): fel.append(f'Alla frågor kom inte med i {s["id"]}/{ps["id"]}: {ordning}')
                if ordning and len(ordning) > 3: slumpad.append(ordning != sorted(ordning))
                if not pg.locator('.klar').count(): fel.append(f'Ingen klar-vy efter {s["id"]}/{ps["id"]}')
                elif spelade < 2 and pg.locator('[data-act="spel-slut"]').count():
                    pg.click('[data-act="spel-slut"]'); pg.wait_for_timeout(300); pg.click('[data-act="spel-start"]')
                    box = pg.locator('#spelplan').bounding_box()
                    for k in range(14):
                        pg.mouse.move(box['x'] + box['width'] * (0.2 + 0.6 * (k % 5) / 4), box['y'] + box['height'] * 0.85)
                        pg.mouse.down(); pg.mouse.move(box['x'] + box['width'] * (0.3 + 0.05 * k), box['y'] + box['height'] * 0.8); pg.mouse.up()
                        pg.wait_for_timeout(180)
                    pg.screenshot(path=str(SHOT / f'spel-{spelade}.png'))
                    pg.click('[data-act="spel-avsluta"]'); pg.wait_for_timeout(200)
                    if not pg.locator('.laxkort').count(): fel.append('Kom inte tillbaka till start efter spelet')
                    spelade += 1
        pg.wait_for_timeout(1600)
        pg.screenshot(path=str(SHOT / '5-klar.png'))
        state = pg.evaluate('JSON.parse(localStorage.getItem("laxgympan.v1"))')
        pg.goto(URL); pg.wait_for_timeout(900)
        pg.screenshot(path=str(SHOT / '6-hem.png'))
        pg.evaluate('(()=>{const s=JSON.parse(localStorage.getItem("laxgympan.v1"));s.skin="dif";s.figur="kanin";localStorage.setItem("laxgympan.v1",JSON.stringify(s))})()')
        pg.goto(URL); pg.wait_for_timeout(900); pg.screenshot(path=str(SHOT / '6b-hem-dif.png'))
        pg.click('[data-act="inst"]'); pg.wait_for_timeout(300); pg.screenshot(path=str(SHOT / '6c-inst.png')); pg.click('[data-act="inst-stang"]')
        # Öva igen-passet
        if pg.locator('[data-act="igen"]').count():
            pg.click('[data-act="igen"]'); svara_fel(); pg.screenshot(path=str(SHOT / '7-igen.png'))
        # Mobilbredd och mörkt läge
        m = b.new_context(viewport={'width': 390, 'height': 844}, color_scheme='dark', has_touch=True, reduced_motion='reduce')
        mp = m.new_page(); mp.on('pageerror', lambda e: fel.append('mobil pageerror: ' + str(e)))
        mp.goto(URL); mp.evaluate('localStorage.setItem("laxgympan.v1", ' + json.dumps(json.dumps(state)) + ')'); mp.goto(URL); mp.wait_for_timeout(600)
        mp.screenshot(path=str(SHOT / '8-mobil-mork-hem.png'), full_page=False)
        mp.click('[data-act="oppna"][data-set="laxa2"]'); mp.click('[data-act="starta"][data-set="laxa2"][data-pass="sida1"]'); mp.wait_for_timeout(300)

        mp.screenshot(path=str(SHOT / '9-mobil-mork-ordna.png'))
        bredd = mp.evaluate('document.documentElement.scrollWidth')
        if bredd > 390: fel.append(f'Sidan scrollar i sidled på mobil: {bredd}px')
        b.close()
        return state

st = run()
print('Pausspel mitt i pass:', len(mittspel))
print('Pass i slumpad ordning:', sum(slumpad), 'av', len(slumpad))
print('Stjärnor:', st['stjarnor'], 'pass med medalj:', len(st['pass']), 'missade:', len(st['missade']))
print('\n'.join(fel) if fel else 'Inga fel.')
sys.exit(1 if fel else 0)
