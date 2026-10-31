/* erva.js - troca o desenho das ervas daninhas pela imagem img/erva.png */
(function () {
  "use strict";

  var SRC = "img/erva.png?v=1";
  var LARGURA = 0.18; /* era 0.38 */
  var BASE = 0.4;
  var ALTURA = LARGURA * (192 / 187);

  var im = new Image();
  im.onload = function () {
    /* 1) troca o HTML da erva: agora é uma <img> */
    WEED = '<img class="wd" src="' + SRC + '" alt="" draggable="false">';

    /* 2) CSS: mesma posição de antes, mas para a <img> */
    var css =
      "#app .pw img.wd{" +
      "position:absolute;left:50%;display:block;" +
      "width:calc(var(--tw)*" +
      LARGURA +
      ")!important;" +
      "height:auto!important;" +
      "margin-left:calc(var(--tw)*-" +
      (LARGURA / 2).toFixed(4) +
      ")!important;" +
      "top:calc(var(--tw)*" +
      (BASE - ALTURA).toFixed(4) +
      ")!important;" +
      "object-fit:contain;pointer-events:none;" +
      "filter:drop-shadow(0 2px 1px rgba(30,15,0,.4))!important}";
    var st = document.createElement("style");
    st.id = "erva-css";
    st.textContent = css;
    document.head.appendChild(st);

    /* 3) força o jogo a redesenhar todos os canteiros */
    btns.forEach(function (x) {
      x.k = "";
    });
    render();
  };
  im.onerror = function () {
    console.warn(
      "[erva.js] não achei " + SRC + " (confira o nome e a pasta img/)",
    );
  };
  im.src = SRC;
})();
