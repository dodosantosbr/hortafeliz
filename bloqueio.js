/* bloqueio.js - cadeado e preço legíveis nos canteiros bloqueados */
(function () {
  var V = "1";
  /* UM ajuste só: 1 = tamanho padrão, 0.8 = menor, 1.2 = maior */
  var ESCALA = 1;

  var u =
    "calc(var(--tw)*" + 0.01 * ESCALA + ")"; /* 1 unidade = 1% do canteiro */
  var css =
    ".lk{gap:calc(" +
    u +
    "*3);color:#fff;font-family:var(--font-body);font-weight:800;" +
    "font-size:calc(" +
    u +
    "*13);line-height:1;letter-spacing:-.01em;" +
    "-webkit-text-stroke:calc(" +
    u +
    "*3.5) #1b2a0e;paint-order:stroke fill;" +
    "text-shadow:0 1px 0 rgba(0,0,0,.5);font-variant-numeric:tabular-nums;" +
    "transition:transform .12s}" +
    ".lk svg{flex:none;box-sizing:border-box;width:calc(" +
    u +
    "*17);height:calc(" +
    u +
    "*17);" +
    "padding:calc(" +
    u +
    "*3);color:#fff3d6;background:radial-gradient(circle at 35% 30%,#6b4424,#2b1a0a);" +
    "border:max(1px,calc(" +
    u +
    "*1.6)) solid #ffd54a;border-radius:50%;" +
    "box-shadow:0 1px 0 rgba(0,0,0,.45);-webkit-text-stroke:0}" +
    /* longe demais para comprar: só o cadeado, pequeno e discreto */
    ".pw:not(:has(.tile.buy)) .lk svg{width:calc(" +
    u +
    "*13);height:calc(" +
    u +
    "*13);" +
    "padding:calc(" +
    u +
    "*2.2);opacity:.65}" +
    /* dá para comprar: moeda depois do preço */
    ".pw:has(.tile.buy) .lk::after{content:'';flex:none;order:3;" +
    "width:calc(" +
    u +
    "*14);height:calc(" +
    u +
    "*14);border-radius:50%;" +
    "background:radial-gradient(circle at 35% 30%,#fff1a6,#e3a900 55%,#b98100);" +
    "border:1.5px solid #8a6200}" +
    ".pw:has(.tile.buy):hover .lk{transform:scale(1.1)}" +
    /* sem moedas suficientes */
    ".pw[data-poor='1'] .lk{color:#ffb3a6}" +
    /* canteiro "armado" (segundo toque confirma a compra) */
    ".pw:has(.tile.armed) .lk{color:#fff3a0;transform:scale(1.12)}";

  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* usa a moeda do HUD se existir */
  var lista = ["img/ui/hud_moeda.png?v=" + V, "img/hud_moeda.png?v=" + V];
  (function next(i) {
    if (i >= lista.length) return;
    var im = new Image();
    im.onload = function () {
      st.textContent +=
        ".pw:has(.tile.buy) .lk::after{background:url('" +
        lista[i] +
        "') center/contain no-repeat !important;border:0 !important;box-shadow:none !important}";
    };
    im.onerror = function () {
      next(i + 1);
    };
    im.src = lista[i];
  })(0);

  /* marca em vermelho os canteiros que você ainda não pode pagar */
  function poor() {
    if (typeof S === "undefined" || typeof btns === "undefined") return;
    var pr = price();
    btns.forEach(function (x) {
      var comprar = x.b.classList.contains("buy");
      x.w.dataset.poor = comprar && S.coins < pr ? "1" : "0";
    });
  }
  setInterval(poor, 400);
  poor();
})();
