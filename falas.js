/* falas.js - carregar DEPOIS do andar.js
   Os bichos "falam" sozinhos: de tempos em tempos aparece um balãozinho
   em cima de um animal com o mesmo texto que ele diz quando você toca nele.
   Só de dia, só com o jogo visível e sem painel aberto. */
(function () {
  if (/editar/.test(location.hash)) return;

  /* ================= CONFIGURAÇÃO ================= */
  var MIN_S = 3 /* intervalo mínimo entre falas (segundos) */,
    MAX_S = 8 /* intervalo máximo */,
    DURACAO = 2.6; /* quanto tempo o balão fica na tela (segundos) */

  /* Fala de cada bicho (mesmos textos do "say" do assets.js). */
  var FALAS = {
    cachorro: ["Au au!"],
    porco: ["Óinc óinc!"],
    cabra: ["Méééé!"],
    burro: ["Iiiaaa!"],
    ovelha: ["Béé!"],
    pato: ["Quá!"],
    pintinho: ["Piu piu!"],
    gato: ["Miau!"],
  };
  var FALA_GALINHA = ["Có có!"];
  var FALA_VACA = ["Muuu!"];

  /* ================= CSS ================= */
  var st = document.createElement("style");
  st.textContent =
    ".fala{position:absolute;z-index:7;pointer-events:none;white-space:nowrap;" +
    "background:#fffdf2;color:#2c3a20;border:2px solid #3a2f2a;border-radius:12px;" +
    "padding:3px 9px;font:700 12px/1.3 var(--font-body,sans-serif);" +
    "box-shadow:0 2px 0 rgba(0,0,0,.25);animation:falaup " +
    DURACAO +
    "s ease-out forwards}" +
    ".fala::after{content:'';position:absolute;left:50%;bottom:-7px;margin-left:-5px;" +
    "border:5px solid transparent;border-top:6px solid #3a2f2a;border-bottom:0}" +
    ".fala::before{content:'';position:absolute;left:50%;bottom:-4px;margin-left:-3px;z-index:1;" +
    "border:3px solid transparent;border-top:4px solid #fffdf2;border-bottom:0}" +
    "@keyframes falaup{0%{opacity:0;transform:translateY(6px) scale(.85)}" +
    "12%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1;transform:translateY(-4px)}" +
    "100%{opacity:0;transform:translateY(-10px)}}" +
    "@media (prefers-reduced-motion:reduce){.fala{animation:falafade " +
    DURACAO +
    "s linear forwards}" +
    "@keyframes falafade{0%,85%{opacity:1}100%{opacity:0}}}";
  document.head.appendChild(st);

  /* ================= AUXILIARES ================= */
  var app = document.getElementById("app");
  if (!app) return;
  function rnd(a, b) {
    return a + Math.random() * (b - a);
  }
  function pick(a) {
    return a[Math.floor(Math.random() * a.length)];
  }

  /* lista os bichos que podem falar agora: [elemento visível, texto] */
  function candidatos() {
    var out = [];
    document.querySelectorAll("#placed .pi[data-id]").forEach(function (el) {
      var f = FALAS[el.dataset.id];
      if (f && el.offsetParent)
        out.push({ el: el, txt: pick(f), id: el.dataset.id });
    });
    var hens = [document.getElementById("hen")].concat(
      Array.prototype.slice.call(document.querySelectorAll("#flock .hen")),
    );
    hens.forEach(function (h, i) {
      if (h && !h.hidden && h.offsetParent)
        out.push({ el: h, txt: pick(FALA_GALINHA), id: "hen" + i });
    });
    document.querySelectorAll("#flock .cow").forEach(function (c, i) {
      if (!c.hidden && c.offsetParent)
        out.push({ el: c, txt: pick(FALA_VACA), id: "cow" + i });
    });
    return out;
  }

  var ultimoId = "";
  function falar() {
    var noite = app.getAttribute("data-phase") === "night";
    var overlay = document.getElementById("overlay");
    if (noite || document.hidden || (overlay && !overlay.hidden)) return;

    var lista = candidatos().filter(function (c) {
      return c.id !== ultimoId;
    });
    if (!lista.length) return;
    var c = pick(lista);

    /* mede o que está visível do bicho (o quadro animado ou a imagem) */
    var alvo =
      c.el.querySelector(".qd") || c.el.querySelector("img,svg") || c.el;
    var r = alvo.getBoundingClientRect();
    if (!r.width || !r.height) return;
    ultimoId = c.id;

    var ar = app.getBoundingClientRect();
    var b = document.createElement("div");
    b.className = "fala";
    b.textContent = c.txt;
    app.appendChild(b);
    var w = b.offsetWidth,
      h = b.offsetHeight;
    var x = r.left - ar.left + r.width / 2 - w / 2;
    var y = r.top - ar.top - h - 8;
    b.style.left = Math.max(4, Math.min(ar.width - w - 4, x)) + "px";
    b.style.top = Math.max(60, y) + "px";
    setTimeout(
      function () {
        b.remove();
      },
      DURACAO * 1000 + 100,
    );
  }

  /* ================= LOOP ================= */
  function agenda() {
    setTimeout(
      function () {
        try {
          falar();
        } catch (e) {}
        agenda();
      },
      rnd(MIN_S, MAX_S) * 1000,
    );
  }
  /* espera os bichos do #placed aparecerem antes de começar */
  setTimeout(agenda, 4000);
})();
