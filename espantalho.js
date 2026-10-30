/* espantalho.js - prende o espantalho na borda da plantação */
(function () {
  var app = document.getElementById("app"),
    sc = document.getElementById("scare"),
    f = document.getElementById("field");
  if (!app || !sc || !f) return;

  /* ajustes (em "canteiros": 1 = largura de um canteiro) */
  var TAMANHO = 0.7; /* largura do espantalho */
  var DX = -0.1; /* negativo = mais para a esquerda */
  var DY = -0.15; /* negativo = mais para cima */
  var PROP = 512 / 388; /* altura / largura do PNG */

  function pos() {
    if (sc.hidden) return;
    var a = app.getBoundingClientRect(),
      r = f.getBoundingClientRect(),
      tw = r.width / 6,
      w = tw * TAMANHO,
      h = w * PROP,
      bx = r.left - a.left + tw * 1.7 + tw * DX /* meio da borda esquerda */,
      by = r.top - a.top + tw * 0.80 + tw * DY;
    sc.style.setProperty("width", w + "px", "important");
    sc.style.setProperty("left", bx - w / 2 + "px", "important");
    sc.style.setProperty("top", by - h + "px", "important");
  }
  setInterval(pos, 400);
  window.addEventListener("resize", pos);
  pos();
})();
