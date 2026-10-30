/* ambiente.js - carregar DEPOIS do jogo.js, curral.js e noite.js
   Dia: passarinhos, galo, galinha, vaca, cachorro (só se você tiver o bicho).
   Noite: grilos e coruja. Respeita Config > Sons. */
(function () {
  /* Volume geral dos sons de ambiente (0 a 1) */
  var VOL = 0.6;

  /* Intervalos entre sons, em segundos [mínimo, máximo] */
  var EVERY = {
    bird: [4, 10],
    rooster: [60, 120],
    hen: [12, 30],
    cow: [45, 100],
    dog: [50, 120],
    owl: [18, 40],
  };

  var G = null,
    next = {};

  function rnd(a, b) {
    return a + Math.random() * (b - a);
  }
  function out() {
    if (!window.AC || AC.state !== "running" || !S || !S.snd) return false;
    if (!G) {
      G = AC.createGain();
      G.gain.value = VOL;
      G.connect(AC.destination);
    }
    return true;
  }

  /* nota simples: tipo, freq inicial, freq final, atraso, duração, volume, filtro [tipo, freq] */
  function note(type, f1, f2, t0, d, v, filt) {
    var o = AC.createOscillator(),
      g = AC.createGain(),
      t = AC.currentTime + t0,
      last = g;
    o.type = type;
    o.frequency.setValueAtTime(f1, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + Math.min(0.02, d / 3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g);
    if (filt) {
      var f = AC.createBiquadFilter();
      f.type = filt[0];
      f.frequency.value = filt[1];
      f.Q.value = filt[2] || 1;
      g.connect(f);
      last = f;
    }
    last.connect(G);
    o.start(t);
    o.stop(t + d + 0.05);
    return o;
  }

  /* ---------- sons do dia ---------- */
  function bird() {
    var n = 2 + Math.floor(Math.random() * 3),
      base = rnd(2200, 3600),
      i;
    for (i = 0; i < n; i++)
      note("sine", base, base * rnd(1.15, 1.5), i * 0.11, 0.09, 0.05);
  }
  function rooster() {
    var f = ["bandpass", 1300, 1.2],
      seq = [
        [0, 520, 660, 0.16],
        [0.2, 660, 820, 0.16],
        [0.42, 820, 700, 0.42],
        [0.9, 760, 380, 0.5],
      ];
    seq.forEach(function (s) {
      note("sawtooth", s[1], s[2], s[0], s[3], 0.07, f);
    });
  }
  function hen() {
    var n = 3 + Math.floor(Math.random() * 3),
      i;
    for (i = 0; i < n; i++)
      note("sawtooth", 420, 260, i * 0.11, 0.08, 0.07, ["lowpass", 900]);
  }
  function cow() {
    var o = note("sawtooth", 150, 105, 0, 1.3, 0.09, ["lowpass", 480]);
    var lfo = AC.createOscillator(),
      lg = AC.createGain();
    lfo.frequency.value = 5;
    lg.gain.value = 5;
    lfo.connect(lg);
    lg.connect(o.frequency);
    lfo.start();
    lfo.stop(AC.currentTime + 1.4);
  }
  function dog() {
    var n = Math.random() < 0.5 ? 2 : 3,
      i;
    for (i = 0; i < n; i++)
      note("sawtooth", 340, 190, i * 0.28, 0.12, 0.06, ["lowpass", 1100]);
  }

  /* ---------- sons da noite ---------- */
  function cricket(t0, f) {
    for (var i = 0; i < 3; i++)
      note("sine", f, null, t0 + i * 0.07, 0.04, 0.02);
  }
  function owl() {
    var n = Math.random() < 0.5 ? 2 : 3,
      i;
    for (i = 0; i < n; i++) {
      note("sine", 430, 360, i * 0.55, 0.38, 0.09, ["lowpass", 700]);
    }
  }

  /* ---------- agenda ---------- */
  function due(k) {
    var now = Date.now();
    if (!next[k]) next[k] = now + rnd(EVERY[k][0], EVERY[k][1]) * 1000 * 0.5;
    if (now < next[k]) return false;
    next[k] = now + rnd(EVERY[k][0], EVERY[k][1]) * 1000;
    return true;
  }

  function tick() {
    if (document.hidden || !out()) return;
    var ph = $("app").getAttribute("data-phase"),
      night = ph === "night" || ph === "dusk";

    if (night) {
      /* grilos: 2 grupos por segundo, cada um com um tom diferente */
      var k;
      for (k = 0; k < 2; k++) cricket(rnd(0, 0.9), rnd(4200, 4700));
      if (ph === "night" && due("owl")) owl();
      return;
    }

    if (!rainOn && due("bird")) bird();
    if (due("rooster")) rooster();
    if (S.hens > 0 && due("hen")) hen();
    if (S.cows > 0 && due("cow")) cow();
    if (document.querySelector("[data-id=cachorro]") && due("dog")) dog();
  }

  setInterval(tick, 1000);
})();
