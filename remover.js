/* ===========================================================
   Roça Feliz - remover.js
   Ferramenta "Remover": tira uma planta ou árvore do canteiro.
   Carregar POR ÚLTIMO no index.html:  <script src="remover.js"></script>

   Como usar no jogo:
   1) Toque em "Remover" na barra de ferramentas.
   2) Toque na planta/árvore. O canteiro balança e fica vermelho.
   3) Toque de novo (em até 3 s) para confirmar.
   A ferramenta continua ativa até você escolher outra (ex.: Mão).

   Opcional: se existir img/ui/tool_pa.png, ele vira o ícone do botão (como tool_foice.png).
   =========================================================== */
(function () {
  if (
    typeof S === "undefined" ||
    typeof act !== "function" ||
    typeof render !== "function"
  )
    return;

  var V = "1"; /* mude ao trocar o PNG do ícone (evita cache) */
  /* Quanto do preço da semente volta ao remover: 0 = nada, 0.5 = metade, 1 = tudo */
  var REFUND = 0;

  var rmArmed = -1,
    rmT,
    RMIMG = null;

  /* ícone reserva (pá) desenhado em código, usado enquanto não houver o PNG */
  var SHOVEL =
    '<svg class="tico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 22v-5l5-5 5 5-5 5z"/><path d="M9.5 14.5 16 8"/><path d="m17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2"/></svg>';

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#tools .tb svg.tico{width:22px;height:22px;flex:none}" +
    '#tools .tb[data-t="remove"][aria-pressed="true"]{border-color:#ff6a5a;box-shadow:0 0 0 2px rgba(255,106,90,.35)}' +
    "@keyframes rmshake{25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}" +
    ".pw.rm-armed .ov{animation:rmshake .35s ease-in-out infinite;" +
    "filter:drop-shadow(0 0 5px #ff3b30) drop-shadow(0 0 2px #ff3b30)}" +
    "@media (prefers-reduced-motion:reduce){.pw.rm-armed .ov{animation:none}}";
  document.head.appendChild(st);

  /* ícone opcional em PNG */
  (function () {
    var list = [
      "img/ui/tool_pa.png?v=" + V,
      "img/tool_pa.png?v=" + V,
      "img/ui/tool_remover.png?v=" + V,
    ];
    (function next(i) {
      if (i >= list.length) return;
      var im = new Image();
      im.onload = function () {
        RMIMG = list[i];
        render();
      };
      im.onerror = function () {
        next(i + 1);
      };
      im.src = list[i];
    })(0);
  })();

  /* ---------- auxiliares ---------- */
  function nomeDe(p) {
    return isTree(p) ? TREES[p.t].nome : CROPS[p.c].nome;
  }
  function custoDe(p) {
    return isTree(p) ? TREES[p.t].custo : CROPS[p.c].custo;
  }
  function prontaDe(p) {
    return isTree(p) ? tReady(p) : frac(p) >= 1;
  }

  /* ---------- a ação de remover ---------- */
  var _act = act;
  act = function (i) {
    if (S.tool !== "remove") {
      rmArmed = -1;
      return _act.apply(this, arguments);
    }
    var p = S.plots[i];
    /* canteiro bloqueado: segue o comportamento normal (compra) */
    if (!p || !p.on) return _act.apply(this, arguments);
    if (isEmpty(p)) {
      toast("Não há nada plantado aqui.");
      return;
    }
    var nome = nomeDe(p),
      back = Math.floor(custoDe(p) * REFUND);

    if (rmArmed !== i) {
      rmArmed = i;
      clearTimeout(rmT);
      rmT = setTimeout(function () {
        rmArmed = -1;
        render();
      }, 3000);
      toast(
        "Remover " +
          nome +
          "?" +
          (prontaDe(p) ? " Ela está pronta para colher!" : "") +
          " Toque de novo para confirmar." +
          (back ? " Devolve " + back + " moedas." : " Não devolve moedas."),
      );
      return;
    }

    rmArmed = -1;
    clearTimeout(rmT);
    p.c = -1;
    p.t = -1;
    p.pr = 0;
    p.m = false;
    p.rb = 0;
    p.w = false;
    p.f = false;
    if (back) S.coins += back;
    sfx("plant");
    dirt(i);
    log("Você removeu: " + nome + ".");
    toast(nome + " removida." + (back ? " +" + back + " moedas." : ""));
  };

  /* ---------- botão na barra de ferramentas ---------- */
  $("tools").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest('[data-t="remove"]');
      if (!b) return;
      S.tool = S.tool === "remove" ? "hand" : "remove";
      rmArmed = -1;
      if (S.tool === "remove")
        toast("Remover: toque numa planta e confirme com outro toque.");
    },
    true /* captura: roda antes do tratador do jogo, que redesenha em seguida */,
  );

  function decorate() {
    var app = $("app"),
      box = $("tools");
    app.setAttribute("data-tool", S.tool);
    if (box && !box.querySelector('[data-t="remove"]')) {
      var b = document.createElement("button");
      b.className = "tb";
      b.dataset.t = "remove";
      b.setAttribute("aria-label", "Remover planta");
      b.innerHTML =
        (RMIMG ? '<img class="tico" src="' + RMIMG + '" alt="">' : SHOVEL) +
        "Remover";
      box.appendChild(b);
    }
    var rb = box && box.querySelector('[data-t="remove"]');
    if (rb) rb.setAttribute("aria-pressed", S.tool === "remove");
    btns.forEach(function (x, i) {
      x.w.classList.toggle("rm-armed", S.tool === "remove" && i === rmArmed);
    });
  }

  var _render = render;
  render = function () {
    _render.apply(this, arguments);
    try {
      decorate();
    } catch (e) {}
  };

  /* ---------- texto na Ajuda ---------- */
  try {
    var _aj = PANELS.ajuda[1];
    PANELS.ajuda[1] = function () {
      var h = _aj();
      var extra =
        '<p class="txt"><strong>Remover:</strong> escolha a ferramenta Remover, toque numa planta ou árvore e toque de novo para confirmar. Útil para tirar uma árvore que você não quer mais.</p>';
      var k = h.indexOf('<button class="btn" data-act="tut">');
      return k >= 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra;
    };
  } catch (e) {}

  render();
})();
