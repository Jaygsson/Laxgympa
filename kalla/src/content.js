/* ===== Läxgympan: läxorna =====
   Varje läxa har pass. Ett pass har antingen fasta frågor (fragor),
   nya liknande frågor varje gång (gen) eller ett blandat förhör (pool).
   Frågetyper: val (flerval), svar (skriv in svaret), kort (förklara med egna ord),
   ordna (storleksordning) och pil (pilkastning). {3/4} visas som ett bråk. */
var LAXOR = [
  {
    id: 'europa', amne: 'geo', titel: 'Europas länder', under: 'Hitta länderna på kartan', ny: true,
    pass: [
      { id: 'utforska', titel: 'Utforska kartan', under: 'Tryck på ett land och lär dig mer', utforska: true },
      { id: 'norden', titel: 'Norden', karta: 'norden' },
      { id: 'vast', titel: 'Västeuropa', karta: 'vast' },
      { id: 'mellan', titel: 'Mellaneuropa', karta: 'mellan' },
      { id: 'syd', titel: 'Sydeuropa', karta: 'syd' },
      { id: 'balkan', titel: 'Balkan', karta: 'balkan' },
      { id: 'ost', titel: 'Östeuropa och Baltikum', karta: 'ost' },
      { id: 'alla', titel: 'Hela Europa', under: '12 länder, från stora till små', karta: 'alla', antal: 12 },
      { id: 'huvudstader', titel: 'Huvudstäder', under: '10 frågor om huvudstäder', huvudstader: true, antal: 10 }
    ]
  },
  {
    id: 'femman', amne: 'matte', titel: 'Femmans matte', under: 'Det man ska kunna i åk 5 – från lätt till klurigt', ny: true,
    pass: [
      { id: 'tal', titel: 'Tal och räkning', under: 'Positionssystemet, huvudräkning och överslag', fragor: [
        { niva: 1, typ: 'svar', text: 'Vilken siffra står på tiotalsplatsen i talet 4 381?', falt: [{ typ: 'tal', svar: '8' }], ledtrad: 'Från höger: ental, tiotal, hundratal, tusental.', losning: ['4 381: 4 tusental, 3 hundratal, 8 tiotal och 1 ental.', 'Tiotalssiffran är 8.'] },
        { niva: 1, typ: 'svar', text: 'Räkna ut.', uttryck: '46 · 10', falt: [{ typ: 'tal', svar: '460' }], ledtrad: 'Gånger 10: alla siffror flyttar ett steg åt vänster, och en nolla kommer på entalsplatsen.', losning: ['46 · 10 = 460'] },
        { niva: 1, typ: 'svar', text: 'Räkna ut i huvudet.', uttryck: '350 + 250', falt: [{ typ: 'tal', svar: '600' }], ledtrad: 'Börja med hundratalen: 300 + 200. Sedan 50 + 50.', losning: ['300 + 200 = 500', '50 + 50 = 100', '500 + 100 = 600'] },
        { niva: 2, typ: 'svar', text: 'Räkna ut.', uttryck: '3 600 / 100', falt: [{ typ: 'tal', svar: '36' }], ledtrad: 'Delat med 100: ta bort två nollor.', losning: ['3 600 / 100 = 36'] },
        { niva: 2, typ: 'val', text: 'Gör ett överslag. Ungefär hur mycket är 198 + 403?', alt: ['600', '500', '700'], ratt: 0, ledtrad: 'Avrunda: 198 är nästan 200 och 403 är nästan 400.', losning: ['198 ≈ 200 och 403 ≈ 400.', '200 + 400 = 600'] },
        { niva: 3, typ: 'val', text: 'Ella köper 3 tröjor som kostar 199 kr styck. Vilket svar är rimligt?', alt: ['597 kr', '59,70 kr', '5 970 kr'], ratt: 0, ledtrad: 'En tröja kostar nästan 200 kr. Vad kostar då tre?', losning: ['199 kr är nästan 200 kr.', '3 · 200 = 600, så svaret ska vara nära 600 kr.', 'Exakt: 3 · 199 = 597 kr.'] },
        { niva: 3, typ: 'svar', papper: true, text: 'Räkna ut.', uttryck: '1 000 − 382', falt: [{ typ: 'tal', svar: '618' }], ledtrad: 'Tips: räkna 999 − 382 först. Lägg sedan till 1.', losning: ['999 − 382 = 617 (då behövs ingen växling)', '1 000 är 1 mer än 999: 617 + 1 = 618'] }
      ] },
      { id: 'negativa', titel: 'Minusgrader', under: 'Negativa tal på termometern', fragor: [
        { niva: 1, typ: 'val', text: 'Vilken temperatur är kallast?', alt: ['−8 °C', '−2 °C', '0 °C', '3 °C'], ratt: 0, fast: true, ledtrad: 'Ju längre ner under noll, desto kallare.', losning: ['−8 °C ligger längst ner på termometern.', 'Det är kallast.'] },
        { niva: 1, typ: 'svar', minus: true, text: 'Termometern visar −3 °C. Det blir 5 grader varmare. Vad visar termometern nu?', falt: [{ typ: 'tal', svar: '2', enhet: '°C' }], ledtrad: 'Räkna uppåt: −3, −2, −1, 0, 1, 2.', losning: ['Från −3 °C är det 3 grader upp till 0 °C.', 'Sedan 2 grader till: 2 °C.'] },
        { niva: 2, typ: 'ordna', text: 'Ordna talen. Börja med det minsta.', items: ['−5', '−1', '0', '2', '7'], etiketter: ['Minst', 'Störst'], ledtrad: 'Tänk dig en termometer. Det som är längst ner är minst.', losning: ['Minustal är mindre än noll.', '−5 är mindre än −1, eftersom det är längre från noll åt minushållet.', '−5, −1, 0, 2, 7'] },
        { niva: 2, typ: 'svar', minus: true, text: 'Det är 4 °C. Det blir 10 grader kallare. Vad visar termometern nu?', falt: [{ typ: 'tal', svar: '-6', enhet: '°C' }], ledtrad: 'Först 4 grader ner till 0. Hur många grader är det kvar att gå ner? Tryck på minus-knappen för minusgrader.', losning: ['4 grader ner ger 0 °C.', 'Det är 6 grader kvar: −6 °C.'] },
        { niva: 3, typ: 'svar', minus: true, text: 'Hissen står i källaren på våning −2. Den åker upp 7 våningar. Vilken våning är den på nu?', falt: [{ typ: 'tal', svar: '5' }], ledtrad: 'Räkna: −1, 0, 1, 2, 3 …', losning: ['Från −2 till 0 är 2 våningar.', 'Det är 5 våningar kvar: våning 5.'] },
        { niva: 3, typ: 'svar', text: 'På natten var det −7 °C. På dagen var det 4 °C. Hur många grader skilde det?', falt: [{ typ: 'tal', svar: '11', enhet: 'grader' }], ledtrad: 'Från −7 upp till 0, och sedan upp till 4.', losning: ['Från −7 °C till 0 °C: 7 grader.', 'Från 0 °C till 4 °C: 4 grader.', '7 + 4 = 11 grader'] }
      ] },
      { id: 'procent', titel: 'Bråk och procent', under: 'Del av något, och procent som andel', fragor: [
        { niva: 1, typ: 'svar', text: 'Hur mycket är hälften av 18?', falt: [{ typ: 'tal', svar: '9' }], ledtrad: 'Dela 18 i två lika stora delar.', losning: ['18 / 2 = 9'] },
        { niva: 1, typ: 'val', text: 'Vad betyder 50 %?', alt: ['Hälften', 'En fjärdedel', 'En tiondel'], ratt: 0, ledtrad: 'Procent betyder hundradelar. 50 av 100 är …', losning: ['50 % = 50 hundradelar = ' + '{50/100}' + ' = {1/2}', 'Det är hälften.'] },
        { niva: 2, typ: 'svar', text: 'Hur mycket är en fjärdedel av 20 kr?', falt: [{ typ: 'tal', svar: '5', enhet: 'kr' }], ledtrad: 'Dela 20 i fyra lika stora delar.', losning: ['20 / 4 = 5 kr'] },
        { niva: 2, typ: 'svar', text: 'Skriv 25 % som ett bråk.', falt: [{ typ: 'brak', svar: '1/4' }], ledtrad: '25 % är 25 hundradelar. Hur många gånger får 25 plats i 100?', losning: ['25 % = {25/100}', '{25/100} = {1/4}'] },
        { niva: 2, typ: 'svar', text: 'Räkna ut. Svara i bråkform.', uttryck: '{2/5} + {1/5}', falt: [{ typ: 'brak', svar: '3/5' }], ledtrad: 'Nämnarna är lika. Lägg bara ihop täljarna.', losning: ['Båda är femtedelar.', '2 femtedelar + 1 femtedel = 3 femtedelar = {3/5}'] },
        { niva: 3, typ: 'svar', text: 'Hur mycket är 10 % av 250 kr?', falt: [{ typ: 'tal', svar: '25', enhet: 'kr' }], ledtrad: '10 % är en tiondel. Dela med 10.', losning: ['10 % = {1/10}', '250 / 10 = 25 kr'] },
        { niva: 3, typ: 'svar', papper: true, text: 'En tröja kostar 200 kr. Priset sänks med 25 %. Vad kostar tröjan nu?', falt: [{ typ: 'tal', svar: '150', enhet: 'kr' }], ledtrad: 'Räkna först ut hur mycket 25 % av 200 kr är.', losning: ['25 % = en fjärdedel.', 'En fjärdedel av 200 kr = 50 kr.', '200 − 50 = 150 kr'] }
      ] },
      { id: 'matt', titel: 'Mått och tid', under: 'Enheter, längd, vikt, volym och klockan', fragor: [
        { niva: 1, typ: 'svar', text: 'Hur många centimeter är 2 meter?', falt: [{ typ: 'tal', svar: '200', enhet: 'cm' }], ledtrad: '1 m = 100 cm.', losning: ['2 · 100 = 200 cm'] },
        { niva: 1, typ: 'svar', text: 'Hur många gram är 3 kilogram?', falt: [{ typ: 'tal', svar: '3000', enhet: 'g' }], ledtrad: '1 kg = 1 000 g.', losning: ['3 · 1 000 = 3 000 g'] },
        { niva: 2, typ: 'svar', text: 'Hur många deciliter är 1,5 liter?', falt: [{ typ: 'tal', svar: '15', enhet: 'dl' }], ledtrad: '1 l = 10 dl.', losning: ['1 l = 10 dl och en halv liter = 5 dl.', '10 + 5 = 15 dl'] },
        { niva: 2, typ: 'svar', text: 'Hur många meter är 250 cm?', falt: [{ typ: 'tal', svar: '2,5', enhet: 'm' }], ledtrad: '100 cm = 1 m. Hur många hela meter, och vad blir över?', losning: ['200 cm = 2 m, och 50 cm = 0,5 m.', '250 cm = 2,5 m'] },
        { niva: 2, typ: 'val', text: 'Filmen börjar 17:45 och är 1 timme och 30 minuter lång. När slutar den?', alt: ['19:15', '18:75', '19:45'], ratt: 0, ledtrad: 'Lägg först till 1 timme. Lägg sedan till 30 minuter. En timme har 60 minuter.', losning: ['17:45 + 1 timme = 18:45', '18:45 + 15 minuter = 19:00, och 15 minuter till = 19:15'] },
        { niva: 3, typ: 'svar', text: 'Hur många minuter är två och en halv timme?', falt: [{ typ: 'tal', svar: '150', enhet: 'min' }], ledtrad: '1 timme = 60 minuter. En halv timme = 30 minuter.', losning: ['2 timmar = 2 · 60 = 120 minuter.', '120 + 30 = 150 minuter'] }
      ] },
      { id: 'geometri', titel: 'Geometri', under: 'Omkrets, area, vinklar och skala', fragor: [
        { niva: 1, typ: 'svar', text: 'Hur lång är omkretsen av rektangeln?', figur: { form: 'rektangel', b: 6, h: 4 }, falt: [{ typ: 'tal', svar: '20', enhet: 'cm' }], ledtrad: 'Omkretsen är alla fyra sidor tillsammans.', losning: ['6 + 4 + 6 + 4 = 20 cm'] },
        { niva: 1, typ: 'svar', text: 'Hur stor är arean av rektangeln?', figur: { form: 'rektangel', b: 6, h: 4 }, falt: [{ typ: 'tal', svar: '24', enhet: 'cm²' }], ledtrad: 'Area = längd · bredd. Det blir lika många rutor som 6 rader med 4 i varje.', losning: ['6 · 4 = 24 cm²'] },
        { niva: 2, typ: 'val', text: 'Vilken vinkel är trubbig?', alt: ['120°', '90°', '35°'], ratt: 0, ledtrad: 'En rät vinkel är 90°. En trubbig vinkel är större än en rät.', losning: ['Spetsig: mindre än 90°. Rät: precis 90°. Trubbig: större än 90°.', '120° är trubbig.'] },
        { niva: 2, typ: 'svar', text: 'En kvadrat har omkretsen 28 cm. Hur lång är en sida?', falt: [{ typ: 'tal', svar: '7', enhet: 'cm' }], ledtrad: 'En kvadrat har fyra lika långa sidor.', losning: ['28 / 4 = 7 cm'] },
        { niva: 3, typ: 'svar', text: 'En karta har skalan 1:100. En sträcka är 3 cm på kartan. Hur många meter är den i verkligheten?', falt: [{ typ: 'tal', svar: '3', enhet: 'm' }], ledtrad: '1:100 betyder att allt i verkligheten är 100 gånger större.', losning: ['3 cm · 100 = 300 cm', '300 cm = 3 m'] },
        { niva: 3, typ: 'svar', papper: true, text: 'Ett rum är 5 m långt och 4 m brett. En ny matta kostar 100 kr per kvadratmeter. Vad kostar en matta till hela golvet?', falt: [{ typ: 'tal', svar: '2000', enhet: 'kr' }], ledtrad: 'Räkna först ut arean.', losning: ['Area: 5 · 4 = 20 m²', '20 · 100 = 2 000 kr'] }
      ] },
      { id: 'statistik', titel: 'Diagram och statistik', under: 'Läsa diagram, typvärde, median, medelvärde och chans', fragor: [
        { niva: 1, typ: 'val', text: 'Klassen röstade på sin favoritsport. Vilken sport fick flest röster?', figur: { form: 'stapel', rubrik: 'Favoritsport', data: [['Fotboll', 8], ['Gympa', 6], ['Dans', 5], ['Simning', 3]] }, alt: ['Fotboll', 'Gympa', 'Dans', 'Simning'], ratt: 0, fast: true, ledtrad: 'Vilken stapel är högst?', losning: ['Fotbollsstapeln är högst: 8 röster.'] },
        { niva: 1, typ: 'svar', text: 'Hur många fler röstade på fotboll än på simning?', figur: { form: 'stapel', rubrik: 'Favoritsport', data: [['Fotboll', 8], ['Gympa', 6], ['Dans', 5], ['Simning', 3]] }, falt: [{ typ: 'tal', svar: '5' }], ledtrad: 'Läs av båda staplarna och räkna skillnaden.', losning: ['Fotboll 8, simning 3.', '8 − 3 = 5'] },
        { niva: 2, typ: 'svar', text: 'Vad är typvärdet av talen?', uttryck: '3,   5,   9,   5,   7', falt: [{ typ: 'tal', svar: '5' }], ledtrad: 'Typvärdet är det tal som finns flest gånger.', losning: ['5 finns två gånger, de andra en gång.', 'Typvärde: 5'] },
        { niva: 2, typ: 'svar', text: 'Vad är medianen av talen?', uttryck: '8,   2,   9,   4,   7', falt: [{ typ: 'tal', svar: '7' }], ledtrad: 'Skriv talen i storleksordning. Vilket står i mitten?', losning: ['I ordning: 2, 4, 7, 8, 9', 'Talet i mitten är 7.'] },
        { niva: 3, typ: 'svar', text: 'Elsa gör 12 hjulningar på måndag, 15 på tisdag och 18 på onsdag. Hur många gör hon i medeltal per dag?', falt: [{ typ: 'tal', svar: '15', enhet: 'st' }], ledtrad: 'Lägg ihop alla. Dela sedan med antalet dagar.', losning: ['12 + 15 + 18 = 45', '45 / 3 = 15'] },
        { niva: 3, typ: 'svar', text: 'Vilken är chansen att få en sexa när man slår en vanlig tärning? Svara i bråkform.', falt: [{ typ: 'brak', svar: '1/6' }], ledtrad: 'Hur många sidor har tärningen? Hur många av dem är en sexa?', losning: ['En tärning har 6 sidor, och en av dem är en sexa.', 'Chansen är {1/6}.'] }
      ] },
      { id: 'algebra', titel: 'Mönster och ekvationer', under: 'Hitta x och fortsätt mönster', fragor: [
        { niva: 1, typ: 'svar', text: 'Vilket tal är x?', uttryck: 'x + 7 = 15', falt: [{ etikett: 'x =', typ: 'tal', svar: '8' }], ledtrad: 'Vilket tal plus 7 blir 15?', losning: ['15 − 7 = 8', 'x = 8'] },
        { niva: 1, typ: 'svar', text: 'Vilket tal ska stå i stället för frågetecknet?', uttryck: '3,   6,   9,   12,   ?', falt: [{ typ: 'tal', svar: '15' }], ledtrad: 'Hur mycket ökar talen varje gång?', losning: ['Talen ökar med 3.', '12 + 3 = 15'] },
        { niva: 2, typ: 'svar', text: 'Vilket tal är x?', uttryck: '4 · x = 28', falt: [{ etikett: 'x =', typ: 'tal', svar: '7' }], ledtrad: '4 gånger vilket tal blir 28?', losning: ['28 / 4 = 7', 'x = 7'] },
        { niva: 2, typ: 'svar', text: 'Vilket tal är x?', uttryck: 'x − 12 = 30', falt: [{ etikett: 'x =', typ: 'tal', svar: '42' }], ledtrad: 'Vilket tal minus 12 blir 30? Räkna 30 + 12.', losning: ['30 + 12 = 42', 'x = 42'] },
        { niva: 3, typ: 'svar', papper: true, text: 'Figur 1 är byggd av 4 stickor, figur 2 av 7 och figur 3 av 10. Hur många stickor behövs till figur 5?', falt: [{ typ: 'tal', svar: '16', enhet: 'st' }], ledtrad: 'Hur många stickor kommer till för varje ny figur?', losning: ['Det kommer 3 stickor till varje gång.', 'Figur 4: 13, figur 5: 16.'] },
        { niva: 3, typ: 'svar', papper: true, text: 'Jag tänker på ett tal. Jag tar det gånger 2 och lägger till 5. Då får jag 29. Vilket tal tänker jag på?', falt: [{ typ: 'tal', svar: '12' }], ledtrad: 'Räkna baklänges: ta bort 5 först, och dela sedan med 2.', losning: ['29 − 5 = 24', '24 / 2 = 12', 'Kolla: 12 · 2 + 5 = 29'] }
      ] },
      { id: 'kluringar', titel: 'Kluringar', under: 'Problemlösning i vardagen', fragor: [
        { niva: 2, typ: 'svar', papper: true, text: 'En busslapp kostar 26 kr. Fyra kompisar åker buss. Vad kostar det tillsammans?', falt: [{ typ: 'tal', svar: '104', enhet: 'kr' }], ledtrad: 'Räkna 4 · 26. Du kan dela upp 26 i 20 + 6.', losning: ['4 · 20 = 80 och 4 · 6 = 24', '80 + 24 = 104 kr'] },
        { niva: 2, typ: 'svar', papper: true, text: 'Maja har 500 kr. Hon köper tre saker som kostar 89 kr styck. Hur mycket har hon kvar?', falt: [{ typ: 'tal', svar: '233', enhet: 'kr' }], ledtrad: 'Räkna först ut vad tre saker kostar.', losning: ['3 · 89 = 267 kr', '500 − 267 = 233 kr'] },
        { niva: 2, typ: 'svar', papper: true, text: 'Tre glassar kostar 45 kr. Vad kostar fem glassar?', falt: [{ typ: 'tal', svar: '75', enhet: 'kr' }], ledtrad: 'Vad kostar en glass?', losning: ['En glass: 45 / 3 = 15 kr', 'Fem glassar: 5 · 15 = 75 kr'] },
        { niva: 3, typ: 'svar', papper: true, text: 'Vera har 3 tröjor och 2 byxor. På hur många olika sätt kan hon klä sig med en tröja och en byxa?', falt: [{ typ: 'tal', svar: '6', enhet: 'sätt' }], ledtrad: 'Rita! Varje tröja kan sitta ihop med varje byxa.', losning: ['Tröja 1 med byxa 1 eller 2: 2 sätt.', 'Samma för tröja 2 och tröja 3.', '3 · 2 = 6 sätt'] },
        { niva: 3, typ: 'val', text: 'Gympan börjar 18:10 och håller på i 75 minuter. När slutar den?', alt: ['19:25', '18:85', '19:15'], ratt: 0, ledtrad: '75 minuter = 1 timme och 15 minuter.', losning: ['75 minuter = 60 + 15 minuter.', '18:10 + 1 timme = 19:10', '19:10 + 15 minuter = 19:25'] },
        { niva: 3, typ: 'svar', papper: true, text: 'Saga och Alva har tillsammans 30 klistermärken. Saga har 6 fler än Alva. Hur många har Alva?', falt: [{ typ: 'tal', svar: '12', enhet: 'st' }], ledtrad: 'Ta bort de 6 extra först. Dela sedan resten lika.', losning: ['30 − 6 = 24', '24 / 2 = 12. Alva har 12.', 'Saga har 12 + 6 = 18. Kolla: 12 + 18 = 30.'] }
      ] },
      { id: 'ova', titel: 'Träna mer', under: 'Nya frågor varje gång, från lätt till klurigt', gen: ['procent', 'brak_av', 'enhet', 'omkrets_area', 'negativa', 'lagesmatt', 'ekvation', 'monster', 'gange10', 'proportion'], antal: 10 }
    ]
  },
  {
    id: 'kap1', amne: 'matte', titel: 'Övningsprov kap 1', under: 'Bråk och decimaltal',
    pass: [
      { id: 'del1', titel: 'Del 1', under: 'Störst, andelar, decimaler och kronor', fragor: [
        { typ: 'val', text: 'Vilket tal är störst?', alt: ['0,3', '0,13'], ratt: 0, fast: true,
          ledtrad: 'Lägg till en nolla så att båda talen får två decimaler: 0,30 och 0,13.',
          losning: ['Skriv talen med två decimaler: 0,30 och 0,13.', '30 hundradelar är mer än 13 hundradelar.', '0,3 är störst.'] },
        { typ: 'val', text: 'Vilket tal är störst?', alt: ['0,15', '{1/5}'], ratt: 1, fast: true,
          ledtrad: 'Gör om {1/5} till decimalform. Hur många tiondelar är en femtedel?',
          losning: ['{1/5} = {2/10} = 0,2', '0,2 är samma som 0,20, och 0,20 är mer än 0,15.', '{1/5} är störst.'] },
        { typ: 'val', text: 'Vilket tal är störst?', alt: ['{7/10}', '{17/100}'], ratt: 0, fast: true,
          ledtrad: 'Skriv {7/10} som hundradelar.',
          losning: ['{7/10} = {70/100}', '70 hundradelar är mer än 17 hundradelar.', '{7/10} är störst.'] },
        { typ: 'svar', text: 'Hur stor andel av figuren är färgad? Svara i bråkform.',
          figur: { form: 'cirkel', delar: 4, fargade: [0] },
          falt: [{ typ: 'brak', svar: '1/4' }],
          ledtrad: 'Hur många lika stora delar finns det? Hur många av dem är färgade?',
          losning: ['Cirkeln är delad i 4 lika stora delar.', '1 del är färgad.', 'Andelen är {1/4}. Som decimaltal är det 0,25.'] },
        { typ: 'svar', text: 'Hur stor andel av figuren är färgad? Svara i bråkform.',
          figur: { form: 'rutor', rader: 3, kol: 2, fargade: [0, 2, 3, 4] },
          falt: [{ typ: 'brak', svar: '4/6' }],
          ledtrad: 'Räkna alla rutor. Räkna sedan de färgade.',
          losning: ['Det finns 6 lika stora rutor.', '4 av dem är färgade.', 'Andelen är {4/6}. Det är samma sak som {2/3}.'] },
        { typ: 'svar', text: 'Hur stor andel av figuren är färgad? Svara i bråkform.',
          figur: { form: 'triangel', rader: 3, fargade: [0, 2, 4, 6, 8] },
          falt: [{ typ: 'brak', svar: '5/9' }],
          ledtrad: 'Räkna alla små trianglar, även de som står upp och ner.',
          losning: ['Den stora triangeln är delad i 9 lika stora små trianglar.', '5 av dem är färgade.', 'Andelen är {5/9}.'] },
        { typ: 'svar', text: 'Skriv talen i decimalform.',
          falt: [{ etikett: 'a) fem tiondelar', typ: 'tal', svar: '0,5' }, { etikett: 'b) {11/100}', typ: 'tal', svar: '0,11' }, { etikett: 'c) tre hundradelar', typ: 'tal', svar: '0,03' }],
          ledtrad: 'Tiondelar står på första platsen efter kommat. Hundradelar står på andra platsen.',
          losning: ['Fem tiondelar = 0,5', '{11/100} = elva hundradelar = 0,11', 'Tre hundradelar = 0,03. Trean står på hundradelsplatsen.'] },
        { typ: 'svar', text: 'Skriv i kronor.',
          falt: [{ etikett: 'a) 17 kr 30 öre', typ: 'tal', svar: '17,3', enhet: 'kr' }, { etikett: 'b) 50 öre', typ: 'tal', svar: '0,5', enhet: 'kr' }, { etikett: 'c) 3 kr 5 öre', typ: 'tal', svar: '3,05', enhet: 'kr' }],
          ledtrad: '1 krona = 100 öre. Då är 1 öre en hundradel av en krona, alltså 0,01 kr.',
          losning: ['17 kr 30 öre = 17,30 kr. Det kan också skrivas 17,3 kr.', '50 öre = 0,50 kr = 0,5 kr', '5 öre = 0,05 kr. Alltså är 3 kr 5 öre = 3,05 kr.'] },
        { typ: 'svar', text: 'Avrunda.', papper: true,
          falt: [{ etikett: 'a) 679 till hundratal', typ: 'tal', svar: '700' }, { etikett: 'b) 129,5 till tiotal', typ: 'tal', svar: '130' }, { etikett: 'c) 0,678 till tiondelar', typ: 'tal', svar: '0,7' }],
          ledtrad: 'Titta på siffran till höger om den plats du avrundar till. 0–4: avrunda nedåt. 5–9: avrunda uppåt.',
          losning: ['679: tiotalssiffran är 7, så 679 ≈ 700.', '129,5: entalssiffran är 9, så 129,5 ≈ 130.', '0,678: hundradelssiffran är 7, så 0,678 ≈ 0,7.'] },
        { typ: 'svar', text: 'Vilket tal är x?', papper: true,
          falt: [{ etikett: 'a) 1 − x = {3/8}', typ: 'brak', svar: '5/8' }, { etikett: 'b) x + {5/7} = 1', typ: 'brak', svar: '2/7' }, { etikett: 'c) {4/5} = 1 − x', typ: 'brak', svar: '1/5' }],
          ledtrad: 'Skriv 1 som ett bråk med samma nämnare, till exempel 1 = {8/8}.',
          losning: ['a) {8/8} − {3/8} = {5/8}, så x = {5/8}', 'b) {7/7} − {5/7} = {2/7}, så x = {2/7}', 'c) {5/5} − {4/5} = {1/5}, så x = {1/5}'] },
        { typ: 'svar', text: 'Jonas äter upp tre femtedelar av en pizza. Hur stor andel av pizzan finns kvar? Svara i bråkform och decimalform.', papper: true,
          falt: [{ etikett: 'Bråkform', typ: 'brak', svar: '2/5' }, { etikett: 'Decimalform', typ: 'tal', svar: '0,4' }],
          ledtrad: 'Hela pizzan är {5/5}.',
          losning: ['Hela pizzan = {5/5}', '{5/5} − {3/5} = {2/5}', '{2/5} = {4/10} = 0,4'] },
        { typ: 'svar', text: 'Lukas står i kön till matsalen. Han är nummer 7 framifrån och nummer 11 bakifrån. Hur många står i kön?', papper: true,
          falt: [{ typ: 'tal', svar: '17', enhet: 'st' }],
          ledtrad: 'Rita kön på papperet. Se till att du inte räknar Lukas två gånger.',
          losning: ['Framifrån räknar du 7 personer, och Lukas är den sista av dem.', 'Bakifrån räknar du 11 personer, och Lukas är den första av dem.', 'Lukas har räknats två gånger: 7 + 11 − 1 = 17.'] }
      ] },
      { id: 'del2', titel: 'Del 2', under: 'Siffrornas värde, avrundning och kluringar', fragor: [
        { typ: 'svar', text: 'Du har talet 0,547. Vilken siffra är hundradelssiffran?',
          falt: [{ typ: 'tal', svar: '4' }],
          ledtrad: 'Första platsen efter kommat är tiondelar. Den andra är hundradelar.',
          losning: ['0,547: 5 tiondelar, 4 hundradelar och 7 tusendelar.', 'Hundradelssiffran är 4.'] },
        { typ: 'val', text: 'Vilket värde har siffran 7 i talet 0,547?', alt: ['7', '0,7', '0,07', '0,007'], ratt: 3, fast: true,
          ledtrad: 'Vilken plats står sjuan på efter kommat?',
          losning: ['Sjuan står på tredje platsen efter kommat. Det är tusendelsplatsen.', 'Den är värd 7 tusendelar, alltså 0,007.'] },
        { typ: 'svar', text: 'Avrunda talet 19,325 till',
          falt: [{ etikett: 'a) heltal', typ: 'tal', svar: '19' }, { etikett: 'b) tiondelar', typ: 'tal', svar: '19,3' }, { etikett: 'c) hundradelar', typ: 'tal', svar: '19,33' }],
          ledtrad: 'Titta på siffran direkt till höger om den plats du avrundar till.',
          losning: ['Heltal: tiondelssiffran är 3, så 19,325 ≈ 19.', 'Tiondelar: hundradelssiffran är 2, så 19,325 ≈ 19,3.', 'Hundradelar: tusendelssiffran är 5. Då avrundar vi uppåt: 19,325 ≈ 19,33.'] },
        { typ: 'svar', text: 'Axel kliver in i en hiss på femte våningen i ett höghus. Först åker han ner tre våningar. Sedan åker han upp sju våningar. Då är han på näst högsta våningen. Hur många våningar har huset?', papper: true,
          falt: [{ typ: 'tal', svar: '10' }],
          ledtrad: 'Rita huset som en stege på papperet och följ Axel.',
          losning: ['5 − 3 = 2. Axel är på våning 2.', '2 + 7 = 9. Axel är på våning 9.', 'Våning 9 är näst högst, så den högsta är våning 10. Huset har 10 våningar.'] },
        { typ: 'val', text: 'Vilket av talen är störst?', alt: ['{1/2}', '1,2', '0,12', '1,12', '{11/12}'], ratt: 1, fast: true,
          ledtrad: 'Vilka av talen är större än 1? Jämför sedan dem.',
          losning: ['{1/2} = 0,5, och {11/12} är lite mindre än 1.', '1,2 och 1,12 är större än 1. Skriv 1,2 som 1,20.', '1,20 är mer än 1,12, så 1,2 är störst.'] },
        { typ: 'val', text: 'Vilket av talen är minst?', alt: ['{1/2}', '1,2', '0,12', '1,12', '{11/12}'], ratt: 2, fast: true,
          ledtrad: 'Vilka av talen är mindre än 1? Jämför dem.',
          losning: ['{1/2} = 0,50. {11/12} är nästan 1.', '0,50 är mer än 0,12.', '0,12 är minst.'] },
        { typ: 'svar', text: 'I en skål ligger några vindruvor. Astrid äter upp en femtedel av dem. Sedan äter Katia upp en fjärdedel av de vindruvor som finns kvar. Katia åt 12 vindruvor. Hur många vindruvor fanns det från början?', papper: true,
          falt: [{ typ: 'tal', svar: '60', enhet: 'st' }],
          ledtrad: 'Börja bakifrån. Katia åt en fjärdedel av det som fanns kvar, och det var 12 vindruvor. Hur många fanns kvar innan Katia åt?',
          losning: ['Katia åt {1/4} av det som var kvar, och det var 12. Då var det 4 · 12 = 48 kvar efter Astrid.', 'Astrid åt {1/5}. Då är 48 lika med {4/5} av alla vindruvor.', '{1/5} är 48 / 4 = 12. Alla vindruvor: 5 · 12 = 60.', 'Kolla: Astrid äter 12, och 48 är kvar. Katia äter {1/4} av 48, alltså 12. Det stämmer!'] }
      ] },
      { id: 'klurigt', titel: 'Klurigt: tiondelar och hundradelar', under: 'Extra träning på kronor, bråk och decimaler', gen: ['brak_dec', 'kronor', 'platsvarde', 'jamfor', 'brak_dec', 'kronor', 'dec_brak'], antal: 8 },
      { id: 'ova', titel: 'Träna mer', under: 'Nya liknande frågor varje gång', gen: ['jamfor', 'figur', 'brak_dec', 'dec_brak', 'kronor', 'avrunda', 'platsvarde', 'x_brak', 'andel_kvar', 'ko', 'hiss', 'storst'], antal: 8 }
    ]
  },
  {
    id: 'kemi', amne: 'no', titel: 'Kemi och miljö', under: 'Instuderingsfrågor åk 5',
    pass: [
      { id: 's1', titel: 'Vad är kemi?', fragor: [
        { typ: 'val', text: 'Vad handlar kemi om?', alt: ['Vad ämnen består av och hur de kan förändras', 'Hur planeterna rör sig i rymden', 'Hur man räknar med bråk'], ratt: 0, ledtrad: 'Kemi handlar om ämnen, till exempel vatten, järn och luft.', losning: ['Kemi handlar om **vad olika ämnen består av** och **hur de kan förändras** och bli nya ämnen.'] },
        { typ: 'val', text: 'Vad är en kemist?', alt: ['En person som forskar om ämnen', 'En person som bygger hus', 'En person som studerar stjärnor'], ratt: 0, ledtrad: 'Ordet kemist kommer från kemi.', losning: ['En kemist **forskar om ämnen** och om vad som händer när de reagerar med varandra.'] },
        { typ: 'val', text: 'Vad är en alkemist?', alt: ['En tidig kemist för länge sedan', 'En kemist som bara jobbar med alkohol', 'En robot som blandar ämnen'], ratt: 0, ledtrad: 'Alkemisterna levde för flera hundra år sedan.', losning: ['En alkemist var en slags **tidig kemist för länge sedan**. Alkemisterna försökte bland annat **göra guld** av andra metaller.'] },
        { typ: 'val', text: 'Vad försökte alkemisterna göra?', alt: ['Göra guld av andra metaller', 'Bygga de första raketerna', 'Hitta nya djurarter'], ratt: 0, ledtrad: 'Tänk på en dyr, gul metall.', losning: ['Alkemisterna försökte göra **guld** av andra metaller.'] }
      ] },
      { id: 's2', titel: 'Atomer och molekyler', fragor: [
        { typ: 'val', text: 'Vad är en atom?', alt: ['Den minsta byggstenen som allt är uppbyggt av', 'Ett annat ord för en cell', 'En sorts liten bakterie'], ratt: 0, ledtrad: 'Allt omkring oss är byggt av dem.', losning: ['En atom är den **minsta byggstenen**. Allt omkring oss är uppbyggt av atomer.'] },
        { typ: 'val', text: 'Vad är en molekyl?', alt: ['Två eller flera atomer som sitter ihop', 'En halv atom', 'Ett annat ord för grundämne'], ratt: 0, ledtrad: 'Vatten, H₂O, är ett exempel.', losning: ['En molekyl är **två eller flera atomer som sitter ihop**, till exempel vatten, H₂O.'] },
        { typ: 'val', text: 'Vad är skillnaden mellan en atom och en molekyl?', alt: ['En atom är en byggsten. En molekyl är flera atomer ihop.', 'En molekyl är mindre än en atom.', 'Det finns ingen skillnad.'], ratt: 0, ledtrad: 'Vilken av dem består av flera delar?', losning: ['En atom är **en enda byggsten**. En molekyl är **flera atomer som sitter ihop**.'] },
        { typ: 'val', text: 'Vad består en atom av?', alt: ['En kärna med protoner och neutroner, och elektroner runt', 'Små molekyler', 'Celler och vatten'], ratt: 0, ledtrad: 'I mitten av atomen finns en kärna.', losning: ['En atom har en **kärna** med **protoner** och **neutroner**. Runt kärnan rör sig **elektroner**.'] },
        { typ: 'val', text: 'Vad heter de små delarna som rör sig runt atomkärnan?', alt: ['Elektroner', 'Protoner', 'Molekyler'], ratt: 0, ledtrad: 'Ordet börjar på e.', losning: ['Runt kärnan rör sig **elektroner**. Protonerna sitter inne i kärnan.'] },
        { typ: 'val', text: 'Vad är ett grundämne?', alt: ['Ett ämne med bara en sorts atomer', 'Ett ämne med många olika sorters atomer', 'Ett ämne som bara finns i marken'], ratt: 0, ledtrad: 'Syre och guld är grundämnen.', losning: ['Ett grundämne består av **bara en sorts atomer**. Exempel: syre, järn och guld.'] },
        { typ: 'val', text: 'Vilket av dessa är ett grundämne?', alt: ['Syre', 'Vatten', 'Koldioxid'], ratt: 0, ledtrad: 'Ett grundämne har bara en sorts atomer.', losning: ['**Syre** har bara en sorts atomer. Vatten och koldioxid är kemiska föreningar.'] },
        { typ: 'val', text: 'Vad är en kemisk förening?', alt: ['Ett ämne med två eller flera olika sorters atomer', 'En klubb för kemister', 'Ett ämne med bara en sorts atomer'], ratt: 0, ledtrad: 'Vatten är en kemisk förening. Det har både väte och syre.', losning: ['En kemisk förening består av **två eller flera olika sorters atomer** som sitter ihop. Exempel: vatten och koldioxid.'] },
        { typ: 'val', text: 'Vatten (H₂O) är …', alt: ['en kemisk förening', 'ett grundämne', 'en enda atom'], ratt: 0, ledtrad: 'H₂O har två sorters atomer: väte (H) och syre (O).', losning: ['Vatten har två olika sorters atomer, så det är en **kemisk förening**.'] },
        { typ: 'val', text: 'Vad händer med atomerna när nya ämnen bildas?', alt: ['De byter plats och sätter ihop sig på nya sätt', 'De försvinner', 'De blir till ljus'], ratt: 0, ledtrad: 'Atomer kan inte försvinna.', losning: ['Atomerna **försvinner inte**. De **byter plats** och sätter ihop sig på nya sätt.'] }
      ] },
      { id: 's3', titel: 'Kemiska reaktioner', fragor: [
        { typ: 'val', text: 'Vad är en kemisk reaktion?', alt: ['När ämnen förändras och nya ämnen bildas', 'När något flyttas till en annan plats', 'När något blir kallare'], ratt: 0, ledtrad: 'Efteråt finns det något helt nytt.', losning: ['En kemisk reaktion är när ämnen förändras och **nya ämnen bildas**.'] },
        { typ: 'val', text: 'Vilket är ett exempel på en kemisk reaktion i vardagen?', alt: ['Ved brinner i en brasa', 'Is smälter i solen', 'Vatten kokar i en kastrull'], ratt: 0, ledtrad: 'Vid vilken av dem bildas ett helt nytt ämne?', losning: ['När ved brinner bildas nya ämnen, som aska och rök. Fler exempel: man **bakar en kaka**, eller en **banan blir brun**.', 'Is och vattenånga är fortfarande vatten.'] },
        { typ: 'val', text: 'Vad händer när järn rostar?', alt: ['Järnet reagerar med syre och vatten, och rost bildas', 'Järnet smälter', 'Järnet blir till guld'], ratt: 0, ledtrad: 'Rost är ett nytt ämne.', losning: ['Järnet reagerar med **syre och vatten** i luften. Då bildas ett nytt ämne: **rost**.'] },
        { typ: 'val', text: 'Vad behöver järn för att rosta?', alt: ['Syre och vatten', 'Socker och salt', 'Bara mörker'], ratt: 0, ledtrad: 'Båda finns i luften omkring oss.', losning: ['Järn rostar när det reagerar med **syre och vatten**.'] },
        { typ: 'val', text: 'Vad är skillnaden mellan en kemisk reaktion och en förändring där inget nytt ämne bildas?', alt: ['Vid en kemisk reaktion bildas ett nytt ämne', 'Vid en kemisk reaktion blir allt varmare', 'Det är samma sak'], ratt: 0, ledtrad: 'Tänk på is som smälter. Är det fortfarande vatten?', losning: ['Vid en kemisk reaktion **bildas ett nytt ämne**. När is smälter är det **fortfarande samma ämne**, vatten.'] },
        { typ: 'val', text: 'Is smälter till vatten. Vad är det?', alt: ['En förändring där inget nytt ämne bildas', 'En kemisk reaktion', 'En ny sorts atom'], ratt: 0, ledtrad: 'Är smält is fortfarande vatten?', losning: ['Smält is är fortfarande vatten. Inget nytt ämne bildas.'] }
      ] },
      { id: 's4', titel: 'Fast, flytande och gasform', fragor: [
        { typ: 'val', text: 'Vilka tre former kan ett ämne finnas i?', alt: ['Fast form, flytande form och gasform', 'Stor form, liten form och mellanform', 'Varm form, kall form och ljum form'], ratt: 0, ledtrad: 'Tänk på is, vatten och ånga.', losning: ['Ett ämne kan finnas i **fast form**, **flytande form** och **gasform**.'] },
        { typ: 'val', text: 'Vad händer med vatten när det fryser?', alt: ['Det blir is, alltså fast form', 'Det blir vattenånga', 'Det försvinner'], ratt: 0, ledtrad: 'Tänk på en isbit.', losning: ['Vatten blir **is** när det fryser. Det sker vid **0 °C**.'] },
        { typ: 'val', text: 'Vid hur många grader fryser vatten?', alt: ['0 °C', '10 °C', '100 °C'], ratt: 0, ledtrad: 'Det är när det börjar bli minusgrader.', losning: ['Vatten fryser vid **0 °C**.'] },
        { typ: 'val', text: 'Vad händer när vatten kokar?', alt: ['Det blir vattenånga, alltså gasform', 'Det blir is', 'Det blir salt'], ratt: 0, ledtrad: 'Titta på en kastrull med kokande vatten. Vad stiger upp?', losning: ['Kokande vatten blir **vattenånga**, alltså gasform. Det sker vid **100 °C**.'] },
        { typ: 'val', text: 'Vid hur många grader kokar vatten?', alt: ['100 °C', '50 °C', '0 °C'], ratt: 0, ledtrad: 'Det är ett jämnt hundratal.', losning: ['Vatten kokar vid **100 °C**.'] },
        { typ: 'val', text: 'Vad menas med avdunstning?', alt: ['När vatten långsamt blir gas utan att koka', 'När vatten fryser till is', 'När vatten blir smutsigt'], ratt: 0, ledtrad: 'Tänk på en vattenpöl som torkar i solen.', losning: ['Avdunstning är när vatten **långsamt blir gas utan att koka**, till exempel när en vattenpöl torkar.'] },
        { typ: 'val', text: 'Hur kan vatten gå från gasform till flytande form?', alt: ['Ångan kyls ner och blir vattendroppar', 'Ångan värms upp ännu mer', 'Det går inte'], ratt: 0, ledtrad: 'Tänk på imma på en kall spegel.', losning: ['När vattenånga **kyls ner** blir den vatten igen. Det kallas **kondensation**.'] },
        { typ: 'val', text: 'Vad kallas det när vattenånga blir vatten igen?', alt: ['Kondensation', 'Avdunstning', 'Smältning'], ratt: 0, ledtrad: 'Det är motsatsen till avdunstning.', losning: ['Det kallas **kondensation**. Avdunstning är tvärtom: vatten blir gas.'] }
      ] },
      { id: 's5', titel: 'Syror och baser', fragor: [
        { typ: 'val', text: 'Vad är en syra?', alt: ['Ett surt ämne med pH under 7, till exempel citronsaft', 'Ett ämne som alltid är varmt', 'Ett ämne med pH över 7, till exempel tvål'], ratt: 0, ledtrad: 'Syror smakar surt. Men smaka aldrig på okända ämnen!', losning: ['En syra är **sur** och har **pH under 7**. Exempel: **citronsaft** och **ättika**.'] },
        { typ: 'val', text: 'Vad är en bas?', alt: ['Motsatsen till en syra, med pH över 7, till exempel tvål', 'En syra som är extra stark', 'Ett instrument i ett band'], ratt: 0, ledtrad: 'I kemi är en bas motsatsen till en syra.', losning: ['En bas är **motsatsen till en syra** och har **pH över 7**. Exempel: **tvål**, **natron** och många rengöringsmedel.'] },
        { typ: 'val', text: 'Vilket av dessa är surt?', alt: ['Citronsaft', 'Tvål', 'Rent vatten'], ratt: 0, ledtrad: 'Vilket smakar surt?', losning: ['**Citronsaft** är en syra. Tvål är en bas, och rent vatten är neutralt.'] },
        { typ: 'val', text: 'Vad betyder det att ett ämne är neutralt?', alt: ['Det är varken surt eller basiskt', 'Det är både surt och basiskt', 'Det är giftigt'], ratt: 0, ledtrad: 'Rent vatten är neutralt.', losning: ['Neutralt betyder **varken surt eller basiskt**. Det har **pH 7**, som rent vatten.'] },
        { typ: 'val', text: 'Vilket pH har ett neutralt ämne?', alt: ['7', '1', '14'], ratt: 0, ledtrad: 'Det ligger mitt på pH-skalan.', losning: ['Neutralt är **pH 7**. Under 7 är surt, och över 7 är basiskt.'] },
        { typ: 'val', text: 'Vad används indikatorer till?', alt: ['Att visa om något är surt eller basiskt genom att byta färg', 'Att göra vatten varmare', 'Att mäta hur tungt något är'], ratt: 0, ledtrad: 'Tänk på pH-papper och rödkålssaft.', losning: ['En indikator **byter färg** och visar om något är **surt eller basiskt**. Exempel: pH-papper och rödkålssaft.'] },
        { typ: 'val', text: 'Vad kan hända när en syra och en bas blandas?', alt: ['De kan ta ut varandra så att det blir neutralt', 'Det blir alltid en explosion', 'Blandningen blir dubbelt så sur'], ratt: 0, ledtrad: 'Syra och bas är motsatser.', losning: ['Syran och basen kan **ta ut varandra** så att blandningen blir **neutral**. Det kallas **neutralisation**.'] },
        { typ: 'val', text: 'Vad betyder det att mark eller vatten försuras?', alt: ['Att det blir surare, till exempel av surt regn', 'Att det blir saltare', 'Att det fryser till is'], ratt: 0, ledtrad: 'Ordet försuras har ordet sur i sig.', losning: ['Marken eller vattnet **blir surare**, ofta på grund av **surt regn**. Det kan skada fiskar, djur och växter.'] }
      ] },
      { id: 's6', titel: 'Vårt avfall och återvinning', fragor: [
        { typ: 'val', text: 'Vad menas med avfall?', alt: ['Det vi slänger, till exempel sopor och matrester', 'Saker vi köper i affären', 'Löv som faller av träden'], ratt: 0, ledtrad: 'Det hamnar ofta i soppåsen.', losning: ['Avfall är **det vi slänger**, till exempel sopor, förpackningar och matrester.'] },
        { typ: 'val', text: 'Varför är det viktigt att sortera våra sopor?', alt: ['Så att material kan bli nytt och farligt avfall inte skadar naturen', 'Så att soppåsen blir tyngre', 'Det spelar ingen roll'], ratt: 0, ledtrad: 'Vad kan hända med en gammal burk om den sorteras rätt?', losning: ['Sorterade sopor kan **återvinnas och bli nya saker**, och **farligt avfall skadar inte naturen**.'] },
        { typ: 'val', text: 'Vad betyder återvinning?', alt: ['Att gammalt material blir till nya saker', 'Att vinna en tävling en gång till', 'Att slänga saker i havet'], ratt: 0, ledtrad: 'Det handlar om sopor, inte om tävlingar.', losning: ['Återvinning betyder att gammalt material tas om hand och **blir till nya saker**.'] },
        { typ: 'val', text: 'Vad kan hända med material som lämnas till återvinning?', alt: ['Det smälts eller mals ner och blir nya produkter', 'Det grävs ner och försvinner', 'Det skickas till månen'], ratt: 0, ledtrad: 'En gammal burk kan bli en ny burk.', losning: ['Materialet sorteras, **smälts eller mals ner** och blir **nya produkter**.'] },
        { typ: 'val', text: 'Vad kan matavfall bli när det återvinns?', alt: ['Biogas och gödsel', 'Nya glasburkar', 'Plastpåsar'], ratt: 0, ledtrad: 'Det kan bli bränsle till bussar.', losning: ['Matavfall kan bli **biogas** och **gödsel**.'] },
        { typ: 'val', text: 'Varför ska batterier och farligt avfall sorteras separat?', alt: ['De har giftiga ämnen som kan skada natur och människor', 'De är för tunga för soppåsen', 'De luktar illa'], ratt: 0, ledtrad: 'Det heter farligt avfall av en anledning.', losning: ['Batterier och farligt avfall innehåller **giftiga ämnen** som kan **läcka ut** och skada djur, natur och människor.'] },
        { typ: 'val', text: 'Var ska ett gammalt batteri lämnas?', alt: ['I en batteriholk eller på återvinningscentralen', 'I den vanliga soppåsen', 'I komposten'], ratt: 0, ledtrad: 'Batterier är farligt avfall.', losning: ['Batterier ska lämnas i en **batteriholk** eller på **återvinningscentralen**.'] },
        { typ: 'val', text: 'Vad kan vi göra för att minska mängden avfall?', alt: ['Laga saker och inte slänga mat', 'Köpa nya saker oftare', 'Slänga allt i samma påse'], ratt: 0, ledtrad: 'Vilket gör att vi slänger mindre?', losning: ['Vi kan **köpa mindre**, **återanvända**, **laga** saker som gått sönder och **inte slänga mat**.'] }
      ] },
      { id: 's7', titel: 'Plast', fragor: [
        { typ: 'val', text: 'Vad är plast oftast tillverkat av?', alt: ['Olja', 'Sand', 'Ull'], ratt: 0, ledtrad: 'Det pumpas upp ur marken.', losning: ['Plast tillverkas oftast av **olja**. Det finns också plast som görs av **växter**.'] },
        { typ: 'val', text: 'Varför används plast till så många olika saker?', alt: ['Den är billig, lätt och tålig och kan formas till nästan allt', 'Den är gjord av guld', 'Den växer på träd'], ratt: 0, ledtrad: 'Tänk på allt som är gjort av plast hemma.', losning: ['Plast är **billig**, **lätt** och **tålig**, och den kan **formas till nästan vad som helst**.'] },
        { typ: 'val', text: 'Vilka problem kan plast orsaka i naturen?', alt: ['Djur kan äta den eller fastna i den', 'Blommor växer snabbare', 'Plasten smälter när det regnar'], ratt: 0, ledtrad: 'Tänk på fåglar och fiskar.', losning: ['Djur kan **äta plast** eller **fastna i den**. Plast bryts ner **väldigt långsamt** och skräpar ner.'] },
        { typ: 'val', text: 'Vad är mikroplast?', alt: ['Jättesmå bitar av plast', 'Plast som bara finns i mikrovågsugnar', 'En sorts fisk'], ratt: 0, ledtrad: 'Mikro betyder jätteliten.', losning: ['Mikroplast är **jättesmå bitar av plast**. De bildas när plast slits och går sönder.'] },
        { typ: 'val', text: 'Mikroplast är plastbitar som är mindre än …', alt: ['5 millimeter', '5 meter', '5 kilometer'], ratt: 0, ledtrad: 'Bitarna är jättesmå.', losning: ['Mikroplast är mindre än **5 millimeter**.'] },
        { typ: 'val', text: 'Hur kan plast hamna i haven?', alt: ['Skräp blåser eller spolas ut i floder och följer med vattnet', 'Fiskar tillverkar plast', 'Plast regnar ner från molnen'], ratt: 0, ledtrad: 'Vart rinner bäckar och floder?', losning: ['Skräp som slängs i naturen kan **blåsa eller spolas ut** i bäckar och floder och **följa med vattnet** ut i havet.'] },
        { typ: 'val', text: 'Hur kan vi minska användningen av plast?', alt: ['Använda tygpåse och egen vattenflaska', 'Köpa en ny plastpåse varje gång', 'Slänga plast i naturen'], ratt: 0, ledtrad: 'Vilket gör att vi använder mindre ny plast?', losning: ['Vi kan använda **tygpåse** och **egen vattenflaska**, **återanvända** saker och **sortera** plasten.'] }
      ] },
      { id: 's8', titel: 'Människan påverkar miljön', fragor: [
        { typ: 'val', text: 'Vilket är ett exempel på hur människan påverkar miljön?', alt: ['Bilar och fabriker släpper ut avgaser', 'Fåglar bygger bon', 'Solen går upp på morgonen'], ratt: 0, ledtrad: 'Vilket av dem gör människor?', losning: ['Bilar och fabriker släpper ut **avgaser**. Vi **skräpar ner**, **hugger ner skog** och **fiskar för mycket**.'] },
        { typ: 'val', text: 'Vad kan utsläpp från industrier och trafik orsaka?', alt: ['Surt regn, luftföroreningar och varmare klimat', 'Mer fisk i sjöarna', 'Att plast försvinner'], ratt: 0, ledtrad: 'Avgaserna hamnar i luften.', losning: ['Utsläppen kan ge **luftföroreningar**, **surt regn** och ett **varmare klimat**.'] },
        { typ: 'val', text: 'Vad är surt regn?', alt: ['Regn som blivit surt av avgaser i luften', 'Regn som smakar citron', 'Regn som bara faller på natten'], ratt: 0, ledtrad: 'Det har med utsläpp att göra.', losning: ['Surt regn är regn som är **surare än vanligt** på grund av **avgaser** i luften.'] },
        { typ: 'val', text: 'Hur bildas surt regn?', alt: ['Avgaser från fabriker och bilar blandas med vattnet i luften', 'Molnen blir för kalla', 'Solen skiner för mycket'], ratt: 0, ledtrad: 'Vad kommer ut ur bilarnas avgasrör?', losning: ['Surt regn bildas när **avgaser** från till exempel fabriker och bilar **blandas med vattnet i luften**.'] },
        { typ: 'val', text: 'Vad kan vi människor göra för att skydda miljön?', alt: ['Cykla, återvinna och spara el', 'Åka bil överallt', 'Låta lamporna lysa hela tiden'], ratt: 0, ledtrad: 'Vilket ger minst utsläpp och sopor?', losning: ['Vi kan **cykla eller gå**, åka buss och tåg, **återvinna**, **spara el och vatten** och köpa mindre.'] },
        { typ: 'val', text: 'Du ska till en kompis som bor nära. Vad är bäst för miljön?', alt: ['Cykla eller gå', 'Bli skjutsad med bil', 'Åka taxi'], ratt: 0, ledtrad: 'Vilket ger inga avgaser alls?', losning: ['Att **cykla eller gå** ger inga avgaser.'] }
      ] },
      { id: 's9', titel: 'Att konservera mat', fragor: [
        { typ: 'val', text: 'Vad betyder det att konservera mat?', alt: ['Att få maten att hålla längre utan att bli dålig', 'Att äta upp maten snabbt', 'Att värma maten i mikron'], ratt: 0, ledtrad: 'Tänk på mat i burk som håller länge.', losning: ['Att konservera mat betyder att göra så att maten **håller längre** utan att bli dålig.'] },
        { typ: 'val', text: 'Varför behöver vi konservera vissa livsmedel?', alt: ['Bakterier och mögel gör annars maten dålig', 'Maten blir godare av att bli gammal', 'Annars blir maten för tung'], ratt: 0, ledtrad: 'Vad händer med en macka som ligger framme i en vecka?', losning: ['**Bakterier och mögel** gör maten dålig. Konserverad mat **håller längre**, så vi slipper slänga den.'] },
        { typ: 'val', text: 'Varför håller maten längre i kylskåpet?', alt: ['Bakterierna växer långsammare när det är kallt', 'Kylan gör maten tyngre', 'Kylan dödar alla bakterier'], ratt: 0, ledtrad: 'Bakterierna finns kvar, men något händer med dem.', losning: ['Kylan dödar inte bakterierna, men de **växer mycket långsammare**.'] },
        { typ: 'val', text: 'Vilket är ett sätt att konservera mat?', alt: ['Salta den', 'Ha den i en varm ficka', 'Skölja den i ljummet vatten'], ratt: 0, ledtrad: 'Tänk på saltad fisk och skinka.', losning: ['Att **salta** gör att maten håller längre.'] },
        { typ: 'val', text: 'Vilket av dessa är också ett sätt att konservera mat?', alt: ['Frysa den', 'Ha den i en varm bil', 'Blöta ner den'], ratt: 0, ledtrad: 'Tänk på frysen hemma.', losning: ['Att **frysa** maten gör att den håller länge.'] },
        { typ: 'val', text: 'Vilken lista innehåller bara sätt att konservera mat?', alt: ['Kyla, frysa, torka, salta och sylta', 'Kyla, värma, blöta och skaka', 'Salta, tappa, kasta och gömma'], ratt: 0, ledtrad: 'Alla sätten ska få maten att hålla längre.', losning: ['Man kan **kyla**, **frysa**, **torka**, **salta**, **sylta** med socker, lägga in i **ättika**, **röka** eller **koka in** i burk.'] }
      ] },
      { id: 's10', titel: 'Repetera och förklara', fragor: [
        { typ: 'val', text: 'Vilken mening stämmer?', alt: ['En molekyl är flera atomer ihop. Ett grundämne har bara en sorts atomer.', 'En atom är flera molekyler ihop.', 'Ett grundämne har många olika sorters atomer.'], ratt: 0, ledtrad: 'Atomen är den minsta byggstenen.', losning: ['**Atom**: den minsta byggstenen. **Molekyl**: två eller flera atomer ihop. **Grundämne**: bara en sorts atomer, som syre eller guld.'] },
        { typ: 'val', text: 'Vad händer när vatten avdunstar och sedan kondenserar?', alt: ['Det blir vattenånga och sedan vattendroppar igen', 'Det blir is och sedan salt', 'Det försvinner för alltid'], ratt: 0, ledtrad: 'Avdunsta = bli gas. Kondensera = bli vätska igen.', losning: ['När vatten **avdunstar** blir det **vattenånga**. När ångan **kyls ner kondenserar** den och blir **vattendroppar** igen, som imma eller moln.'] },
        { typ: 'val', text: 'Varför är det viktigt att återvinna material?', alt: ['Gamla saker blir nya, och det blir mindre sopor', 'Då får man fler sopor', 'Det gör ingen skillnad'], ratt: 0, ledtrad: 'Vad händer med en gammal burk som återvinns?', losning: ['Gamla material kan **bli nya saker**. Vi behöver ta mindre nytt från naturen, och det blir **mindre sopor**.'] },
        { typ: 'val', text: 'Hur kan plast påverka djur och natur?', alt: ['Djur kan äta plast eller fastna i den', 'Djur blir starkare av plast', 'Plast är bra mat för fiskar'], ratt: 0, ledtrad: 'Plast är inte mat.', losning: ['Djur kan **äta plast** eller **fastna i den**. Plast blir **mikroplast** som hamnar i vatten och mat.'] },
        { typ: 'val', text: 'Vilka tre saker kan du själv göra för en bättre miljö?', alt: ['Sortera sopor, ta egen vattenflaska och cykla', 'Slänga mat, köpa nytt och åka bil', 'Låta lampan lysa, duscha länge och skräpa ner'], ratt: 0, ledtrad: 'Alla tre sakerna ska vara bra för miljön.', losning: ['Till exempel: **sortera soporna**, använda **egen vattenflaska** och **cykla eller gå** i stället för att åka bil.'] },
        { typ: 'val', text: 'Vad bildas när vattenånga kyls ner?', alt: ['Vattendroppar', 'Salt', 'Rost'], ratt: 0, ledtrad: 'Tänk på en kall spegel i badrummet.', losning: ['Vattenångan kondenserar och blir **vattendroppar**.'] }
      ] },
      { id: 'forhor', titel: 'Blandat förhör', under: '10 frågor från alla stationer', pool: true, antal: 10 }
    ]
  },
  {
    id: 'laxa2', amne: 'matte', titel: 'Läxa 2', under: 'Efter avsnitt 1.3',
    pass: [
      { id: 'sida1', titel: 'Sida 1', under: 'Storleksordning, andelar och bråkform', fragor: [
        { typ: 'ordna', text: 'Skriv talen i storleksordning. Börja med det största.', items: ['{1/3}', '{1/5}', '{1/6}', '{1/10}', '{1/100}'], etiketter: ['Störst', 'Minst'],
          ledtrad: 'Ju fler delar det hela delas i, desto mindre blir varje del. Vilken bit är störst: en tredjedel eller en tiondel av en pizza?',
          losning: ['Alla bråken har 1 i täljaren. Då är det nämnaren som avgör.', 'Ju större nämnare, desto mindre del.', '{1/3}, {1/5}, {1/6}, {1/10}, {1/100}'] },
        { typ: 'svar', text: 'Hur stor andel av bilden är färgad? Svara i både bråkform och decimalform.',
          figur: { form: 'cirkel', delar: 2, fargade: [0] },
          falt: [{ etikett: 'Bråkform', typ: 'brak', svar: '1/2' }, { etikett: 'Decimalform', typ: 'tal', svar: '0,5' }],
          ledtrad: 'Hur många lika stora delar är cirkeln delad i?',
          losning: ['Cirkeln har 2 lika stora delar och 1 är färgad: {1/2}.', '{1/2} = {5/10} = 0,5'] },
        { typ: 'svar', text: 'Hur stor andel av bilden är färgad? Svara i både bråkform och decimalform.',
          figur: { form: 'rutor', rader: 2, kol: 2, fargade: [3] },
          falt: [{ etikett: 'Bråkform', typ: 'brak', svar: '1/4' }, { etikett: 'Decimalform', typ: 'tal', svar: '0,25' }],
          ledtrad: 'Tänk på pengar: en fjärdedel av en krona är 25 öre.',
          losning: ['4 rutor, och 1 är färgad: {1/4}.', '{1/4} = {25/100} = 0,25'] },
        { typ: 'svar', text: 'Hur stor andel av bilden är färgad? Svara i både bråkform och decimalform.',
          figur: { form: 'rutor', rader: 2, kol: 5, fargade: [0, 1, 2, 3, 5, 6, 7] },
          falt: [{ etikett: 'Bråkform', typ: 'brak', svar: '7/10' }, { etikett: 'Decimalform', typ: 'tal', svar: '0,7' }],
          ledtrad: 'Räkna alla rutor och de färgade rutorna.',
          losning: ['10 rutor, och 7 är färgade: {7/10}.', '{7/10} = sju tiondelar = 0,7'] },
        { typ: 'svar', text: 'Skriv talen i bråkform.',
          falt: [{ etikett: 'a) 0,03', typ: 'brak', svar: '3/100' }, { etikett: 'b) 0,9', typ: 'brak', svar: '9/10' }, { etikett: 'c) 0,017', typ: 'brak', svar: '17/1000' }],
          ledtrad: 'En decimal betyder tiondelar, två decimaler hundradelar och tre decimaler tusendelar.',
          losning: ['0,03 = tre hundradelar = {3/100}', '0,9 = nio tiondelar = {9/10}', '0,017 = sjutton tusendelar = {17/1000}'] },
        { typ: 'svar', text: 'På ett fat ligger 12 plommon. Mia äter 2, Leo äter 3 och Damon äter 4. Hur stor andel av plommonen finns kvar på fatet? Svara i bråkform.', papper: true,
          falt: [{ typ: 'brak', svar: '3/12' }],
          ledtrad: 'Hur många plommon äter de tillsammans? Hur många är kvar av 12?',
          losning: ['De äter 2 + 3 + 4 = 9 plommon.', 'Kvar: 12 − 9 = 3 plommon.', 'Andelen som är kvar är {3/12}. Det är samma sak som {1/4}.'] },
        { typ: 'svar', text: 'Gustav II Adolf dog den 6 november 1632. I december samma år skulle han ha fyllt 38 år. Vilket år föddes han?', papper: true,
          falt: [{ typ: 'tal', svar: '1594' }],
          ledtrad: 'Räkna bakåt 38 år från 1632.',
          losning: ['1632 − 38 = 1594', 'Han dog innan han hann fylla 38 i december, men födelseåret blir ändå 1594.'] }
      ] },
      { id: 'sida2', titel: 'Sida 2', under: 'Rest, siffror och problemlösning', fragor: [
        { typ: 'svar', text: 'Vilket tal är x?', papper: true,
          falt: [{ etikett: 'a) {35/8} = 4 rest x', typ: 'tal', svar: '3' }, { etikett: 'b) {46/7} = x rest 4', typ: 'tal', svar: '6' }, { etikett: 'c) {50/x} = 8 rest 2', typ: 'tal', svar: '6' }],
          ledtrad: 'Rest är det som blir över. Använd multiplikationstabellen.',
          losning: ['a) 4 · 8 = 32 och 35 − 32 = 3, så x = 3.', 'b) 46 − 4 = 42 och 6 · 7 = 42, så x = 6.', 'c) 50 − 2 = 48 och 8 · 6 = 48, så x = 6.'] },
        { typ: 'svar', text: 'Siffrorna är 5, 9, 3, 2 och 6. Använd alla siffrorna en gång var.', papper: true,
          falt: [{ etikett: 'a) Det näst minsta talet som går', typ: 'tal', svar: '23596' }, { etikett: 'b) Ett tal så nära 60 000 som möjligt', typ: 'tal', svar: '59632' }, { etikett: 'c) Summan av svaren i a och b', typ: 'tal', svar: '83228' }],
          ledtrad: 'Det minsta talet får man när siffrorna står från minst till störst.',
          losning: ['a) Det minsta talet är 23 569. Byt plats på de två sista siffrorna: 23 596.', 'b) 59 632 ligger 368 från 60 000. Börjar talet med 6 blir det minst 62 359, och det ligger längre bort.', 'c) 23 596 + 59 632 = 83 228'] },
        { typ: 'svar', text: 'Astrid och Hugo bar tillsammans ner 42 kg potatis i källaren. Hugo bar dubbelt så mycket som Astrid. Hur många kilogram bar var och en?', papper: true,
          falt: [{ etikett: 'Astrid', typ: 'tal', svar: '14', enhet: 'kg' }, { etikett: 'Hugo', typ: 'tal', svar: '28', enhet: 'kg' }],
          ledtrad: 'Astrid bär 1 del och Hugo bär 2 delar. Hur många delar blir det tillsammans?',
          losning: ['Astrid = 1 del, Hugo = 2 delar. Tillsammans 3 delar.', '1 del = {42/3} = 14 kg', 'Astrid bar 14 kg och Hugo 2 · 14 = 28 kg. Kolla: 14 + 28 = 42.'] },
        { typ: 'svar', text: 'Tre lika tunga påsar med äpplen väger tillsammans 6 kg. Äpplena kostar 18 kr per kilogram. Emma köper två påsar. Hur mycket får hon tillbaka om hon betalar med en hundralapp?', papper: true,
          falt: [{ typ: 'tal', svar: '28', enhet: 'kr' }],
          ledtrad: 'Hur mycket väger en påse? Hur mycket väger då två?',
          losning: ['En påse väger {6/3} = 2 kg.', 'Två påsar väger 2 · 2 = 4 kg.', '4 kg kostar 4 · 18 = 72 kr.', 'Tillbaka: 100 − 72 = 28 kr.'] }
      ] },
      { id: 'veckans', titel: 'Veckans problem', under: 'Talföljder', fragor: [
        { typ: 'svar', text: 'Vilka tal ska stå i stället för frågetecknen?', uttryck: '5,   25,   45,   ?,   85,   ?',
          falt: [{ etikett: 'Första ?', typ: 'tal', svar: '65' }, { etikett: 'Andra ?', typ: 'tal', svar: '105' }],
          ledtrad: 'Hur mycket ökar talen varje gång?',
          losning: ['Talen ökar med 20 varje gång.', '45 + 20 = 65 och 85 + 20 = 105.'] },
        { typ: 'svar', text: 'Vilka tal ska stå i stället för frågetecknen?', uttryck: '1,   2,   4,   ?,   16,   ?',
          falt: [{ etikett: 'Första ?', typ: 'tal', svar: '8' }, { etikett: 'Andra ?', typ: 'tal', svar: '32' }],
          ledtrad: 'Vad händer med talet varje gång? Plus eller gånger?',
          losning: ['Talen blir dubbelt så stora varje gång.', '4 · 2 = 8 och 16 · 2 = 32.'] },
        { typ: 'svar', text: 'Vilka tal ska stå i stället för frågetecknen?', uttryck: '100,   99,   ?,   94,   ?,   85',
          falt: [{ etikett: 'Första ?', typ: 'tal', svar: '97' }, { etikett: 'Andra ?', typ: 'tal', svar: '90' }],
          ledtrad: 'Hur mycket minskar talet första gången? Är det samma varje gång?',
          losning: ['Talen minskar med 1, sedan 2, sedan 3 och så vidare.', '99 − 2 = 97, 97 − 3 = 94, 94 − 4 = 90 och 90 − 5 = 85.'] }
      ] },
      { id: 'ova', titel: 'Träna mer', under: 'Nya liknande frågor varje gång', gen: ['ordna_brak', 'figur', 'dec_brak', 'andel_kvar', 'rest', 'siffror', 'dubbelt', 'handla', 'talfoljd'], antal: 8 }
    ]
  },
  {
    id: 'pilkast', amne: 'matte', titel: 'Uppställning och pilkast', under: 'Räkna på papper',
    pass: [
      { id: 'laxan', titel: 'Läxan', under: 'Räkna ut och kasta pil', fragor: [
        { typ: 'svar', text: 'Räkna ut.', uttryck: '{825/5}', papper: true, falt: [{ typ: 'tal', svar: '165' }],
          ledtrad: 'Dela upp 825 i delar som är lätta att dela med 5, till exempel 500 + 300 + 25.',
          losning: ['825 = 500 + 300 + 25', '{500/5} = 100,  {300/5} = 60,  {25/5} = 5', '100 + 60 + 5 = 165'] },
        { typ: 'svar', text: 'Räkna ut.', uttryck: '6 · 247', papper: true, falt: [{ typ: 'tal', svar: '1482' }],
          ledtrad: 'Dela upp 247 i 200 + 40 + 7 och multiplicera var för sig.',
          losning: ['247 = 200 + 40 + 7', '6 · 200 + 6 · 40 + 6 · 7', '= 1200 + 240 + 42', '= 1482'] },
        { typ: 'svar', text: 'Räkna ut.', uttryck: '423 − 274', papper: true, falt: [{ typ: 'tal', svar: '149' }],
          ledtrad: 'Ställ upp talen under varandra och börja med entalen. Går det inte, får du växla.',
          losning: ['Ental: 3 − 4 går inte. Växla en tia: 13 − 4 = 9.', 'Tiotal: efter växlingen är det 1 kvar. 1 − 7 går inte. Växla ett hundratal: 11 − 7 = 4.', 'Hundratal: efter växlingen är det 3 kvar. 3 − 2 = 1.', 'Svar: 423 − 274 = 149'] },
        { typ: 'pil', text: 'Wilma och Ari kastar sex pilar var. Wilma träffar tavlan med alla sina pilar och får 111 poäng. Hur kan Wilmas pilar ha träffat?', pilar: 6, mal: 111, varden: [1, 5, 20, 25, 50],
          ledtrad: '111 slutar på 1. Vilken ring måste en pil ha träffat för att summan ska sluta på 1?',
          losning: ['En pil måste ha träffat 1:an. Annars slutar summan på 0 eller 5.', 'Ett sätt: 25 + 25 + 20 + 20 + 20 + 1 = 111.', 'Ett annat sätt: 50 + 25 + 25 + 5 + 5 + 1 = 111.'] },
        { typ: 'pil', text: 'Ari missar tavlan en gång, men får ändå lika många poäng som Wilma: 111. Hur kan Aris fem pilar ha träffat?', pilar: 5, mal: 111, varden: [1, 5, 20, 25, 50],
          ledtrad: 'En av pilarna måste vara 1:an. Vilka fyra pilar blir 110 tillsammans?',
          losning: ['En pil träffar 1:an. De andra fyra ska bli 110 tillsammans.', 'Ett sätt: 50 + 20 + 20 + 20 + 1 = 111.', 'Ett annat sätt: 50 + 50 + 5 + 5 + 1 = 111.'] }
      ] },
      { id: 'ova', titel: 'Träna mer', under: 'Nya liknande frågor varje gång', gen: ['uppstallning', 'uppstallning', 'pil', 'rest', 'uppstallning'], antal: 6 }
    ]
  }
];
if (typeof module !== 'undefined') module.exports = LAXOR;
