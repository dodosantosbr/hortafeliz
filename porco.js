/* ===========================================================
   Roça Feliz - porco.js
   Porco de criação: compra na Loja, cresce com o tempo e, depois de
   adulto, a pessoa toca nele e escolhe "Recolher". Ele vira CARNE DE
   PORCO no Armazém.
   Carregar DEPOIS do burro.js no index.html:  <script src="porco.js"></script>

   Usa o porco que o assets.js já coloca na tela (img/animais/porco.png).
   Até comprar, o porco (e a lama) ficam escondidos.
   =========================================================== */
(function () {
  if (
    typeof S === "undefined" ||
    typeof PANELS === "undefined" ||
    typeof openPanel !== "function"
  )
    return;

  /* ================= AJUSTES ================= */
  var PORCO_PRICE = 300; /* preço do leitão (moedas) */
  var PORCO_LVL = 4; /* nível para liberar a compra */
  var PORCO_MS = 10 * 60 * 1000; /* tempo para ficar adulto (10 min). Para testar: 20000 = 20 s */
  var PORK_PRICE = 700; /* quanto vale 1 carne de porco no Armazém */
  var PORCO_XP = 30; /* XP ao recolher */
  var KID_SCALE = 0.55; /* tamanho do leitão (1 = tamanho adulto) */

  var armed = false,
    armedT;

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    /* escondido até comprar (a lama é filha do porco e some junto) */
    '.pi[data-id="porco"]{display:none;transform:scale(var(--pk,1));transform-origin:50% 100%;transition:transform 1s linear}' +
    '.app.has-porco .pi[data-id="porco"]{display:block}' +
    ".pbadge{position:absolute;top:-16%;left:calc(50% - 10px);width:20px;height:20px;border-radius:50%;" +
    "background:var(--coin);color:#5a3d00;border:2px solid #fff;font:700 12px/16px var(--font-body);" +
    "text-align:center;pointer-events:none;z-index:2}";
  document.head.appendChild(st);

  /* ---------- auxiliares ---------- */
  function pFrac() {
    return S.porco
      ? Math.max(0, Math.min(1, (Date.now() - S.porco.born) / PORCO_MS))
      : 0;
  }
  function sellPork(n) {
    n = Math.min(n, S.pork || 0);
    if (n <= 0) return 0;
    var g = n * PORK_PRICE;
    S.coins += g;
    S.stats.sold += g;
    S.pork -= n;
    return g;
  }
  /* o "Vender tudo" do burro.js usa esta função */
  window.sellPork = sellPork;

  /* ---------- aparência do porco no sítio ---------- */
  function sync() {
    var app = $("app"),
      has = !!S.porco;
    app.classList.toggle("has-porco", has);
    if (!has) return;
    var f = pFrac(),
      ready = f >= 1;
    app.style.setProperty("--pk", (KID_SCALE + (1 - KID_SCALE) * f).toFixed(3));
    var el = document.querySelector('.pi[data-id="porco"]');
    if (!el) return;
    var bd = el.querySelector(".pbadge");
    if (ready && !bd) {
      bd = document.createElement("div");
      bd.className = "pbadge";
      bd.textContent = "!";
      el.appendChild(bd);
    } else if (!ready && bd) bd.remove();
  }
  setInterval(function () {
    sync();
    if (open === "porco") renderPanel(); /* barra de progresso ao vivo */
  }, 1000);
  sync();

  /* tocar no porco abre o painel dele */
  document.addEventListener(
    "click",
    function (e) {
      if (/editar/.test(location.hash)) return;
      var el = e.target.closest && e.target.closest('.pi[data-id="porco"]');
      if (!el) return;
      e.stopPropagation();
      openPanel("porco");
    },
    true,
  );

  /* ---------- painel do porco ---------- */
  function pPorco() {
    if (!S.porco)
      return '<p class="txt">Você não tem um porco. Compre um leitão na Loja.</p>';
    var f = pFrac(),
      ready = f >= 1,
      left = (PORCO_MS - (Date.now() - S.porco.born)) / 1000;
    return (
      '<p class="txt">' +
      (ready
        ? "Seu porco já está grande! Ao recolher, ele vira <strong>1 carne de porco</strong> no Armazém, que vale <strong>" +
          PORK_PRICE +
          " moedas</strong>."
        : "Seu porco ainda é leitão e está crescendo. Faltam <strong>" +
          fmt(left) +
          "</strong>.") +
      "</p>" +
      '<div class="pb"><i style="width:' +
      f * 100 +
      '%"></i></div>' +
      '<div class="acts" style="margin-top:12px;justify-content:flex-start"><button class="btn main" data-act="porcocollect"' +
      (ready ? "" : " disabled") +
      ">" +
      (ready
        ? armed
          ? "Tem certeza? Toque de novo"
          : "Recolher"
        : "Ainda crescendo") +
      "</button></div>"
    );
  }
  PANELS.porco = ["Porco", pPorco];

  /* ---------- Loja: item do porco (junto dos animais) ---------- */
  function shopPorco() {
    var has = !!S.porco,
      lock = S.lvl < PORCO_LVL;
    return (
      '<div class="item"><div><strong>Porco</strong><span class="note">Cresce em ' +
      fmt(PORCO_MS / 1000) +
      ". Depois de grande, você o recolhe e ele vira carne de porco no Armazém, que vale " +
      PORK_PRICE +
      " moedas. " +
      (lock ? "Libera no nível " + PORCO_LVL + "." : "") +
      '</span></div><div class="acts"><button class="btn" data-act="buyporco"' +
      (has || lock ? " disabled" : "") +
      ">" +
      (has ? "Comprado" : lock ? "Nível " + PORCO_LVL : PORCO_PRICE + " moedas") +
      "</button></div></div>"
    );
  }
  var _loja = PANELS.loja[1];
  PANELS.loja[1] = function () {
    var h = _loja(),
      m = h.indexOf("<strong>Premium</strong>"),
      k = m >= 0 ? h.lastIndexOf("<p", m) : -1;
    return k >= 0 ? h.slice(0, k) + shopPorco() + h.slice(k) : h;
  };

  /* ---------- Armazém: linha da carne de porco ---------- */
  var _arm = PANELS.armazem[1];
  PANELS.armazem[1] = function () {
    var h = _arm(),
      n = S.pork || 0;
    if (!n) return h;
    var tot = n * PORK_PRICE,
      row =
        '<div class="item"><div><span class="chead"><span class="dot" style="background:#e39a9a;border:2px solid var(--line)"></span><strong>Carne de porco × ' +
        n +
        '</strong></span><span class="note">' +
        PORK_PRICE +
        ' moedas cada</span></div><div class="acts"><button class="btn" data-act="sellpork" data-n="1">Vender 1</button><button class="btn" data-act="sellpork" data-n="all">Vender tudo</button></div></div>';
    if (h.indexOf("armazém está vazio") >= 0)
      return (
        row +
        '<div class="item"><div><strong>Total guardado</strong><span class="note">' +
        tot +
        ' moedas</span></div><div class="acts"><button class="btn main" data-act="sellall">Vender tudo</button></div></div>'
      );
    var k = h.lastIndexOf('<div class="item"><div><strong>Total guardado');
    h = k >= 0 ? h.slice(0, k) + row + h.slice(k) : h + row;
    return h.replace(
      /(Total guardado<\/strong><span class="note">)(\d+)/,
      function (m, a, b) {
        return a + (+b + tot);
      },
    );
  };

  /* ---------- cliques dos botões (captura: roda antes do jogo) ---------- */
  $("pbody").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest("[data-act]");
      if (!b || b.disabled) return;
      var a = b.dataset.act;

      if (a === "buyporco") {
        if (S.porco) toast("Você já tem um porco.");
        else if (S.lvl < PORCO_LVL)
          toast("Porco libera no nível " + PORCO_LVL + ".");
        else if (S.coins < PORCO_PRICE)
          toast("Faltam " + (PORCO_PRICE - S.coins) + " moedas.");
        else {
          S.coins -= PORCO_PRICE;
          S.porco = { born: Date.now() };
          toast("Compra feita: porco.");
          log("Você comprou um porco.");
        }
      } else if (a === "porcocollect") {
        if (!S.porco || pFrac() < 1) return;
        if (!armed) {
          armed = true;
          clearTimeout(armedT);
          armedT = setTimeout(function () {
            armed = false;
            if (open === "porco") renderPanel();
          }, 3000);
          renderPanel();
          return;
        }
        armed = false;
        clearTimeout(armedT);
        S.porco = null;
        S.pork = (S.pork || 0) + 1;
        addXp(PORCO_XP);
        sfx("h4");
        toast("Porco recolhido! 1 carne de porco guardada no Armazém.");
        log("Você recolheu o porco: +1 carne de porco no Armazém.");
        closePanel();
      } else if (a === "sellpork") {
        var g = sellPork(b.dataset.n === "all" ? S.pork || 0 : 1);
        if (g) toast("Vendido por " + g + " moedas.");
      } else return; /* o "Vender tudo" geral é tratado no burro.js */

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
        '<p class="txt"><strong>Porco:</strong> compre um leitão na Loja. Quando ficar grande (aparece um aviso dourado), toque nele e escolha Recolher. Ele vira carne de porco no Armazém.</p>';
      var k = h.indexOf('<button class="btn" data-act="tut">');
      return k >= 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra;
    };
  } catch (e) {}
})();
