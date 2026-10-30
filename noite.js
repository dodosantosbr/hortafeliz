/* noite.js - carregar DEPOIS do jogo.js (e do curral.js, se usar)
   De noite: escurece casa, galinheiro e objetos, mas MANTEM janelas e luzes acesas
   (com um brilho suave). Animais so escurecem. */
(function () {
  /* Objetos que tem janelas/luzes e devem manter o brilho.
     Use o "id" do PLACED do assets (cada item abaixo e um seletor CSS). */
  var LIT = [
    "[data-id^=casinha]",
    "[data-id=celeiro]",
    "[data-id=poco]",
    "[data-id=caixa_correio]",
  ];

  /* Escurecimento dos animais */
  var DARK = "brightness(.62) saturate(.85) sepia(.3) hue-rotate(185deg)";

  /* Ajuste fino da deteccao de luz: o ultimo numero da linha "lights"
     (-4). Mais negativo (-5) = so as luzes mais fortes acendem.
     Menos negativo (-3) = acende mais coisas. */
  var svg = document.createElement("div");
  svg.innerHTML =
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<filter id="rfNightLit" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">' +
    '<feColorMatrix in="SourceGraphic" type="matrix" values="0.45 0 0 0 0  0 0.52 0 0 0  0 0 0.75 0 0.02  0 0 0 1 0" result="dark"/>' +
    '<feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 4 -6 0 -4" result="lights"/>' +
    '<feGaussianBlur in="lights" stdDeviation="3" result="glow"/>' +
    '<feColorMatrix in="glow" type="matrix" values="1 0 0 0 0.1  0 1 0 0 0.05  0 0 1 0 0  0 0 0 1.6 0" result="glow2"/>' +
    '<feMerge><feMergeNode in="dark"/><feMergeNode in="glow2"/><feMergeNode in="lights"/></feMerge>' +
    "</filter></svg>";
  document.body.appendChild(svg.firstChild);

  var N = "html .app.bg[data-phase=night] ";
  var css =
    N +
    "svg.house," +
    N +
    "svg.coop{filter:url(#rfNightLit) !important}" +
    N +
    "#placed .pi img," +
    N +
    "#hen," +
    N +
    ".flock .hen," +
    N +
    ".flock .cow," +
    N +
    ".scare{filter:" +
    DARK +
    " !important}" +
    N +
    "#placed .pi .qd," +
    N +
    "#hen .qd," +
    N +
    ".flock .hen .qd," +
    N +
    ".flock .cow .qd{filter:" +
    DARK +
    " drop-shadow(0 3px 2px rgba(0,0,0,.28)) !important}" +
    LIT.map(function (s) {
      return N + "#placed .pi" + s + " img";
    }).join(",") +
    "{filter:url(#rfNightLit) !important}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);
})();
