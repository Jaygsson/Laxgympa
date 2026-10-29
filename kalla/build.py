"""Bygger Läxgympan till en enda HTML-fil.
laxgympan.html  = artefakten (utan doctype/head, skelettet läggs på vid publicering)
laxgympan-fristaende.html = samma sida som hel webbsida (för egen adress eller lokal test)
"""
from pathlib import Path
src = Path(__file__).parent / 'src'
css = (src / 'style.css').read_text()
logic = (src / 'logic.js').read_text()
content = (src / 'content.js').read_text()
gubbar = (src / 'gubbar.js').read_text()
ui = (src / 'ui.js').read_text().replace('  /*SPEL*/', (src / 'spel.js').read_text()).replace('  /*GEO*/', (src / 'geo.js').read_text())
geodata = (src / 'geo-data.js').read_text()

huvud = '''<title>Läxgympan</title>
<meta name="claude:viewport-fit-sides" content="cover">
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
{logic}
</script>
<script>
{content}
</script>
<script>
{gubbar}
</script>
<script>
{geodata}
</script>
<script>
{ui}
</script>
'''
(Path(__file__).parent / 'laxgympan.html').write_text(huvud + kropp)
fristaende = ('<!doctype html><html lang="sv"><head><meta charset="utf-8">'
              '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
              '<meta name="theme-color" content="#FF4F9A"><meta name="mobile-web-app-capable" content="yes"><link rel="icon" href="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2096%2096%22%3E%3Crect%20width%3D%2296%22%20height%3D%2296%22%20rx%3D%2222%22%20fill%3D%22%23FF4F9A%22/%3E%3Cpath%20d%3D%22M22%2046%20L24%2014%20L46%2034%20Z%20M74%2046%20L72%2014%20L50%2034%20Z%22%20fill%3D%22%23FFF2E6%22%20stroke%3D%22%232A2D5A%22%20stroke-width%3D%224%22%20stroke-linejoin%3D%22round%22/%3E%3Ccircle%20cx%3D%2248%22%20cy%3D%2256%22%20r%3D%2228%22%20fill%3D%22%23FFF2E6%22%20stroke%3D%22%232A2D5A%22%20stroke-width%3D%224%22/%3E%3Cellipse%20cx%3D%2238%22%20cy%3D%2254%22%20rx%3D%224.5%22%20ry%3D%226%22%20fill%3D%22%232A2D5A%22/%3E%3Cellipse%20cx%3D%2258%22%20cy%3D%2254%22%20rx%3D%224.5%22%20ry%3D%226%22%20fill%3D%22%232A2D5A%22/%3E%3Cpath%20d%3D%22M40%2067%20Q44%2072%2048%2067%20Q52%2072%2056%2067%22%20fill%3D%22none%22%20stroke%3D%22%232A2D5A%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22/%3E%3Cpath%20d%3D%22M32%2026%20L20%2018%20L22%2034%20Z%20M32%2026%20L44%2018%20L42%2034%20Z%22%20fill%3D%22%233AAAF5%22%20stroke%3D%22%232A2D5A%22%20stroke-width%3D%223%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E"><style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}</style>'
              + huvud + '</head><body>' + kropp + '</body></html>')
(Path(__file__).parent / 'laxgympan-fristaende.html').write_text(fristaende)
(Path(__file__).parent / 'webb').mkdir(exist_ok=True)
pwa_huvud = ('<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-192.png">')
pwa_kropp = """<script>
try { if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {}
</script>"""
webbsida = fristaende.replace('</head>', pwa_huvud + '</head>', 1).replace('</body>', pwa_kropp + '</body>', 1)
(Path(__file__).parent / 'webb' / 'index.html').write_text(webbsida)
import shutil
for f in (Path(__file__).parent / 'pwa').iterdir(): shutil.copy(f, Path(__file__).parent / 'webb' / f.name)
print('byggt', len(huvud + kropp) // 1024, 'kB')
