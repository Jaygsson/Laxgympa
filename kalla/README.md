# Läxgympan – källkod

Appen på https://jaygsson.github.io/Laxgympa/ byggs från filerna här. `index.html` i roten är den byggda appen.

## Bygga
```
cd kalla
python3 build.py          # skapar laxgympan.html, laxgympan-fristaende.html och webb/ (index.html + PWA-filer)
cp webb/* ..              # lägg den byggda appen i repots rot (GitHub Pages)
```

## Filer
| Fil | Innehåll |
|---|---|
| src/style.css | Utseende: färgtema (rosa/ljusblått + Djurgårdstema), knappar, animationer, trick |
| src/gubbar.js | Gosedjursfigurerna som SVG (kanin, docka, häst, röd panda, blå apa, ljus apa) |
| src/ui.js | Själva appen: vyer, pass, frågeflöde, stjärnor, trick, ljud, konfetti |
| src/logic.js | Rättning och frågegeneratorer (Träna mer, Femmans matte) |
| src/content.js, femman.js, no-kemi.js | Läxorna och frågorna |
| src/spel.js | Pausspelen Akta dig! och Hinderhoppet |
| src/geo.js, geo-data.js | Europakartan (geo-data.js byggs av geo/bygg-karta.js från Natural Earth) |
| pwa/ | Ikoner, manifest och service worker |

## Testa (Node + Playwright)
```
node test.js        # facit och 93 000 genererade frågor
python3 e2e.py      # klickar igenom alla pass i webbläsaren
python3 geotest.py  # alla länder går att trycka på, huvudstadsfrågor
node regntest.js; node hopptest.js   # spelen går att klara
```

## Data som sparas
Allt sparas lokalt på plattan i localStorage (`laxgympan.v1`). Inget skickas någonstans.
