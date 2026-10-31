/* espantalho.js - prende o espantalho na borda da plantação
   (funciona com o zoom/câmera do camera.js) */
(function () {
  var app = document.getElementById("app"),
    sc = document.getElementById("scare"),
    f = document.getElementById("field");
  if (!app || !sc || !f) return;

  /* ajustes (em "canteiros": 1 = largura de um canteiro) */
  var TAMANHO = 0.7; /* largura do espantalho */
  var DX = -0.1; /* negativo = mais para a esquerda */
  var DY = -0.47; /* negativo = mais para cima */
  var PROP = 512 / 388; /* altura / largura do PNG */

  /* só grava se mudou mais de 0,5 px (evita tremer) */
  function put(prop, v) {
    var old = parseFloat(sc.style.getPropertyValue(prop));
    if (isNaN(old) || Math.abs(old - v) > 0.5)
      sc.style.setProperty(prop, v.toFixed(1) + "px", "important");
  }

  function pos() {
    if (sc.hidden) return;

    /* origem: o contêiner da câmera (se existir) já inclui zoom e arrasto */
    var cam = document.getElementById("rfCam"),
      o = (cam || app).getBoundingClientRect(),
      k = app.clientWidth ? o.width / app.clientWidth : 1;
    if (!k || !isFinite(k)) k = 1;

    var r = f.getBoundingClientRect(),
      tw = r.width / k / 6 /* largura do canteiro em coordenadas locais */,
      w = tw * TAMANHO,
      h = w * PROP,
      bx = (r.left - o.left) / k + tw * 1.7 + tw * DX,
      by = (r.top - o.top) / k + tw * 0.8 + tw * DY;

    put("width", w);
    put("left", bx - w / 2);
    put("top", by - h);
  }

  setInterval(pos, 400);
  window.addEventListener("resize", pos);
  pos();
})();
