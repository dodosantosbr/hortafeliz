/* ===========================================================
   Roça Feliz - burro.js
   Burro de criação: compra na Loja, cresce com o tempo e, depois de
   adulto, a pessoa toca nele e escolhe "Recolher". Ele vira CARNE no
   Armazém, que vale bastante dinheiro.
   Carregar POR ÚLTIMO no index.html:  <script src="burro.js"></script>
   (depois do remover.js)

   Usa a imagem img/animais/burro.png, que o assets.js já carrega.
   =========================================================== */
(function () {
  if (
    typeof S === "undefined" ||
    typeof PANELS === "undefined" ||
    typeof openPanel !== "function"
  )
    return;

  /* ================= AJUSTES ================= */
  var BURRO_PRICE = 500; /* preço do filhote (moedas) */
  var BURRO_LVL = 6; /* nível para liberar a compra */
  var BURRO_MS =
    15 *
    60 *
    1000; /* tempo para ficar adulto (15 min). Para testar: 20000 = 20 s */
  var MEAT_PRICE = 1200; /* quanto vale 1 carne no Armazém */
  var BURRO_XP = 50; /* XP ao recolher */
  var KID_SCALE = 0.55; /* tamanho do filhote (1 = tamanho adulto) */

  var armed = false,
    armedT;

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    /* escondido até comprar */
    '.pi[data-id="burro"]{display:none;transform:scale(var(--bk,1));transform-origin:50% 100%;transition:transform 1s linear}' +
    '.app.has-burro .pi[data-id="burro"]{display:block}' +
    ".bbadge{position:absolute;top:-16%;left:calc(50% - 10px);width:20px;height:20px;border-radius:50%;" +
    "background:var(--coin);color:#5a3d00;border:2px solid #fff;font:700 12px/16px var(--font-body);" +
    "text-align:center;pointer-events:none;z-index:2}" +
    ".bbadge.wander{animation:rfwalk var(--dur,30s) ease-in-out infinite;animation-delay:var(--dl,0s)}" +
    "@media (prefers-reduced-motion:reduce){.bbadge{animation:none !important}}";
  document.head.appendChild(st);

  /* ---------- auxiliares ---------- */
  function bFrac() {
    return S.burro
      ? Math.max(0, Math.min(1, (Date.now() - S.burro.born) / BURRO_MS))
      : 0;
  }
  function sellMeat(n) {
    n = Math.min(n, S.meat || 0);
    if (n <= 0) return 0;
    var g = n * MEAT_PRICE;
    S.coins += g;
    S.stats.sold += g;
    S.meat -= n;
    return g;
  }

  /* ---------- aparência do burro no sítio ---------- */
  function sync() {
    var app = $("app"),
      has = !!S.burro;
    app.classList.toggle("has-burro", has);
    if (!has) return;
    var f = bFrac(),
      ready = f >= 1;
    app.style.setProperty("--bk", (KID_SCALE + (1 - KID_SCALE) * f).toFixed(3));
    var el = document.querySelector('.pi[data-id="burro"]');
    if (!el) return;
    var bd = el.querySelector(".bbadge");
    if (ready && !bd) {
      bd = document.createElement("div");
      bd.className = "bbadge";
      bd.textContent = "!";
      var im = el.querySelector("img.wander");
      if (im) {
        /* anda junto com o burro */
        bd.classList.add("wander");
        ["--wd", "--dur", "--dl"].forEach(function (p) {
          bd.style.setProperty(p, im.style.getPropertyValue(p));
        });
      }
      el.appendChild(bd);
    } else if (!ready && bd) bd.remove();
  }
  setInterval(function () {
    sync();
    if (open === "burro") renderPanel(); /* barra de progresso ao vivo */
  }, 1000);
  sync();

  /* tocar no burro abre o painel dele */
  document.addEventListener(
    "click",
    function (e) {
      if (/editar/.test(location.hash)) return;
      var el = e.target.closest && e.target.closest('.pi[data-id="burro"]');
      if (!el) return;
      e.stopPropagation();
      openPanel("burro");
    },
    true,
  );

  /* ---------- painel do burro ---------- */
  function pBurro() {
    if (!S.burro)
      return '<p class="txt">Você não tem um burro. Compre um filhote na Loja.</p>';
    var f = bFrac(),
      ready = f >= 1,
      left = (BURRO_MS - (Date.now() - S.burro.born)) / 1000;
    return (
      '<p class="txt">' +
      (ready
        ? "Seu burro já é adulto! Ao recolher, ele vira <strong>1 carne</strong> no Armazém, que vale <strong>" +
          MEAT_PRICE +
          " moedas</strong>."
        : "Seu burro ainda é filhote e está crescendo. Faltam <strong>" +
          fmt(left) +
          "</strong>.") +
      "</p>" +
      '<div class="pb"><i style="width:' +
      f * 100 +
      '%"></i></div>' +
      '<div class="acts" style="margin-top:12px;justify-content:flex-start"><button class="btn main" data-act="burrocollect"' +
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
  PANELS.burro = ["Burro", pBurro];

  /* ---------- Loja: item do burro (junto dos animais) ---------- */
  function shopBurro() {
    var has = !!S.burro,
      lock = S.lvl < BURRO_LVL;
    return (
      '<div class="item"><div><strong>Burro</strong><span class="note">Cresce em ' +
      fmt(BURRO_MS / 1000) +
      ". Depois de adulto, você o recolhe e ele vira carne no Armazém, que vale " +
      MEAT_PRICE +
      " moedas. " +
      (lock ? "Libera no nível " + BURRO_LVL + "." : "") +
      '</span></div><div class="acts"><button class="btn" data-act="buyburro"' +
      (has || lock ? " disabled" : "") +
      ">" +
      (has
        ? "Comprado"
        : lock
          ? "Nível " + BURRO_LVL
          : BURRO_PRICE + " moedas") +
      "</button></div></div>"
    );
  }
  var _loja = PANELS.loja[1];
  PANELS.loja[1] = function () {
    var h = _loja(),
      m = h.indexOf("<strong>Premium</strong>"),
      k = m >= 0 ? h.lastIndexOf("<p", m) : -1;
    return k >= 0 ? h.slice(0, k) + shopBurro() + h.slice(k) : h;
  };

  /* ---------- Armazém: linha da carne ---------- */
  var _arm = PANELS.armazem[1];
  PANELS.armazem[1] = function () {
    var h = _arm(),
      n = S.meat || 0;
    if (!n) return h;
    var tot = n * MEAT_PRICE,
      row =
        '<div class="item"><div><span class="chead"><span class="dot" style="background:#b5524a;border:2px solid var(--line)"></span><strong>Carne × ' +
        n +
        '</strong></span><span class="note">' +
        MEAT_PRICE +
        ' moedas cada</span></div><div class="acts"><button class="btn" data-act="sellmeat" data-n="1">Vender 1</button><button class="btn" data-act="sellmeat" data-n="all">Vender tudo</button></div></div>';
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

      if (a === "buyburro") {
        if (S.burro) toast("Você já tem um burro.");
        else if (S.lvl < BURRO_LVL)
          toast("Burro libera no nível " + BURRO_LVL + ".");
        else if (S.coins < BURRO_PRICE)
          toast("Faltam " + (BURRO_PRICE - S.coins) + " moedas.");
        else {
          S.coins -= BURRO_PRICE;
          S.burro = { born: Date.now() };
          toast("Compra feita: burro.");
          log("Você comprou um burro.");
        }
      } else if (a === "burrocollect") {
        if (!S.burro || bFrac() < 1) return;
        if (!armed) {
          armed = true;
          clearTimeout(armedT);
          armedT = setTimeout(function () {
            armed = false;
            if (open === "burro") renderPanel();
          }, 3000);
          renderPanel();
          return;
        }
        armed = false;
        clearTimeout(armedT);
        S.burro = null;
        S.meat = (S.meat || 0) + 1;
        addXp(BURRO_XP);
        sfx("h4");
        toast("Burro recolhido! 1 carne guardada no Armazém.");
        log("Você recolheu o burro: +1 carne no Armazém.");
        closePanel();
      } else if (a === "sellmeat") {
        var g = sellMeat(b.dataset.n === "all" ? S.meat || 0 : 1);
        if (g) toast("Vendido por " + g + " moedas.");
      } else if (a === "sellall") {
        /* igual ao do jogo, mas incluindo a carne */
        var t = 0,
          k;
        for (k = 0; k < 6; k++) t += sellCrop(k, S.inv[k]);
        for (k = 0; k < TREES.length; k++) t += sellTree(k, S.tinv[k]);
        for (k = 0; k < PRODS.length; k++) t += sellProd(k, S.prod[k]);
        t += sellMeat(S.meat || 0);
        if (window.sellPork) t += window.sellPork(S.pork || 0);
        if (t) {
          toast("Vendido por " + t + " moedas.");
          log("Você vendeu colheitas por " + t + " moedas.");
        }
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
        '<p class="txt"><strong>Burro:</strong> compre um filhote na Loja. Quando ficar adulto (aparece um aviso dourado), toque nele e escolha Recolher. Ele vira carne no Armazém e vale muitas moedas.</p>';
      var k = h.indexOf('<button class="btn" data-act="tut">');
      return k >= 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra;
    };
  } catch (e) {}
})();
