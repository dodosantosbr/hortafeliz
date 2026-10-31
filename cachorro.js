/* ===========================================================
   Roça Feliz - cachorro.js
   O cachorro agora é COMPRADO na Loja (aba Animais) e não vem mais de graça.
   Ele já vem com a casinha básica. Na aba Decoração da Loja o jogador
   compra e troca o modelo da casinha do cachorro.

   Carregar no index.html, junto dos outros (pode ser logo depois do porco.js):
   <script src="cachorro.js"></script>

   Depende do loja.js ter "cachorro" na lista ANIMAIS e de chamar
   window.rfDogDeco() dentro de houses() (veja as 2 linhas a alterar).

   Para as defesas contra invasores, use: window.rfTemCachorro()
   =========================================================== */
(function () {
  if (
    typeof S === "undefined" ||
    typeof PANELS === "undefined" ||
    typeof openPanel !== "function"
  )
    return;

  /* ================= AJUSTES ================= */
  var DOG_PRICE = 300; /* preço do cachorro (já com a casinha básica) */
  var V = "1"; /* mude ao trocar um PNG (evita cache) */

  /* Modelos da casinha. f = arquivo dentro de img/. preco 0 = já vem com o cachorro.
     Só aparece na loja o modelo cujo PNG existir. Para adicionar mais, copie uma linha. */
  var DOG_HOUSES = [
    { id: "c1", nome: "Casinha simples", f: "casinha_cachorro.png", preco: 0 },
    { id: "c2", nome: "Casinha 2", f: "casinha_cachorro_2.png", preco: 50000 },
    { id: "c3", nome: "Casinha 3", f: "casinha_cachorro_3.png", preco: 70000 },
    { id: "c4", nome: "Casinha 4", f: "casinha_cachorro_4.png", preco: 90000 },
  ];

  /* ---------- CSS: escondido até comprar ---------- */
  var st = document.createElement("style");
  st.textContent =
    '.pi[data-id="cachorro"],.pi[data-id="casinha_cachorro"]{display:none}' +
    '.app.has-cachorro .pi[data-id="cachorro"],.app.has-cachorro .pi[data-id="casinha_cachorro"]{display:block}' +
    ".sh-sep{grid-column:1/-1;font-weight:700;font-size:13px;color:var(--ink-soft);" +
    "border-top:2px solid var(--line);padding-top:10px;margin-top:4px}";
  document.head.appendChild(st);

  /* ---------- quais modelos têm imagem ---------- */
  var HAVE = { c1: true };
  DOG_HOUSES.forEach(function (h) {
    if (h.id === "c1") return;
    var im = new Image();
    im.onload = function () {
      HAVE[h.id] = true;
      if (open === "loja") renderPanel();
    };
    im.src = "img/" + h.f + "?v=" + V;
  });

  function modelo(id) {
    return DOG_HOUSES.filter(function (h) {
      return h.id === id;
    })[0];
  }
  window.rfTemCachorro = function () {
    return !!S.cachorro;
  };

  /* ---------- aparência no sítio ---------- */
  function applyModel() {
    var el = document.querySelector('.pi[data-id="casinha_cachorro"] img');
    if (!el) return;
    if (!el.dataset.orig) el.dataset.orig = el.getAttribute("src");
    var m = modelo(S.dogHouse),
      want =
        m && m.id !== "c1" && HAVE[m.id]
          ? "img/" + m.f + "?v=" + V
          : el.dataset.orig;
    if (el.getAttribute("src") !== want) el.setAttribute("src", want);
  }
  function sync() {
    if (!S.dogHouses) S.dogHouses = {};
    if (!S.dogHouse) S.dogHouse = "c1";
    /* no modo #editar mostra sempre, para poder arrastar */
    $("app").classList.toggle(
      "has-cachorro",
      !!S.cachorro || /editar/.test(location.hash),
    );
    applyModel();
  }
  setInterval(sync, 1000);
  sync();

  /* ---------- Loja, aba Animais: item do cachorro ---------- */
  function shopCachorro() {
    var has = !!S.cachorro;
    return (
      '<div class="item"><div><strong>Cachorro</strong><span class="note">Guarda a fazenda contra invasores. Já vem com uma casinha. Compra única.</span></div>' +
      '<div class="acts"><button class="btn" data-act="buycachorro"' +
      (has ? " disabled" : "") +
      ">" +
      (has ? "Comprado" : DOG_PRICE + " moedas") +
      "</button></div></div>"
    );
  }
  var _loja = PANELS.loja[1];
  PANELS.loja[1] = function () {
    var h = _loja(),
      m = h.indexOf("<strong>Premium</strong>"),
      k = m >= 0 ? h.lastIndexOf("<p", m) : -1;
    return k >= 0 ? h.slice(0, k) + shopCachorro() + h.slice(k) : h;
  };

  /* ---------- Loja, aba Decoração: casinhas do cachorro ---------- */
  window.rfDogDeco = function () {
    var out = '<div class="sh-sep">Casinhas do cachorro</div>';
    DOG_HOUSES.forEach(function (h) {
      var owned = h.preco === 0 || (S.dogHouses && S.dogHouses[h.id]),
        cur = (S.dogHouse || "c1") === h.id,
        cls = "btn sh-buy",
        act = "",
        dis = false,
        label;
      if (!S.cachorro) {
        label = "Compre o cachorro";
        dis = true;
      } else if (cur) {
        label = "Em uso";
        dis = true;
      } else if (owned) {
        label = "Usar";
        act = "doguse";
        cls = "btn main sh-buy";
      } else {
        label = '<i class="sh-coin"></i>' + h.preco;
        act = "dogbuy";
      }
      out +=
        '<div class="sh-card"><div class="sh-name">' +
        esc(h.nome) +
        '</div><div class="sh-ico sh-house"><span class="sh-emo">🏠</span>' +
        '<img class="sh-img" alt="" src="img/' +
        h.f +
        "?v=" +
        V +
        '" onload="this.previousSibling.style.display=\'none\';this.style.display=\'block\'" onerror="this.remove()">' +
        '</div><button class="' +
        cls +
        '" data-act="' +
        act +
        '" data-id="' +
        h.id +
        '"' +
        (dis ? " disabled" : "") +
        ">" +
        label +
        "</button></div>";
    });
    return out;
  };

  /* ---------- cliques (captura: roda antes do jogo) ---------- */
  $("pbody").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest("[data-act]");
      if (!b || b.disabled) return;
      var a = b.dataset.act;

      if (a === "buycachorro") {
        if (S.cachorro) toast("Você já tem um cachorro.");
        else if (S.coins < DOG_PRICE)
          toast("Faltam " + (DOG_PRICE - S.coins) + " moedas.");
        else {
          S.coins -= DOG_PRICE;
          S.cachorro = true;
          toast("Compra feita: cachorro.");
          log("Você comprou um cachorro.");
        }
      } else if (a === "dogbuy") {
        var h = modelo(b.dataset.id);
        if (!h || !S.cachorro) return;
        if (!S.dogHouses) S.dogHouses = {};
        if (S.dogHouses[h.id]) toast("Você já tem essa casinha.");
        else if (S.coins < h.preco)
          toast("Faltam " + (h.preco - S.coins) + " moedas.");
        else {
          S.coins -= h.preco;
          S.dogHouses[h.id] = true;
          S.dogHouse = h.id;
          toast("Compra feita: " + h.nome + ".");
          log("Você comprou a " + h.nome.toLowerCase() + " do cachorro.");
        }
      } else if (a === "doguse") {
        var u = modelo(b.dataset.id);
        if (!u || !S.cachorro) return;
        if (u.preco > 0 && !(S.dogHouses && S.dogHouses[u.id])) return;
        S.dogHouse = u.id;
        toast("Casinha trocada: " + u.nome + ".");
      } else return;

      e.stopPropagation();
      after();
      sync();
    },
    true,
  );

  /* ---------- texto na Ajuda ---------- */
  try {
    var _aj = PANELS.ajuda[1];
    PANELS.ajuda[1] = function () {
      var h = _aj();
      var extra =
        '<p class="txt"><strong>Cachorro:</strong> compre na Loja, aba Animais. Ele já vem com uma casinha. Na aba Decoração você compra outros modelos de casinha.</p>';
      var k = h.indexOf('<button class="btn" data-act="tut">');
      return k >= 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra;
    };
  } catch (e) {}
})();
