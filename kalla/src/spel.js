  // ---------- Bonusspel efter ett klarat pass ----------
  // Två spel som turas om: "Akta dig!" (dra figuren, undvik det som faller) och "Hinderhoppet" (tryck för att hoppa).
  var SPELTID = 30, MAX_SPELSTJ = 5, SPEL = null;
  // Pausspel mitt i ett pass (efter var tredje fråga) är kortare
  function mittSpel() { return !!(P && P.mittSpel); }
  function speltid() { return spelTyp() === 'regn' ? (mittSpel() ? 25 : 40) : (mittSpel() ? 20 : SPELTID); }
  function maxStj() { return spelTyp() === 'regn' ? (mittSpel() ? 6 : 10) : (mittSpel() ? 3 : MAX_SPELSTJ); }
  var SPELNAMN = { regn: 'Akta dig!', hopp: 'Hinderhoppet' };
  /*HOPP-START*/
  var HOPP = {
    g: 2600, hojd: 150, andra: 0.72,
    fart: function (t) { return 370 + t * 12; },
    // Nästa hinder: höjder i px vid skala 1, avstånd i px vid skalaX 1
    monster: function (t, rnd) {
      var v = rnd(), h;
      if (t > 5 && v < 0.2) h = [{ typ: 'boll', dx: 0, r: 17 }];
      else if (t > 3 && v < 0.4) h = [{ typ: 'hack', dx: 0, w: 28, h: 60 }, { typ: 'hack', dx: 74, w: 28, h: 60 }];
      else if (v < 0.58) h = [{ typ: 'hack', dx: 0, w: 28, h: 84 }];
      else if (v < 0.8) h = [{ typ: 'plint', dx: 0, w: 66 + Math.round(rnd() * 44), h: 58 + Math.round(rnd() * 16) }];
      else h = [{ typ: 'hack', dx: 0, w: 28, h: 62 }];
      return { hinder: h, paus: Math.max(0.95, 1.45 - t * 0.02) * (0.9 + rnd() * 0.45) + (h[0].typ === 'boll' ? 0.25 : 0) };
    }
  };
  /*HOPP-SLUT*/
  /*REGN-START*/
  var REGN = {
    fart: function (t) { return 240 + t * 11; },
    paus: function (t) { return Math.max(0.22, 0.7 - t * 0.017); },
    // fx = var över bredden (0–1), r = storlek vid skala 1, vx = sidledsfart, fartF = egen fart
    monster: function (t, rnd) {
      var en = function (extra) { var o = { fx: rnd(), r: 15 + rnd() * 12, vx: 0, fartF: 0.85 + rnd() * 0.35 }; for (var k in extra) o[k] = extra[k]; return o; };
      var v = rnd();
      if (t > 14 && v < 0.15) return [en({ r: 32 + rnd() * 6, fartF: 0.75, stor: true })];
      if (t > 9 && v < 0.35) { var a = rnd(); return [en({ fx: a }), en({ fx: (a + 0.3 + rnd() * 0.4) % 1 })]; }
      if (t > 5 && v < 0.6) return [en({ vx: (rnd() < 0.5 ? -1 : 1) * (60 + rnd() * 80) })];
      return [en()];
    }
  };
  /*REGN-SLUT*/
  function spelTyp() { return S.nastaSpel === 'hopp' ? 'hopp' : 'regn'; }
  var HJARTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="var(--rod)" stroke="color-mix(in srgb,var(--rod) 60%,#000)" stroke-width="1.2"/></svg>';

  function vySpel() {
    var typ = spelTyp(), namn = esc(kompisNamn());
    var instr = typ === 'hopp' ? 'Tryck på skärmen för att hoppa över häckarna och plintarna. Tryck en gång till i luften för ett extra högt hopp. Se upp för bollarna som flyger: dem ska du inte hoppa in i! Ta stjärnorna på vägen.' : 'Sätt fingret var som helst, till exempel en bit under ' + namn + ', och dra. ' + namn + ' följer fingret utan att hoppa dit, så du ser hela tiden var du är. Akta dig för snöbollarna och kottarna, och fånga stjärnorna!';
    return '<div class="vy spelvy"><div class="spel-topp"><button class="ikon-knapp" data-act="spel-avsluta" aria-label="' + (mittSpel() ? 'Hoppa över spelet och fortsätt läxan' : 'Avsluta spelet') + '">' + IK.kryss + '</button>' +
      '<div class="spel-tid" aria-hidden="true"><div id="spel-tidfyll"></div></div><span class="spel-hjartan" id="spel-hjartan" aria-label="3 liv kvar">' + HJARTA + HJARTA + HJARTA + '</span>' +
      '<span class="spel-stj" aria-live="polite">' + IK.stjarna + '<b id="spel-stj">0</b></span></div>' +
      '<div class="spelplan ' + typ + '" id="spelplan"><canvas id="spelduk"></canvas><div class="spel-figur" id="spelfigur">' + kompisSVG('glad') + '</div>' +
      '<div class="spel-overlay" id="spel-overlay"><div class="spel-ruta">' + (mittSpel() ? '<p class="spel-paus">Tre frågor klara! Dags för en paus.</p>' : '') + '<h2>' + SPELNAMN[typ] + '</h2><p>' + instr + '</p><p class="spel-liten">Du har tre liv, och spelet tar ' + speltid() + ' sekunder. Du kan få upp till ' + maxStj() + ' stjärnor.</p><button class="knapp" data-act="spel-start">Starta!</button></div></div></div></div>';
  }
  function spelFarger() {
    var cs = getComputedStyle(document.documentElement), f = {};
    ['bg', 'surface', 'ink', 'muted', 'line', 'pop', 'pop2', 'pop-soft', 'pop2-soft', 'guld', 'matta', 'matta-kant', 'bom', 'rod'].forEach(function (k) { f[k] = cs.getPropertyValue('--' + k).trim() || '#888'; });
    return f;
  }
  function efterSpel() {
    var plan = $('#spelplan'), duk = $('#spelduk'), typ = spelTyp();
    SPEL = { mitt: mittSpel(), tid: speltid(), maxStj: maxStj(), typ: typ, plan: plan, duk: duk, g: duk.getContext('2d'), fig: $('#spelfigur'), igang: false, slut: false, t: 0, liv: 3, stj: 0, stjUte: 0, stjTid: 0, saker: [], nasta: 0.9, skydd: 0, raf: 0, hopp: 0, vy: 0, markX: 0, moln: [], farg: spelFarger() };
    SPEL.stjTid = stjIntervall(SPEL) * 0.5;
    for (var i = 0; i < 4; i++) SPEL.moln.push({ x: Math.random(), y: 0.08 + Math.random() * 0.3, s: 0.6 + Math.random() * 0.8 });
    storlekSpel(true); ritaSpel(); placeraFigur();
    plan.addEventListener('pointerdown', spelPek);
    plan.addEventListener('pointermove', spelDra);
    plan.addEventListener('pointerup', spelSlapp);
    plan.addEventListener('pointercancel', spelSlapp);
  }
  function storlekSpel(forsta) {
    var s = SPEL; if (!s) return;
    var W = s.plan.clientWidth, H = s.plan.clientHeight, d = Math.min(2, window.devicePixelRatio || 1);
    var fx = forsta ? 0.5 : (s.W ? s.x / s.W : 0.5), fy = forsta ? 1 : (s.H ? s.y / s.H : 1);
    s.W = W; s.H = H; s.duk.width = W * d; s.duk.height = H * d; s.g.setTransform(d, 0, 0, d, 0, 0);
    s.skala = Math.max(0.7, Math.min(1.3, H / 800)); s.skalaX = Math.max(0.6, Math.min(1.3, W / 800));
    s.fw = Math.max(90, Math.min(s.typ === 'hopp' ? 150 : 170, W * (s.typ === 'hopp' ? 0.22 : 0.26))); s.fh = s.fw * 196 / 240;
    s.fig.style.width = s.fw + 'px';
    s.mark = H - 46 * s.skala;
    if (s.typ === 'hopp') { s.x = W * 0.2; s.y = forsta ? s.mark : Math.min(s.mark, fy * H); }
    else { s.x = fx * W; s.y = forsta ? H - 14 : fy * H; s.mx = s.x; s.my = s.y; }
    s.hoppV = Math.sqrt(2 * HOPP.g * HOPP.hojd) * s.skala;
  }
  function placeraFigur() {
    var s = SPEL; if (!s) return;
    var rot = s.typ === 'hopp' && s.hopp ? Math.max(-25, Math.min(25, s.vy / 40)) : (s.typ === 'regn' ? Math.max(-14, Math.min(14, (s.mx - s.x) / 12)) : 0);
    s.fig.style.transform = 'translate(' + (s.x - s.fw * 0.5).toFixed(1) + 'px,' + (s.y - s.fh * 0.94).toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)';
  }
  function hitbox(s) { return { x1: s.x - s.fw * 0.16, x2: s.x + s.fw * 0.16, y1: s.y - s.fh * 0.86, y2: s.y - s.fh * 0.08 }; }
  function cirkelTraff(o, r) { var cx = Math.max(r.x1, Math.min(o.x, r.x2)), cy = Math.max(r.y1, Math.min(o.y, r.y2)); return Math.hypot(o.x - cx, o.y - cy) < o.r * 0.85; }
  function rektTraff(a, b) { return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1; }

  function spelPos(e) { var b = SPEL.plan.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; }
  function spelPek(e) {
    var s = SPEL; if (!s || !s.igang || s.slut) return;
    if (e.target.closest && e.target.closest('.spel-overlay')) return;
    if (s.typ === 'hopp') { hoppa(); e.preventDefault(); return; }
    var p = spelPos(e);
    s.drag = { id: e.pointerId, px: p.x, py: p.y, fx: s.mx, fy: s.my };
    try { s.plan.setPointerCapture(e.pointerId); } catch (er) { }
    e.preventDefault();
  }
  function spelDra(e) {
    var s = SPEL; if (!s || !s.igang || s.slut || s.typ !== 'regn' || !s.drag || e.pointerId !== s.drag.id) return;
    var p = spelPos(e);
    s.mx = Math.max(s.fw * 0.2, Math.min(s.W - s.fw * 0.2, s.drag.fx + (p.x - s.drag.px)));
    s.my = Math.max(s.H * 0.42, Math.min(s.H - 10, s.drag.fy + (p.y - s.drag.py)));
  }
  function spelSlapp(e) { var s = SPEL; if (s && s.drag && e.pointerId === s.drag.id) s.drag = null; }
  function hoppa() {
    var s = SPEL; if (s.hopp >= 2) return;
    s.vy = -s.hoppV * (s.hopp ? HOPP.andra : 1); s.hopp++; ljud('boing');
  }

  function spelStart() {
    var s = SPEL; if (!s || s.slut) return;
    $('#spel-overlay').hidden = true;
    if (!s.startad) { s.startad = true; S.nastaSpel = s.typ === 'hopp' ? 'regn' : 'hopp'; if (P && !s.mitt) P.spelat = true; spara(); }
    s.igang = true; s.pausad = false; s.sist = 0;
    cancelAnimationFrame(s.raf); s.raf = requestAnimationFrame(spelSteg);
  }
  function spelSteg(ts) {
    var s = SPEL; if (!s || s.slut || s.pausad) return;
    var dt = s.sist ? Math.min(0.05, (ts - s.sist) / 1000) : 0; s.sist = ts;
    s.t += dt; s.skydd = Math.max(0, s.skydd - dt);
    if (s.typ === 'regn') uppdRegn(s, dt); else uppdHopp(s, dt);
    if (s.slut) return;
    s.fig.classList.toggle('skyddad', s.skydd > 0);
    ritaSpel(); placeraFigur();
    var tf = $('#spel-tidfyll'); if (tf) tf.style.width = Math.min(100, s.t / s.tid * 100).toFixed(1) + '%';
    if (s.t >= s.tid) { slutSpel(true); return; }
    s.raf = requestAnimationFrame(spelSteg);
  }
  function uppdRegn(s, dt) {
    var k = Math.min(1, dt * 12);
    s.x += (s.mx - s.x) * k; s.y += (s.my - s.y) * k;
    s.nasta -= dt;
    if (s.nasta <= 0) {
      REGN.monster(s.t, Math.random).forEach(function (m) {
        var r = m.r * s.skala;
        s.saker.push({ x: r + m.fx * (s.W - 2 * r), y: -r, r: r, v: REGN.fart(s.t) * s.skala * m.fartF, vx: m.vx * s.skalaX, typ: m.stor ? 'snoboll' : (Math.random() < 0.5 ? 'snoboll' : 'kotte'), rot: Math.random() * 6, vr: (Math.random() - 0.5) * 3 });
      });
      s.nasta = REGN.paus(s.t);
    }
    // Stjärnorna kommer jämnt utspridda över hela spelet i stället för att alla kommer i början
    if (s.t >= s.stjTid && s.stj + s.stjUte < s.maxStj) {
      s.saker.push({ x: 20 + Math.random() * (s.W - 40), y: -20, r: 20, v: 150 * s.skala, vx: 0, typ: 'stjarna', rot: 0, vr: 0 }); s.stjUte++;
      nastaStjarna(s);
    }
    var hb = hitbox(s);
    s.saker = s.saker.filter(function (o) {
      o.y += o.v * dt; o.rot += o.vr * dt;
      if (o.vx) { o.x += o.vx * dt; if (o.x < o.r) { o.x = o.r; o.vx = -o.vx; } else if (o.x > s.W - o.r) { o.x = s.W - o.r; o.vx = -o.vx; } }
      if (cirkelTraff(o, hb)) {
        if (o.typ === 'stjarna') { fangaStjarna(o); return false; }
        if (s.skydd <= 0) { traffad(); return false; }
      }
      if (o.y - o.r > s.H + 10) { if (o.typ === 'stjarna') s.stjUte--; return false; }
      return true;
    });
  }
  function uppdHopp(s, dt) {
    var g = HOPP.g * s.skala, fart = HOPP.fart(s.t) * s.skalaX;
    s.vy += g * dt; s.y += s.vy * dt;
    if (s.y >= s.mark) { s.y = s.mark; s.vy = 0; s.hopp = 0; }
    s.markX = (s.markX + fart * dt) % 56;
    s.moln.forEach(function (m) { m.x -= dt * 0.02 * m.s; if (m.x < -0.2) m.x = 1.1; });
    s.nasta -= dt;
    if (s.nasta <= 0) {
      var m = HOPP.monster(s.t, Math.random);
      m.hinder.forEach(function (o) {
        if (o.typ === 'boll') s.saker.push({ typ: 'boll', x: s.W + 40 + o.dx * s.skalaX, r: o.r * s.skala, hojd: s.fh * 0.86 + o.r * s.skala + 16 * s.skala, rot: 0 });
        else s.saker.push({ typ: o.typ, x: s.W + 40 + o.dx * s.skalaX, w: o.w * s.skalaX, h: o.h * s.skala });
      });
      if (m.hinder[0].typ !== 'boll' && s.t >= s.stjTid && s.stj + s.stjUte < s.maxStj) { s.saker.push({ typ: 'stjarna', x: s.W + 40 + (90 + Math.random() * 90) * s.skalaX, y: s.mark - (120 + Math.random() * 80) * s.skala, r: 18 }); s.stjUte++; nastaStjarna(s); }
      s.nasta = m.paus;
    }
    var hb = hitbox(s);
    s.saker = s.saker.filter(function (o) {
      o.x -= fart * dt;
      if (o.typ === 'stjarna') {
        if (cirkelTraff(o, hb)) { fangaStjarna(o); return false; }
        if (o.x < -40) { s.stjUte--; return false; }
        return true;
      }
      if (o.typ === 'boll') {
        o.rot -= dt * 8; o.y = s.mark - o.hojd;
        if (!o.traffad && cirkelTraff(o, hb) && s.skydd <= 0) { o.traffad = true; traffad(); }
        return o.x + o.r > -40;
      }
      if (!o.traffad && rektTraff({ x1: o.x + 4, x2: o.x + o.w - 4, y1: s.mark - o.h + 4, y2: s.mark }, hb) && s.skydd <= 0) { o.traffad = true; traffad(); }
      return o.x + o.w > -40;
    });
  }
  // En stjärna ungefär var tid/(max+1):e sekund, lite slumpad, så att de räcker hela spelet
  function stjIntervall(s) { return s.tid / (s.maxStj + 1.5); }
  function nastaStjarna(s) { var iv = stjIntervall(s); s.stjTid = Math.max(s.stjTid, s.t - iv * 0.5) + iv * (0.8 + Math.random() * 0.4); }
  function fangaStjarna(o) {
    var s = SPEL; s.stjUte = Math.max(0, s.stjUte - 1);
    if (s.stj >= s.maxStj) return;
    s.stj++; var el = $('#spel-stj'); if (el) el.textContent = s.stj;
    ljud('ratt');
    var b = s.plan.getBoundingClientRect(); konfetti(b.left + o.x, b.top + o.y, 14, 10);
  }
  function traffad() {
    var s = SPEL; s.liv--; s.skydd = 1.3;
    var h = $('#spel-hjartan'); if (h) { h.innerHTML = new Array(Math.max(0, s.liv) + 1).join(HJARTA); h.setAttribute('aria-label', Math.max(0, s.liv) + ' liv kvar'); }
    ljud('fel'); minSpel('hmm', 900);
    var p = s.plan; p.classList.remove('skaka'); void p.offsetWidth; p.classList.add('skaka');
    if (s.liv <= 0) slutSpel(false);
  }
  function slutSpel(klarade) {
    var s = SPEL; if (!s || s.slut) return;
    s.slut = true; s.igang = false; cancelAnimationFrame(s.raf); s.fig.classList.remove('skyddad');
    S.stjarnor += s.stj; spara();
    var sek = Math.min(s.tid, Math.floor(s.t));
    var o = $('#spel-overlay');
    o.innerHTML = '<div class="spel-ruta"><h2>' + (klarade ? 'Grymt! Du klarade hela spelet!' : 'Bra kämpat!') + '</h2>' +
      '<p>' + (klarade ? esc(kompisNamn()) + ' klarade sig i alla ' + s.tid + ' sekunder.' : esc(kompisNamn()) + ' klarade sig i ' + sek + ' sekunder.') + '</p>' +
      '<p class="spel-resultat">' + IK.stjarna + '<b>+' + s.stj + '</b> ' + (s.stj === 1 ? 'stjärna' : 'stjärnor') + '</p>' +
      (s.mitt ? '<p class="spel-liten">Nu fortsätter läxan. Efter tre frågor till blir det ' + SPELNAMN[spelTyp()] + '.</p><button class="knapp" data-act="spel-tillbaka">Fortsätt läxan</button></div>'
              : '<p class="spel-liten">Klara ett pass till, så får du spela igen. Nästa gång blir det ' + SPELNAMN[spelTyp()] + '.</p><button class="knapp" data-act="hem">Till start</button></div>');
    o.hidden = false;
    if (klarade || s.stj) { minSpel('jubel', 1500); rorelse(slumpRorelse()); konfettiFran($('.spel-resultat'), 60); ljud('medalj'); }
  }
  function stoppaSpel() { if (SPEL) { cancelAnimationFrame(SPEL.raf); SPEL = null; } }

  function stjarnform(g, x, y, r) {
    g.beginPath();
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); }
    g.closePath();
  }
  function rundRekt(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function ritaSpel() {
    var s = SPEL, g = s.g, f = s.farg, W = s.W, H = s.H;
    var bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, f['pop2-soft']); bg.addColorStop(1, f.surface);
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    g.fillStyle = f.surface; g.globalAlpha = 0.85;
    s.moln.forEach(function (m) { var x = m.x * W, y = m.y * H, r = 22 * m.s * s.skala; g.beginPath(); g.arc(x, y, r, 0, 7); g.arc(x + r, y - r * 0.4, r * 1.2, 0, 7); g.arc(x + r * 2.2, y, r * 0.9, 0, 7); g.fill(); });
    g.globalAlpha = 1;
    if (s.typ === 'hopp') {
      g.fillStyle = f.matta; g.fillRect(0, s.mark, W, H - s.mark);
      g.fillStyle = f['matta-kant']; for (var x = -s.markX; x < W; x += 56) g.fillRect(x, s.mark + 10, 28, 6);
      g.fillRect(0, s.mark, W, 4);
    } else {
      g.fillStyle = f.matta; g.fillRect(0, H - 22, W, 22); g.fillStyle = f['matta-kant']; g.fillRect(0, H - 22, W, 4);
    }
    s.saker.forEach(function (o) {
      g.save();
      if (o.typ === 'stjarna') {
        g.translate(o.x, o.y); g.rotate(Math.sin(s.t * 3 + o.x) * 0.3);
        stjarnform(g, 0, 0, o.r); g.fillStyle = f.guld; g.fill(); g.lineWidth = 2.5; g.strokeStyle = f.ink; g.stroke();
      } else if (o.typ === 'snoboll') {
        g.beginPath(); g.arc(o.x, o.y, o.r, 0, 7); g.fillStyle = '#FFFFFF'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#7FA9DD'; g.stroke();
        g.beginPath(); g.arc(o.x - o.r * 0.35, o.y - o.r * 0.35, o.r * 0.25, 0, 7); g.fillStyle = '#DCEBFF'; g.fill();
      } else if (o.typ === 'kotte') {
        g.translate(o.x, o.y); g.rotate(o.rot);
        g.beginPath(); g.ellipse(0, 0, o.r * 0.72, o.r, 0, 0, 7); g.fillStyle = '#8A5A33'; g.fill(); g.lineWidth = 2.5; g.strokeStyle = '#4E3018'; g.stroke();
        g.strokeStyle = '#C08A55'; g.lineWidth = 2;
        for (var i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(-o.r * 0.6, i * o.r * 0.32); g.quadraticCurveTo(0, i * o.r * 0.32 + o.r * 0.22, o.r * 0.6, i * o.r * 0.32); g.stroke(); }
      } else if (o.typ === 'boll') {
        g.translate(o.x, o.y); g.rotate(o.rot);
        g.beginPath(); g.arc(0, 0, o.r, 0, 7); g.fillStyle = f.pop; g.fill();
        g.save(); g.beginPath(); g.arc(0, 0, o.r, 0, 7); g.clip();
        g.fillStyle = f.guld; g.fillRect(-o.r, -o.r * 0.28, o.r * 2, o.r * 0.56); g.restore();
        g.beginPath(); g.arc(0, 0, o.r, 0, 7); g.lineWidth = 2.5; g.strokeStyle = f.ink; g.stroke();
        g.setLineDash([4, 5]); g.beginPath(); g.moveTo(o.r + 8, 0); g.lineTo(o.r + 26, 0); g.moveTo(o.r + 6, -7); g.lineTo(o.r + 18, -8); g.stroke(); g.setLineDash([]);
      } else if (o.typ === 'hack') {
        var top = s.mark - o.h;
        g.strokeStyle = f.ink; g.lineWidth = 5; g.lineCap = 'round';
        g.beginPath(); g.moveTo(o.x + 4, s.mark); g.lineTo(o.x + 4, top + 6); g.moveTo(o.x + o.w - 4, s.mark); g.lineTo(o.x + o.w - 4, top + 6); g.stroke();
        rundRekt(g, o.x - 6, top, o.w + 12, 12, 5); g.fillStyle = f.pop; g.fill(); g.lineWidth = 2.5; g.stroke();
        g.fillStyle = '#FFFFFF'; g.fillRect(o.x + o.w * 0.2, top + 3, o.w * 0.22, 6); g.fillRect(o.x + o.w * 0.62, top + 3, o.w * 0.22, 6);
      } else if (o.typ === 'plint') {
        var lag = o.h / 3;
        for (var j = 0; j < 3; j++) { var w = o.w - j * 6, x0 = o.x + j * 3; rundRekt(g, x0, s.mark - (j + 1) * lag, w, lag, 5); g.fillStyle = j === 2 ? f.pop : f.bom; g.fill(); g.lineWidth = 2.5; g.strokeStyle = f.ink; g.stroke(); }
      }
      g.restore();
    });
  }
