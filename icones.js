/* icones.js - Armazém: usa prod_X.png; se não existir, usa semente_X.png; se também não, mantém a bolinha. */
(function () {
  var V = "2"; /* mesmo V do assets.js */
  var PROD = {
    Cenoura: ["caixote_cenouras", "cenoura", "cenoura"],
    Milho: ["caixote_milhos", "milho", "milho"],
    Tomate: ["caixote_tomate", "tomate", "tomate"],
    Morango: ["caixote_morango", "morango", "morango"],
    Abóbora: ["caixote_abobora", "abobora", "abobora"],
    Girassol: ["caixote_girassol", "girassol", "girassol"],
    Laranja: ["caixote_laranja", "laranja", "laranjeira"],
    Manga: ["caixote_manga", "manga", "mangueira"],
    Maçã: ["caixote_macas", "maca", "macieira"],
    Ovo: ["caixote_ovo", "ovo", null],
    Leite: ["caixote_leite", "leite", null],
  };
  function tenta(lista, ok) {
    (function next(i) {
      if (i >= lista.length) return;
      var im = new Image();
      im.onload = function () {
        ok(lista[i]);
      };
      im.onerror = function () {
        next(i + 1);
      };
      im.src = lista[i];
    })(0);
  }
  function decorar() {
    if (typeof open === "undefined" || open !== "armazem") return;
    var heads = document.querySelectorAll("#pbody .chead");
    heads.forEach(function (h) {
      var dot = h.querySelector(".dot"),
        s = h.querySelector("strong");
      if (!dot || !s || dot.dataset.tried) return;
      dot.dataset.tried = "1";
      var m = PROD[s.textContent.split(" × ")[0].trim()];
      if (!m) return;
      var lista = [];
      ["img/icones/", "img/"].forEach(function (d) {
        lista.push(d + m[0] + ".png?v=" + V); // caixote (1.ª tentativa)
      });
      ["img/icones/", "img/"].forEach(function (d) {
        lista.push(d + "prod_" + m[1] + ".png?v=" + V); // prod_X
      });
      if (m[2])
        ["img/icones/", "img/"].forEach(function (d) {
          lista.push(d + "semente_" + m[2] + ".png?v=" + V); // semente (último recurso)
        });
      tenta(lista, function (src) {
        if (!dot.parentNode) return;
        var im = document.createElement("img");
        im.className = "ico";
        im.src = src;
        im.alt = "";
        im.draggable = false;
        dot.parentNode.replaceChild(im, dot);
      });
    });
  }
  new MutationObserver(decorar).observe(document.getElementById("pbody"), {
    childList: true,
  });
  var st = document.createElement("style");
  st.textContent = "#pbody .chead .ico{width:40px;height:40px}";
  document.head.appendChild(st);
})();
