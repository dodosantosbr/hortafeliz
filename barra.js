/* ===========================================================
   barra.js - barra de progresso só aparece ao tocar na planta.
   Fica verde e mostra "Nome · tempo que falta" dentro dela.
   =========================================================== */
(function () {
  "use strict";

  /* ================= AJUSTES ================= */
  var DURACAO = 4000; /* quanto tempo a barra fica visível (ms) */

  /* ================= CSS ================= */
  var css =
    /* escondida por padrão */
    "#app .pw .pbar{display:none!important}" +
    /* visível só quando marcada com .show */
    "#app .pw .pbar.show{display:block!important;" +
    "position:absolute;left:50%;right:auto;bottom:auto;" +
    "width:auto!important;min-width:calc(var(--tw)*.9);" +
    "margin-left:0!important;transform:translateX(-50%);" +
    "top:calc(var(--tw)*.3);height:16px!important;z-index:8;" +
    "border:2px solid #1f4a0c;border-radius:9px;" +
    "background:rgba(20,50,10,.8);overflow:hidden;" +
    "box-shadow:0 2px 0 rgba(0,0,0,.35);white-space:nowrap}" +
    /* preenchimento verde */
    "#app .pw .pbar.show i{position:absolute;left:0;top:0;bottom:0;" +
    "height:auto!important;" +
    "background:linear-gradient(#a6f07a,#3f9a2a)!important}" +
    /* texto dentro da barra */
    "#app .pw .pbar .bt{position:relative;display:block;padding:0 8px;" +
    "font:700 10px/12px var(--font-body,sans-serif);color:#fff;" +
    "text-align:center;text-shadow:0 1px 1px rgba(0,0,0,.75);" +
    "pointer-events:none}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ================= LÓGICA ================= */
  var SHOWN = {}; /* índice do canteiro -> hora em que a barra some */

  function info(i) {
    var p = S.plots[i];
    if (!p || !p.on) return null;
    if (isTree(p)) {
      if (tReady(p)) return null;
      var T = TREES[p.t];
      return {
        n: T.nome,
        s: p.m ? T.rebrota - p.rb / 1000 : T.tempo - p.pr / 1000,
      };
    }
    if (p.c < 0) return null;
    var C = CROPS[p.c];
    if (frac(p) >= 1) return null;
    return { n: C.nome, s: C.tempo - p.pr / 1000 };
  }

  function apply() {
    var now = Date.now();
    btns.forEach(function (x, i) {
      var bar = x.o.querySelector(".pbar");
      if (!bar) return;
      var on = SHOWN[i] && SHOWN[i] > now;
      var d = on && info(i);
      if (!d) {
        bar.classList.remove("show");
        return;
      }
      var t = bar.querySelector(".bt");
      if (!t) {
        t = document.createElement("span");
        t.className = "bt";
        bar.appendChild(t);
      }
      var txt = d.n + " · " + fmt(Math.max(0, d.s));
      if (t.textContent !== txt) t.textContent = txt;
      bar.classList.add("show");
    });
  }

  /* toque num canteiro: mostra a barra dele */
  $("field").addEventListener("click", function (e) {
    var b = e.target.closest(".tile");
    if (!b) return;
    SHOWN[+b.dataset.i] = Date.now() + DURACAO;
    apply();
  });

  /* quando o jogo redesenha um canteiro, reaplica na hora (sem piscar) */
  var _render = render;
  render = function () {
    _render();
    apply();
  };

  /* mantém o tempo atualizando enquanto a barra está aberta */
  setInterval(apply, 250);
})();
