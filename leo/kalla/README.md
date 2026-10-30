# Lekgympan – Leos app (5 år), källkod

Appen på https://jaygsson.github.io/Laxgympa/leo/ byggs från filerna här. `leo/index.html` är den byggda appen.
Den ligger i samma repo som Läxgympan men under `/leo/`, med egen adress, egen ikon (fotboll på grön plan), eget manifest
(`id: lekgympan`), egen service worker (scope `/leo/`) och egen lagring (`lekgympan.v1`). Lovas app ändras inte.

## Bygga
```
cd leo/kalla
python3 ikoner.py        # bara om ikonerna ska ritas om
python3 build.py         # skapar lekgympan-fristaende.html och webb/ (index.html + PWA-filer)
cp webb/* ..             # lägg den byggda appen i /leo/ (GitHub Pages)
```

## Vad som återanvänds från Läxgympan (läses direkt från `../../kalla/src`, kopieras inte)
| Fil | Hur |
|---|---|
| `kalla/src/style.css` | Hela utseendet. Leos färger ligger i `src/leo.css` som läggs efter och byter variablerna (grön plan + orange; teman "Blå is" och "Röd och gul"). |
| `kalla/src/spel.js` | Bonusspelen Akta dig! och Hinderhoppet, oförändrade. Fem korta texter byts i `build.py` ("läxan" → "banan"). |

## Egna filer
| Fil | Innehåll |
|---|---|
| `src/gubbar.js` | Sex nya sportgosedjur med samma skelett och API som Lovas (så att alla trick i style.css fungerar): Lejonet (fotboll, tröja 10), Hunden (hockeyhjälm), Björnen (innebandy), Pingvinen (löpare), Grodan och Apan (hänger i räcket). Fotboll i handen i stället för gymnastikband. |
| `src/innehall.js` | Frågegeneratorerna och banorna. Allt slumpas: fråga, saker, rätt svar och var svaren hamnar. Samma generator kommer aldrig två gånger i rad. |
| `src/ui.js` | Appen: hem, pass (8 frågor, spel efter 4), klar-vy, inställningar. Talsyntes på svenska läser upp varje fråga, varje tryckt bokstav/siffra och facit. Rätt svar går vidare av sig självt. |
| `src/leo.css` | Färger och de nya delarna: stora bildrutor, "tryck på N saker", bygg ordet, mönster, talrad. |
| `pwa/` | Ikoner (ritas av `ikoner.py`), manifest, service worker |

## Banor och vad Leo övar (Lpfö 18: antal, ordning, former, mönster, bokstäver, språkljud)
| Bana | Nivå 1 | Nivå 2 | Nivå 3 |
|---|---|---|---|
| Räkna | räkna saker 1–5, hitta siffran, tryck på N saker, flest/minst, före/efter | 1–10, plus, ordna siffror | 1–20 |
| Bokstäver | vilken bokstav börjar ordet på, hitta bokstaven, bokstaven som fattas i LEO, bygg LEO | stor/liten bokstav, sista ljudet | bygg ord |
| Former och färger | former, färger, störst/minst, mönster | färg + form ("den gröna fyrkanten") | tre-delade mönster |
| Läsa | bild → ord, ord → bild (2–3 bokstäver), bygg ordet | 4 bokstäver, rim | rim, sista ljudet |
| Blandat | lite av allt | | |

Nivån per bana sätts automatiskt: guld ger nästa nivå, brons går ner ett steg (kan låsas i inställningarna).
Belöningar: stjärnor (2 vid rätt direkt, 1 vid andra försöket), trick för kompisen (upplåses med stjärnor), medaljer per bana,
bonusspel efter fyra frågor och efter banan, samt "Dagens stjärnor" (+5 för första banan varje dag).

## Färger
- Bara ljust läge: `<html data-theme="light">` stänger av Lovas mörka färger och `color-scheme: only light` gör att
  Chrome på en platta i mörkt läge (även med "mörkt tema för webbplatser") låter sidan vara ljus.
- Varje tema har tre nivåer per färg: `--pop` (fyllning/dekor), `--pop-deep` (text och knappar), `--pop-soft` (ljus bakgrund).
  Text är alltid `-deep` eller `--ink` på ljus botten (minst 4,5:1), vit text bara på `-deep` (5,9–6,9:1).
- Svarsrutor: vita med tjock kant. Siffran/ordet är alltid fullt synlig; rätt = grön ruta + ✓, fel = röd ruta + ✕.
  Former visas på ljusgrå ruta (`--formruta`) så att även vita och gula former syns.

## Testa
```
node test.js        # 280 000 genererade frågor: giltiga alternativ, inga dubbletter, slumpad placering av rätt svar
python3 e2e.py      # Playwright: klickar igenom alla banor på tre nivåer, med rätt och fel svar, spelen, inställningar; skärmbilder i shots/
python3 fargtest.py # Kontrast (WCAG) för all text och alla former: alla frågetyper × fel/facit/rätt × 3 teman × ljust/mörkt system
```

## Data som sparas
Allt sparas lokalt på plattan i localStorage (`lekgympan.v1`). Inget skickas någonstans. Rösten är plattans egen talsyntes
(Android: Inställningar → System → Språk → Text-till-tal, lägg till svenska om den saknas).
