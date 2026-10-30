/* ===========================================================
   Roça Feliz - inseticida.js
   Herbicida: igual ao fertilizante (compra, escolhe a ferramenta e toca
   numa planta). O canteiro fica 1 hora SEM nascer erva daninha.
   Se já tinha erva no canteiro, ela some na hora.

   Carregar ANTES do loja.js, depois do porco.js:
     <script src="porco.js"></script>
     <script src="inseticida.js"></script>
     <script src="loja.js"></script>

   Imagens (opcionais, em img/ui/):
     tool_herbicida.png      - frasco (barra de ferramentas e loja)
     herbicida_pacote.png    - pacote com 5 (só na loja)
   =========================================================== */
(function () {
  if (typeof S === "undefined" || typeof PANELS === "undefined") return;

  /* ================= AJUSTES ================= */
  var PRECO_1 = 50; /* 1 herbicida (moedas) */
  var PRECO_5 = 200; /* pacote com 5 */
  var DURACAO = 60 * 60 * 1000; /* 1 hora. Para testar: 30000 = 30 s */
  var V = "2";

  /* acha a imagem do frasco uma vez só (aceita também o nome com .png duplicado) */
  var ICON = null;
  (function () {
    var l = [
      "ui/tool_herbicida.png",
      "tool_herbicida.png",
      "ui/tool_inseticida.png",
      "tool_inseticida.png",
      "tool_inseticida.png.png",
      "ui/tool_inseticida.png.png",
    ];
    var im = new Image();
    im.onload = function () {
      ICON = im.src;
      try {
        render();
      } catch (e) {}
    };
    im.onerror = function () {
      var n = l.shift();
      if (n) im.src = "img/" + n + "?v=" + V;
    };
    im.onerror();
  })();

  function qtd() {
    return S.insect || 0;
  }
  function protegida(p) {
    return p.ins && p.ins > Date.now();
  }

  /* ---------- usar numa planta ---------- */
  function usar(i) {
    var p = S.plots[i];
    if (isEmpty(p)) return toast("Plante algo antes de usar herbicida.");
    if (isTree(p)) return toast("Árvores não pegam ervas daninhas.");
    if (frac(p) >= 1) return toast("Esta planta já está pronta.");
    if (protegida(p))
      return toast(
        "Este canteiro já está protegido por mais " +
          fmt((p.ins - Date.now()) / 1000) +
          ".",
      );
    if (qtd() <= 0) {
      S.tool = "hand";
      return toast("Acabaram os herbicidas.");
    }
    S.insect = qtd() - 1;
    p.ins = Date.now() + DURACAO;
    p.w = false;
    pop(i, "Protegida!");
    sfx("plant");
    if (qtd() <= 0) S.tool = "hand";
  }

  /* toque no canteiro com a ferramenta herbicida (captura: antes do jogo) */
  $("field").addEventListener(
    "click",
    function (e) {
      if (S.tool !== "insect") return;
      var b = e.target.closest(".tile");
      if (!b) return;
      var i = +b.dataset.i;
      if (!S.plots[i].on) return; /* comprar canteiro: segue o jogo normal */
      e.stopPropagation();
      usar(i);
      after();
    },
    true,
  );

  /* ---------- barra de ferramentas ---------- */
  $("tools").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest('.tb[data-t="insect"]');
      if (!b) return;
      e.stopPropagation();
      if (qtd() <= 0) {
        toast("Você não tem herbicidas. Compre na Loja.");
        return;
      }
      S.tool = S.tool === "insect" ? "hand" : "insect";
      if (S.tool === "insect") toast("Toque numa planta que está crescendo.");
      after();
    },
    true,
  );

  function addToolBtn() {
    var t = $("tools"),
      ref = t.querySelector('.tb[data-t="harvest"]');
    if (!t || t.querySelector('.tb[data-t="insect"]')) return;
    var b = document.createElement("button");
    b.className = "tb";
    b.dataset.t = "insect";
    b.setAttribute("aria-pressed", S.tool === "insect");
    b.innerHTML =
      (ICON
        ? '<img class="tico" alt="" src="' + ICON + '">'
        : '<span class="ie">🧴</span>') +
      "Herbicida (" +
      qtd() +
      ")";
    t.insertBefore(b, ref || null);
  }

  /* a cada desenho: apaga erva em canteiro protegido e põe o botão da ferramenta */
  var _render = render;
  render = function () {
    var now = Date.now();
    S.plots.forEach(function (p) {
      if (!p.ins) return;
      if (p.ins > now) {
        if (p.w) p.w = false; /* erva que tentou nascer */
      } else p.ins = 0;
    });
    _render();
    addToolBtn();
  };

  /* ---------- Loja ---------- */
  function shopItem(nome, desc, n, preco) {
    return (
      '<div class="item"><div><strong>' +
      nome +
      '</strong><span class="note">' +
      desc +
      '</span></div><div class="acts"><button class="btn" data-act="buyinset" data-n="' +
      n +
      '" data-p="' +
      preco +
      '">' +
      preco +
      " moedas</button></div></div>"
    );
  }
  var _loja = PANELS.loja[1];
  PANELS.loja[1] = function () {
    var h = _loja(),
      m = h.indexOf("<strong>Premium</strong>"),
      k = m >= 0 ? h.lastIndexOf("<p", m) : -1;
    var add =
      shopItem(
        "Herbicida",
        "Deixa um canteiro 1 hora sem nascer erva daninha.",
        1,
        PRECO_1,
      ) +
      shopItem(
        "Pacote com 5 herbicidas",
        "Mais barato que comprar um por um.",
        5,
        PRECO_5,
      );
    return k >= 0 ? h.slice(0, k) + add + h.slice(k) : h;
  };

  /* ---------- painel Fertilizantes: ganha a parte do herbicida ---------- */
  var _fert = PANELS.fert[1];
  PANELS.fert[0] = "Fertilizante e herbicida";
  PANELS.fert[1] = function () {
    return (
      _fert() +
      '<p class="note" style="margin:14px 0 0"><strong>Herbicida</strong></p>' +
      '<p class="txt">Protege um canteiro: durante 1 hora não nasce erva daninha nele. Se já tiver erva, ela some.</p>' +
      '<div class="item"><div><strong>Você tem ' +
      qtd() +
      '</strong><span class="note">Escolha a ferramenta e toque numa planta que está crescendo.</span></div>' +
      '<div class="acts"><button class="btn main" data-act="useinset"' +
      (qtd() ? "" : " disabled") +
      ">Usar</button></div></div>" +
      '<div class="item"><div><strong>Comprar 1</strong><span class="note">' +
      PRECO_1 +
      ' moedas</span></div><div class="acts"><button class="btn" data-act="buyinset" data-n="1" data-p="' +
      PRECO_1 +
      '">Comprar</button></div></div>'
    );
  };

  /* ---------- botões dos painéis (captura: roda antes do jogo) ---------- */
  $("pbody").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest("[data-act]");
      if (!b || b.disabled) return;
      var a = b.dataset.act;
      if (a === "buyinset") {
        var n = +b.dataset.n || 1,
          p = +b.dataset.p || PRECO_1;
        if (S.coins < p) toast("Faltam " + (p - S.coins) + " moedas.");
        else {
          S.coins -= p;
          S.insect = qtd() + n;
          toast("Compra feita: " + (n > 1 ? n + " herbicidas." : "herbicida."));
          log("Você comprou " + n + (n > 1 ? " herbicidas." : " herbicida."));
        }
      } else if (a === "useinset") {
        if (qtd() > 0) {
          S.tool = "insect";
          toast("Toque numa planta que está crescendo.");
        }
        closePanel();
        render();
        e.stopPropagation();
        return;
      } else return;
      e.stopPropagation();
      after();
    },
    true,
  );

  /* ---------- texto na Ajuda ---------- */
  try {
    var _aj = PANELS.ajuda[1];
    PANELS.ajuda[1] = function () {
      var h = _aj(),
        extra =
          '<p class="txt"><strong>Herbicida:</strong> compre na Loja, escolha a ferramenta e toque numa planta. O canteiro fica 1 hora sem nascer erva daninha.</p>',
        k = h.indexOf('<button class="btn" data-act="tut">');
      return k >= 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra;
    };
  } catch (e) {}
})();
