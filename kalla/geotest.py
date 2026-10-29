"""Geografitest: varje land ska gå att trycka på i sin vy, fel tryck ska visa rätt land, utforska ska visa fakta."""
from playwright.sync_api import sync_playwright
import pathlib, json
URL = pathlib.Path(__file__).with_name('laxgympan-fristaende.html').resolve().as_uri()
SHOT = pathlib.Path(__file__).with_name('shots')
fel = []; resultat = {}; hs = {'fragor': 0}
with sync_playwright() as p:
    b = p.chromium.launch()
    for namn, vp in [('platta', {'width': 800, 'height': 1280}), ('liten', {'width': 412, 'height': 900})]:
        pg = b.new_page(viewport=vp, has_touch=True, reduced_motion='reduce')
        pg.on('pageerror', lambda e: fel.append(str(e)))
        pg.goto(URL)
        pg.evaluate('localStorage.setItem("laxgympan.v1", JSON.stringify({v:2,namn:"Lova",figur:"panda",namnPa:{},skin:"rosa",ljud:false,stjarnor:50,pass:{},missade:[]}))')
        pg.goto(URL); pg.wait_for_timeout(300)
        def till_skarm(kod):
            return pg.evaluate("""k => { const svg = document.querySelector('.geo-karta.fraga svg'); const m = GEO.lander[k].mitt; const pt = svg.createSVGPoint(); pt.x = m[0]; pt.y = m[1]; const s = pt.matrixTransform(svg.getScreenCTM()); return [s.x, s.y]; }""", kod)
        for region in ['norden', 'vast', 'mellan', 'syd', 'balkan', 'ost', 'alla']:
            antal = len(pg.evaluate(f'GEO.regioner["{region}"].lander')) if region != 'alla' else 12
            omgangar = 1 if region != 'alla' else 4  # Hela Europa slumpar 12 av 42 länder, kör flera gånger
            for _ in range(omgangar):
                pg.goto(URL); pg.wait_for_timeout(150)
                pg.click('[data-act="oppna"][data-set="europa"]'); pg.click(f'[data-act="starta"][data-set="europa"][data-pass="{region}"]'); pg.wait_for_timeout(100)
                for i in range(antal):
                    if pg.locator('#spelplan').count(): pg.click('[data-act="spel-avsluta"]'); pg.wait_for_timeout(100)
                    mal = pg.get_attribute('.geo-karta.fraga', 'data-mal')
                    x, y = till_skarm(mal)
                    pg.mouse.click(x, y); pg.wait_for_timeout(50)
                    ok = pg.locator('.besked.ratt').count() > 0
                    resultat.setdefault((namn, region, mal), ok)
                    if not ok:
                        fel.append(f'{namn}/{region}: {mal} gick inte att träffa vid sin mittpunkt ({x:.0f},{y:.0f}): ' + (pg.locator('#aterkoppling').inner_text()[:80] if pg.locator('#aterkoppling').count() else ''))
                        if not pg.locator('[data-act="nasta"]').count(): break
                    if namn == 'platta' and region == 'balkan' and i == 0: pg.screenshot(path=str(SHOT / 'geo-ratt.png'))
                    if pg.locator('.geo-hsfraga').count():
                        hs['fragor'] += 1
                        if pg.locator('[data-act="nasta"]').count(): fel.append(f'{mal}: Nästa syns innan huvudstaden är besvarad')
                        if pg.locator('.geo-fakta').count(): fel.append(f'{mal}: faktakortet avslöjar huvudstaden för tidigt')
                        if len(pg.locator('.geo-hsfraga [data-act="geo-hs"]').all()) != 4: fel.append(f'{mal}: inte fyra alternativ')
                        alts = [t.strip() for t in pg.locator('.geo-hsfraga [data-act="geo-hs"]').all_inner_texts()]
                        if len(set(alts)) != 4: fel.append(f'{mal}: dubbletter bland alternativen {alts}')
                        r = int(pg.get_attribute('.geo-hsfraga', 'data-r'))
                        if namn == 'platta' and hs['fragor'] == 1: pg.screenshot(path=str(SHOT / 'geo-hs-fraga.png'))
                        svara_ratt = hs['fragor'] % 3 != 0
                        stj0 = pg.evaluate('JSON.parse(localStorage.getItem("laxgympan.v1")).stjarnor')
                        pg.click(f'.geo-hsfraga [data-act="geo-hs"][data-i="{r if svara_ratt else (r + 1) % 4}"]'); pg.wait_for_timeout(60)
                        stj1 = pg.evaluate('JSON.parse(localStorage.getItem("laxgympan.v1")).stjarnor')
                        if svara_ratt and stj1 != stj0 + 1: fel.append(f'{mal}: rätt huvudstad gav inte en extra stjärna')
                        if not svara_ratt and stj1 != stj0: fel.append(f'{mal}: fel huvudstad gav stjärna')
                        if not pg.locator('.geo-fakta').count(): fel.append(f'{mal}: faktakortet kom inte efter huvudstadsfrågan')
                        elif alts[r].split('\n')[-1].strip() not in pg.locator('.geo-fakta').inner_text(): fel.append(f'{mal}: facit {alts[r]!r} stämmer inte med faktakortet')
                        if not pg.locator('[data-act="nasta"]').count(): fel.append(f'{mal}: Nästa kom inte efter huvudstadsfrågan'); break
                        if namn == 'platta' and hs['fragor'] in (1, 3): pg.screenshot(path=str(SHOT / f'geo-hs-svar{hs["fragor"]}.png'), full_page=True)
                    pg.click('[data-act="nasta"]'); pg.wait_for_timeout(60)
        # Fel tryck: tryck på Sverige när frågan gäller något annat
        if namn == 'platta':
            pg.goto(URL); pg.wait_for_timeout(150)
            pg.click('[data-act="oppna"][data-set="europa"]'); pg.click('[data-act="starta"][data-set="europa"][data-pass="norden"]'); pg.wait_for_timeout(100)
            mal = pg.get_attribute('.geo-karta.fraga', 'data-mal'); annat = 'SE' if mal != 'SE' else 'NO'
            x, y = till_skarm(annat); pg.mouse.click(x, y); pg.wait_for_timeout(100)
            txt = pg.locator('#aterkoppling').inner_text()
            print('Fel tryck visar:', txt.split('\n')[0][:90])
            if 'Det där är' not in txt: fel.append('Fel tryck gav inte rätt besked')
            if not pg.locator('.geo-land.ratt').count() or not pg.locator('.geo-land.fel').count(): fel.append('Fel tryck markerade inte rätt och fel land')
            pg.screenshot(path=str(SHOT / 'geo-fel.png'))
            if pg.locator('.geo-hsfraga').count():
                r = int(pg.get_attribute('.geo-hsfraga', 'data-r')); pg.click(f'.geo-hsfraga [data-act="geo-hs"][data-i="{r}"]'); pg.wait_for_timeout(80)
                if not pg.locator('[data-act="nasta"]').count(): fel.append('Fel tryck + huvudstad gav ingen Nästa-knapp')
                pg.screenshot(path=str(SHOT / 'geo-fel-hs.png'), full_page=True)
            # Utforska
            pg.goto(URL); pg.wait_for_timeout(150)
            pg.click('[data-act="oppna"][data-set="europa"]'); pg.click('[data-act="starta"][data-set="europa"][data-pass="utforska"]'); pg.wait_for_timeout(150)
            pt = pg.evaluate("""() => { const svg = document.querySelector('.geo-karta svg'); const m = GEO.lander.IT.mitt; const q = svg.createSVGPoint(); q.x = m[0]; q.y = m[1]; const s = q.matrixTransform(svg.getScreenCTM()); return [s.x, s.y]; }""")
            pg.mouse.click(*pt); pg.wait_for_timeout(200)
            h3 = pg.locator('.geo-fakta h3').inner_text() if pg.locator('.geo-fakta h3').count() else ''
            print('Utforska, tryck på Italien:', h3, '|', pg.locator('.geo-fakta dl').inner_text().replace('\n', ' ')[:160])
            if h3 != 'Italien': fel.append('Utforska visade inte Italien')
            pg.screenshot(path=str(SHOT / 'geo-utforska.png'))
            pg.click('[data-act="geo-region"][data-r="balkan"]'); pg.wait_for_timeout(150); pg.screenshot(path=str(SHOT / 'geo-utforska-balkan.png'))
            # Huvudstäder
            pg.goto(URL); pg.wait_for_timeout(150)
            pg.click('[data-act="oppna"][data-set="europa"]'); pg.click('[data-act="starta"][data-set="europa"][data-pass="huvudstader"]'); pg.wait_for_timeout(100)
            pg.locator('[data-act="val"]').first.click(); pg.wait_for_timeout(100)
            if not pg.locator('[data-act="nasta"]').count(): pg.locator('[data-act="val"]:not([disabled])').first.click(); pg.wait_for_timeout(100)
            pg.screenshot(path=str(SHOT / 'geo-huvudstad.png'), full_page=True)
        # sidled
        if pg.evaluate('document.documentElement.scrollWidth') > vp['width']: fel.append(f'{namn}: sidan scrollar i sidled')
        pg.close()
    b.close()
tot = len(resultat); ok = sum(1 for v in resultat.values() if v)
print(f'Länder träffade vid första tryck: {ok} av {tot} (land och vy, två skärmstorlekar)')
print('Huvudstadsfrågor efter kartan:', hs['fragor'])
print('Fel:', '\n'.join(fel) if fel else 'inga')
