/* ===========================================================
   Roça Feliz - regar.js
   Ferramenta "Regador": rega uma planta ou árvore que está crescendo.
   Carregar POR ÚLTIMO no index.html, DEPOIS do remover.js:
     <script src="remover.js"></script>
     <script src="regar.js"></script>

   Regras (ajuste as constantes logo abaixo):
   - O regador é grátis e não acaba.
   - Cada rega adianta WATER (10%) do tempo total de crescimento
     (ou de rebrota, nas árvores).
   - Cada canteiro aceita UMA rega por ciclo (como o fertilizante).
     O ciclo recomeça depois da colheita.
   - Com chuva não precisa regar: a chuva já acelera tudo.
   - Plantas com erva daninha não podem ser regadas (limpe antes).

   Opcional: img/ui/tool_regador.png vira o ícone do botão e o ponteiro
   do mouse (reduzido na hora para 32 px, igual ao cursor.js).
   =========================================================== */
(function () {
  if (
    typeof S === "undefined" ||
    typeof act !== "function" ||
    typeof render !== "function"
  )
    return;

  var V = "1"; /* mude ao trocar o PNG (evita cache) */
  var WATER = 0.1; /* fração do tempo total adiantada por rega */

  var CAN_IMG = null;

  /* ícone reserva (regador) desenhado em código, usado enquanto não houver o PNG */
  var CAN =
    '<svg class="tico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 10h9v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M8 10V8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v2"/><path d="M15 14l5-5"/><path d="M19 7l3 3"/><path d="M21 14v.01M19 17v.01M22 17.5v.01"/></svg>';

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#tools .tb svg.tico{width:22px;height:22px;flex:none}" +
    '#tools .tb[data-t="water"][aria-pressed="true"]{border-color:#5bb8ff;box-shadow:0 0 0 2px rgba(91,184,255,.35)}' +
    '#app:not(.modal)[data-tool="water"] .tile{cursor:pointer !important}';
  document.head.appendChild(st);

  /* ---------- ícone / ponteiro em PNG (opcional) ---------- */
  var stc = document.createElement("style");
  document.head.appendChild(stc);
  (function () {
    var list = ["img/ui/tool_regador.png?v=" + V, "img/tool_regador.png?v=" + V];
    (function next(i) {
      if (i >= list.length) return;
      var im = new Image();
      im.onload = function () {
        CAN_IMG = list[i];
        /* ponteiro: recorta a margem transparente e reduz para 32 px */
        try {
          var w = im.naturalWidth,
            h = im.naturalHeight,
            t = document.createElement("canvas");
          t.width = w;
          t.height = h;
          var tx = t.getContext("2d");
          tx.drawImage(im, 0, 0);
          var d = tx.getImageData(0, 0, w, h).data,
            x0 = w,
            y0 = h,
            x1 = 0,
            y1 = 0,
            x,
            y;
          for (y = 0; y < h; y++)
            for (x = 0; x < w; x++)
              if (d[(y * w + x) * 4 + 3] > 16) {
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
              }
          if (x1 > x0 && y1 > y0) {
            var bw = x1 - x0 + 1,
              bh = y1 - y0 + 1,
              k = 30 / Math.max(bw, bh),
              dw = Math.max(1, Math.round(bw * k)),
              dh = Math.max(1, Math.round(bh * k)),
              c = document.createElement("canvas");
            c.width = 32;
            c.height = 32;
            var cx = c.getContext("2d");
            cx.imageSmoothingQuality = "high";
            cx.drawImage(
              im,
              x0,
              y0,
              bw,
              bh,
              Math.round((32 - dw) / 2),
              Math.round((32 - dh) / 2),
              dw,
              dh,
            );
            stc.textContent =
              '#app:not(.modal)[data-tool="water"] .tile{cursor:url("' +
              c.toDataURL("image/png") +
              '") 16 16, pointer !important}';
          }
        } catch (e) {
          /* sem canvas (file://): fica o ponteiro de mão */
        }
        render();
      };
      im.onerror = function () {
        next(i + 1);
      };
      im.src = list[i];
    })(0);
  })();

  /* ---------- som ---------- */
  if (typeof SFX !== "undefined") {
    SFX.water = function () {
      noise(0, 0.28, 3500, 0.7, 0.12, "highpass");
      tone(900, 0, 0.08, "sine", 0.06, 500);
      tone(700, 0.1, 0.08, "sine", 0.05, 420);
    };
  }

  /* ---------- gotinhas ---------- */
  function drops(i) {
    if (rm()) return;
    var w = btns[i].w,
      f = $("field"),
      cx = w.offsetLeft + w.offsetWidth / 2,
      cy = w.offsetTop + w.offsetHeight * 0.1,
      k;
    for (k = 0; k < 7; k++) {
      var d = mk(
        "z-index:6;left:" +
          (cx - 3 + (Math.random() - 0.5) * w.offsetWidth * 0.5) +
          "px;top:" +
          cy +
          "px;width:6px;height:9px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;" +
          "background:#5bb8ff;border:1px solid #2b6ea8",
      );
      f.appendChild(d);
      if (!d.animate) {
        d.remove();
        continue;
      }
      d.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          {
            transform: "translateY(" + w.offsetHeight * 0.7 + "px)",
            opacity: 0,
          },
        ],
        {
          duration: 520 + Math.random() * 250,
          delay: k * 40,
          easing: "ease-in",
          fill: "both",
        },
      ).onfinish = (function (e) {
        return function () {
          e.remove();
        };
      })(d);
    }
  }

  /* ---------- a rega ---------- */
  var _act = act;
  act = function (i) {
    if (S.tool !== "water") return _act.apply(this, arguments);
    var p = S.plots[i];
    /* canteiro bloqueado: segue o comportamento normal (compra) */
    if (!p || !p.on) return _act.apply(this, arguments);

    if (isEmpty(p)) {
      toast("Plante algo antes de regar.");
      return;
    }
    if (rainOn) {
      toast("Está chovendo: a chuva já ajuda as plantas a crescer.");
      return;
    }
    if (isTree(p)) {
      var T = TREES[p.t];
      if (p.m && tReady(p)) {
        toast("Esta planta já está pronta.");
        return;
      }
      if (p.d) {
        toast("Este canteiro já foi regado.");
        return;
      }
      p.d = true;
      S.stats.watered = (S.stats.watered || 0) + 1;
      if (!p.m) {
        p.pr = Math.min(T.tempo * 1000, p.pr + T.tempo * 1000 * WATER);
        if (p.pr >= T.tempo * 1000) {
          p.m = true;
          p.rb = T.rebrota * 1000;
        }
      } else {
        p.rb = Math.min(T.rebrota * 1000, p.rb + T.rebrota * 1000 * WATER);
      }
    } else {
      if (p.w) {
        toast("Limpe as ervas antes: elas travam o crescimento.");
        return;
      }
      if (frac(p) >= 1) {
        toast("Esta planta já está pronta.");
        return;
      }
      if (p.d) {
        toast("Este canteiro já foi regado.");
        return;
      }
      p.d = true;
      S.stats.watered = (S.stats.watered || 0) + 1;
      p.pr = Math.min(
        CROPS[p.c].tempo * 1000,
        p.pr + CROPS[p.c].tempo * 1000 * WATER,
      );
    }
    pop(i, "+" + Math.round(WATER * 100) + "%");
    sfx("water");
    drops(i);
  };

  /* depois da colheita o canteiro pode ser regado de novo */
  var _h = harvest;
  harvest = function (i) {
    var r = _h.apply(this, arguments);
    if (S.plots[i]) S.plots[i].d = false;
    return r;
  };
  var _ht = harvestTree;
  harvestTree = function (i) {
    var r = _ht.apply(this, arguments);
    if (S.plots[i]) S.plots[i].d = false;
    return r;
  };

  /* ---------- botão na barra de ferramentas ---------- */
  $("tools").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest('[data-t="water"]');
      if (!b) return;
      S.tool = S.tool === "water" ? "hand" : "water";
      if (S.tool === "water")
        toast("Regador: toque numa planta que está crescendo.");
    },
    true /* captura: roda antes do tratador do jogo, que redesenha em seguida */,
  );

  function decorate() {
    var box = $("tools");
    $("app").setAttribute("data-tool", S.tool);
    /* canteiro vazio nunca guarda marca de rega */
    S.plots.forEach(function (p) {
      if (p.d && isEmpty(p)) p.d = false;
    });
    if (!box) return;
    if (!box.querySelector('[data-t="water"]')) {
      var b = document.createElement("button");
      b.className = "tb";
      b.dataset.t = "water";
      b.setAttribute("aria-label", "Regador");
      b.innerHTML =
        (CAN_IMG
          ? '<img class="tico" src="' + CAN_IMG + '" alt="">'
          : CAN) + "Regador";
      var ref = box.querySelector('[data-t="fert"]');
      /* logo depois do Fertilizante */
      box.insertBefore(b, ref ? ref.nextSibling : null);
    }
    box
      .querySelector('[data-t="water"]')
      .setAttribute("aria-pressed", S.tool === "water");
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
        '<p class="txt"><strong>Regador:</strong> ferramenta grátis. Escolha o Regador e toque numa planta que está crescendo para adiantar ' +
        Math.round(WATER * 100) +
        '% do tempo. Cada canteiro aceita uma rega por ciclo. Com chuva não precisa regar.</p>';
      var k = h.indexOf('<button class="btn" data-act="tut">');
      return k >= 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra;
    };
  } catch (e) {}

  render();
})();
