/* ===========================================================
   Roça Feliz - jogo.js (arquivo único)
   Ordem: 1) JOGO  2) VISUAL  3) ASSETS (PNGs de img/)
   Para ajustar tamanhos/posições, procure a seção ASSETS (CONFIGURAÇÃO).
   =========================================================== */

/* ################# 1) JOGO ################# */
/* cenário gerado por código */
(function () {
  var rep = function (n) {
    var s = "";
    for (var i = 0; i < n; i++) s += " q25 -44 50 0";
    return s;
  };
  var $t = document.getElementById("treeline");
  $t.innerHTML =
    '<path transform="translate(25 10)" d="M-25 60 V34' +
    rep(21) +
    ' V60Z" fill="#2f7a22" stroke="#24601a" stroke-width="3" vector-effect="non-scaling-stroke"/>' +
    '<path d="M0 60 V34' +
    rep(20) +
    ' V60Z" fill="var(--tree)" stroke="#2a6a18" stroke-width="3" vector-effect="non-scaling-stroke"/>';
  var s = "";
  [
    [22, 30, 0.7],
    [62, 22, 0.75],
    [98, 34, 0.65],
  ].forEach(function (f) {
    var x = f[0],
      y = f[1],
      k = f[2],
      i;
    s +=
      '<path d="M' +
      x +
      " " +
      y +
      " L" +
      x +
      ' 88" stroke="#2f6a14" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M' +
      x +
      " " +
      y +
      " L" +
      x +
      ' 88" stroke="#5cc02e" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M' +
      x +
      " 70 q-14 -4 -16 -14 q12 2 16 14z" +
      '" fill="#5cc02e" stroke="#2f6a14" stroke-width="1.2"/>';
    for (i = 0; i < 12; i++)
      s +=
        '<ellipse cx="' +
        x +
        '" cy="' +
        (y - 23 * k) +
        '" rx="' +
        8.4 * k +
        '" ry="' +
        17 * k +
        '" transform="rotate(' +
        i * 30 +
        " " +
        x +
        " " +
        y +
        ')" fill="#ffd21f" stroke="#a87a0a" stroke-width="1.2"/>';
    s +=
      '<circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="' +
      14 * k +
      '" fill="#6a4220" stroke="#3a220e" stroke-width="2"/>' +
      '<circle cx="' +
      (x - 3) +
      '" cy="' +
      (y - 3) +
      '" r="1.6" fill="#a0703a"/><circle cx="' +
      (x + 3) +
      '" cy="' +
      (y + 2) +
      '" r="1.6" fill="#a0703a"/>';
  });
  document.getElementById("sunf").innerHTML = s;
  var g = "";
  [
    [14, 60, "#a23a68", "#ff8fb8"],
    [34, 48, "#8a8a8a", "#fff"],
    [54, 64, "#8a1a1a", "#ff5a5a"],
    [24, 76, "#6a3a9a", "#c8a0ff"],
    [44, 80, "#a23a68", "#ffd0e4"],
    [70, 70, "#8a8a8a", "#fff"],
  ].forEach(function (f) {
    var x = f[0],
      y = f[1],
      i,
      px,
      py;
    g +=
      '<path d="M' +
      x +
      " " +
      (y + 4) +
      ' q-3 12 0 24" stroke="#3f8a1f" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M' +
      x +
      " " +
      (y + 18) +
      ' q-9 -2 -10 -8 q8 0 10 8z" fill="#5cc02e" stroke="#2f6a14" stroke-width="1"/>';
    for (i = 0; i < 5; i++) {
      px = x + 5.5 * Math.cos(i * 1.2566);
      py = y + 5.5 * Math.sin(i * 1.2566);
      g +=
        '<circle cx="' + px + '" cy="' + py + '" r="5.4" fill="' + f[2] + '"/>';
    }
    for (i = 0; i < 5; i++) {
      px = x + 5.5 * Math.cos(i * 1.2566);
      py = y + 5.5 * Math.sin(i * 1.2566);
      g +=
        '<circle cx="' + px + '" cy="' + py + '" r="4.2" fill="' + f[3] + '"/>';
    }
    g +=
      '<circle cx="' +
      x +
      '" cy="' +
      y +
      '" r="3.2" fill="#ffd93a" stroke="#a87a0a" stroke-width="1"/>';
  });
  g +=
    '<g class="bunny"><circle cx="128" cy="92" r="15" fill="#3a2f2a"/><circle cx="144" cy="82" r="11" fill="#3a2f2a"/><circle cx="116" cy="98" r="7" fill="#3a2f2a"/><circle cx="128" cy="92" r="13" fill="#fff"/><circle cx="144" cy="82" r="9" fill="#fff"/><circle cx="116" cy="98" r="5" fill="#fff"/>' +
    '<ellipse cx="141" cy="64" rx="3.5" ry="11" fill="#fff" stroke="#3a2f2a" stroke-width="2"/><ellipse cx="141" cy="65" rx="1.6" ry="7" fill="#ffb3c8"/>' +
    '<ellipse cx="149" cy="66" rx="3.5" ry="10" fill="#fff" stroke="#3a2f2a" stroke-width="2" transform="rotate(14 149 66)"/><ellipse cx="149" cy="67" rx="1.6" ry="6" fill="#ffb3c8" transform="rotate(14 149 66)"/>' +
    '<circle cx="147" cy="81" r="1.6" fill="#222"/><circle cx="152" cy="85" r="2" fill="#ffb3c8"/></g>';
  document.getElementById("garden").innerHTML = g;
})();

var CROPS = [
  {
    nome: "Cenoura",
    lvl: 1,
    custo: 10,
    tempo: 20,
    venda: 18,
    xp: 2,
    cor: "#e8751a",
    tipo: "raiz",
  },
  {
    nome: "Milho",
    lvl: 2,
    custo: 25,
    tempo: 45,
    venda: 48,
    xp: 6,
    cor: "#f2c200",
  },
  {
    nome: "Tomate",
    lvl: 3,
    custo: 40,
    tempo: 90,
    venda: 86,
    xp: 12,
    cor: "#d9302c",
  },
  {
    nome: "Morango",
    lvl: 4,
    custo: 70,
    tempo: 150,
    venda: 155,
    xp: 22,
    cor: "#e0245e",
  },
  {
    nome: "Abóbora",
    lvl: 5,
    custo: 120,
    tempo: 300,
    venda: 285,
    xp: 42,
    cor: "#e8891a",
  },
  {
    nome: "Girassol",
    lvl: 6,
    custo: 200,
    tempo: 600,
    venda: 470,
    xp: 85,
    cor: "#f5c400",
    tipo: "flor",
  },
];
/* árvores frutíferas. tempo = crescer; rebrota = tempo para dar frutas de novo */
var TREES = [
  {
    nome: "Laranjeira",
    fruto: "Laranja",
    lvl: 3,
    custo: 150,
    tempo: 180,
    rebrota: 150,
    frutos: 2,
    venda: 40,
    xp: 10,
    cor: "#f28c1e",
    borda: "#9a4a0a",
    copa: "#3f9a2a",
    luz: "#86d84e",
    sombra: "#22681a",
  },
  {
    nome: "Mangueira",
    fruto: "Manga",
    lvl: 6,
    custo: 350,
    tempo: 360,
    rebrota: 300,
    frutos: 3,
    venda: 60,
    xp: 20,
    cor: "#ffb31f",
    borda: "#a8620a",
    copa: "#2f8a3a",
    luz: "#72d06a",
    sombra: "#1a5a26",
  },
  {
    nome: "Macieira",
    fruto: "Maçã",
    lvl: 8,
    custo: 600,
    tempo: 480,
    rebrota: 420,
    frutos: 3,
    venda: 95,
    xp: 30,
    cor: "#e0342b",
    borda: "#8a1410",
    copa: "#3f9a2a",
    luz: "#86d84e",
    sombra: "#22681a",
  },
];
var NPCS = [
  ["Dona Cida", 9],
  ["Seu Zé", 7],
  ["Tiana", 5],
  ["Beto", 4],
  ["Lu", 3],
  ["Nico", 2],
];
var SHOP = [
  {
    nome: "Fertilizante",
    desc: "Adianta um canteiro em metade do tempo total.",
    custo: 30,
  },
  {
    nome: "Pacote com 5 fertilizantes",
    desc: "Mais barato que comprar um por um.",
    custo: 130,
  },
  {
    nome: "Espantalho",
    desc: "Ervas daninhas aparecem bem menos. Compra única.",
    custo: 250,
  },
];
var QUESTS = [
  {
    id: "q1",
    t: "Plante 5 sementes",
    m: 5,
    g: function () {
      return S.stats.planted;
    },
    r: { coins: 30 },
  },
  {
    id: "q2",
    t: "Colha 10 plantas",
    m: 10,
    g: function () {
      return S.stats.harvested;
    },
    r: { coins: 60 },
  },
  {
    id: "q3",
    t: "Limpe ervas 3 vezes",
    m: 3,
    g: function () {
      return S.stats.cleaned;
    },
    r: { fert: 1 },
  },
  {
    id: "q4",
    t: "Venda 100 moedas em colheitas",
    m: 100,
    g: function () {
      return S.stats.sold;
    },
    r: { coins: 50 },
  },
  {
    id: "q5",
    t: "Compre 2 canteiros",
    m: 2,
    g: function () {
      return S.stats.bought;
    },
    r: { coins: 80 },
  },
  {
    id: "q6",
    t: "Colha 5 tomates",
    m: 5,
    g: function () {
      return S.stats.hb[2];
    },
    r: { coins: 100, fert: 1 },
  },
  {
    id: "q7",
    t: "Chegue ao nível 4",
    m: 4,
    g: function () {
      return S.lvl;
    },
    r: { coins: 150 },
  },
];
var ACH = [
  {
    id: "a1",
    n: "Primeira colheita",
    d: "Colha uma planta.",
    ok: function () {
      return S.stats.harvested >= 1;
    },
  },
  {
    id: "a2",
    n: "Mão boa",
    d: "Colha 50 plantas.",
    ok: function () {
      return S.stats.harvested >= 50;
    },
  },
  {
    id: "a3",
    n: "Sitiante",
    d: "Chegue ao nível 5.",
    ok: function () {
      return S.lvl >= 5;
    },
  },
  {
    id: "a4",
    n: "Fazendeiro de verdade",
    d: "Chegue ao nível 10.",
    ok: function () {
      return S.lvl >= 10;
    },
  },
  {
    id: "a5",
    n: "Cofre cheio",
    d: "Tenha 1000 moedas ao mesmo tempo.",
    ok: function () {
      return S.coins >= 1000;
    },
  },
  {
    id: "a6",
    n: "Feirante",
    d: "Venda 1000 moedas em colheitas.",
    ok: function () {
      return S.stats.sold >= 1000;
    },
  },
  {
    id: "a7",
    n: "Dono da terra",
    d: "Tenha 20 canteiros.",
    ok: function () {
      return (
        S.plots.filter(function (p) {
          return p.on;
        }).length >= 20
      );
    },
  },
  {
    id: "a8",
    n: "Capina em dia",
    d: "Limpe ervas 20 vezes.",
    ok: function () {
      return S.stats.cleaned >= 20;
    },
  },
  {
    id: "a9",
    n: "Pomar farto",
    d: "Colha frutas de árvores 10 vezes.",
    ok: function () {
      return (S.stats.tfruit || 0) >= 10;
    },
  },
];
var MENU = [
  ["amigos", "Amigos"],
  ["sementes", "Sementes"],
  ["fert", "Fertilizantes"],
  ["armazem", "Armazém"],
  ["entregas", "Entregas"],
  ["loja", "Loja"],
  ["missoes", "Missões"],
  ["ranking", "Ranking"],
  ["mural", "Mural"],
  ["correio", "Correio"],
  ["conquistas", "Conquistas"],
  ["config", "Config"],
];
var ICONS = {
  amigos:
    '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M15 14.5c3 0 6 1.5 6 5.5"/>',
  sementes:
    '<path d="M12 21V11"/><path d="M12 13c-5 0-7-3-7-7 5 0 7 2 7 7z"/><path d="M12 15c0-4 2-6 7-6 0 4-2 6-7 6z"/>',
  fert: '<path d="M7 8h10l2 12H5z"/><path d="M9 8c0-3 1-4 3-4s3 1 3 4"/><path d="M10 14h4"/>',
  armazem:
    '<path d="M3 10l9-6 9 6v10H3z"/><path d="M8 20v-7h8v7M8 13l8 7M16 13l-8 7"/>',
  entregas:
    '<path d="M2 16V8h11v8M13 11h4l3 3v2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
  loja: '<path d="M4 9l1-5h14l1 5z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
  missoes:
    '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3"/>',
  ranking: '<path d="M4 20V13h4v7M10 20V6h4v14M16 20v-9h4v9"/>',
  mural:
    '<rect x="3" y="4" width="18" height="15" rx="2"/><path d="M7 9h6M7 13h10"/><circle cx="17" cy="8" r="1.5"/>',
  correio:
    '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/>',
  conquistas:
    '<path d="M8 4h8v6a4 4 0 01-8 0z"/><path d="M8 6H4v2a3 3 0 003 3M16 6h4v2a3 3 0 01-3 3M12 14v4M8 20h8"/>',
  config:
    '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
};
var KEY = "roca-feliz-v2",
  R = 6,
  N = 36;
var S,
  btns = [],
  open = null,
  armedTile = -1,
  armedT,
  armedReset = false,
  lastFocus = null,
  seedTab = "cult";

function $(id) {
  return document.getElementById(id);
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
function pad(n) {
  return (n < 10 ? "0" : "") + n;
}
function need(l) {
  return 30 + 25 * l + (l > 5 ? 8 * (l - 5) * l : 0);
}
function totalXp(l, x) {
  var t = 0;
  for (var i = 1; i < l; i++) t += need(i);
  return t + x;
}
function fmt(s) {
  s = Math.ceil(s);
  return s >= 60 ? Math.floor(s / 60) + " min " + (s % 60) + " s" : s + " s";
}
function inner(r, c) {
  return r >= 1 && r <= 3 && c >= 1 && c <= 3;
}
function isTree(p) {
  return p.t !== undefined && p.t >= 0;
}
function isEmpty(p) {
  return p.c < 0 && !isTree(p);
}
function fresh() {
  var p = [];
  for (var i = 0; i < N; i++)
    p.push({
      on: inner(Math.floor(i / R), i % R),
      c: -1,
      t: -1,
      m: false,
      rb: 0,
      pr: 0,
      w: false,
      f: false,
    });
  return {
    coins: 100,
    xp: 0,
    lvl: 1,
    sel: 0,
    tool: "hand",
    plots: p,
    last: Date.now(),
    inv: [0, 0, 0, 0, 0, 0],
    tinv: [0, 0, 0],
    fert: 1,
    scare: false,
    stats: {
      planted: 0,
      harvested: 0,
      cleaned: 0,
      sold: 0,
      bought: 0,
      fertUsed: 0,
      tfruit: 0,
      hb: [0, 0, 0, 0, 0, 0],
    },
    tutDone: false,
    tutStep: 0,
    qdone: {},
    ach: {},
    mail: [],
    daily: "",
    welcomed: false,
    visit: {},
    log: [],
    name: "Meu Sítio",
    time: "auto",
    snd: true,
    hens: 0,
    cows: 0,
    an2: true,
    coop: false,
    eggT: 0,
    milkT: 0,
    prod: [0, 0],
    house: "padrao",
  };
}
function load() {
  try {
    var r = localStorage.getItem(KEY);
    if (r) {
      var o = JSON.parse(r);
      if (o && o.plots && o.plots.length === N && o.stats && o.stats.hb) {
        if (o.snd === undefined) o.snd = true;
        if (!o.an2) {
          o.an2 = true;
          o.coop = o.hens > 0 || o.cows > 0;
          if (o.hens > 0) o.hens--;
        }
        if (o.coop === undefined) o.coop = o.hens > 0 || o.cows > 0;
        if (o.hens === undefined) {
          o.hens = 0;
          o.cows = 0;
          o.eggT = 0;
          o.milkT = 0;
          o.prod = [0, 0];
        }
        if (o.tutDone === undefined) {
          o.tutDone = o.stats.planted > 0;
          o.tutStep = 0;
        }
        if (!o.tinv) o.tinv = [0, 0, 0];
        while (o.tinv.length < 3) o.tinv.push(0);
        if (o.stats.tfruit === undefined) o.stats.tfruit = 0;
        o.plots.forEach(function (p) {
          if (p.t === undefined) {
            p.t = -1;
            p.m = false;
            p.rb = 0;
          }
        });
        /* limpa restos da decoração antiga e define a casa */
        delete o.deco;
        delete o.dinv;
        delete o.dxp;
        if (!o.house) o.house = "padrao";
        return o;
      }
    }
    var old = localStorage.getItem("roca-feliz-v1");
    if (old) {
      var v = JSON.parse(old),
        f = fresh();
      if (v && typeof v.coins === "number") {
        f.coins = v.coins;
        f.xp = v.xp || 0;
        f.lvl = v.lvl || 1;
      }
      return f;
    }
  } catch (e) {}
  return fresh();
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
}
function addMail(tit, txt, coins, fert) {
  S.mail.unshift({
    tit: tit,
    txt: txt,
    coins: coins || 0,
    fert: fert || 0,
    got: false,
  });
  if (S.mail.length > 30) S.mail.length = 30;
}
function log(m) {
  var d = new Date();
  S.log.unshift({
    t: pad(d.getHours()) + ":" + pad(d.getMinutes()),
    m: m,
  });
  if (S.log.length > 30) S.log.length = 30;
}
var tt;
function toast(m) {
  sfxFor(m);
  var t = $("toast");
  t.textContent = m;
  clearTimeout(tt);
  tt = setTimeout(function () {
    t.textContent = "";
  }, 3200);
}

/* sons */
var AC = null;
function audioUnlock() {
  if (!AC) {
    try {
      var C = window.AudioContext || window.webkitAudioContext;
      if (C) AC = new C();
    } catch (e) {}
  }
  if (!AC) return;
  if (AC.state === "suspended") {
    var p = AC.resume();
    if (p && p.then) p.then(rainSync);
  } else rainSync();
}
["pointerdown", "touchstart", "keydown"].forEach(function (ev) {
  document.addEventListener(ev, audioUnlock, { passive: true });
});
function tone(f, t0, d, type, v, f2) {
  var o = AC.createOscillator(),
    g = AC.createGain(),
    t = AC.currentTime + t0;
  o.type = type || "sine";
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v || 0.15, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g);
  g.connect(AC.destination);
  o.start(t);
  o.stop(t + d + 0.02);
}
function noise(t0, d, f, q, v, type) {
  var n = Math.max(1, Math.floor(AC.sampleRate * d)),
    buf = AC.createBuffer(1, n, AC.sampleRate),
    data = buf.getChannelData(0),
    i;
  for (i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
  var src = AC.createBufferSource(),
    fl = AC.createBiquadFilter(),
    g = AC.createGain(),
    t = AC.currentTime + t0;
  src.buffer = buf;
  fl.type = type || "bandpass";
  fl.frequency.value = f;
  fl.Q.value = q || 1;
  g.gain.setValueAtTime(v || 0.15, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  src.connect(fl);
  fl.connect(g);
  g.connect(AC.destination);
  src.start(t);
}
var SFX = {
  plant: function () {
    noise(0, 0.12, 500, 0.8, 0.35, "lowpass");
    tone(180, 0, 0.12, "sine", 0.25, 70);
    tone(95, 0.05, 0.1, "sine", 0.2, 60);
  },
  /* uma colheita com som próprio para cada cultura */
  h0: function () {
    noise(0, 0.07, 2600, 1.3, 0.3);
    noise(0.07, 0.07, 3200, 1.3, 0.22);
    tone(320, 0, 0.06, "square", 0.05, 150);
  },
  h1: function () {
    tone(500, 0, 0.07, "triangle", 0.18, 900);
    tone(700, 0.08, 0.07, "triangle", 0.18, 1100);
    noise(0, 0.05, 4000, 1, 0.12);
  },
  h2: function () {
    tone(260, 0, 0.13, "sine", 0.22, 110);
    noise(0, 0.1, 900, 2, 0.2);
    tone(520, 0.07, 0.08, "triangle", 0.1);
  },
  h3: function () {
    tone(1047, 0, 0.09, "triangle", 0.12);
    tone(1319, 0.07, 0.09, "triangle", 0.12);
    tone(1568, 0.14, 0.16, "triangle", 0.12);
  },
  h4: function () {
    tone(110, 0, 0.22, "sine", 0.4, 55);
    noise(0, 0.08, 600, 1, 0.22);
    tone(330, 0.06, 0.1, "triangle", 0.1);
  },
  h5: function () {
    tone(784, 0, 0.28, "sine", 0.14);
    tone(988, 0.08, 0.28, "sine", 0.14);
    tone(1319, 0.16, 0.38, "sine", 0.12);
  },
  ht0: function () {
    noise(0, 0.1, 5000, 0.7, 0.14, "highpass");
    tone(600, 0.02, 0.08, "triangle", 0.18, 900);
    tone(900, 0.1, 0.1, "triangle", 0.14);
  },
  ht1: function () {
    noise(0, 0.1, 4200, 0.7, 0.14, "highpass");
    tone(440, 0.02, 0.1, "triangle", 0.18, 660);
    tone(660, 0.1, 0.12, "triangle", 0.16, 880);
  },
  ht2: function () {
    noise(0, 0.08, 3800, 0.8, 0.14, "highpass");
    tone(520, 0.02, 0.09, "triangle", 0.18, 780);
    tone(780, 0.1, 0.12, "triangle", 0.16, 1040);
  },
  egg: function () {
    tone(1200, 0, 0.06, "sine", 0.12, 1800);
    tone(900, 0.07, 0.09, "sine", 0.1, 1100);
  },
  milk: function () {
    tone(220, 0, 0.32, "sawtooth", 0.05, 150);
    tone(330, 0, 0.32, "triangle", 0.07, 230);
  },
  sell: function () {
    tone(1319, 0, 0.08, "square", 0.06);
    tone(1760, 0.07, 0.26, "square", 0.06);
    tone(2637, 0.07, 0.2, "triangle", 0.04);
  },
  level: function () {
    [523, 659, 784, 1047, 1319].forEach(function (f, i) {
      tone(f, i * 0.1, 0.26, "triangle", 0.16);
    });
    tone(1568, 0.5, 0.5, "sine", 0.1);
  },
  err: function () {
    tone(180, 0, 0.2, "sawtooth", 0.08, 110);
  },
};
/* ---- som de chuva ----
         Ruído filtrado em loop (nada de arquivo de áudio). Entra suave quando
         começa a chover e some suave quando para. Respeita o botão Sons da Config.
         Para ajustar o volume, mude RAIN_VOL (0 a 1). */
var RAIN = null,
  RAINBUF = null,
  RAIN_VOL = 0.5;
function rainStart() {
  try {
    var t = AC.currentTime,
      i;
    if (!RAINBUF) {
      var n = AC.sampleRate * 8,
        d,
        last = 0,
        w;
      RAINBUF = AC.createBuffer(1, n, AC.sampleRate);
      d = RAINBUF.getChannelData(0);
      for (i = 0; i < n; i++) {
        w = Math.random() * 2 - 1;
        last = last * 0.35 + w * 0.65;
        d[i] = last;
      }
    }
    var master = AC.createGain(),
      nodes = [];
    master.gain.setValueAtTime(0.0001, t);
    master.gain.linearRampToValueAtTime(RAIN_VOL, t + 2.5);
    master.connect(AC.destination);
    var layer = function (type, freq, q, vol, off, lfoHz, lfoDepth) {
      var s = AC.createBufferSource(),
        f = AC.createBiquadFilter(),
        g = AC.createGain();
      s.buffer = RAINBUF;
      s.loop = true;
      f.type = type;
      f.frequency.value = freq;
      f.Q.value = q;
      g.gain.value = vol;
      s.connect(f);
      f.connect(g);
      g.connect(master);
      s.start(0, off);
      nodes.push(s);
      if (lfoHz) {
        var o = AC.createOscillator(),
          og = AC.createGain();
        o.frequency.value = lfoHz;
        og.gain.value = lfoDepth;
        o.connect(og);
        og.connect(g.gain);
        o.start();
        nodes.push(o);
      }
    };
    layer("bandpass", 2200, 0.3, 0.26, 0, 0.11, 0.05); /* corpo da chuva */
    layer("bandpass", 4200, 0.7, 0.1, 2.7, 0.17, 0.04); /* gotas finas */
    layer("lowpass", 220, 0.7, 0.3, 5.1, 0.06, 0.08); /* rumor grave */
    RAIN = { master: master, nodes: nodes };
  } catch (e) {
    RAIN = null;
  }
}
function rainStop() {
  var r = RAIN;
  RAIN = null;
  if (!r) return;
  try {
    var t = AC.currentTime;
    r.master.gain.cancelScheduledValues(t);
    r.master.gain.setValueAtTime(r.master.gain.value, t);
    r.master.gain.linearRampToValueAtTime(0.0001, t + 1.8);
  } catch (e) {}
  setTimeout(function () {
    r.nodes.forEach(function (n) {
      try {
        if (n.stop) n.stop();
        n.disconnect();
      } catch (e) {}
    });
    try {
      r.master.disconnect();
    } catch (e) {}
  }, 2000);
}
function rainSync() {
  var want = !!(rainOn && S && S.snd && AC && AC.state === "running");
  if (want && !RAIN) rainStart();
  else if (!want && RAIN) rainStop();
}
var lastSfx = {};
function sfx(n) {
  if (!S || !S.snd || !AC || AC.state !== "running") return;
  var now = Date.now();
  if (now - (lastSfx[n] || 0) < 70) return;
  lastSfx[n] = now;
  try {
    SFX[n]();
  } catch (e) {}
}
function sfxFor(m) {
  if (
    /^(Faltam|Moedas insuficientes|Compre primeiro|Plante algo|Esta planta já|Este canteiro já|Acabaram|Você não tem)|libera no nível/.test(
      m,
    )
  )
    sfx("err");
  else if (/^Nível \d|^Conquista/.test(m)) sfx("level");
  else if (
    /^(Vendido|Compra feita|Missão cumprida|Você recebeu|Canteiro novo)| deu \d+ moedas/.test(
      m,
    )
  )
    sfx("sell");
}

/* animais */
var PRODS = [
  { nome: "Ovo", venda: 14, cor: "#f3e6c8" },
  { nome: "Leite", venda: 70, cor: "#e8f0ff" },
];
var EGG_MS = 90000,
  MILK_MS = 240000;
function maxHens() {
  return 2;
}
function maxCows() {
  return S.lvl >= 9 ? 2 : S.lvl >= 5 ? 1 : 0;
}
function henPrice() {
  return 60 * S.hens + 40;
}
function cowPrice() {
  return 500 + 400 * S.cows;
}
var HEN =
  '<svg viewBox="0 0 64 60" aria-hidden="true"><defs><radialGradient id="hf-b" cx=".35" cy=".28" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f1ede3"/><stop offset="1" stop-color="#bdb6a6"/></radialGradient><linearGradient id="hf-w" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fbf8f0"/><stop offset="1" stop-color="#c4bcaa"/></linearGradient><linearGradient id="hf-t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e4d8"/><stop offset="1" stop-color="#a9a290"/></linearGradient><radialGradient id="hf-c" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#ff6a5a"/><stop offset="1" stop-color="#b81818"/></radialGradient><linearGradient id="hf-l" x1="0" x2="1"><stop offset="0" stop-color="#f3b640"/><stop offset="1" stop-color="#c8801a"/></linearGradient></defs><ellipse cx="32" cy="56" rx="21" ry="3.6" fill="#000" opacity=".28"/><g stroke="url(#hf-l)" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M26 44V54M26 54l-5 2.4M26 54l.6 3.2M26 54l5 2"/></g><g stroke="#c8801a" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M37 44V54M37 54l-5 2.4M37 54l.6 3.2M37 54l5 2"/></g><ellipse cx="9" cy="25" rx="4.6" ry="12" transform="rotate(-38 9 25)" fill="url(#hf-t)"/><ellipse cx="12" cy="22" rx="4.2" ry="11.5" transform="rotate(-18 12 22)" fill="url(#hf-w)"/><ellipse cx="6.5" cy="30" rx="3.8" ry="9" transform="rotate(-58 6.5 30)" fill="#cfc8b6"/><path d="M12 31C12 19 26 15 38 19C48 22 52 31 48 41C44 50 30 53 22 50C14 47 12 39 12 31Z" fill="url(#hf-b)"/><path d="M16 42C22 52 40 54 47 42C44 50 30 53 22 50C18 48 16 45 16 42Z" fill="#8a8272" opacity=".35"/><g fill="none" stroke="#cfc8b8" stroke-width="1" stroke-linecap="round"><path d="M35 36q3 3 6 0M38 42q3 3 6 0M31 44q3 3 6 0M42 33q3 3 5 0M27 48q3 2 6 0"/></g><path d="M19 29C25 23 38 25 40 33C38 41 28 43 22 39C18 36 17 32 19 29Z" fill="url(#hf-w)" stroke="#b9b19f" stroke-width=".8"/><g fill="none" stroke="#b3ab98" stroke-width="1" stroke-linecap="round"><path d="M22 32q7-4 14 1M22 35q7-3 13 2M24 38q6-2 10 2"/></g><g class="hh"><ellipse cx="45" cy="22" rx="7.5" ry="11" transform="rotate(18 45 22)" fill="url(#hf-b)"/><path d="M46 7q0-6 4-3q1-4 4-1q3-1 3 3q0 4-4 4q-4 2-7-3z" fill="url(#hf-c)" stroke="#8a1010" stroke-width=".6"/><circle cx="51" cy="14" r="7" fill="url(#hf-b)"/><ellipse cx="53" cy="17" rx="3.4" ry="2.2" fill="#f2b8b0" opacity=".75"/><path d="M57 12.4L63.5 15L57 17.2Z" fill="#f2a52a" stroke="#b87410" stroke-width=".7" stroke-linejoin="round"/><path d="M57 15L63 15" stroke="#a86410" stroke-width=".6"/><ellipse cx="55.4" cy="20.6" rx="2" ry="3.6" fill="#d82a2a" stroke="#8a1010" stroke-width=".5"/><circle cx="53.4" cy="11.6" r="2.7" fill="#f0a830"/><circle cx="53.4" cy="11.6" r="1.8" fill="#161616"/><circle cx="52.9" cy="11" r=".6" fill="#fff"/></g></svg>';
var COW =
  '<svg viewBox="0 0 110 70" aria-hidden="true"><defs><linearGradient id="cw-b" gradientUnits="userSpaceOnUse" x1="0" y1="10" x2="0" y2="55"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#ece8df"/><stop offset="1" stop-color="#b3ad9f"/></linearGradient><linearGradient id="cw-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a423c"/><stop offset="1" stop-color="#14110e"/></linearGradient><linearGradient id="cw-l" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9c3b5"/></linearGradient><linearGradient id="cw-ld" x1="0" x2="1"><stop offset="0" stop-color="#d9d4c8"/><stop offset="1" stop-color="#99927f"/></linearGradient><radialGradient id="cw-m" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fbc9c4"/><stop offset="1" stop-color="#d98582"/></radialGradient><clipPath id="cw-c"><path d="M14 27C14 14 30 11 48 12C66 11 80 14 82 29C83 43 78 51 66 53C52 55 34 55 22 52C14 49 13 37 14 27Z"/></clipPath></defs><ellipse cx="48" cy="66" rx="38" ry="4.2" fill="#000" opacity=".28"/><path d="M31 42Q31 39 35 39Q39 39 39 42L38 60L32 60ZM63 42Q63 39 67 39Q71 39 71 42L70 60L64 60Z" fill="url(#cw-ld)"/><path d="M32 59.5h6l.6 4.6h-7.2zM64 59.5h6l.6 4.6h-7.2z" fill="#2b2420"/><g class="tl"><path d="M14 26C6 28 4 40 7 54" fill="none" stroke="#e6e1d6" stroke-width="3" stroke-linecap="round"/><path d="M14 26C6 28 4 40 7 54" fill="none" stroke="#b8b2a2" stroke-width="1" stroke-linecap="round" opacity=".6"/><ellipse cx="7" cy="56" rx="3" ry="5.4" fill="#1d1814"/></g><ellipse cx="48" cy="54" rx="7" ry="4.6" fill="#f0aaa6"/><path d="M64 16C76 9 93 14 95 27C96 36 89 43 80 42L64 46Z" fill="url(#cw-b)"/><path d="M14 27C14 14 30 11 48 12C66 11 80 14 82 29C83 43 78 51 66 53C52 55 34 55 22 52C14 49 13 37 14 27Z" fill="url(#cw-b)"/><g clip-path="url(#cw-c)"><path d="M22 10C34 6 46 12 44 22C42 32 28 32 22 26C16 20 16 12 22 10Z" fill="url(#cw-p)"/><path d="M58 30C70 26 82 34 80 46C78 56 62 56 56 48C52 42 52 33 58 30Z" fill="url(#cw-p)"/><path d="M12 38C20 34 28 40 26 48C24 56 12 56 10 48Z" fill="url(#cw-p)"/><path d="M50 16C56 14 62 18 60 24C58 28 50 28 48 23Z" fill="url(#cw-p)"/><ellipse cx="44" cy="16" rx="30" ry="5" fill="#fff" opacity=".28"/><ellipse cx="48" cy="52" rx="38" ry="8" fill="#000" opacity=".16"/></g><path d="M22 44Q22 40 27 40Q32 40 32 44L31 61L23.5 61ZM66 44Q66 40 71 40Q76 40 76 44L75 61L67.5 61Z" fill="url(#cw-l)"/><path d="M23.5 59.5h7.4l.7 5.2h-8.8zM67.5 59.5h7.4l.7 5.2h-8.8z" fill="#2b2420"/><g class="ch"><path d="M85 22C93 17 102 23 101 33C100 42 93 47 87 45C83 43 80 30 85 22Z" fill="url(#cw-b)"/><path d="M86 21C92 18 98 21 98 27C92 29 88 28 86 21Z" fill="url(#cw-p)"/><ellipse cx="99" cy="39" rx="7.4" ry="6.2" fill="url(#cw-m)"/><ellipse cx="102" cy="37.5" rx="1.3" ry="1.8" fill="#6a2e2e"/><ellipse cx="97" cy="38.4" rx="1.1" ry="1.6" fill="#6a2e2e" opacity=".8"/><path d="M95 43q4 2.4 8-.4" fill="none" stroke="#7a3a38" stroke-width=".9" stroke-linecap="round"/><circle cx="91.6" cy="27.4" r="2.6" fill="#0e0c0a"/><circle cx="91" cy="26.6" r=".8" fill="#fff"/><path d="M88.4 24.6q3-2.2 6 0" fill="none" stroke="#0e0c0a" stroke-width="1"/><path d="M86 19q-2-7-7-7q2 5 5 8z" fill="#efe0b8" stroke="#b89a5a" stroke-width=".8"/><g class="er"><ellipse cx="80" cy="25" rx="7.2" ry="3.4" transform="rotate(24 80 25)" fill="#231d19"/><ellipse cx="80.5" cy="25.4" rx="4.6" ry="1.9" transform="rotate(24 80.5 25.4)" fill="#e9a29e"/></g></g></svg>';
var flockKey = "";
function renderFlock() {
  var WD = window.innerWidth >= 760,
    k = S.hens + "/" + S.cows + "/" + S.coop + WD;
  if (k === flockKey) return;
  flockKey = k;
  $("hen").hidden = S.hens < 1;
  var cp = document.querySelector("svg.coop");
  if (cp) cp.style.display = S.coop ? "" : "none";
  ["sheep", "duck", "nest"].forEach(function (n) {
    var e = document.querySelector("svg." + n);
    if (e) e.style.display = "none";
  });
  var h = "",
    i,
    j;
  for (i = 1; i < S.hens; i++)
    h +=
      '<button class="hen" data-an="hen" aria-label="Galinha" style="left:' +
      ((WD ? 76 : 59) + (i % 3) * 5) +
      "%;top:" +
      (29 + (i % 2) * 3.5) +
      "%;animation-duration:" +
      (26 + i * 4) +
      "s;animation-delay:-" +
      i * 7 +
      's">' +
      HEN +
      "</button>";
  for (j = 0; j < S.cows; j++)
    h +=
      '<button class="cow" data-an="cow" aria-label="Vaca" style="left:' +
      ((WD ? 87 : 77) - j * 9) +
      "%;top:" +
      (34 + j * 3) +
      "%;animation-delay:-" +
      j * 2 +
      's">' +
      COW +
      "</button>";
  $("flock").innerHTML = h;
}
function appPop(el, txt) {
  var ar = $("app").getBoundingClientRect(),
    r = el.getBoundingClientRect(),
    e = document.createElement("div");
  e.className = "float";
  e.textContent = txt;
  e.style.zIndex = 6;
  e.style.left = r.left - ar.left + "px";
  e.style.top = r.top - ar.top - 14 + "px";
  $("app").appendChild(e);
  setTimeout(function () {
    e.remove();
  }, 950);
}
function animals(dt) {
  if (dt <= 0) return;
  var n = 0,
    m = 0;
  S.eggT += dt * S.hens;
  n = Math.floor(S.eggT / EGG_MS);
  S.eggT -= n * EGG_MS;
  if (S.cows > 0) {
    S.milkT += dt * S.cows;
    m = Math.floor(S.milkT / MILK_MS);
    S.milkT -= m * MILK_MS;
  }
  var antes = S.eggsLaid || 0;
  S.eggsLaid = antes + n;
  if (antes < 2 && S.eggsLaid >= 2) {
    toast("Nasceu um pintinho!");
    log("Um pintinho nasceu no galinheiro.");
  }
  S.prod[0] += n;
  S.prod[1] += m;
  if (dt < 5000) {
    if (n) {
      appPop($("hen"), "+" + n + (n > 1 ? " ovos" : " ovo"));
      sfx("egg");
    }
    if (m) {
      var c = document.querySelector(".cow");
      if (c) appPop(c, "+" + m + " leite");
      sfx("milk");
    }
  }
}
function animalInfo(k) {
  if (k === "cow")
    toast(
      "Vacas: " +
        S.cows +
        " · próximo leite em " +
        fmt((MILK_MS - S.milkT) / S.cows / 1000) +
        ".",
    );
  else
    toast(
      "Có có! Galinhas: " +
        S.hens +
        " · próximo ovo em " +
        fmt((EGG_MS - S.eggT) / S.hens / 1000) +
        ".",
    );
}

/* sprites */
function lf(x, y, a, l, w, fill) {
  w = w || l * 0.4;
  var t = "translate(" + x + " " + y + ") rotate(" + a + ")";
  return (
    '<path transform="' +
    t +
    '" d="M0 0C' +
    w +
    " " +
    -l * 0.3 +
    " " +
    w * 0.7 +
    " " +
    -l * 0.85 +
    " 0 " +
    -l +
    "C" +
    -w * 0.7 +
    " " +
    -l * 0.85 +
    " " +
    -w +
    " " +
    -l * 0.3 +
    ' 0 0Z" fill="' +
    (fill || "url(#leafg)") +
    '" stroke="#2f6a14" stroke-width="1.6" stroke-linejoin="round"/><path transform="' +
    t +
    '" d="M0 -2L0 ' +
    -l * 0.75 +
    '" stroke="#3f8a1f" stroke-width="1"/>'
  );
}
function dot(x, y, r, f, k) {
  return (
    '<circle cx="' +
    x +
    '" cy="' +
    y +
    '" r="' +
    r +
    '" fill="' +
    f +
    '" stroke="' +
    k +
    '" stroke-width="1.6"/>'
  );
}
function berry(x, y) {
  var t = 'transform="translate(' + x + " " + y + ')"';
  return (
    "<path " +
    t +
    ' d="M0 -7C7 -9 10 -1 0 9C-10 -1 -7 -9 0 -7Z" fill="#e8284e" stroke="#8a1030" stroke-width="1.5"/><path ' +
    t +
    ' d="M-3 -2h.1M2 1h.1M-1 4h.1M3 -3h.1" stroke="#ffe27a" stroke-width="1.8" stroke-linecap="round"/><path ' +
    t +
    ' d="M-4 -7L0 -4L4 -7L0 -10Z" fill="#3f8a1f"/>'
  );
}
var UNRIPE = {
  "#f28a1e": "#a6d65e",
  "#ffd93a": "#bfe070",
  "#e8392e": "#93d05a",
  "#e8284e": "#bfe58c",
  "#f5921e": "#8fcf52",
  "#ffd21f": "#a4d85c",
};
function unripe(s) {
  return s.replace(/#[0-9a-f]{6}/gi, function (m) {
    return UNRIPE[m.toLowerCase()] || m;
  });
}
function prodSVG(c) {
  var s = "",
    i;
  if (c.nome === "Cenoura") {
    s +=
      '<ellipse cx="42" cy="88" rx="7" ry="4.5" fill="#f28a1e" stroke="#9a4a0a" stroke-width="1.6"/><ellipse cx="58" cy="88" rx="7" ry="4.5" fill="#f28a1e" stroke="#9a4a0a" stroke-width="1.6"/><ellipse cx="40" cy="86.5" rx="2.5" ry="1.2" fill="#fff" opacity=".5"/>';
  } else if (c.nome === "Milho") {
    s +=
      '<path d="M50 38l-7-12M50 38v-14M50 38l7-12" stroke="#d8b84a" stroke-width="2" stroke-linecap="round"/><g transform="translate(60 54) rotate(20)"><path d="M0 0C-8 4 -8 22 0 28C8 22 8 4 0 0Z" fill="#ffd93a" stroke="#9a7a0a" stroke-width="1.6"/><path d="M-3 6v16M3 6v16" stroke="#e0b41a" stroke-width="1.2"/><path d="M-9 30Q-4 14 0 0Q4 14 9 30Q0 24 -9 30Z" fill="#6cc03a" stroke="#2f6a14" stroke-width="1.4"/></g>';
  } else if (c.nome === "Tomate") {
    [
      [34, 66],
      [64, 60],
      [49, 78],
    ].forEach(function (q) {
      s +=
        dot(q[0], q[1], 8, "#e8392e", "#8a1a14") +
        '<circle cx="' +
        (q[0] - 3) +
        '" cy="' +
        (q[1] - 3) +
        '" r="2.2" fill="#fff" opacity=".6"/><path d="M' +
        (q[0] - 4) +
        " " +
        (q[1] - 7) +
        "L" +
        q[0] +
        " " +
        (q[1] - 4) +
        "L" +
        (q[0] + 4) +
        " " +
        (q[1] - 7) +
        "L" +
        q[0] +
        " " +
        (q[1] - 10) +
        'Z" fill="#3f8a1f"/>';
    });
  } else if (c.nome === "Morango") {
    s += berry(34, 70) + berry(64, 66) + berry(49, 80);
    for (i = 0; i < 5; i++)
      s += dot(
        52 + 5 * Math.cos(i * 1.2566),
        56 + 5 * Math.sin(i * 1.2566),
        3.2,
        "#fff",
        "#9a9a9a",
      );
    s += dot(52, 56, 2.4, "#ffd93a", "#a87a0a");
  } else if (c.nome === "Abóbora") {
    s +=
      lf(24, 74, -70, 26) +
      lf(78, 76, 70, 26) +
      '<ellipse cx="50" cy="74" rx="26" ry="17" fill="#f5921e" stroke="#8a4a08" stroke-width="2"/><path d="M38 59Q33 74 38 89M50 57Q46 74 50 91M62 59Q67 74 62 89" fill="none" stroke="#c8700f" stroke-width="2"/><ellipse cx="40" cy="67" rx="4" ry="2.2" fill="#fff" opacity=".4"/><rect x="47" y="50" width="7" height="10" rx="2" fill="#5c9a2a" stroke="#2f6a14" stroke-width="1.5"/><path d="M54 52q8-2 8 5" fill="none" stroke="#3f8a1f" stroke-width="2"/>';
  } else {
    for (i = 0; i < 12; i++)
      s +=
        '<ellipse cx="50" cy="17" rx="5.5" ry="11" transform="rotate(' +
        i * 30 +
        ' 50 34)" fill="#ffd21f" stroke="#a87a0a" stroke-width="1.2"/>';
    s +=
      '<circle cx="50" cy="34" r="11" fill="#6a4220" stroke="#3a220e" stroke-width="2"/><circle cx="46" cy="31" r="1.6" fill="#a0703a"/><circle cx="53" cy="30" r="1.6" fill="#a0703a"/><circle cx="50" cy="37" r="1.6" fill="#a0703a"/>';
  }
  return s;
}
/* estágios: 0 semente, 1 broto, 2 mudinha, 3 folhagem, 4 frutos verdes, 5 madura */
function onePlant(c, st) {
  var tall = c.nome === "Milho" || c.tipo === "flor",
    s = "";
  if (st === 0)
    return '<ellipse cx="50" cy="86" rx="17" ry="7" fill="#7a4a24" stroke="#3f2410" stroke-width="2"/><ellipse cx="45" cy="83" rx="7" ry="2.5" fill="#a8703c"/><ellipse cx="55" cy="87" rx="4" ry="1.6" fill="#5a3418"/>';
  s = '<ellipse cx="50" cy="90" rx="15" ry="5" fill="#4d2d14" opacity=".5"/>';
  if (st === 1)
    return s + lf(50, 88, -30, 15) + lf(50, 88, 30, 15) + lf(50, 88, 0, 11);
  if (st === 2)
    return s + lf(50, 88, -38, 26) + lf(50, 88, 38, 26) + lf(50, 88, 0, 20);
  var g = st === 3 ? 0.8 : 1;
  s += '<g transform="translate(50 88) scale(' + g + ') translate(-50 -88)">';
  if (tall) {
    s +=
      '<path d="M50 88L50 38" stroke="#2f6a14" stroke-width="7" stroke-linecap="round"/><path d="M50 88L50 38" stroke="#6fcb38" stroke-width="3.5" stroke-linecap="round"/>';
    s +=
      lf(50, 84, -62, 34) +
      lf(50, 84, 62, 34) +
      lf(50, 66, -55, 30) +
      lf(50, 66, 55, 30);
    if (st === 3 && c.tipo === "flor")
      s += dot(50, 34, 7, "#78c93a", "#2f6a14");
  } else
    s +=
      lf(50, 88, -62, 34) +
      lf(50, 88, 62, 34) +
      lf(50, 88, -28, 44) +
      lf(50, 88, 28, 44) +
      lf(50, 88, 0, 50);
  s += "</g>";
  if (st === 3) return s;
  if (st === 4) {
    var o =
      c.tipo === "flor"
        ? "translate(50 38) scale(.62) translate(-50 -34)"
        : "translate(50 84) scale(.6) translate(-50 -84)";
    return s + '<g transform="' + o + '">' + unripe(prodSVG(c)) + "</g>";
  }
  return s + prodSVG(c);
}
function plantSVG(c, st) {
  var P = [
      [28, 70, 0.42],
      [72, 68, 0.42],
      [50, 88, 0.6],
    ],
    s = '<svg viewBox="0 0 100 100" aria-hidden="true">';
  P.forEach(function (q) {
    s +=
      '<g transform="translate(' +
      (q[0] - 50 * q[2]) +
      " " +
      (q[1] - 88 * q[2]) +
      ") scale(" +
      q[2] +
      ')">' +
      onePlant(c, st) +
      "</g>";
  });
  if (st === 5)
    s +=
      '<path class="gl" d="M84 12l2.4 7 7 2.4-7 2.4-2.4 7-2.4-7-7-2.4 7-2.4z" fill="#fff8c0"/><path class="gl g2" d="M14 34l1.6 4.6 4.6 1.6-4.6 1.6-1.6 4.6-1.6-4.6-4.6-1.6 4.6-1.6z" fill="#fff8c0"/>';
  return s + "</svg>";
}
/* sprite da árvore. st 0 muda, 1 jovem, 2 adulta sem frutas, 3 com frutas */
function treeSVG(ti, st) {
  var T = TREES[ti],
    s =
      '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="tg' +
      ti +
      '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="' +
      T.luz +
      '"/><stop offset=".55" stop-color="' +
      T.copa +
      '"/><stop offset="1" stop-color="' +
      T.sombra +
      '"/></radialGradient><linearGradient id="tk" x1="0" x2="1"><stop offset="0" stop-color="#b98350"/><stop offset="1" stop-color="#6e4526"/></linearGradient></defs><ellipse cx="50" cy="90" rx="24" ry="6" fill="#000" opacity=".18"/>';
  if (st === 0) {
    s +=
      '<rect x="48" y="68" width="4" height="22" rx="2" fill="#9a6a3a" stroke="#4a2f1c" stroke-width="1.5"/>' +
      lf(50, 72, -40, 24, null, T.copa) +
      lf(50, 72, 40, 24, null, T.copa) +
      lf(50, 72, 0, 30, null, T.copa);
    return s + "</svg>";
  }
  var k = st === 1 ? 0.7 : 1,
    cy = 88 - 52 * k;
  s +=
    '<rect x="44" y="' +
    (88 - 46 * k) +
    '" width="12" height="' +
    46 * k +
    '" rx="3" fill="url(#tk)" stroke="#4a2f1c" stroke-width="2"/>';
  [
    [50, cy, 26 * k],
    [30, cy + 16 * k, 18 * k],
    [70, cy + 16 * k, 18 * k],
  ].forEach(function (q) {
    s += dot(q[0], q[1], q[2], "url(#tg" + ti + ")", "#1f5a14");
  });
  s +=
    '<circle cx="' +
    (50 - 9 * k) +
    '" cy="' +
    (cy - 9 * k) +
    '" r="' +
    8 * k +
    '" fill="#fff" opacity=".2"/>';
  if (st === 4)
    [
      [38, 30],
      [60, 24],
      [50, 44],
      [28, 50],
      [72, 50],
    ].forEach(function (q) {
      s += dot(q[0], q[1], 3.4, "#a6d65e", "#4a8a1f");
    });
  if (st === 3)
    [
      [38, 30],
      [60, 24],
      [50, 44],
      [28, 50],
      [72, 50],
    ].forEach(function (q) {
      s +=
        dot(q[0], q[1], 6, T.cor, T.borda) +
        '<circle cx="' +
        (q[0] - 2) +
        '" cy="' +
        (q[1] - 2) +
        '" r="1.6" fill="#fff" opacity=".6"/>';
    });
  return s + "</svg>";
}
var SCARE =
  '<svg viewBox="0 0 80 100" aria-hidden="true"><defs><linearGradient id="sc-w" x1="0" x2="1"><stop offset="0" stop-color="#b98350"/><stop offset="1" stop-color="#7a4e28"/></linearGradient><radialGradient id="sc-h" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffe9b0"/><stop offset="1" stop-color="#e0b060"/></radialGradient><linearGradient id="sc-s" x1="0" x2="1"><stop offset="0" stop-color="#5d8fd6"/><stop offset="1" stop-color="#2f5fa8"/></linearGradient></defs><ellipse cx="40" cy="95" rx="22" ry="4.5" fill="#000" opacity=".25"/><g stroke="#3a2418" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><rect x="36" y="36" width="8" height="58" rx="2.5" fill="url(#sc-w)"/><rect x="8" y="42" width="64" height="8" rx="3.5" fill="url(#sc-w)"/><path d="M20 44L12 66L28 66Z" fill="#e8c35a" stroke-width="2"/><path d="M60 44L52 66L68 66Z" fill="#e8c35a" stroke-width="2"/><path d="M26 46H54L58 80H22Z" fill="url(#sc-s)"/><path d="M30 60h8v8h-8z" fill="#e8c35a" stroke-width="1.6"/><path d="M8 50l-3 8M12 50l-1 8M72 50l3 8M68 50l1 8" stroke="#c9a23a" stroke-width="2"/><circle cx="40" cy="30" r="12" fill="url(#sc-h)"/><path d="M33 29h.1M47 29h.1" stroke="#3a2418" stroke-width="3.4"/><path d="M34 36q6 4 12 0" fill="none" stroke-width="2"/><path d="M26 22H54L50 15Q40 9 30 15Z" fill="#7a4e28"/><path d="M22 24H58Q40 19 22 24Z" fill="#5c3818"/><path d="M28 18Q40 12 52 18" fill="none" stroke="#e8c35a" stroke-width="2.4"/></g></svg>';
var WEED =
  '<svg class="wd" viewBox="0 0 26 26" aria-hidden="true"><path d="M13 24 C13 14 8 9 3 6 C10 6 13 11 13 16 C13 9 16 4 23 3 C18 8 15 14 13 24z" fill="#3b7a2a" stroke="#1f4a15" stroke-width="1.5"/></svg>';
var LOCK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';
function frac(p) {
  return Math.min(1, p.pr / (CROPS[p.c].tempo * 1000));
}
function stageOf(f) {
  return f < 0.12
    ? 0
    : f < 0.3
      ? 1
      : f < 0.5
        ? 2
        : f < 0.75
          ? 3
          : f < 1
            ? 4
            : 5;
}
/* árvores */
function tReady(p) {
  return p.m && p.rb >= TREES[p.t].rebrota * 1000;
}
function tFrac(p) {
  var T = TREES[p.t];
  return p.m
    ? Math.min(1, p.rb / (T.rebrota * 1000))
    : Math.min(1, p.pr / (T.tempo * 1000));
}
function tStage(p) {
  if (!p.m) return p.pr / (TREES[p.t].tempo * 1000) < 0.35 ? 0 : 1;
  return tReady(p) ? 3 : tFrac(p) >= 0.5 ? 4 : 2;
}
function selInfo() {
  if (S.sel >= 10 && TREES[S.sel - 10])
    return { nome: TREES[S.sel - 10].nome, cor: TREES[S.sel - 10].cor };
  return { nome: CROPS[S.sel].nome, cor: CROPS[S.sel].cor };
}
function unlockedCount() {
  return S.plots.filter(function (p) {
    return p.on;
  }).length;
}
function price() {
  var k = unlockedCount() - 9;
  return 50 + 22 * k + 5 * k * k;
}
function adj(i) {
  var r = Math.floor(i / R),
    c = i % R,
    a = [];
  if (r > 0) a.push(i - R);
  if (r < R - 1) a.push(i + R);
  if (c > 0) a.push(i - 1);
  if (c < R - 1) a.push(i + 1);
  return a.some(function (j) {
    return S.plots[j].on;
  });
}

/* construção */
function build() {
  var f = $("field");
  for (var i = 0; i < N; i++) {
    var w = document.createElement("div");
    w.className = "pw";
    var b = document.createElement("button");
    b.className = "tile";
    b.dataset.i = i;
    var o = document.createElement("div");
    o.className = "ov";
    w.appendChild(b);
    w.appendChild(o);
    f.appendChild(w);
    btns.push({ w: w, b: b, o: o, k: "" });
  }
  $("menu").innerHTML = MENU.map(function (m) {
    return (
      '<button class="mi" data-p="' +
      m[0] +
      '" aria-label="' +
      m[1] +
      '"><svg viewBox="0 0 24 24" aria-hidden="true">' +
      ICONS[m[0]] +
      "</svg><span>" +
      m[1] +
      '</span><span class="bdg" id="bd-' +
      m[0] +
      '" hidden></span></button>'
    );
  }).join("");
}
function layout() {
  var app = $("app"),
    W = app.clientWidth,
    H = app.clientHeight;
  var tw = Math.floor(Math.max(44, Math.min((W * 0.96) / R, (H - 300) / 3)));
  var f = $("field");
  f.style.setProperty("--tw", tw + "px");
  f.style.width = R * tw + "px";
  f.style.height = 3 * tw + "px";
  var ft = Math.max(
    106 + tw * 0.5,
    (96 + (H - 190)) / 2 - 1.5 * tw + tw * 0.15,
  );
  f.style.top = ft + "px";
  var sc = $("scare");
  var sw = tw * 0.62,
    fl = f.getBoundingClientRect().left - app.getBoundingClientRect().left;
  sc.style.width = sw + "px";
  sc.style.left = Math.max(4, fl + tw * 0.4 - sw / 2) + "px";
  sc.style.top = ft + tw * 0.6 - sw * 1.19 + "px";
  btns.forEach(function (x, i) {
    var r = Math.floor(i / R),
      c = i % R;
    x.w.style.left = (R * tw) / 2 + ((c - r) * tw) / 2 - tw / 2 + "px";
    x.w.style.top = ((c + r) * tw) / 4 + "px";
  });
}
function updateSky() {
  var d = new Date(),
    h = d.getHours() + d.getMinutes() / 60,
    m = S.time,
    ph;
  if (m === "day") {
    ph = "day";
    h = 12;
  } else if (m === "night") {
    ph = "night";
    h = 23;
  } else
    ph =
      h >= 6.5 && h < 17
        ? "day"
        : h >= 17 && h < 19
          ? "dusk"
          : h >= 5 && h < 6.5
            ? "dawn"
            : "night";
  $("app").setAttribute("data-phase", ph);
  var isDay = ph !== "night",
    t;
  if (isDay) t = Math.max(0, Math.min(1, (h - 5.5) / 14));
  else {
    var hh = h >= 19.5 ? h - 19.5 : h + 4.5;
    t = Math.max(0, Math.min(1, hh / 10));
  }
  var o = isDay ? $("sun") : $("moon");
  $("sun").hidden = !isDay;
  $("moon").hidden = isDay;
  o.style.left = 6 + t * 88 + "%";
  o.style.top = 13 - Math.sin(Math.PI * t) * 10 + "%";
}

/* renderização */
function render() {
  renderFlock();
  $("scare").hidden = !S.scare;
  $("coins").textContent = S.coins;
  $("farm").textContent = S.name;
  $("lvl").textContent = S.lvl;
  $("xptxt").textContent = S.xp + " / " + need(S.lvl) + " XP";
  $("xpbar").style.width = (100 * S.xp) / need(S.lvl) + "%";
  var pr = price();
  S.plots.forEach(function (p, i) {
    var x = btns[i],
      b = x.b,
      o = x.o,
      k,
      ov = "",
      cls = "tile",
      lab;
    if (!p.on) {
      var buy = adj(i),
        armed = armedTile === i;
      k = "L" + buy + armed + pr;
      if (x.k === k) return;
      x.k = k;
      cls += " lock" + (buy ? " buy" : "") + (armed ? " armed" : "");
      ov = '<div class="lk">' + LOCK + (buy ? pr : "") + "</div>";
      lab = buy
        ? "Comprar canteiro por " + pr + " moedas"
        : "Canteiro bloqueado";
    } else if (isEmpty(p)) {
      k = "E";
      if (x.k === k) return;
      x.k = k;
      lab = "Canteiro vazio";
    } else if (isTree(p)) {
      var T = TREES[p.t],
        tf = tFrac(p),
        ts = tStage(p),
        tr = ts === 3;
      k = "T" + p.t + ts + (tr ? "r" : Math.floor(tf * 100));
      if (x.k === k) return;
      x.k = k;
      ov =
        '<div class="spr' +
        (tr ? " bob" : "") +
        '">' +
        treeSVG(p.t, ts) +
        "</div>" +
        (tr
          ? '<div class="badge">!</div>'
          : '<div class="pbar"><i style="width:' + tf * 100 + '%"></i></div>');
      lab =
        T.nome +
        (tr
          ? ", com " + T.fruto.toLowerCase() + "s prontas"
          : p.m
            ? ", dando frutas de novo"
            : ", crescendo");
    } else {
      var c = CROPS[p.c],
        fr = frac(p),
        st = stageOf(fr),
        ripe = fr >= 1;
      k = "P" + p.c + st + (ripe ? "r" : Math.floor(fr * 100)) + p.w;
      if (x.k === k) return;
      x.k = k;
      ov =
        '<div class="spr' +
        (ripe ? " bob" : "") +
        '">' +
        plantSVG(c, st) +
        "</div>" +
        (p.w ? WEED : "") +
        (ripe
          ? '<div class="badge">!</div>'
          : '<div class="pbar"><i style="width:' + fr * 100 + '%"></i></div>');
      lab =
        c.nome +
        (ripe
          ? ", pronto para colher"
          : p.w
            ? ", com ervas daninhas"
            : ", crescendo");
    }
    x.w.className = "pw" + (p.on ? " bed" : "");
    b.className = cls;
    b.setAttribute("aria-label", lab);
    o.innerHTML = ov;
  });
  var si = selInfo();
  $("tools").innerHTML =
    '<button class="tb" data-t="seed" aria-label="Semente escolhida"><span class="dot" style="background:' +
    si.cor +
    '"></span>' +
    si.nome +
    "</button>" +
    '<button class="tb" data-t="hand" aria-pressed="' +
    (S.tool === "hand") +
    '">Mão</button>' +
    '<button class="tb" data-t="fert" aria-pressed="' +
    (S.tool === "fert") +
    '">Fertilizante (' +
    S.fert +
    ")</button>" +
    '<button class="tb" data-t="harvest">Colher tudo</button>' +
    '<button class="tb" data-t="clean">Limpar tudo</button>';
  var mails = S.mail.filter(function (m) {
    return !m.got;
  }).length;
  var qs = QUESTS.filter(function (q) {
    return !S.qdone[q.id] && q.g() >= q.m;
  }).length;
  badge("correio", mails);
  badge("missoes", qs);
  tutRender();
}
function badge(id, n) {
  var e = $("bd-" + id);
  e.hidden = !n;
  e.textContent = n;
}
function pop(i, txt) {
  var w = btns[i].w,
    e = document.createElement("div");
  e.className = "float";
  e.textContent = txt;
  e.style.left = w.offsetLeft + w.offsetWidth / 2 - 10 + "px";
  e.style.top = w.offsetTop - w.offsetWidth * 0.3 + "px";
  $("field").appendChild(e);
  setTimeout(function () {
    e.remove();
  }, 950);
}

/* animações */
function rm() {
  return !!(
    window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
function mk(css) {
  var d = document.createElement("div");
  d.style.cssText = "position:absolute;pointer-events:none;" + css;
  return d;
}
function dirt(i) {
  if (rm()) return;
  var w = btns[i].w,
    f = $("field"),
    cx = w.offsetLeft + w.offsetWidth / 2,
    cy = w.offsetTop + w.offsetHeight / 2,
    cols = ["#6b4222", "#8a5a30", "#4d2d14"],
    k;
  for (k = 0; k < 8; k++) {
    var sz = 5 + Math.random() * 4,
      d = mk(
        "z-index:3;left:" +
          (cx - sz / 2) +
          "px;top:" +
          (cy - sz / 2) +
          "px;width:" +
          sz +
          "px;height:" +
          sz +
          "px;border-radius:50%;background:" +
          cols[k % 3],
      );
    f.appendChild(d);
    if (!d.animate) {
      d.remove();
      continue;
    }
    var dx = (Math.random() - 0.5) * w.offsetWidth * 0.8,
      up = 14 + Math.random() * 18;
    d.animate(
      [
        { transform: "translate(0,0)", opacity: 1 },
        {
          transform: "translate(" + dx * 0.6 + "px," + -up + "px)",
          opacity: 1,
          offset: 0.45,
        },
        { transform: "translate(" + dx + "px,6px)", opacity: 0 },
      ],
      { duration: 520, easing: "ease-out" },
    ).onfinish = (function (e) {
      return function () {
        e.remove();
      };
    })(d);
  }
  setTimeout(function () {
    var s = btns[i].o.querySelector(".spr");
    if (s && s.animate) {
      s.style.transformOrigin = "50% 90%";
      s.animate(
        [
          { transform: "scale(.3)" },
          { transform: "scale(1.15)" },
          { transform: "scale(1)" },
        ],
        { duration: 320, easing: "ease-out" },
      );
    }
  }, 40);
}
function bump(el) {
  if (el && el.animate)
    el.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.3)" },
        { transform: "scale(1)" },
      ],
      { duration: 280 },
    );
}
function target() {
  return document.querySelector('.mi[data-p="armazem"]');
}
function flyEl(c, r, t, delay) {
  var ar = $("app").getBoundingClientRect(),
    dx = t.left + t.width / 2 - r.left - r.width / 2,
    dy = t.top + t.height / 2 - r.top - r.height / 2;
  c.style.cssText +=
    ";position:absolute;z-index:7;pointer-events:none;margin:0;left:" +
    (r.left - ar.left) +
    "px;top:" +
    (r.top - ar.top) +
    "px;width:" +
    r.width +
    "px;height:" +
    r.height +
    "px";
  $("app").appendChild(c);
  if (!c.animate) {
    c.remove();
    return;
  }
  var a = c.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      {
        transform: "translate(" + dx * 0.25 + "px,-46px) scale(1.12)",
        opacity: 1,
        offset: 0.35,
      },
      {
        transform: "translate(" + dx + "px," + dy + "px) scale(.25)",
        opacity: 0.3,
      },
    ],
    { duration: 760, delay: delay || 0, easing: "ease-in", fill: "both" },
  );
  a.onfinish = function () {
    c.remove();
    bump(target());
  };
}
function flyPlant(i) {
  if (rm()) return;
  var spr = btns[i].o.querySelector(".spr"),
    tg = target();
  if (!spr || !tg) return;
  var c = spr.cloneNode(true);
  c.className = "fly";
  flyEl(c, spr.getBoundingClientRect(), tg.getBoundingClientRect(), 0);
}
function flyFruit(i, cor, n) {
  if (rm()) return;
  var spr = btns[i].o.querySelector(".spr"),
    tg = target();
  if (!spr || !tg) return;
  var r = spr.getBoundingClientRect(),
    k;
  for (k = 0; k < n; k++) {
    var c = document.createElement("div");
    c.style.cssText =
      "border-radius:50%;border:2px solid rgba(0,0,0,.35);background:" + cor;
    flyEl(
      c,
      {
        left: r.left + r.width / 2 - 8 + (k - (n - 1) / 2) * 12,
        top: r.top + r.height * 0.25,
        width: 16,
        height: 16,
      },
      tg.getBoundingClientRect(),
      k * 90,
    );
  }
}
function confetti() {
  if (rm()) return;
  var app = $("app"),
    W = app.clientWidth,
    H = app.clientHeight,
    cols = ["#ffd93a", "#ff5a7a", "#4cc2ff", "#7be04a", "#c28bff", "#ff9a3a"],
    k;
  for (k = 0; k < 36; k++) {
    var d = mk(
      "z-index:11;left:" +
        W / 2 +
        "px;top:" +
        H * 0.3 +
        "px;width:8px;height:12px;border-radius:2px;background:" +
        cols[k % cols.length],
    );
    app.appendChild(d);
    if (!d.animate) {
      d.remove();
      continue;
    }
    var dx = (Math.random() - 0.5) * W * 0.9,
      up = 60 + Math.random() * 120,
      rot = (Math.random() - 0.5) * 900;
    d.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        {
          transform:
            "translate(" +
            dx * 0.5 +
            "px," +
            -up +
            "px) rotate(" +
            rot * 0.4 +
            "deg)",
          opacity: 1,
          offset: 0.3,
        },
        {
          transform:
            "translate(" + dx + "px," + H * 0.65 + "px) rotate(" + rot + "deg)",
          opacity: 0.9,
        },
      ],
      {
        duration: 1500 + Math.random() * 900,
        easing: "cubic-bezier(.3,.6,.5,1)",
      },
    ).onfinish = (function (e) {
      return function () {
        e.remove();
      };
    })(d);
  }
}

/* regras */
function addXp(n) {
  S.xp += n;
  while (S.xp >= need(S.lvl)) {
    S.xp -= need(S.lvl);
    S.lvl++;
    var nc = CROPS.filter(function (c) {
      return c.lvl === S.lvl;
    })[0];
    var nt = TREES.filter(function (c) {
      return c.lvl === S.lvl;
    })[0];
    toast(
      "Nível " +
        S.lvl +
        "!" +
        (nc ? " Nova semente: " + nc.nome + "." : "") +
        (nt ? " Nova árvore: " + nt.nome + "." : ""),
    );
    log("Você subiu para o nível " + S.lvl + ".");
    confetti();
    addMail(
      "Presente de nível",
      "Parabéns por chegar ao nível " + S.lvl + ". Aqui vai um agrado.",
      Math.min(150, 12 * S.lvl),
      0,
    );
  }
}
function checkAch() {
  ACH.forEach(function (a) {
    if (!S.ach[a.id] && a.ok()) {
      S.ach[a.id] = 1;
      toast("Conquista: " + a.n);
      log("Conquista desbloqueada: " + a.n + ".");
    }
  });
}
function harvest(i) {
  var p = S.plots[i],
    c = CROPS[p.c];
  S.inv[p.c]++;
  S.stats.harvested++;
  S.stats.hb[p.c]++;
  addXp(c.xp);
  pop(i, "+1");
  sfx("h" + p.c);
  flyPlant(i);
  p.c = -1;
  p.pr = 0;
  p.w = false;
  p.f = false;
}
function harvestTree(i) {
  var p = S.plots[i],
    T = TREES[p.t];
  S.tinv[p.t] += T.frutos;
  S.stats.harvested++;
  S.stats.tfruit = (S.stats.tfruit || 0) + 1;
  addXp(T.xp);
  pop(i, "+" + T.frutos);
  sfx("ht" + p.t);
  flyFruit(i, T.cor, T.frutos);
  p.rb = 0;
  p.f = false;
}
function act(i) {
  var p = S.plots[i];
  if (!p.on) {
    if (!adj(i)) {
      toast("Compre primeiro um canteiro vizinho aos que você já tem.");
      return;
    }
    var pr = price();
    if (armedTile !== i) {
      armedTile = i;
      clearTimeout(armedT);
      armedT = setTimeout(function () {
        armedTile = -1;
        render();
      }, 3000);
      toast("Comprar este canteiro por " + pr + " moedas? Toque de novo.");
      return;
    }
    if (S.coins < pr) {
      toast("Faltam " + (pr - S.coins) + " moedas.");
      return;
    }
    S.coins -= pr;
    p.on = true;
    S.stats.bought++;
    armedTile = -1;
    log("Você comprou um canteiro novo.");
    toast("Canteiro novo!");
    return;
  }
  if (S.tool === "fert") {
    if (isEmpty(p)) {
      toast("Plante algo antes de usar fertilizante.");
      return;
    }
    if (isTree(p)) {
      var TT = TREES[p.t];
      if (p.m && tReady(p)) {
        toast("Esta planta já está pronta.");
        return;
      }
      if (p.f) {
        toast("Este canteiro já foi fertilizado.");
        return;
      }
      if (S.fert <= 0) {
        S.tool = "hand";
        toast("Acabaram os fertilizantes.");
        return;
      }
      S.fert--;
      p.f = true;
      S.stats.fertUsed++;
      if (!p.m) {
        p.pr = Math.min(TT.tempo * 1000, p.pr + TT.tempo * 500);
        if (p.pr >= TT.tempo * 1000) {
          p.m = true;
          p.rb = TT.rebrota * 1000;
        }
      } else p.rb = Math.min(TT.rebrota * 1000, p.rb + TT.rebrota * 500);
      pop(i, "+50%");
      if (S.fert <= 0) S.tool = "hand";
      return;
    }
    if (frac(p) >= 1) {
      toast("Esta planta já está pronta.");
      return;
    }
    if (p.f) {
      toast("Este canteiro já foi fertilizado.");
      return;
    }
    if (S.fert <= 0) {
      S.tool = "hand";
      toast("Acabaram os fertilizantes.");
      return;
    }
    S.fert--;
    p.f = true;
    S.stats.fertUsed++;
    p.pr = Math.min(CROPS[p.c].tempo * 1000, p.pr + CROPS[p.c].tempo * 500);
    pop(i, "+50%");
    if (S.fert <= 0) S.tool = "hand";
    return;
  }
  if (isEmpty(p)) {
    if (S.sel >= 10) {
      var T = TREES[S.sel - 10];
      if (S.lvl < T.lvl) {
        toast(T.nome + " libera no nível " + T.lvl + ".");
        return;
      }
      if (S.coins < T.custo) {
        toast("Moedas insuficientes para " + T.nome + ".");
        return;
      }
      S.coins -= T.custo;
      S.stats.planted++;
      sfx("plant");
      dirt(i);
      p.t = S.sel - 10;
      p.c = -1;
      p.pr = 0;
      p.m = false;
      p.rb = 0;
      p.w = false;
      p.f = false;
      return;
    }
    var c = CROPS[S.sel];
    if (S.lvl < c.lvl) {
      toast(c.nome + " libera no nível " + c.lvl + ".");
      return;
    }
    if (S.coins < c.custo) {
      toast("Moedas insuficientes para " + c.nome + ".");
      return;
    }
    S.coins -= c.custo;
    S.stats.planted++;
    sfx("plant");
    dirt(i);
    p.c = S.sel;
    p.t = -1;
    p.pr = 0;
    p.w = false;
    p.f = false;
    return;
  }
  if (isTree(p)) {
    if (tReady(p)) {
      harvestTree(i);
      return;
    }
    var TR = TREES[p.t];
    toast(
      TR.nome +
        ": " +
        (p.m
          ? "frutas em " + fmt(TR.rebrota - p.rb / 1000)
          : "faltam " + fmt(TR.tempo - p.pr / 1000) + " para crescer") +
        ".",
    );
    return;
  }
  if (p.w) {
    p.w = false;
    S.stats.cleaned++;
    S.coins += 2;
    addXp(2);
    pop(i, "+2");
    return;
  }
  if (frac(p) >= 1) {
    harvest(i);
    return;
  }
  toast(
    CROPS[p.c].nome + ": faltam " + fmt(CROPS[p.c].tempo - p.pr / 1000) + ".",
  );
}
function tick() {
  var now = Date.now(),
    dt = Math.min(now - S.last, 12 * 3600 * 1000);
  S.last = now;
  wxUpdate();
  if (dt < 5000 && Math.random() < dt / 300000) bflySpawn();
  animals(dt);
  S.plots.forEach(function (p) {
    if (!p.on) return;
    var mul = rainOn && dt < 5000 ? 1.2 : 1;
    if (isTree(p)) {
      var T = TREES[p.t];
      if (!p.m) {
        p.pr = Math.min(T.tempo * 1000, p.pr + dt * mul);
        if (p.pr >= T.tempo * 1000) {
          p.m = true;
          p.rb = T.rebrota * 1000;
        }
      } else p.rb = Math.min(T.rebrota * 1000, p.rb + dt * mul);
      return;
    }
    if (p.c < 0 || p.w) return;
    var tot = CROPS[p.c].tempo * 1000;
    if (p.pr >= tot) return;
    var before = p.pr / tot;
    p.pr = Math.min(tot, p.pr + dt * mul);
    if (
      dt < 5000 &&
      before > 0.2 &&
      before < 0.85 &&
      Math.random() < (dt / 70000) * (S.scare ? 0.3 : 1) * (sunOn ? 2.2 : 1)
    )
      p.w = true;
  });
  render();
  save();
}
function after() {
  checkAch();
  render();
  save();
  if (open) renderPanel();
  tutCheck();
}

/* painéis */
function rewardTxt(r) {
  var a = [];
  if (r.coins) a.push(r.coins + " moedas");
  if (r.fert)
    a.push(r.fert + (r.fert > 1 ? " fertilizantes" : " fertilizante"));
  return a.join(" e ");
}
function pSementes() {
  var tabs = [
    ["cult", "Culturas"],
    ["arv", "Árvores"],
  ]
    .map(function (x) {
      return (
        '<button class="btn" data-act="seedtab" data-v="' +
        x[0] +
        '" aria-pressed="' +
        (seedTab === x[0]) +
        '">' +
        x[1] +
        "</button>"
      );
    })
    .join("");
  var head = '<div class="seg" style="margin-bottom:10px">' + tabs + "</div>";
  if (seedTab === "arv")
    return (
      head +
      '<p class="note" style="margin-bottom:8px">Árvores ocupam um canteiro. Depois de crescer, dão frutas várias vezes: a cada colheita, começa um tempo de rebrota.</p><div class="grid2">' +
      TREES.map(function (c, i) {
        var lock = S.lvl < c.lvl,
          id = 10 + i;
        return (
          '<div class="card' +
          (S.sel === id ? " sel" : "") +
          (lock ? " off" : "") +
          '"><div class="chead"><span class="dot" style="background:' +
          c.cor +
          '"></span><strong>' +
          c.nome +
          "</strong></div>" +
          '<p class="meta">Custa ' +
          c.custo +
          " · cresce em " +
          fmt(c.tempo) +
          "<br>Dá " +
          c.frutos +
          " " +
          c.fruto.toLowerCase() +
          "s a cada " +
          fmt(c.rebrota) +
          "<br>Cada fruta vende por " +
          c.venda +
          " · +" +
          c.xp +
          " XP</p>" +
          (lock
            ? '<span class="note">Libera no nível ' + c.lvl + "</span>"
            : '<button class="btn" data-act="pickt" data-i="' +
              i +
              '">' +
              (S.sel === id ? "Escolhida" : "Escolher") +
              "</button>") +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  return (
    head +
    '<div class="grid2">' +
    CROPS.map(function (c, i) {
      var lock = S.lvl < c.lvl;
      return (
        '<div class="card' +
        (S.sel === i ? " sel" : "") +
        (lock ? " off" : "") +
        '"><div class="chead"><span class="dot" style="background:' +
        c.cor +
        '"></span><strong>' +
        c.nome +
        "</strong></div>" +
        '<p class="meta">Custa ' +
        c.custo +
        " · cresce em " +
        fmt(c.tempo) +
        "<br>Vende por " +
        c.venda +
        " · +" +
        c.xp +
        " XP</p>" +
        (lock
          ? '<span class="note">Libera no nível ' + c.lvl + "</span>"
          : '<button class="btn" data-act="pick" data-i="' +
            i +
            '">' +
            (S.sel === i ? "Escolhida" : "Escolher") +
            "</button>") +
        "</div>"
      );
    }).join("") +
    "</div>"
  );
}
function pFert() {
  return (
    '<p class="txt">Fertilizante adianta uma planta em metade do tempo total de crescimento (ou de rebrota, nas árvores). Cada canteiro aceita um por ciclo.</p>' +
    '<div class="item"><div><strong>Você tem ' +
    S.fert +
    '</strong><span class="note">Escolha a ferramenta e toque numa planta que ainda está crescendo.</span></div>' +
    '<div class="acts"><button class="btn main" data-act="usefert"' +
    (S.fert ? "" : " disabled") +
    ">Usar</button></div></div>" +
    '<div class="item"><div><strong>Comprar 1</strong><span class="note">30 moedas</span></div><div class="acts"><button class="btn" data-act="buy" data-i="0">Comprar</button></div></div>'
  );
}
function pArmazem() {
  var rows = "",
    tot = 0;
  CROPS.forEach(function (c, i) {
    if (!S.inv[i]) return;
    tot += S.inv[i] * c.venda;
    rows +=
      '<div class="item"><div><span class="chead"><span class="dot" style="background:' +
      c.cor +
      '"></span><strong>' +
      c.nome +
      " × " +
      S.inv[i] +
      '</strong></span><span class="note">' +
      c.venda +
      " moedas cada</span></div>" +
      '<div class="acts"><button class="btn" data-act="sell" data-i="' +
      i +
      '" data-n="1">Vender 1</button><button class="btn" data-act="sell" data-i="' +
      i +
      '" data-n="all">Vender tudo</button></div></div>';
  });
  TREES.forEach(function (c, i) {
    if (!S.tinv[i]) return;
    tot += S.tinv[i] * c.venda;
    rows +=
      '<div class="item"><div><span class="chead"><span class="dot" style="background:' +
      c.cor +
      '"></span><strong>' +
      c.fruto +
      " × " +
      S.tinv[i] +
      '</strong></span><span class="note">' +
      c.venda +
      " moedas cada</span></div>" +
      '<div class="acts"><button class="btn" data-act="sellt" data-i="' +
      i +
      '" data-n="1">Vender 1</button><button class="btn" data-act="sellt" data-i="' +
      i +
      '" data-n="all">Vender tudo</button></div></div>';
  });
  PRODS.forEach(function (c, i) {
    if (!S.prod[i]) return;
    tot += S.prod[i] * c.venda;
    rows +=
      '<div class="item"><div><span class="chead"><span class="dot" style="background:' +
      c.cor +
      ';border:2px solid var(--line)"></span><strong>' +
      c.nome +
      " × " +
      S.prod[i] +
      '</strong></span><span class="note">' +
      c.venda +
      " moedas cada</span></div>" +
      '<div class="acts"><button class="btn" data-act="sellp" data-i="' +
      i +
      '" data-n="1">Vender 1</button><button class="btn" data-act="sellp" data-i="' +
      i +
      '" data-n="all">Vender tudo</button></div></div>';
  });
  if (!rows)
    return '<p class="txt">O armazém está vazio. Colha plantas maduras para guardar aqui e vender depois.</p>';
  return (
    rows +
    '<div class="item"><div><strong>Total guardado</strong><span class="note">' +
    tot +
    ' moedas</span></div><div class="acts"><button class="btn main" data-act="sellall">Vender tudo</button></div></div>'
  );
}
function pLojaItens() {
  return (
    SHOP.map(function (s, i) {
      var done = i === 2 && S.scare;
      return (
        '<div class="item"><div><strong>' +
        s.nome +
        '</strong><span class="note">' +
        s.desc +
        '</span></div><div class="acts"><button class="btn" data-act="buy" data-i="' +
        i +
        '"' +
        (done ? " disabled" : "") +
        ">" +
        (done ? "Comprado" : s.custo + " moedas") +
        "</button></div></div>"
      );
    }).join("") +
    pAnimais() +
    pPremium()
  );
}
var COOP_PRICE = 150;
function pAnimais() {
  var hm = maxHens(),
    cm = maxCows(),
    hFull = S.hens >= hm || !S.coop,
    cFull = cm === 0 || S.cows >= cm;
  return (
    '<p class="note" style="margin:14px 0 0"><strong>Animais</strong></p>' +
    '<div class="item"><div><strong>Galinheiro</strong><span class="note">Necessário para criar galinhas. Compra única.</span></div><div class="acts"><button class="btn" data-act="buycoop"' +
    (S.coop ? " disabled" : "") +
    ">" +
    (S.coop ? "Comprado" : COOP_PRICE + " moedas") +
    "</button></div></div>" +
    '<div class="item"><div><strong>Galinha (' +
    S.hens +
    "/" +
    hm +
    ')</strong><span class="note">Bota 1 ovo a cada 90 s e cada ovo vale ' +
    PRODS[0].venda +
    ' moedas. Limite de 2 galinhas.</span></div><div class="acts"><button class="btn" data-act="buyan" data-k="hen"' +
    (hFull ? " disabled" : "") +
    ">" +
    (!S.coop
      ? "Compre o galinheiro"
      : hFull
        ? "Limite"
        : henPrice() + " moedas") +
    "</button></div></div>" +
    '<div class="item"><div><strong>Vaca (' +
    S.cows +
    "/" +
    cm +
    ')</strong><span class="note">Dá 1 leite a cada 4 min e cada leite vale ' +
    PRODS[1].venda +
    " moedas. " +
    (cm === 0
      ? "Libera no nível 5."
      : cm === 1
        ? "A segunda vaca libera no nível 9."
        : "") +
    '</span></div><div class="acts"><button class="btn" data-act="buyan" data-k="cow"' +
    (cFull ? " disabled" : "") +
    ">" +
    (cm === 0 ? "Nível 5" : cFull ? "Limite" : cowPrice() + " moedas") +
    "</button></div></div>"
  );
}
function pPremium() {
  var P = [
    ["Ovelha", "Produz lã valiosa. Animal premium, só com dinheiro real."],
    ["Pato", "Bota ovos raros. Animal premium, só com dinheiro real."],
  ];
  return (
    '<p class="note" style="margin:14px 0 0"><strong>Premium</strong></p>' +
    P.map(function (a) {
      return (
        '<div class="item"><div><strong>' +
        a[0] +
        '</strong><span class="note">' +
        a[1] +
        '</span></div><div class="acts"><button class="btn" disabled>Em breve</button></div></div>'
      );
    }).join("")
  );
}
function pMissoes() {
  return QUESTS.map(function (q) {
    var g = Math.min(q.g(), q.m),
      done = !!S.qdone[q.id],
      can = !done && g >= q.m;
    return (
      '<div class="item"><div><strong>' +
      q.t +
      '</strong><span class="note">Recompensa: ' +
      rewardTxt(q.r) +
      " · " +
      g +
      "/" +
      q.m +
      '</span><div class="pb"><i style="width:' +
      (100 * g) / q.m +
      '%"></i></div></div>' +
      '<div class="acts"><button class="btn' +
      (can ? " main" : "") +
      '" data-act="claimq" data-id="' +
      q.id +
      '"' +
      (can ? "" : " disabled") +
      ">" +
      (done ? "Recebida" : "Receber") +
      "</button></div></div>"
    );
  }).join("");
}
function board() {
  var arr = NPCS.map(function (n) {
    return {
      n: n[0],
      l: n[1],
      x: totalXp(n[1], Math.floor(need(n[1]) * 0.4)),
      me: false,
    };
  });
  arr.push({ n: S.name, l: S.lvl, x: totalXp(S.lvl, S.xp), me: true });
  return arr.sort(function (a, b) {
    return b.x - a.x;
  });
}
function pRanking() {
  return (
    '<p class="note" style="margin-bottom:6px">Os vizinhos são personagens de exemplo. Seus pontos são o XP total acumulado.</p>' +
    board()
      .map(function (r, i) {
        return (
          '<div class="item' +
          (r.me ? " me" : "") +
          '"><span class="rk">' +
          (i + 1) +
          '</span><div style="flex:1"><strong>' +
          esc(r.n) +
          '</strong><span class="note">Nível ' +
          r.l +
          "</span></div><strong>" +
          r.x +
          " XP</strong></div>"
        );
      })
      .join("")
  );
}
function pAmigos() {
  var today = new Date().toDateString();
  return (
    '<p class="note" style="margin-bottom:6px">Visite os vizinhos uma vez por dia e ganhe um presente.</p>' +
    NPCS.map(function (n, i) {
      var got = S.visit[n[0]] === today;
      return (
        '<div class="item"><div><strong>' +
        n[0] +
        '</strong><span class="note">Nível ' +
        n[1] +
        " · presente de " +
        (8 + n[1] * 2) +
        ' moedas</span></div><div class="acts"><button class="btn" data-act="visit" data-i="' +
        i +
        '"' +
        (got ? " disabled" : "") +
        ">" +
        (got ? "Volte amanhã" : "Visitar") +
        "</button></div></div>"
      );
    }).join("")
  );
}
function pMural() {
  if (!S.log.length)
    return '<p class="txt">Nada por aqui ainda. Os acontecimentos do sítio aparecem neste mural.</p>';
  return (
    '<div class="log">' +
    S.log
      .map(function (l) {
        return (
          '<div class="item"><div><time>' +
          l.t +
          "</time>" +
          esc(l.m) +
          "</div></div>"
        );
      })
      .join("") +
    "</div>"
  );
}
function pCorreio() {
  if (!S.mail.length) return '<p class="txt">Nenhuma carta por enquanto.</p>';
  return S.mail
    .map(function (m, i) {
      var r = rewardTxt({ coins: m.coins, fert: m.fert });
      return (
        '<div class="item"><div><strong>' +
        esc(m.tit) +
        '</strong><span class="note">' +
        esc(m.txt) +
        (r ? " · " + r : "") +
        '</span></div><div class="acts"><button class="btn' +
        (m.got ? "" : " main") +
        '" data-act="claimm" data-i="' +
        i +
        '"' +
        (m.got ? " disabled" : "") +
        ">" +
        (m.got ? "Aberta" : "Abrir") +
        "</button></div></div>"
      );
    })
    .join("");
}
function pConquistas() {
  return ACH.map(function (a) {
    var ok = !!S.ach[a.id];
    return (
      '<div class="item ach' +
      (ok ? "" : " off") +
      '"><div><strong>' +
      a.n +
      '</strong><span class="note">' +
      a.d +
      '</span></div><span class="note">' +
      (ok ? "Desbloqueada" : "Bloqueada") +
      "</span></div>"
    );
  }).join("");
}
function pConfig() {
  var seg = [
    ["auto", "Automático"],
    ["day", "Dia"],
    ["night", "Noite"],
  ]
    .map(function (t) {
      return (
        '<button class="btn" data-act="time" data-v="' +
        t[0] +
        '" aria-pressed="' +
        (S.time === t[0]) +
        '">' +
        t[1] +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="field-row"><label for="nm"><strong>Nome do sítio</strong></label><input id="nm" data-name maxlength="22" value="' +
    esc(S.name) +
    '"></div>' +
    '<div class="field-row"><strong>Horário do cenário</strong><div class="seg">' +
    seg +
    '</div><span class="note">No automático, o céu segue a hora do seu aparelho.</span></div>' +
    '<div class="field-row"><strong>Sons</strong><div class="seg"><button class="btn" data-act="snd" data-v="1" aria-pressed="' +
    S.snd +
    '">Ligado</button><button class="btn" data-act="snd" data-v="0" aria-pressed="' +
    !S.snd +
    '">Desligado</button></div></div>' +
    '<div class="field-row"><strong>Recomeçar</strong><span class="note">Apaga todo o progresso deste navegador.</span><div><button class="btn" data-act="reset">' +
    (armedReset ? "Tem certeza? Toque de novo" : "Recomeçar do zero") +
    "</button></div></div>"
  );
}
function pAjuda() {
  return (
    '<p class="txt"><strong>Plantar:</strong> escolha uma semente em Sementes e toque num canteiro marrom vazio.</p>' +
    '<p class="txt"><strong>Colher:</strong> quando aparecer o aviso dourado, toque na planta. Ela vai para o Armazém, onde você vende.</p>' +
    '<p class="txt"><strong>Árvores frutíferas:</strong> na aba Árvores de Sementes. Ocupam um canteiro, demoram a crescer e depois dão frutas várias vezes. Depois de cada colheita, a árvore leva um tempo para dar frutas de novo.</p>' +
    '<p class="txt"><strong>Ervas daninhas:</strong> param o crescimento. Toque para limpar.</p>' +
    '<p class="txt"><strong>Terra nova:</strong> toque num canteiro verde com cadeado vizinho à sua terra. Toque duas vezes para confirmar a compra.</p>' +
    '<p class="txt"><strong>Pressa:</strong> use fertilizante para adiantar uma planta.</p>' +
    '<p class="txt"><strong>Animais:</strong> as galinhas botam ovos e as vacas dão leite sozinhas. Tudo vai para o Armazém. Toque num animal para ver o próximo produto. Compre mais na Loja.</p>' +
    '<p class="txt"><strong>Casas:</strong> na Loja, aba Casas, você troca a casa do sítio quando quiser.</p>' +
    '<p class="txt"><strong>Sons:</strong> ligue ou desligue em Config.</p>' +
    '<p class="txt">O jogo continua crescendo enquanto você está fora e salva sozinho neste navegador.</p>' +
    '<button class="btn" data-act="tut">Rever tutorial</button>'
  );
}
function pEntregas() {
  return '<p class="txt">As entregas ainda estão chegando. Volte em breve!</p>';
}
var PANELS = {
  sementes: ["Sementes", pSementes],
  fert: ["Fertilizantes", pFert],
  armazem: ["Armazém", pArmazem],
  entregas: ["Entregas", pEntregas],
  loja: ["Loja", pLoja],
  missoes: ["Missões", pMissoes],
  ranking: ["Ranking", pRanking],
  amigos: ["Amigos", pAmigos],
  mural: ["Mural", pMural],
  correio: ["Correio", pCorreio],
  conquistas: ["Conquistas", pConquistas],
  config: ["Configurações", pConfig],
  ajuda: ["Ajuda", pAjuda],
};
function renderPanel() {
  var pb = $("pbody"),
    y = pb.scrollTop;
  $("ptitle").textContent = PANELS[open][0];
  pb.innerHTML = PANELS[open][1]();
  pb.scrollTop = y;
}
function openPanel(n) {
  lastFocus = document.activeElement;
  open = n;
  armedReset = false;
  $("overlay").hidden = false;
  renderPanel();
  $("pclose").focus({ preventScroll: true });
  $("app").scrollTop = 0;
  $("app").scrollLeft = 0;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  tutCheck();
}
function closePanel() {
  open = null;
  $("overlay").hidden = true;
  if (lastFocus && lastFocus.focus)
    try {
      lastFocus.focus();
    } catch (e) {}
}
function sellCrop(i, n) {
  n = Math.min(n, S.inv[i]);
  if (n <= 0) return 0;
  var g = n * CROPS[i].venda;
  S.coins += g;
  S.stats.sold += g;
  S.inv[i] -= n;
  return g;
}
function sellTree(i, n) {
  n = Math.min(n, S.tinv[i]);
  if (n <= 0) return 0;
  var g = n * TREES[i].venda;
  S.coins += g;
  S.stats.sold += g;
  S.tinv[i] -= n;
  return g;
}
function sellProd(i, n) {
  n = Math.min(n, S.prod[i]);
  if (n <= 0) return 0;
  var g = n * PRODS[i].venda;
  S.coins += g;
  S.stats.sold += g;
  S.prod[i] -= n;
  return g;
}

/* eventos */
$("field").addEventListener("click", function (e) {
  var b = e.target.closest(".tile");
  if (!b) return;
  act(+b.dataset.i);
  after();
});
$("menu").addEventListener("click", function (e) {
  var b = e.target.closest(".mi");
  if (b) openPanel(b.dataset.p);
});
$("helpb").addEventListener("click", function () {
  openPanel("ajuda");
});
$("pclose").addEventListener("click", closePanel);
$("overlay").addEventListener("click", function (e) {
  if (e.target === $("overlay")) closePanel();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && open) closePanel();
});
$("scare").innerHTML = SCARE;
$("scare").addEventListener("click", function () {
  toast("Espantalho: as ervas daninhas aparecem bem menos.");
});
$("hen").innerHTML = HEN;
$("hen").addEventListener("click", function () {
  animalInfo("hen");
});
$("flock").addEventListener("click", function (e) {
  var b = e.target.closest("[data-an]");
  if (b) animalInfo(b.dataset.an);
});
$("tools").addEventListener("click", function (e) {
  var b = e.target.closest(".tb");
  if (!b) return;
  var t = b.dataset.t;
  if (t === "seed") {
    openPanel("sementes");
    return;
  }
  if (t === "hand") S.tool = "hand";
  else if (t === "fert") {
    if (S.fert <= 0) {
      toast("Você não tem fertilizantes. Compre na Loja.");
      return;
    }
    S.tool = S.tool === "fert" ? "hand" : "fert";
    if (S.tool === "fert") toast("Toque numa planta que está crescendo.");
  } else if (t === "harvest") {
    var n = 0;
    S.plots.forEach(function (p, i) {
      if (!p.on) return;
      if (isTree(p)) {
        if (tReady(p)) {
          harvestTree(i);
          n++;
        }
      } else if (p.c >= 0 && !p.w && frac(p) >= 1) {
        harvest(i);
        n++;
      }
    });
    toast(
      n
        ? n + (n > 1 ? " plantas colhidas." : " planta colhida.")
        : "Nada pronto para colher.",
    );
  } else if (t === "clean") {
    var m = 0;
    S.plots.forEach(function (p) {
      if (p.w) {
        p.w = false;
        S.stats.cleaned++;
        S.coins += 2;
        addXp(2);
        m++;
      }
    });
    toast(m ? "Ervas removidas: " + m + "." : "Nenhuma erva daninha.");
  }
  after();
});
$("pbody").addEventListener("change", function (e) {
  if (e.target.hasAttribute("data-name")) {
    S.name = e.target.value.trim() || "Meu Sítio";
    save();
    render();
  }
});
$("pbody").addEventListener("click", function (e) {
  var b = e.target.closest("[data-act]");
  if (!b || b.disabled) return;
  var a = b.dataset.act,
    i = +b.dataset.i;
  if (decoAct(a, b)) return;
  if (a === "seedtab") {
    seedTab = b.dataset.v;
    renderPanel();
    return;
  }
  if (a === "tut") {
    S.tutDone = false;
    S.tutStep = 0;
    save();
    closePanel();
    render();
    return;
  }
  if (a === "pick") {
    S.sel = i;
    S.tool = "hand";
    save();
    render();
    closePanel();
    return;
  }
  if (a === "pickt") {
    S.sel = 10 + i;
    S.tool = "hand";
    save();
    render();
    closePanel();
    return;
  }
  if (a === "usefert") {
    if (S.fert > 0) {
      S.tool = "fert";
      toast("Toque numa planta que está crescendo.");
    }
    closePanel();
    render();
    return;
  }
  if (a === "sell") {
    var g = sellCrop(i, b.dataset.n === "all" ? S.inv[i] : 1);
    if (g) toast("Vendido por " + g + " moedas.");
  } else if (a === "sellt") {
    var gt = sellTree(i, b.dataset.n === "all" ? S.tinv[i] : 1);
    if (gt) toast("Vendido por " + gt + " moedas.");
  } else if (a === "sellp") {
    var gp = sellProd(i, b.dataset.n === "all" ? S.prod[i] : 1);
    if (gp) toast("Vendido por " + gp + " moedas.");
  } else if (a === "sellall") {
    var t = 0,
      k;
    for (k = 0; k < 6; k++) t += sellCrop(k, S.inv[k]);
    for (k = 0; k < TREES.length; k++) t += sellTree(k, S.tinv[k]);
    for (k = 0; k < PRODS.length; k++) t += sellProd(k, S.prod[k]);
    if (t) {
      toast("Vendido por " + t + " moedas.");
      log("Você vendeu colheitas por " + t + " moedas.");
    }
  } else if (a === "buy") {
    var s = SHOP[i];
    if (S.coins < s.custo) toast("Faltam " + (s.custo - S.coins) + " moedas.");
    else {
      S.coins -= s.custo;
      if (i === 0) S.fert += 1;
      else if (i === 1) S.fert += 5;
      else S.scare = true;
      toast("Compra feita: " + s.nome + ".");
      log("Você comprou: " + s.nome + ".");
    }
  } else if (a === "buycoop") {
    if (S.coop) toast("Você já tem galinheiro.");
    else if (S.coins < COOP_PRICE)
      toast("Faltam " + (COOP_PRICE - S.coins) + " moedas.");
    else {
      S.coins -= COOP_PRICE;
      S.coop = true;
      toast("Compra feita: galinheiro.");
      log("Você comprou um galinheiro.");
    }
  } else if (a === "buyan") {
    var isHen = b.dataset.k === "hen",
      apr = isHen ? henPrice() : cowPrice();
    if (isHen ? S.hens >= maxHens() : S.cows >= maxCows())
      toast("Limite atingido. Suba de nível para ter mais.");
    else if (S.coins < apr) toast("Faltam " + (apr - S.coins) + " moedas.");
    else {
      S.coins -= apr;
      if (isHen) S.hens++;
      else S.cows++;
      toast("Compra feita: " + (isHen ? "galinha nova." : "vaca nova."));
      log("Você comprou " + (isHen ? "uma galinha." : "uma vaca."));
    }
  } else if (a === "claimq") {
    var q = QUESTS.filter(function (x) {
      return x.id === b.dataset.id;
    })[0];
    if (q && !S.qdone[q.id] && q.g() >= q.m) {
      S.qdone[q.id] = 1;
      S.coins += q.r.coins || 0;
      S.fert += q.r.fert || 0;
      toast("Missão cumprida: " + rewardTxt(q.r) + ".");
      log("Missão cumprida: " + q.t + ".");
    }
  } else if (a === "claimm") {
    var m = S.mail[i];
    if (m && !m.got) {
      m.got = true;
      S.coins += m.coins;
      S.fert += m.fert;
      toast(
        rewardTxt({ coins: m.coins, fert: m.fert })
          ? "Você recebeu " + rewardTxt({ coins: m.coins, fert: m.fert }) + "."
          : "Carta aberta.",
      );
    }
  } else if (a === "visit") {
    var n = NPCS[i],
      today = new Date().toDateString();
    if (S.visit[n[0]] !== today) {
      var gain = 8 + n[1] * 2;
      S.visit[n[0]] = today;
      S.coins += gain;
      toast(n[0] + " deu " + gain + " moedas de presente.");
      log("Você visitou " + n[0] + " e ganhou " + gain + " moedas.");
    }
  } else if (a === "snd") {
    S.snd = b.dataset.v === "1";
    if (S.snd) {
      audioUnlock();
      sfx("sell");
    }
    rainSync();
  } else if (a === "time") {
    S.time = b.dataset.v;
    updateSky();
  } else if (a === "reset") {
    if (!armedReset) {
      armedReset = true;
      setTimeout(function () {
        armedReset = false;
        if (open === "config") renderPanel();
      }, 3000);
      renderPanel();
      return;
    }
    armedReset = false;
    var keepSnd = S.snd;
    S = fresh();
    S.snd = keepSnd;
    S.welcomed = true;
    S.daily = new Date().toDateString();
    addMail(
      "Bem-vindo ao sítio!",
      "Aqui vai um presentinho para começar a plantação.",
      40,
      1,
    );
    toast("Sítio novo. Boa colheita!");
    updateSky();
    applyHouse();
    after();
    return;
  }
  after();
});
window.addEventListener("resize", function () {
  flockKey = "";
  renderFlock();
  layout();
  tutRender();
});

/* tutorial */
function tutTile(crop) {
  var k = -1;
  S.plots.forEach(function (p, i) {
    if (k < 0 && p.on && (crop ? !isEmpty(p) : isEmpty(p))) k = i;
  });
  if (k < 0) k = 14;
  return btns[k].w;
}
var TUT = [
  {
    t: "Escolha a semente",
    x: "Toque aqui para ver as sementes. A cenoura já vem escolhida e é a mais rápida.",
    el: function () {
      return document.querySelector('.tb[data-t="seed"]');
    },
    done: function () {
      return open === "sementes";
    },
  },
  {
    t: "Plante",
    x: "Toque num canteiro marrom vazio para plantar a semente escolhida.",
    el: function () {
      return tutTile(false);
    },
    done: function () {
      return S.stats.planted >= 1;
    },
  },
  {
    t: "Espere crescer",
    x: "A barrinha mostra o progresso. Você pode sair: o jogo continua crescendo. O fertilizante adianta metade do tempo.",
    el: function () {
      return tutTile(true);
    },
  },
  {
    t: "Colha",
    x: "Quando aparecer o aviso dourado, toque na planta para colher.",
    el: function () {
      return tutTile(true);
    },
    done: function () {
      return S.stats.harvested >= 1;
    },
  },
  {
    t: "Venda no armazém",
    x: "A colheita fica guardada no Armazém. Abra e venda para ganhar moedas.",
    el: function () {
      return document.querySelector('.mi[data-p="armazem"]');
    },
    done: function () {
      return open === "armazem";
    },
  },
  {
    t: "Missões",
    x: "Cumpra missões para ganhar moedas e fertilizantes. Abra as Missões para ver.",
    el: function () {
      return document.querySelector('.mi[data-p="missoes"]');
    },
    done: function () {
      return open === "missoes";
    },
  },
];
function tutNext() {
  S.tutStep++;
  if (S.tutStep >= TUT.length) {
    S.tutDone = true;
    toast("Tutorial concluído. Boa colheita!");
  }
  save();
  tutRender();
}
function tutCheck() {
  if (S.tutDone) return;
  var st = TUT[S.tutStep];
  if (st && st.done && st.done()) tutNext();
  else tutRender();
}
function tutRender() {
  var b = $("tut"),
    r = $("tring");
  if (S.tutDone || !TUT[S.tutStep]) {
    b.hidden = true;
    r.hidden = true;
    return;
  }
  var st = TUT[S.tutStep],
    el = st.el();
  if (!el) {
    b.hidden = true;
    r.hidden = true;
    return;
  }
  if (b._s !== S.tutStep) {
    b._s = S.tutStep;
    b.innerHTML =
      "<small>Tutorial · " +
      (S.tutStep + 1) +
      " de " +
      TUT.length +
      "</small><p><strong>" +
      st.t +
      ".</strong> " +
      st.x +
      '</p><div class="acts"><button class="btn" data-tut="skip">Pular</button><button class="btn main" data-tut="next">' +
      (S.tutStep === TUT.length - 1 ? "Concluir" : "Próximo") +
      "</button></div>";
  }
  b.hidden = false;
  r.hidden = false;
  var ar = $("app").getBoundingClientRect(),
    tr = el.getBoundingClientRect(),
    pd = 6;
  var L = tr.left - ar.left - pd,
    T = tr.top - ar.top - pd,
    W = tr.width + pd * 2,
    H = tr.height + pd * 2;
  r.style.left = L + "px";
  r.style.top = T + "px";
  r.style.width = W + "px";
  r.style.height = H + "px";
  var bw = b.offsetWidth,
    bh = b.offsetHeight;
  var y = ar.height - (T + H) >= bh + 24 ? T + H + 12 : T - bh - 12;
  var x = Math.max(16, Math.min(ar.width - bw - 16, L + W / 2 - bw / 2));
  b.style.left = x + "px";
  b.style.top = Math.max(60, y) + "px";
}
$("tut").addEventListener("click", function (e) {
  var b = e.target.closest("[data-tut]");
  if (!b) return;
  if (b.dataset.tut === "skip") {
    S.tutDone = true;
    save();
    tutRender();
  } else tutNext();
});

/* casas (aba "Casas" da Loja).
         Para adicionar uma casa: salve o PNG em img/ e acrescente uma linha na lista. */
var shopTab = "loja";
var HOUSE_DEFAULT = "";
var HOUSES = [
  { id: "casa1", nome: "Casa 1", img: "img/casa1.png" },
  { id: "casa2", nome: "Casa 2", img: "img/casa2.png" },
  { id: "casa3", nome: "Casa 3", img: "img/casa3.png" },
  { id: "casa4", nome: "Casa 4", img: "img/casa4.png" },
  { id: "casa5", nome: "Casa 5", img: "img/casa5.png" },
  { id: "casa6", nome: "Casa 6", img: "img/casa6.png" },
  { id: "casa7", nome: "Casa 7", img: "img/casa7.png" },
];
function houseById(id) {
  return (
    HOUSES.filter(function (h) {
      return h.id === id;
    })[0] || HOUSES[0]
  );
}
function applyHouse() {
  var h = houseById(S.house),
    el = document.querySelector("svg.house");
  el.innerHTML = h.img
    ? '<image href="' +
      h.img +
      '" x="0" y="0" width="240" height="170" preserveAspectRatio="xMidYMax meet"/>'
    : HOUSE_DEFAULT;
}
function pDeco() {
  var cur = houseById(S.house).id;
  return (
    '<p class="note" style="margin-bottom:6px">Escolha a casa do seu sítio. Pode trocar quando quiser.</p>' +
    HOUSES.map(function (h) {
      var on = h.id === cur;
      return (
        '<div class="item"><div><strong>' +
        h.nome +
        "</strong>" +
        (on ? '<span class="note">Em uso</span>' : "") +
        '</div><div class="acts"><button class="btn' +
        (on ? "" : " main") +
        '" data-act="house" data-id="' +
        h.id +
        '"' +
        (on ? " disabled" : "") +
        ">" +
        (on ? "Em uso" : "Usar") +
        "</button></div></div>"
      );
    }).join("")
  );
}
function pLoja() {
  var t = [
    ["loja", "Loja"],
    ["deco", "Casas"],
  ]
    .map(function (x) {
      return (
        '<button class="btn" data-act="shoptab" data-v="' +
        x[0] +
        '" aria-pressed="' +
        (shopTab === x[0]) +
        '">' +
        x[1] +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="seg" style="margin-bottom:10px">' +
    t +
    "</div>" +
    (shopTab === "deco" ? pDeco() : pLojaItens())
  );
}
function decoAct(a, b) {
  if (a === "shoptab") {
    shopTab = b.dataset.v;
    after();
    return true;
  }
  if (a === "house") {
    var h = houseById(b.dataset.id);
    var ok = function () {
      S.house = h.id;
      applyHouse();
      toast("Casa trocada: " + h.nome + ".");
      after();
    };
    if (!h.img) ok();
    else {
      var t = new Image();
      t.onload = ok;
      t.onerror = function () {
        toast("Imagem não encontrada: " + h.img);
      };
      t.src = h.img;
    }
    return true;
  }
  return false;
}

/* clima */
var rainOn = false,
  sunOn = false,
  wxK = "";
function wxPick(now) {
  var r = Math.random(),
    t = r < 0.6 ? "clear" : r < 0.85 ? "rain" : "sun";
  var mins =
    t === "clear"
      ? 5 + Math.random() * 3
      : t === "rain"
        ? 2 + Math.random() * 2
        : 3 + Math.random() * 2;
  S.wx = { t: t, until: now + mins * 60000 };
  if (t === "rain") {
    toast("Começou a chover. Crescimento 20% mais rápido.");
    log("Começou a chover.");
  }
  if (t === "sun") {
    toast("Sol forte! As ervas daninhas aparecem mais.");
    log("Dia de sol forte.");
  }
}
function wxUpdate() {
  var now = Date.now();
  if (!S.wx) S.wx = { t: "clear", until: now + 4 * 60000 };
  else if (now > S.wx.until) wxPick(now);
  rainOn = S.wx.t === "rain";
  sunOn = S.wx.t === "sun";
  rainSync();
  if (wxK !== S.wx.t) {
    wxK = S.wx.t;
    $("app").setAttribute("data-wx", S.wx.t);
  }
}

/* borboleta dourada */
var BFLY =
  '<svg viewBox="0 0 40 30" aria-hidden="true"><g class="bw"><path d="M20 15C8 0 0 6 4 16C6 22 14 22 20 15Z" fill="#ffd93a" stroke="#8a5a0a" stroke-width="1.5"/><path d="M20 15C32 0 40 6 36 16C34 22 26 22 20 15Z" fill="#ffb21f" stroke="#8a5a0a" stroke-width="1.5"/></g><path d="M20 8v15" stroke="#4a2f1c" stroke-width="2.4" stroke-linecap="round"/></svg>';
function bflySpawn() {
  if (document.querySelector(".bfly") || open) return;
  var b = document.createElement("button");
  b.className = "bfly";
  b.setAttribute("aria-label", "Borboleta dourada");
  b.style.top = 22 + Math.random() * 30 + "%";
  b.style.animationName = Math.random() < 0.5 ? "bfr" : "bfl";
  b.innerHTML = BFLY;
  b.addEventListener("click", function () {
    var g = 10 + S.lvl * 3;
    S.coins += g;
    S.stats.bfly = (S.stats.bfly || 0) + 1;
    appPop(b, "+" + g);
    toast("Você recebeu " + g + " moedas da borboleta.");
    log("Você pegou uma borboleta dourada: " + g + " moedas.");
    b.remove();
    after();
  });
  b.addEventListener("animationend", function () {
    b.remove();
  });
  $("app").appendChild(b);
}

/* início */
S = load();
if (S.eggsLaid === undefined) S.eggsLaid = S.hens > 0 ? 2 : 0;
if (S.hens > 2) S.hens = 2;
var today = new Date().toDateString();
if (!S.welcomed) {
  S.welcomed = true;
  S.daily = today;
  addMail(
    "Bem-vindo ao sítio!",
    "Aqui vai um presentinho para começar a plantação.",
    40,
    1,
  );
} else if (S.daily !== today) {
  S.daily = today;
  addMail(
    "Presente do dia",
    "O correio trouxe uma surpresinha para o seu sítio.",
    25,
    1,
  );
}
build();
layout();
updateSky();
render();
tick();
setInterval(tick, 500);
setInterval(updateSky, 60000);

/* curral */
(function () {
  var pen = document.createElement("div");
  pen.className = "pen";
  var flock = document.getElementById("flock");
  flock.parentNode.insertBefore(pen, flock);
})();

/* casa de palha com telhado de pagode e escada */
document.querySelector("svg.house").innerHTML =
  '<ellipse cx="120" cy="156" rx="112" ry="8" fill="#000" opacity=".16"/>' +
  '<g stroke="#4a2f1c" stroke-width="3" stroke-linejoin="round">' +
  '<rect x="40" y="86" width="120" height="66" fill="#e8c98a"/>' +
  '<path d="M40 104h120M40 122h120M40 140h120" stroke="#b8893f" stroke-width="2"/>' +
  '<rect x="88" y="108" width="28" height="44" rx="3" fill="#8a5a2c"/>' +
  '<rect x="50" y="100" width="24" height="22" fill="#8fd4f4"/>' +
  '<rect x="128" y="100" width="24" height="22" fill="#8fd4f4"/>' +
  '<path d="M20 90 L100 44 L180 90Z" fill="#f0b832"/>' +
  '<path d="M20 90 Q100 70 180 90" fill="none" stroke="#b07a10" stroke-width="2.5"/>' +
  '<path d="M34 76 L100 30 L166 76Z" fill="#ffd34a"/>' +
  '<path d="M34 76 Q100 58 166 76" fill="none" stroke="#b07a10" stroke-width="2.5"/>' +
  '<path d="M60 56 L100 14 L140 56Z" fill="#f7c235"/>' +
  '<path d="M100 14v-8" stroke-linecap="round"/>' +
  '<path d="M170 154 L206 118 L206 154Z" fill="#c9a06a"/>' +
  '<path d="M178 154 L192 138M188 154 L200 142" stroke="#7a5230" stroke-width="2"/>' +
  "</g>";

/* guarda a casa padrão e aplica a casa escolhida */
HOUSE_DEFAULT = document.querySelector("svg.house").innerHTML;
applyHouse();

/* ################# 2) VISUAL ################# */
/* Roça Feliz - TODO o visual em um único arquivo.
   Carregar DEPOIS do script principal do jogo.
   Usa: img/terra.png (canteiro) e, opcional, img/fundo.png (fundo pintado). */
(function () {
  function uri(svg) {
    return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
  }

  /* ---------- textura dos canteiros bloqueados (grama) ---------- */
  var grass =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>" +
    "<rect width='100' height='100' fill='#2f7a2c'/>" +
    "<g fill='#3f9638' stroke='#1d5a1d' stroke-width='2'>" +
    "<ellipse cx='25' cy='25' rx='22' ry='16'/><ellipse cx='75' cy='22' rx='22' ry='16'/>" +
    "<ellipse cx='22' cy='60' rx='22' ry='16'/><ellipse cx='72' cy='58' rx='24' ry='16'/>" +
    "<ellipse cx='48' cy='88' rx='26' ry='14'/></g>" +
    "<g fill='none' stroke='#6cc455' stroke-width='1.6' stroke-linecap='round' opacity='.8'>" +
    "<path d='M10 22Q25 12 40 22'/><path d='M60 20Q75 10 90 20'/><path d='M8 58Q22 48 38 58'/><path d='M58 56Q72 46 90 56'/></g>" +
    "<rect width='100' height='100' fill='none' stroke='#1d5a1d' stroke-width='3'/></svg>";

  /* ---------- CSS ---------- */
  var css =
    /* céu e gramado sempre vivos */
    ".app,.app[data-phase=dawn],.app[data-phase=dusk]{--sky1:#47b4f4;--sky2:#d6f2ff;--m1:#bff04a;--m2:#6cc426;--tree:#55c42e;--shade:0}" +
    ".app[data-phase=night]{--m1:#7fc43c;--m2:#4a9a2c;--tree:#3f9a2c;--shade:.2}" +
    ".app[data-wx=rain] #wxfx{opacity:.3}" +
    ".meadow::before{content:'';position:absolute;inset:0;pointer-events:none;background:" +
    "repeating-linear-gradient(115deg,rgba(255,255,190,.10) 0 40px,transparent 40px 90px)," +
    "radial-gradient(ellipse 22% 9% at 22% 22%,rgba(255,255,200,.3),transparent 70%)," +
    "radial-gradient(ellipse 24% 10% at 70% 55%,rgba(255,255,200,.24),transparent 70%)}" +
    /* ---- canteiros de terra (img/terra.png) ---- */
    ".pw{filter:none;--th:calc(var(--tw)*.14)}" +
    ".pw.bed::before{content:'';position:absolute;left:0;top:0;width:100%;height:calc(var(--tw)*.5 + var(--th));" +
    "clip-path:none;background:url(img/terra.png) 0 0/100% auto no-repeat;" +
    "filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}" +
    ".pw.bed::after{display:none}" +
    ".pw.bed:hover::before{filter:brightness(1.18) drop-shadow(0 2px 0 rgba(0,0,0,.25))}" +
    ".tile:not(.lock){background:none !important}" +
    ".tile:not(.lock):hover{filter:none}" +
    /* canteiros bloqueados (grama) */
    ".tile.lock,.tile.lock.buy{background:" +
    uri(grass) +
    " 0 0/100% 100% !important}" +
    ".tile.lock.armed{background:var(--accent) !important}" +
    ".tile.lock:hover{filter:brightness(1.18)}" +
    ".pw:not(.bed)::before{content:'';position:absolute;left:0;top:0;width:100%;" +
    "height:calc(var(--tw)/2 + var(--th));" +
    "clip-path:polygon(2% calc(var(--tw)*.25),50% calc(var(--tw)*.49),98% calc(var(--tw)*.25)," +
    "98% calc(var(--tw)*.25 + var(--th)),50% calc(var(--tw)*.49 + var(--th)),2% calc(var(--tw)*.25 + var(--th)));" +
    "background:linear-gradient(90deg,#235e22 50%,#184a18 50%)}" +
    ".lk{color:#d8f5c0;text-shadow:0 1px 2px rgba(0,0,0,.6)}" +
    /* ---- plantas MENORES (base no centro do canteiro) ---- */
    ".spr{width:calc(var(--tw)*.66);height:calc(var(--tw)*.66);margin-left:calc(var(--tw)*-.33);top:calc(var(--tw)*-.28)}" +
    /* árvores ainda menores, pra não virar floresta */
    ".spr:has(#tk){width:calc(var(--tw)*.6);height:calc(var(--tw)*.6);margin-left:calc(var(--tw)*-.3);top:calc(var(--tw)*-.3)}" +
    ".spr svg{filter:saturate(1.35) contrast(1.06) drop-shadow(1px 0 0 #2b2410) drop-shadow(-1px 0 0 #2b2410) " +
    "drop-shadow(0 1px 0 #2b2410) drop-shadow(0 -1px 0 #2b2410) drop-shadow(0 2px 2px rgba(30,15,0,.4))}" +
    ".badge{top:calc(var(--tw)*-.2);margin-left:calc(var(--tw)*.05);width:16px;height:16px;line-height:16px;font-size:11px}" +
    ".pbar{left:30%;right:30%;bottom:6%;height:3px}" +
    ".wd{top:12%;width:calc(var(--tw)*.26);margin-left:calc(var(--tw)*-.13)}" +
    /* curral fechado */
    ".fence.f1,.fence.f2,.fence.fv{display:none !important}" +
    ".pen{position:absolute;left:56%;right:1%;top:21%;height:26%;border:6px solid #a8632c;border-radius:6px;" +
    "background:rgba(160,230,80,.3);box-shadow:0 0 0 2.5px #3a2f2a,inset 0 0 0 2.5px #3a2f2a,0 6px 0 rgba(0,0,0,.22);pointer-events:none}" +
    ".pen::before,.pen::after{content:'';position:absolute;left:-6px;right:-6px;height:14px;" +
    "background:repeating-linear-gradient(90deg,#7a4a22 0 8px,transparent 8px 56px)}" +
    ".pen::before{top:-17px}.pen::after{bottom:-15px}" +
    "@media(min-width:760px){.pen{left:74%;top:22%}.scare{left:19% !important;top:20% !important;width:72px !important}}" +
    /* com fundo pintado: esconde o cenário desenhado */
    ".app.bg .scene:not(.shade){background:url(img/fundo.png) center/cover no-repeat !important}" +
    ".app.bg .scene:not(.shade)>*:not(.flock):not(#hen):not(.house):not(.coop){display:none !important}" +
    ".app.bg .scare{display:none !important}" +
    ".app.bg svg.house{left:44% !important;top:6% !important;width:clamp(120px,12vw,240px) !important}" +
    ".app.bg svg.coop{left:78% !important;top:14% !important}" +
    ".app.bg #hen{left:76% !important;top:39% !important}" +
    ".app.bg .flock .hen{margin-top:8vh}" +
    ".app.bg .flock .cow{margin-top:8vh;margin-left:-3vw}" +
    ".app.bg[data-phase=night] svg.house{left:44% !important;top:6% !important}" +
    ".app.bg[data-phase=night] svg.house,.app.bg[data-phase=night] svg.coop,.app.bg[data-phase=night] #placed .pi img," +
    ".app.bg[data-phase=night] #hen,.app.bg[data-phase=night] .flock .hen,.app.bg[data-phase=night] .flock .cow," +
    ".app.bg[data-phase=night] .scare{filter:brightness(.62) saturate(.85) sepia(.3) hue-rotate(185deg) !important}";

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- começa em modo Dia (só na primeira vez) ---------- */
  try {
    if (!localStorage.getItem("rf-visual-v4")) {
      localStorage.setItem("rf-visual-v4", "1");
      S.time = "day";
      updateSky();
      save();
    }
  } catch (e) {}

  /* ---------- curral ---------- */
  if (!document.querySelector(".pen")) {
    var pen = document.createElement("div");
    pen.className = "pen";
    var fl = document.getElementById("flock");
    fl.parentNode.insertBefore(pen, fl);
  }

  /* a casa padrão passa a ser o pagode; reaplica a casa escolhida */
  HOUSE_DEFAULT = document.querySelector("svg.house").innerHTML;
  applyHouse();

  /* ---------- fundo pintado (opcional) ---------- */
  var img = new Image();
  img.onload = function () {
    document.getElementById("app").classList.add("bg");
  };
  img.src = "img/fundo.png";

  /* redesenha tudo com o visual novo */
  btns.forEach(function (x) {
    x.k = "";
  });
  render();
})();

/* ################# 3) ASSETS ################# */
/* Roça Feliz - assets.js
   Liga os PNGs do "Guia de prompts de arte" ao jogo.
   Carregar DEPOIS do visual.js:   <script src="assets.js"></script>

   Regra de ouro: cada PNG que EXISTIR na pasta img/ passa a ser usado.
   O que ainda não existir continua com o desenho atual do jogo.

   Para ajustar a posição de casinhas, animais e objetos:
   abra o jogo com  #editar  no final do endereço (ex.: index.html#editar),
   arraste os itens, e copie o texto da caixa que aparece para a linha
   "var FIXED = {};" aqui embaixo. */
(function () {
  /* ================= CONFIGURAÇÃO ================= */

  /* Mude este número sempre que trocar um PNG (evita cache do navegador). */
  var V = "2";

  /* Tamanho e altura das plantas/árvores dentro do canteiro. */
  var PLANT_SCALE = 1.15,
    PLANT_Y = 2;
  var TREE_SCALE = 1.0,
    TREE_Y = 0;

  /* Tamanho da área de plantio. 1 = tamanho original; menor = libera a casa e o curral.
     D = computador (tela larga), M = celular. */
  var FIELD_SCALE_D = 0.55,
    FIELD_SCALE_M = 0.75;
  /* Empurra a área de plantio para baixo (em pixels) para não tampar a casa. */
  var FIELD_DY = 18;

  /* Posições salvas no modo #editar (cole aqui o texto gerado). */
  var FIXED = {
    casinha_cachorro: { d: [56, 13, 5.5], m: [74, 12, 16] },
    cachorro: { d: [60, 18, 3.5], m: [76, 19, 10] },
    porco: { d: [70, 18, 5], m: [88, 19, 12] },
  };

  /* Itens soltos no sítio. Só aparecem se o PNG existir.
     d = computador [x%, y%, largura em vw]   m = celular [x%, y%, largura em vw]
     wander = quanto o bicho anda de um lado a outro (vw). idle = só balança.
     click = abre um painel (armazem, correio...).  say = fala ao tocar. */
  var PLACED = [
    {
      id: "casinha_cachorro",
      f: "objetos/casinha_cachorro.png",
      d: [72, 53, 7],
      m: [3, 60, 17],
      say: "A casinha do cachorro.",
    },
    {
      id: "cachorro",
      f: "animais/cachorro.png",
      d: [79, 58, 4.5],
      m: [21, 66, 12],
      wander: 1.5,
      say: "Au au!",
    },
    {
      id: "porco",
      f: "animais/porco.png",
      d: [70, 18, 5],
      m: [88, 19, 12],
      wander: 3,
      say: "Óinc óinc!",
    },
    {
      id: "casinha_cabra",
      f: "objetos/casinha_cabra.png",
      d: [85, 50, 8],
      m: [60, 58, 20],
      say: "A casinha da cabra.",
    },
    {
      id: "cabra",
      f: "animais/cabra.png",
      d: [91, 57, 5],
      m: [80, 66, 12],
      wander: 3,
      say: "Méééé!",
    },
    {
      id: "burro",
      f: "animais/burro.png",
      d: [73, 66, 6],
      m: [45, 61, 14],
      wander: 4,
      say: "Iiiaaa!",
    },
    {
      id: "ovelha",
      f: "animais/ovelha.png",
      d: [80, 68, 5],
      m: [66, 72, 12],
      wander: 3,
      say: "Béé!",
    },
    {
      id: "pato",
      f: "animais/pato.png",
      d: [88, 71, 3],
      m: [36, 72, 8],
      wander: 4,
      say: "Quá!",
    },
    {
      id: "pintinho",
      f: "animais/pintinho.png",
      d: [92, 66, 2.5],
      m: [46, 75, 6],
      wander: 3,
      say: "Piu piu!",
    },
    {
      id: "gato",
      f: "animais/gato.png",
      d: [77, 50, 3.5],
      m: [30, 60, 9],
      idle: true,
      say: "Miau!",
    },
    {
      id: "celeiro",
      f: "objetos/celeiro.png",
      d: [60, 66, 10],
      m: [3, 74, 20],
      click: "armazem",
    },
    {
      id: "poco",
      f: "objetos/poco.png",
      d: [66, 74, 5],
      m: [88, 56, 10],
      say: "Um poço de água fresca.",
    },
    {
      id: "caixa_correio",
      f: "objetos/caixa_correio.png",
      d: [95, 44, 3],
      m: [92, 46, 8],
      click: "correio",
    },
  ];

  /* ================= NOMES DOS ARQUIVOS ================= */
  var CROP_FILES = [
    "cenoura",
    "milho",
    "tomate",
    "morango",
    "abobora",
    "girassol",
  ];
  var TREE_FILES = ["laranjeira", "mangueira", "macieira"];
  var SLUG = {
    Cenoura: "cenoura",
    Milho: "milho",
    Tomate: "tomate",
    Morango: "morango",
    Abóbora: "abobora",
    Girassol: "girassol",
    Laranjeira: "laranjeira",
    Mangueira: "mangueira",
    Macieira: "macieira",
    Maçã: "maca",
    Laranja: "laranja",
    Manga: "manga",
    Ovo: "ovo",
    Leite: "leite",
  };
  var HOUSE_NAMES = [
    "Casa Padrão",
    "Casa de Tijolos",
    "Casa de Fazenda",
    "Casa de Pagode",
    "Mansão de Pedra",
    "Casa Colorida",
    "Casa Japonesa",
  ];
  var MENUS = [
    "amigos",
    "sementes",
    "fert",
    "armazem",
    "entregas",
    "loja",
    "missoes",
    "ranking",
    "mural",
    "correio",
    "conquistas",
    "config",
  ];
  var TOOLICON = {
    hand: "tool_mao",
    fert: "tool_fertilizante",
    harvest: "tool_luva",
    clean: "tool_foice",
  };

  /* ================= CARREGAMENTO ================= */
  var FILES = {},
    SPR = {},
    HFILE = [];

  var LOG = [];
  function probe(rel) {
    var cands = [rel],
      base = rel.split("/").pop();
    if (base !== rel) cands.push(base);
    return new Promise(function (ok) {
      (function next(k) {
        if (k >= cands.length) {
          LOG.push({ f: rel, ok: false, tried: cands });
          return ok(null);
        }
        var i = new Image(),
          src = "img/" + cands[k] + "?v=" + V;
        i.onload = function () {
          LOG.push({ f: rel, ok: true, src: src });
          ok({ src: src, w: i.naturalWidth, h: i.naturalHeight });
        };
        i.onerror = function () {
          next(k + 1);
        };
        i.src = src;
      })(0);
    });
  }
  function load(rel) {
    return probe(rel).then(function (r) {
      if (r) FILES[rel] = r;
      return r;
    });
  }
  function loadAny(list) {
    return load(list[0]).then(function (r) {
      return r || (list.length > 1 ? loadAny(list.slice(1)) : null);
    });
  }
  /* faixa única (planta_x.png) ou um arquivo por estágio (planta_x_1.png ...) */
  function loadSprite(dir, name, n) {
    return load(dir + "/" + name + ".png").then(function (r) {
      if (r) {
        SPR[name] = { strip: r, n: n };
        return;
      }
      var fs = [],
        ps = [],
        k;
      for (k = 1; k <= n; k++)
        (function (k) {
          ps.push(
            load(dir + "/" + name + "_" + k + ".png").then(function (f) {
              fs[k - 1] = f;
            }),
          );
        })(k);
      return Promise.all(ps).then(function () {
        if (fs.length === n && fs.every(Boolean))
          SPR[name] = { frames: fs, n: n };
      });
    });
  }

  var jobs = [];
  HOUSE_NAMES.forEach(function (n, i) {
    jobs.push(
      loadAny([
        "casas/casa" + (i + 1) + ".png",
        "casa" + (i + 1) + ".png",
      ]).then(function (r) {
        HFILE[i] = r;
      }),
    );
  });
  CROP_FILES.forEach(function (n) {
    jobs.push(loadSprite("plantas", "planta_" + n, 6));
  });
  TREE_FILES.forEach(function (n) {
    jobs.push(loadSprite("arvores", "arvore_" + n, 4));
  });
  [
    "cenoura",
    "milho",
    "tomate",
    "morango",
    "abobora",
    "girassol",
    "laranjeira",
    "mangueira",
    "macieira",
  ].forEach(function (n) {
    jobs.push(load("icones/semente_" + n + ".png"));
  });
  [
    "cenoura",
    "milho",
    "tomate",
    "morango",
    "abobora",
    "girassol",
    "laranja",
    "manga",
    "maca",
    "ovo",
    "leite",
  ].forEach(function (n) {
    jobs.push(load("icones/prod_" + n + ".png"));
  });
  [
    "animais/galinha.png",
    "animais/vaca.png",
    "objetos/galinheiro.png",
    "objetos/espantalho.png",
    "objetos/moita_bloqueada.png",
    "objetos/pedras.png",
    "objetos/flores.png",
    "objetos/arvore_enfeite.png",
    "objetos/borboleta_dourada.png",
    "fundo_noite.png",
    "ui/hud_moeda.png",
    "ui/hud_nivel.png",
    "ui/aviso_pronto.png",
  ].forEach(function (f) {
    jobs.push(load(f));
  });
  Object.keys(TOOLICON).forEach(function (k) {
    jobs.push(load("ui/" + TOOLICON[k] + ".png"));
  });
  MENUS.forEach(function (m) {
    jobs.push(load("ui/menu_" + m + ".png"));
  });
  PLACED.forEach(function (it) {
    jobs.push(load(it.f));
  });

  /* ================= CSS BASE ================= */
  var css0 =
    /* barra de progresso: maior, no centro do canteiro e acima dos vizinhos */
    ".pbar{left:50%;right:auto;width:calc(var(--tw)*.58);margin-left:calc(var(--tw)*-.29);top:calc(var(--tw)*.33);bottom:auto;height:10px;z-index:6;border:2px solid #2b2410;border-radius:6px;background:rgba(20,10,0,.7);box-shadow:0 2px 0 rgba(0,0,0,.35)}" +
    ".pbar i{background:linear-gradient(#fff4a8,#f2b400)}" +
    ".badge{z-index:7}" +
    ".spr .simg{position:absolute;left:50%;transform:translateX(-50%);background-repeat:no-repeat;pointer-events:none}" +
    ".spr:has(.simg)::before{display:none}" +
    ".ico{width:28px;height:28px;object-fit:contain;flex:none}" +
    ".tb img.tico{width:22px;height:22px;object-fit:contain;flex:none}" +
    ".mi img.mico{width:36px;height:36px;object-fit:contain}" +
    ".hen img,.cow img{display:block;width:100%;height:auto;pointer-events:none;filter:drop-shadow(0 3px 2px rgba(0,0,0,.3))}" +
    ".scare img{display:block;width:100%;height:auto}" +
    ".bfly img{width:100%;height:100%;object-fit:contain;display:block;animation:wob 1.1s ease-in-out infinite;filter:drop-shadow(0 0 6px #ffd93a)}" +
    ".coop.img{filter:drop-shadow(0 3px 2px rgba(0,0,0,.3))}" +
    "#placed{position:absolute;inset:0;z-index:4;pointer-events:none}" +
    ".pi{position:absolute}" +
    ".pi img{display:block;width:100%;height:auto;-webkit-user-drag:none;user-select:none;filter:drop-shadow(0 3px 2px rgba(0,0,0,.28))}" +
    ".pi.click{pointer-events:auto;cursor:pointer}" +
    "@keyframes rfwalk{0%{transform:translateX(0) scaleX(1)}45%{transform:translateX(var(--wd,4vw)) scaleX(1)}50%{transform:translateX(var(--wd,4vw)) scaleX(-1)}95%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(0) scaleX(1)}}" +
    "@keyframes rfidle{50%{transform:translateY(-2px) scaleY(1.02)}}" +
    ".pi img.wander{animation:rfwalk var(--dur,30s) ease-in-out infinite;animation-delay:var(--dl,0s)}" +
    ".pi img.idle{transform-origin:50% 100%;animation:rfidle 3s ease-in-out infinite}" +
    "@media (prefers-reduced-motion:reduce){.pi img{animation:none !important}}" +
    ".pi.edit{pointer-events:auto;cursor:move;touch-action:none;outline:2px dashed #ffd54a}" +
    ".pi.edit.sel{outline-color:#ff4d4d}" +
    "#rfed{position:fixed;left:8px;bottom:8px;z-index:99;max-width:min(92vw,520px);background:#2b2013;color:#fff3d6;border:2px solid #8a6238;border-radius:12px;padding:8px 10px;font:13px/1.4 sans-serif}" +
    "#rfed button{margin:0 4px 4px 0;padding:3px 10px;font-weight:700}" +
    "#rfed textarea{display:block;width:100%;margin-top:4px;font:11px monospace}";
  var st0 = document.createElement("style");
  st0.textContent = css0;
  document.head.appendChild(st0);

  /* ================= ÁREA DE PLANTIO MENOR ================= */
  layout = function () {
    var app = $("app"),
      W = app.clientWidth,
      H = app.clientHeight;
    var k = W >= 760 ? FIELD_SCALE_D : FIELD_SCALE_M;
    var tw = Math.max(
      36,
      Math.floor(Math.max(44, Math.min((W * 0.96) / R, (H - 300) / 3)) * k),
    );
    var f = $("field");
    f.style.setProperty("--tw", tw + "px");
    f.style.width = R * tw + "px";
    f.style.height = 3 * tw + "px";
    var ft =
      Math.max(106 + tw * 0.5, (96 + (H - 190)) / 2 - 1.5 * tw + tw * 0.15) +
      FIELD_DY;
    f.style.top = ft + "px";
    var sc = $("scare"),
      sw = tw * 0.62,
      fl = f.getBoundingClientRect().left - app.getBoundingClientRect().left;
    sc.style.width = sw + "px";
    sc.style.left = Math.max(4, fl + tw * 0.4 - sw / 2) + "px";
    sc.style.top = ft + tw * 0.6 - sw * 1.19 + "px";
    btns.forEach(function (x, i) {
      var r = Math.floor(i / R),
        c = i % R;
      x.w.style.left = (R * tw) / 2 + ((c - r) * tw) / 2 - tw / 2 + "px";
      x.w.style.top = ((c + r) * tw) / 4 + "px";
    });
  };
  layout();

  /* ================= FUNÇÕES AUXILIARES ================= */
  function sprite(name, frame, scale, y, cls) {
    var s = SPR[name];
    if (!s) return null;
    var fa, src, size, pos, f;
    if (s.strip) {
      fa = s.strip.w / s.n / s.strip.h;
      src = s.strip.src;
      size = s.n * 100 + "% 100%";
      pos = (s.n > 1 ? (frame / (s.n - 1)) * 100 : 0) + "% 0";
    } else {
      f = s.frames[frame] || s.frames[s.frames.length - 1];
      fa = f.w / f.h;
      src = f.src;
      size = "100% 100%";
      pos = "0 0";
    }
    var wp = (fa >= 1 ? 100 : fa * 100) * scale,
      hp = (fa >= 1 ? 100 / fa : 100) * scale;
    return (
      '<div class="simg ' +
      cls +
      '" style="width:' +
      wp +
      "%;height:" +
      hp +
      "%;bottom:" +
      y +
      "%;background-image:url('" +
      src +
      "');background-size:" +
      size +
      ";background-position:" +
      pos +
      '"></div>'
    );
  }
  function imgTag(f, cls) {
    return (
      "<img " +
      (cls ? 'class="' + cls + '" ' : "") +
      'src="' +
      f.src +
      '" alt="" draggable="false">'
    );
  }
  function swapSvg(sel, rel, w, h) {
    var f = FILES[rel],
      el = document.querySelector(sel);
    if (!f || !el) return;
    el.innerHTML =
      '<image href="' +
      f.src +
      '" x="0" y="0" width="' +
      w +
      '" height="' +
      h +
      '" preserveAspectRatio="xMidYMax meet"/>';
    el.classList.add("img");
  }
  function mode() {
    return window.innerWidth >= 760 ? "d" : "m";
  }

  /* ================= APLICA TUDO ================= */
  console.info("[assets.js] carregado, procurando imagens em img/ ...");
  Promise.all(jobs)
    .then(function () {
      var css = "";
      var found = LOG.filter(function (x) {
        return x.ok;
      });
      console.info(
        "[assets.js] imagens encontradas (" + found.length + "):",
        found
          .map(function (x) {
            return x.f;
          })
          .join(", ") || "nenhuma",
      );
      if (/debug/.test(location.hash)) showDebug();

      /* ---- casas ---- */
      var hs = [];
      HOUSE_NAMES.forEach(function (n, i) {
        if (HFILE[i])
          hs.push({ id: "casa" + (i + 1), nome: n, img: HFILE[i].src });
      });
      if (hs.length) {
        HOUSES.length = 0;
        hs.forEach(function (h) {
          HOUSES.push(h);
        });
      }
      applyHouse();

      /* ---- plantas e árvores ---- */
      var _plantSVG = plantSVG,
        _treeSVG = treeSVG;
      plantSVG = function (c, st) {
        var i = CROPS.indexOf(c);
        var h =
          i >= 0 &&
          sprite("planta_" + CROP_FILES[i], st, PLANT_SCALE, PLANT_Y, "plant");
        return h || _plantSVG(c, st);
      };
      treeSVG = function (ti, st) {
        var h = sprite(
          "arvore_" + TREE_FILES[ti],
          st === 4 ? 2 : st,
          TREE_SCALE,
          TREE_Y,
          "tree",
        );
        return h || _treeSVG(ti, st);
      };

      /* ---- galinha e vaca ---- */
      if (FILES["animais/galinha.png"]) {
        HEN = imgTag(FILES["animais/galinha.png"]);
        $("hen").innerHTML = HEN;
      }
      if (FILES["animais/vaca.png"]) COW = imgTag(FILES["animais/vaca.png"]);
      flockKey = "";

      /* ---- cenário ---- */
      swapSvg("svg.coop", "objetos/galinheiro.png", 90, 80);
      if (FILES["objetos/galinheiro.png"])
        css += "svg.coop.img{width:clamp(70px,12vw,130px)}";
      swapSvg("svg.rocks", "objetos/pedras.png", 100, 60);
      swapSvg("svg.garden", "objetos/flores.png", 170, 110);
      swapSvg("svg.tree.t1", "objetos/arvore_enfeite.png", 80, 110);
      swapSvg("svg.tree.t2", "objetos/arvore_enfeite.png", 80, 110);
      if (FILES["objetos/espantalho.png"]) {
        $("scare").innerHTML = imgTag(FILES["objetos/espantalho.png"]);
      }
      if (FILES["objetos/borboleta_dourada.png"]) {
        BFLY = imgTag(FILES["objetos/borboleta_dourada.png"]);
      }
      var bush = FILES["objetos/moita_bloqueada.png"];
      if (bush) {
        css +=
          ".tile.lock,.tile.lock.buy{background:url('" +
          bush.src +
          "') 0 0/100% 100% !important}";
      }
      var noite = FILES["fundo_noite.png"];
      if (noite) {
        css +=
          ".app.bg[data-phase=night] .scene:not(.shade){background-image:url('" +
          noite.src +
          "') !important}";
      }

      /* ---- interface ---- */
      var moeda = FILES["ui/hud_moeda.png"],
        nivel = FILES["ui/hud_nivel.png"],
        aviso = FILES["ui/aviso_pronto.png"];
      if (moeda)
        css +=
          ".coin{background:url('" +
          moeda.src +
          "') center/contain no-repeat !important;border:0 !important;box-shadow:none !important;width:24px;height:24px}";
      if (nivel)
        css +=
          ".lvlb{background:url('" +
          nivel.src +
          "') center/contain no-repeat !important;border:0 !important;box-shadow:none !important}";
      if (aviso)
        css +=
          ".badge{background:url('" +
          aviso.src +
          "') center/contain no-repeat !important;border:0 !important;color:transparent !important;font-size:0 !important}";

      MENUS.forEach(function (m) {
        var f = FILES["ui/menu_" + m + ".png"],
          b = document.querySelector('.mi[data-p="' + m + '"]');
        if (!f || !b) return;
        var s = b.querySelector("svg");
        var im = document.createElement("img");
        im.className = "mico";
        im.src = f.src;
        im.alt = "";
        if (s) b.replaceChild(im, s);
      });

      /* ícones nas listas (Sementes e Armazém) e na barra de ferramentas */
      function decoratePanel() {
        var pre =
          open === "sementes"
            ? "semente_"
            : open === "armazem"
              ? "prod_"
              : null;
        if (!pre) return;
        $("pbody")
          .querySelectorAll(".chead")
          .forEach(function (h) {
            var dot = h.querySelector(".dot"),
              s = h.querySelector("strong");
            if (!dot || !s) return;
            var slug = SLUG[s.textContent.split(" × ")[0].trim()];
            var f = slug && FILES["icones/" + pre + slug + ".png"];
            if (!f) return;
            var im = document.createElement("img");
            im.className = "ico";
            im.src = f.src;
            im.alt = "";
            h.replaceChild(im, dot);
          });
      }
      function decorateTools() {
        document.querySelectorAll("#tools .tb").forEach(function (b) {
          var t = b.dataset.t,
            f;
          if (t === "seed") {
            var slug = SLUG[selInfo().nome];
            f = slug && FILES["icones/semente_" + slug + ".png"];
          } else f = FILES["ui/" + TOOLICON[t] + ".png"];
          if (!f) return;
          var im = document.createElement("img");
          im.className = "tico";
          im.src = f.src;
          im.alt = "";
          var dot = b.querySelector(".dot");
          if (dot) b.replaceChild(im, dot);
          else b.insertBefore(im, b.firstChild);
        });
      }
      var _renderPanel = renderPanel,
        _render = render;
      renderPanel = function () {
        _renderPanel();
        decoratePanel();
      };
      render = function () {
        _render();
        decorateTools();
      };

      /* ---- itens soltos (casinhas, animais, objetos) ---- */
      var EDIT = /editar/.test(location.hash),
        LOCAL = {},
        byId = {},
        sel = null,
        drag = null,
        app = $("app"),
        layer = document.createElement("div");
      try {
        LOCAL = JSON.parse(localStorage.getItem("rf-pos-v1") || "{}");
      } catch (e) {}
      layer.id = "placed";
      app.appendChild(layer);

      function posOf(it, m) {
        var l = LOCAL[it.id] && LOCAL[it.id][m],
          f = FIXED[it.id] && FIXED[it.id][m];
        return l || f || it[m];
      }
      function applyPos() {
        var m = mode();
        PLACED.forEach(function (it) {
          if (!it.el) return;
          var p = posOf(it, m);
          it.el.style.left = p[0] + "%";
          it.el.style.top = p[1] + "%";
          it.el.style.width = "clamp(26px," + p[2] + "vw,300px)";
          it.el.style.zIndex = Math.round(p[1]);
        });
      }
      PLACED.forEach(function (it, n) {
        var f = FILES[it.f];
        if (!f) return;
        var el = document.createElement("div");
        el.className =
          "pi" + (it.click || it.say ? " click" : "") + (EDIT ? " edit" : "");
        el.dataset.id = it.id;
        var im = imgTag(f, it.wander ? "wander" : it.idle ? "idle" : "");
        el.innerHTML = im;
        if (it.wander) {
          var img = el.firstChild;
          img.style.setProperty("--wd", it.wander + "vw");
          img.style.setProperty("--dur", 24 + (n % 5) * 5 + "s");
          img.style.setProperty("--dl", "-" + n * 4 + "s");
        }
        layer.appendChild(el);
        it.el = el;
        byId[it.id] = it;
      });
      applyPos();
      window.addEventListener("resize", applyPos);

      layer.addEventListener("click", function (e) {
        if (EDIT) return;
        var el = e.target.closest(".pi");
        if (!el) return;
        var it = byId[el.dataset.id];
        if (it.click) openPanel(it.click);
        else if (it.say) toast(it.say);
      });

      /* ---- modo editar (#editar) ---- */
      if (EDIT) {
        var box = document.createElement("div");
        box.id = "rfed";
        box.innerHTML =
          "<b>Modo editar</b>: arraste os itens. Selecionado: <b id='rfsel'>nenhum</b><br>" +
          "<button data-a='-'>Menor</button><button data-a='+'>Maior</button><button data-a='reset'>Limpar ajustes</button>" +
          "<textarea readonly rows='5'></textarea>" +
          "<small>Copie o texto acima e cole no lugar de <code>var FIXED = {};</code> no assets.js. Ajuste o celular e o computador separadamente.</small>";
        document.body.appendChild(box);
        var ta = box.querySelector("textarea");
        var round = function (a) {
          return a.map(function (v) {
            return Math.round(v * 10) / 10;
          });
        };
        var dump = function () {
          var o = {};
          PLACED.forEach(function (it) {
            if (it.el)
              o[it.id] = { d: round(posOf(it, "d")), m: round(posOf(it, "m")) };
          });
          ta.value = "var FIXED = " + JSON.stringify(o) + ";";
          $("rfsel").textContent = sel
            ? sel.id + " (" + mode() + ")"
            : "nenhum";
          PLACED.forEach(function (it) {
            if (it.el) it.el.classList.toggle("sel", it === sel);
          });
        };
        var setPos = function (it, p) {
          LOCAL[it.id] = LOCAL[it.id] || {};
          LOCAL[it.id][mode()] = round(p);
          try {
            localStorage.setItem("rf-pos-v1", JSON.stringify(LOCAL));
          } catch (e) {}
          applyPos();
          dump();
        };
        layer.addEventListener("pointerdown", function (e) {
          var el = e.target.closest(".pi");
          if (!el) return;
          var it = byId[el.dataset.id];
          sel = it;
          drag = {
            it: it,
            x0: e.clientX,
            y0: e.clientY,
            p0: posOf(it, mode()).slice(),
            ar: app.getBoundingClientRect(),
          };
          el.setPointerCapture(e.pointerId);
          e.preventDefault();
          dump();
        });
        layer.addEventListener("pointermove", function (e) {
          if (!drag) return;
          var dx = ((e.clientX - drag.x0) / drag.ar.width) * 100,
            dy = ((e.clientY - drag.y0) / drag.ar.height) * 100;
          setPos(drag.it, [drag.p0[0] + dx, drag.p0[1] + dy, drag.p0[2]]);
        });
        layer.addEventListener("pointerup", function () {
          drag = null;
        });
        box.addEventListener("click", function (e) {
          var b = e.target.closest("button");
          if (!b) return;
          if (b.dataset.a === "reset") {
            LOCAL = {};
            try {
              localStorage.removeItem("rf-pos-v1");
            } catch (er) {}
            applyPos();
            dump();
          } else if (sel) {
            var p = posOf(sel, mode()).slice();
            p[2] = Math.max(1, p[2] * (b.dataset.a === "+" ? 1.1 : 0.9));
            setPos(sel, p);
          }
        });
        dump();
      }

      /* ---- aplica o CSS e redesenha ---- */
      if (css) {
        var st1 = document.createElement("style");
        st1.textContent = css;
        document.head.appendChild(st1);
      }
      btns.forEach(function (x) {
        x.k = "";
      });
      renderFlock();
      render();
    })
    .catch(function (e) {
      console.error("[assets.js] ERRO:", e);
      if (/debug/.test(location.hash)) showDebug(String((e && e.stack) || e));
    });

  /* ================= DIAGNÓSTICO (#debug) ================= */
  function showDebug(err) {
    var d = document.createElement("div");
    d.style.cssText =
      "position:fixed;right:8px;top:8px;z-index:99;max-width:min(92vw,460px);max-height:80vh;overflow:auto;background:#2b2013;color:#fff3d6;border:2px solid #8a6238;border-radius:12px;padding:8px 10px;font:12px/1.5 monospace";
    var ok = LOG.filter(function (x) {
        return x.ok;
      }),
      no = LOG.filter(function (x) {
        return !x.ok;
      });
    d.innerHTML =
      "<b>assets.js ativo</b> (V=" +
      V +
      ")<br>" +
      (err
        ? "<span style='color:#ff8a8a'>ERRO: " +
          err.replace(/</g, "&lt;") +
          "</span><br>"
        : "") +
      "<b style='color:#9be37a'>Encontrados (" +
      ok.length +
      ")</b><br>" +
      (ok
        .map(function (x) {
          return "✔ " + x.src.split("?")[0];
        })
        .join("<br>") || "nenhum") +
      "<br><b style='color:#ffb36a'>Não encontrados (" +
      no.length +
      ")</b><br>" +
      no
        .map(function (x) {
          return (
            "✘ " +
            x.tried
              .map(function (t) {
                return "img/" + t;
              })
              .join(" | ")
          );
        })
        .join("<br>");
    document.body.appendChild(d);
  }
})();
(function () {
  var st = document.createElement("style");
  st.textContent =
    ".overlay{background:transparent !important;backdrop-filter:none !important;-webkit-backdrop-filter:none !important}" +
    ".app.modal .pw,.app.modal .pw.bed::before,.app.modal .spr svg,.app.modal .hen svg,.app.modal .cow svg," +
    ".app.modal .coop,.app.modal .sheep,.app.modal .duck,.app.modal .nest,.app.modal .scare,.app.modal .pi img," +
    ".app.modal .fly svg{filter:none !important}";
  document.head.appendChild(st);

  var _open = openPanel,
    _close = closePanel;
  openPanel = function (n) {
    $("app").classList.add("modal");
    _open(n);
  };
  closePanel = function () {
    $("app").classList.remove("modal");
    _close();
  };
})();
/* galinhas e pintinho ficam perto do galinheiro */
(function () {
  function near() {
    var chick = document.querySelector('.pi[data-id="pintinho"]');
    if (chick)
      chick.style.display =
        S && S.coop && S.hens > 0 && (S.eggsLaid || 0) >= 2 ? "" : "none";
    var coop = document.querySelector("svg.coop");
    if (!coop || !S || !S.coop) return;
    var cr = coop.getBoundingClientRect();
    if (!cr.width) return;

    /* referência: o contêiner da câmera (se existir) tem o zoom exato */
    var cam = document.getElementById("rfCam"),
      app = $("app"),
      camR = cam ? cam.getBoundingClientRect() : null,
      k = camR && app.clientWidth ? camR.width / app.clientWidth : 1;
    if (!k || !isFinite(k)) k = 1;

    /* converte um ponto da tela para coordenadas locais do cenário */
    function localX(el, x) {
      if (camR) return (x - camR.left) / k;
      return x - el.offsetParent.getBoundingClientRect().left;
    }
    function localY(el, y) {
      if (camR) return (y - camR.top) / k;
      return y - el.offsetParent.getBoundingClientRect().top;
    }
    /* só grava se mudou mais de 0,5 px (evita tremer) */
    function put(el, prop, v) {
      var old = parseFloat(el.style.getPropertyValue(prop));
      if (isNaN(old) || Math.abs(old - v) > 0.5)
        el.style.setProperty(prop, v.toFixed(1) + "px", "important");
    }

    var cx = cr.left + cr.width / 2;

    /* galinhas: a #hen + as do #flock, espalhadas logo abaixo do galinheiro */
    var hens = [$("hen")].concat(
      Array.prototype.slice.call(document.querySelectorAll("#flock .hen")),
    );
    var vis = hens.filter(function (h) {
      return h && !h.hidden && h.offsetParent;
    });
    vis.forEach(function (h, i) {
      var w = h.offsetWidth || 40,
        hh = h.offsetHeight || 40,
        dx = (i - (vis.length - 1) / 2) * (cr.width * 0.3),
        row = i % 2 ? 0.1 : -0.05;
      put(h, "left", localX(h, cx + dx) - w / 2);
      put(h, "top", localY(h, cr.bottom) - hh * (0.75 + row));
      h.style.setProperty("margin", "0", "important");
    });

    /* pintinho: ao lado do galinheiro, na altura do chão dele */
    var pi = document.querySelector('.pi[data-id="pintinho"]');
    if (pi && pi.offsetParent) {
      put(pi, "left", localX(pi, cr.right - cr.width * 0.1));
      put(pi, "top", localY(pi, cr.bottom) - (pi.offsetHeight || 20) * 0.9);
    }
  }
  setInterval(near, 400);
  window.addEventListener("resize", near);
  near();
})();
/* grama.png nos canteiros bloqueados (igual ao terra.png nos liberados) */
(function () {
  var V = "1";
  var i = new Image();
  i.onload = function () {
    var st = document.createElement("style");
    st.textContent =
      /* some o fundo antigo do botão (menos quando está "armado" para comprar) */
      ".tile.lock:not(.armed){background:none !important}" +
      /* losango de grama, mesma geometria do terra.png */
      ".pw:not(.bed)::before{content:'';position:absolute;left:0;top:0;width:100%;" +
      "height:calc(var(--tw)*.5 + var(--th));clip-path:none;" +
      "background:url(img/grama.png?v=" +
      V +
      ") 0 0/100% auto no-repeat;" +
      "filter:drop-shadow(0 2px 0 rgba(0,0,0,.25))}" +
      ".pw:not(.bed)::after{display:none}" +
      ".pw:not(.bed):hover::before{filter:brightness(1.15) drop-shadow(0 2px 0 rgba(0,0,0,.25))}" +
      /* canteiro "armado": realça a grama em vez de pintar por cima */
      ".pw:has(.tile.armed)::before{filter:brightness(1.3) saturate(1.2) drop-shadow(0 2px 0 rgba(0,0,0,.25))}" +
      ".app.modal .pw:not(.bed)::before{filter:none !important}";
    document.head.appendChild(st);
  };
  i.src = "img/grama.png?v=" + V;
})();
