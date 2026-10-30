"""Bygger Lekgympan (Leos app) till en enda HTML-fil.
Återanvänder Lovas style.css och spel.js direkt från ../../kalla/src (de filerna rörs inte).
lekgympan-fristaende.html = hel webbsida för lokal test
webb/ = det som läggs i repots mapp /leo/ (GitHub Pages)
"""
from pathlib import Path
import shutil
har = Path(__file__).parent
src = har / 'src'
lova = har.parent.parent / 'kalla' / 'src'

css = (lova / 'style.css').read_text() + '\n' + (src / 'leo.css').read_text()
spel = (lova / 'spel.js').read_text()
# Texterna i spelet är skrivna för läxor – byt de få raderna som syns för Leo
for a, b in [
    ('Tre frågor klara! Dags för en paus.', 'Fyra frågor klara! Dags för ett spel.'),
    ('Nu fortsätter läxan. Efter tre frågor till blir det ', 'Nu fortsätter banan. Nästa gång blir det '),
    ('Fortsätt läxan', 'Fortsätt'),
    ('Klara ett pass till, så får du spela igen.', 'Klara en bana till, så får du spela igen.'),
    ('Hoppa över spelet och fortsätt läxan', 'Hoppa över spelet'),
]:
    assert a in spel, 'Hittar inte texten i spel.js: ' + a
    spel = spel.replace(a, b)
ui = (src / 'ui.js').read_text().replace('  /*SPEL*/', spel)
innehall = (src / 'innehall.js').read_text()
gubbar = (src / 'gubbar.js').read_text()

huvud = '''<title>Lekgympan</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Grandstander:wght@600;800&family=Lexend:wght@400;500;600;700&display=swap">
'''
kropp = f'''<style>
{css}
</style>
<div id="app" class="app"></div>
<canvas id="fx" aria-hidden="true"></canvas>
<script>
{innehall}
</script>
<script>
{gubbar}
</script>
<script>
{ui}
</script>
'''
ikon = ('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2096%2096%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20rx%3D%2222%22%20fill%3D%22%232DB36A%22/%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2250%22%20r%3D%2230%22%20fill%3D%22%23fff%22%20stroke%3D%22%231E3A2A%22%20stroke-width%3D%224%22/%3E%3Cpath%20d%3D%22M48%2032l12%209-4.6%2014H40.6L36%2041z%22%20fill%3D%22%231E3A2A%22/%3E%3C/svg%3E')
# Alltid ljust läge: data-theme="light" stänger av Lovas mörka färger, "only light" hindrar webbläsarens tvingade mörka läge
fristaende = ('<!doctype html><html lang="sv" data-theme="light"><head><meta charset="utf-8"><meta name="color-scheme" content="only light">'
              '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
              '<meta name="theme-color" content="#2DB36A"><meta name="mobile-web-app-capable" content="yes"><link rel="icon" href="' + ikon + '">'
              '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>'
              + huvud + '</head><body>' + kropp + '</body></html>')
(har / 'lekgympan-fristaende.html').write_text(fristaende)
(har / 'webb').mkdir(exist_ok=True)
pwa_huvud = '<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-192.png">'
pwa_kropp = """<script>
try { if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {}
</script>"""
webbsida = fristaende.replace('</head>', pwa_huvud + '</head>', 1).replace('</body>', pwa_kropp + '</body>', 1)
(har / 'webb' / 'index.html').write_text(webbsida)
for f in (har / 'pwa').iterdir():
    shutil.copy(f, har / 'webb' / f.name)
print('byggt', len(huvud + kropp) // 1024, 'kB')
