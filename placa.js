/* ===========================================================
   placa.js - troca o cadeado e a moeda dos lotes bloqueados por uma
   plaquinha de "à venda" com o preço escrito na tábua.

   COMO USAR: salve na mesma pasta do index.html, ponha a imagem em
   img/placa.png e coloque DEPOIS do almofada.js no index.html:
       <script src="placa.js"></script>

   As placas ficam numa camada própria (#field > .placas), por cima dos
   canteiros e também da moldura de pedras. Assim nem a terra da frente
   nem a moldura cortam a placa.
   =========================================================== */
(function () {
  "use strict";

  /* ================= AJUSTES (mexa à vontade) ================= */

  /* arquivo da imagem (mude o ?v= para forçar o navegador a recarregar) */
  var SRC = "img/placa.png?v=2";

  /* largura da placa, em fração da largura do canteiro (0.36 = 36%) */
  var TAMANHO = 0.38;

  /* onde a base da estaca fica no canteiro: 0 = topo, 1 = embaixo */
  var BASE_Y = 0.6;

  /* tamanho do número, em fração da largura da placa */
  var TEXTO = 0.27;

  /* inclinação do texto (0 = reto, o preço fica na estaca) */
  var ANGULO = 0;

  /* ================= GEOMETRIA DA IMAGEM (não precisa mexer) =================
     imagem 360 x 405. Base da estaca em x = 53,7%. O preço fica na estaca,
     abaixo do desenho da tábua, em (52,2% , 72%). */
  var BASE_X = 53.7;
  var CX = 52.2;
  var CY = 72;

  var SH = "drop-shadow(0 2px 1px rgba(30,15,0,.4))";
  var TR = "translate(-" + BASE_X + "%,-100%)";
  var Q = "#app #field > .placas > .placa";
  var css =
    /* some o cadeado e a moeda antigos */
    "#app #field .pw:not(.bed) .lk{opacity:0!important}" +
    /* camada das placas: acima da moldura de pedras (a metade da frente da
       moldura usa z-index 50 e cobre o lote do canto de trás) */
    "#app #field > .placas{position:absolute;left:0;top:0;width:0;height:0;" +
    "z-index:60;pointer-events:none;overflow:visible}" +
    /* a placa em si */
    Q +
    "{position:absolute;width:calc(var(--tw)*" +
    TAMANHO +
    ");" +
    "aspect-ratio:360/405;transform:" +
    TR +
    ";transform-origin:" +
    BASE_X +
    "% 100%;" +
    "pointer-events:none;filter:" +
    SH +
    " brightness(.7) saturate(.75);" +
    "transition:transform .12s,filter .12s}" +
    Q +
    " img{display:block;width:100%;height:100%;" +
    "-webkit-user-drag:none;user-select:none}" +
    /* o preço, na estaca logo abaixo da tábua */
    Q +
    " .pr{position:absolute;left:" +
    CX +
    "%;top:" +
    CY +
    "%;" +
    "transform:translate(-50%,-50%) rotate(" +
    ANGULO +
    "deg);" +
    "font-family:var(--font-display);font-weight:400;line-height:1;" +
    "font-size:calc(var(--tw)*" +
    (TAMANHO * TEXTO).toFixed(4) +
    ");" +
    "color:#fff6d8;letter-spacing:.01em;white-space:nowrap;" +
    "-webkit-text-stroke:calc(var(--tw)*.016) #3a1e08;paint-order:stroke fill;" +
    "text-shadow:0 1px 0 rgba(60,25,5,.55);font-variant-numeric:tabular-nums}" +
    /* dá para comprar: cor normal */
    Q +
    ".buy{filter:" +
    SH +
    "}" +
    /* sem moedas suficientes: preço avermelhado */
    Q +
    ".poor .pr{color:#ff9a88}" +
    /* mouse em cima de um lote que dá para comprar */
    Q +
    ".buy.hov{transform:" +
    TR +
    " scale(1.08);filter:" +
    SH +
    " brightness(1.1)}" +
    /* canteiro "armado" (segundo toque confirma a compra) */
    Q +
    ".armed{transform:" +
    TR +
    " scale(1.14);" +
    "filter:" +
    SH +
    " brightness(1.2) saturate(1.2)}";

  var st = document.createElement("style");
  st.id = "placa-css";
  st.textContent = css;
  document.head.appendChild(st);

  /* pré-carrega a imagem */
  var pre = new Image();
  pre.src = SRC;

  var field = document.getElementById("field");
  if (!field) return;
  var layer = null;
  var hovPw = null;

  function getLayer() {
    if (!layer || layer.parentNode !== field) {
      layer = document.createElement("div");
      layer.className = "placas";
      layer.setAttribute("aria-hidden", "true");
      field.appendChild(layer);
    }
    return layer;
  }

  /* garante uma placa por lote bloqueado, copia o preço e acompanha o estado */
  function sync() {
    var L = getLayer(),
      pws = field.querySelectorAll(".pw"),
      i,
      pw,
      p,
      lk,
      t,
      pr,
      buy,
      alive = [];

    for (i = 0; i < pws.length; i++) {
      pw = pws[i];
      if (pw.classList.contains("bed")) continue;
      alive.push(pw);
      p = pw._placa;
      if (!p || p.parentNode !== L) {
        p = document.createElement("div");
        p.className = "placa";
        p.innerHTML =
          '<img src="' +
          SRC +
          '" alt="" draggable="false"><span class="pr"></span>';
        p._pw = pw;
        pw._placa = p;
        L.appendChild(p);
      }
      /* posição e escala (--tw em pixels, igual ao do canteiro) */
      p.style.setProperty("--tw", pw.offsetWidth + "px");
      p.style.left = pw.offsetLeft + pw.offsetWidth / 2 + "px";
      p.style.top = pw.offsetTop + pw.offsetHeight * BASE_Y + "px";

      /* preço copiado do selo antigo */
      lk = pw.querySelector(".lk");
      t = lk ? (lk.textContent || "").trim() : "";
      pr = p.lastChild;
      if (pr.textContent !== t) pr.textContent = t;

      /* estados */
      buy = !!pw.querySelector(".tile.buy");
      p.classList.toggle("buy", buy);
      p.classList.toggle("armed", !!pw.querySelector(".tile.armed"));
      p.classList.toggle("poor", pw.dataset.poor === "1");
      p.classList.toggle("hov", pw === hovPw);
    }

    /* remove placas de lotes que viraram terra ou deixaram de existir */
    for (i = L.children.length - 1; i >= 0; i--) {
      p = L.children[i];
      if (alive.indexOf(p._pw) < 0) L.removeChild(p);
    }
  }

  var pend = false;
  function agenda() {
    if (pend) return;
    pend = true;
    requestAnimationFrame(function () {
      pend = false;
      sync();
    });
  }

  if (window.MutationObserver) {
    new MutationObserver(agenda).observe(field, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  /* mouse em cima do lote: placa cresce de leve */
  field.addEventListener("mouseover", function (e) {
    var pw = e.target.closest ? e.target.closest(".pw") : null;
    if (pw !== hovPw) {
      hovPw = pw;
      agenda();
    }
  });
  field.addEventListener("mouseleave", function () {
    hovPw = null;
    agenda();
  });

  window.addEventListener("resize", agenda);
  setInterval(sync, 400);
  sync();
})();
