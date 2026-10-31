(function () {
  if (
    typeof S === "undefined" ||
    typeof PANELS === "undefined" ||
    typeof openPanel !== "function"
  )
    return;

  /* ================= AJUSTES ================= */
  var OVELHA_PRICE = 300; /* preço da ovelha */
  var OVELHA_LVL = 3; /* nível para liberar */
  var LA_MS = 2 * 60 * 60 * 1000; /* 2 horas (teste: 20000 = 20 s) */
  var LA_PRICE = 150; /* quanto vale 1 lã no Armazém */
  var LA_XP = 20; /* XP ao recolher */

  /* ---------- CSS: escondida até comprar ---------- */
  var st = document.createElement("style");
  st.textContent =
    '.pi[data-id="ovelha"]{display:none}' +
    '.app.has-ovelha .pi[data-id="ovelha"]{display:block}' +
    ".obadge{position:absolute;top:-16%;left:calc(50% - 10px);width:20px;height:20px;border-radius:50%;" +
    "background:var(--coin);color:#5a3d00;border:2px solid #fff;font:700 12px/16px var(--font-body);" +
    "text-align:center;pointer-events:none;z-index:2}";
  document.head.appendChild(st);

  /* ---------- auxiliares ---------- */
  function ready() {
    /* lã pronta quando não existe contagem ou o horário já passou */
    return !!S.ovelha && Date.now() >= (S.ovelha.next || 0);
  }
  function sellLa(n) {
    n = Math.min(n, S.la || 0);
    if (n <= 0) return 0;
    var g = n * LA_PRICE;
    S.coins += g;
    S.stats.sold += g;
    S.la -= n;
    return g;
  }

  /* ---------- aparência no sítio ---------- */
  function skin(src, pelada) {
    return pelada
      ? src.replace(/ovelha(?!_pelada)/, "ovelha_pelada")
      : src.replace("ovelha_pelada", "ovelha");
  }
  function sync() {
    var app = $("app"),
      has = !!S.ovelha;
    app.classList.toggle("has-ovelha", has);
    if (!has) return;
    var el = document.querySelector('.pi[data-id="ovelha"]');
    if (!el) return;
    var im = el.querySelector("img");
    if (im) {
      var src = im.getAttribute("src") || "";
      var alvo = skin(src, !ready());
      if (alvo !== src) im.setAttribute("src", alvo);
    }
    var bd = el.querySelector(".obadge");
    if (ready() && !bd) {
      bd = document.createElement("div");
      bd.className = "obadge";
      bd.textContent = "!";
      el.appendChild(bd);
    } else if (!ready() && bd) bd.remove();
  }

  /* tocar na ovelha abre o painel */
  document.addEventListener(
    "click",
    function (e) {
      if (/editar/.test(location.hash)) return;
      var el = e.target.closest && e.target.closest('.pi[data-id="ovelha"]');
      if (!el) return;
      e.stopPropagation();
      openPanel("ovelha");
    },
    true,
  );

  /* ---------- painel ---------- */
  function pOvelha() {
    if (!S.ovelha)
      return '<p class="txt">Você não tem uma ovelha. Compre na Loja.</p>';
    var r = ready(),
      left = ((S.ovelha.next || 0) - Date.now()) / 1000,
      f = r ? 1 : Math.max(0, Math.min(1, 1 - (left * 1000) / LA_MS));
    return (
      '<p class="txt">' +
      (r
        ? "A lã está pronta! Ao recolher, você ganha <strong>1 lã</strong> no Armazém (vale <strong>" +
          LA_PRICE +
          " moedas</strong>) e a ovelha fica pelada enquanto a lã cresce."
        : "A lã está crescendo. Faltam <strong>" + fmt(left) + "</strong>.") +
      "</p>" +
      '<div class="pb"><i style="width:' +
      f * 100 +
      '%"></i></div>' +
      '<div class="acts" style="margin-top:12px;justify-content:flex-start">' +
      '<button class="btn main" data-act="lacollect"' +
      (r ? "" : " disabled") +
      ">" +
      (r ? "Recolher lã" : "Lã crescendo") +
      "</button></div>"
    );
  }
  PANELS.ovelha = ["Ovelha", pOvelha];

  /* ---------- Loja: card da ovelha (substitui o "Em breve") ---------- */
  function shopOvelha() {
    var has = !!S.ovelha,
      lock = S.lvl < OVELHA_LVL;
    return (
      '<div class="item"><div><strong>Ovelha</strong><span class="note">Recolha a lã a cada ' +
      fmt(LA_MS / 1000) +
      ". Cada lã vale " +
      LA_PRICE +
      " moedas no Armazém. " +
      (lock ? "Libera no nível " + OVELHA_LVL + "." : "") +
      '</span></div><div class="acts"><button class="btn" data-act="buyovelha"' +
      (has || lock ? " disabled" : "") +
      ">" +
      (has
        ? "Comprada"
        : lock
          ? "Nível " + OVELHA_LVL
          : OVELHA_PRICE + " moedas") +
      "</button></div></div>"
    );
  }
  var _loja = PANELS.loja[1];
  PANELS.loja[1] = function () {
    var box = document.createElement("div");
    box.innerHTML = _loja();
    var novo = document.createElement("div");
    novo.innerHTML = shopOvelha();
    novo = novo.firstChild;
    var achou = false;
    box.querySelectorAll(".item").forEach(function (it) {
      var s = it.querySelector("strong");
      if (!achou && s && /^ovelha/i.test(s.textContent.trim())) {
        it.parentNode.replaceChild(novo, it); /* mantém a mesma posição */
        achou = true;
      }
    });
    if (!achou) box.appendChild(novo);
    return box.innerHTML;
  };

  /* ---------- Armazém: linha da lã ---------- */
  var _arm = PANELS.armazem[1];
  PANELS.armazem[1] = function () {
    var h = _arm(),
      n = S.la || 0;
    if (!n) return h;
    var tot = n * LA_PRICE,
      row =
        '<div class="item"><div><span class="chead"><span class="dot" style="background:#f1ead8;border:2px solid var(--line)"></span><strong>Lã × ' +
        n +
        '</strong></span><span class="note">' +
        LA_PRICE +
        ' moedas cada</span></div><div class="acts"><button class="btn" data-act="sellla" data-n="1">Vender 1</button><button class="btn" data-act="sellla" data-n="all">Vender tudo</button></div></div>';
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

  /* ---------- cliques ---------- */
  $("pbody").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest("[data-act]");
      if (!b || b.disabled) return;
      var a = b.dataset.act;

      if (a === "buyovelha") {
        if (S.ovelha) toast("Você já tem uma ovelha.");
        else if (S.lvl < OVELHA_LVL)
          toast("Ovelha libera no nível " + OVELHA_LVL + ".");
        else if (S.coins < OVELHA_PRICE)
          toast("Faltam " + (OVELHA_PRICE - S.coins) + " moedas.");
        else {
          S.coins -= OVELHA_PRICE;
          S.ovelha = { next: 0 }; /* começa com lã pronta */
          toast("Compra feita: ovelha.");
          log("Você comprou uma ovelha.");
        }
      } else if (a === "lacollect") {
        if (!ready()) return;
        S.ovelha.next = Date.now() + LA_MS;
        S.la = (S.la || 0) + 1;
        addXp(LA_XP);
        sfx("h4");
        toast("Lã recolhida! 1 lã guardada no Armazém.");
        log("Você recolheu a lã da ovelha.");
        closePanel();
      } else if (a === "sellla") {
        var g = sellLa(b.dataset.n === "all" ? S.la || 0 : 1);
        if (g) toast("Vendido por " + g + " moedas.");
      } else if (a === "sellall") {
        /* o burro.js já vende o resto; aqui só somamos a lã (sem parar o evento) */
        var t = sellLa(S.la || 0);
        if (t) toast("Lã vendida por " + t + " moedas.");
        after();
        sync();
        return;
      } else return;

      e.stopPropagation();
      after();
      sync();
    },
    true,
  );
  /* aplica ao carregar e mantém atualizado (lã pronta / pelada) */
  sync();
  setInterval(sync, 1000);
})();
