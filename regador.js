/* ===========================================================
   Roça Feliz - regador.js
   - Planta nova nasce SECA e só cresce depois de regada (Regador, planta por planta).
   - A rega das culturas dura WET_MS: depois a planta seca de novo e para de crescer.
   - Árvores frutíferas: depois de COLHEITAS_ARVORE colheitas, a árvore seca
     e só dá frutas de novo depois de regada.
   - Planta pronta para colher não seca.
   - Chuva rega e mantém as culturas molhadas (não afeta as árvores).

   Imagens secas (mesmo nome + "_seca"):
     img/plantas/planta_tomate_seca.png  (e as outras plantas)
     img/arvores/arvore_mangueira_seca.png (e as outras árvores)
   Se a imagem seca não existir, o jogo usa o filtro cinza no lugar.

   Gota de "precisa de água": img/gota.png (se não existir, usa a gota
   desenhada em código).

   Carregar POR ÚLTIMO no index.html:  <script src="regador.js"></script>
   =========================================================== */
(function () {
  if (typeof S === "undefined" || typeof PANELS === "undefined") return;

  /* ================= AJUSTES ================= */
  var CHUVA_REGA = true; /* a chuva rega e mantém as culturas molhadas */
  var WET_MS =
    3 * 60 * 1000; /* quanto tempo a cultura fica molhada depois de regada */
  var COLHEITAS_ARVORE = 2; /* a árvore seca depois dessa quantidade de colheitas */
  var V = "2";

  /* gota acima da planta seca */
  var GOTA_SRC = "img/gota.png?v=1";
  var GOTA_LARGURA = 0.16; /* largura da gota, em fração da largura do canteiro */

  /* ---------- migração: culturas que já existiam contam como regadas ---------- */
  if (!S.waterV) {
    S.plots.forEach(function (p) {
      if (p.c >= 0 && !isTree(p)) {
        p.wt = true;
        p.wat = Date.now();
      }
    });
    S.waterV = 1;
  }

  /* ---------- auxiliares ---------- */
  function isCrop(p) {
    return p.on && p.c >= 0 && !isTree(p);
  }
  function isDryTree(p) {
    return p.on && isTree(p) && !!p.td;
  }
  function isDry(p) {
    return (isCrop(p) && !p.wt) || isDryTree(p);
  }
  function pronta(p) {
    return p.c >= 0 && frac(p) >= 1; /* cultura madura não seca */
  }

  /* som de água */
  SFX.water = function () {
    noise(0, 0.28, 3200, 0.7, 0.16, "highpass");
    tone(900, 0.04, 0.12, "sine", 0.05, 450);
  };

  /* ---------- acha a imagem do regador uma vez só ---------- */
  var ICON = null;
  (function () {
    var l = [
      "ui/tool_regador.png",
      "tool_regador.png",
      "tool_regador.png.png",
      "ui/tool_regador.png.png",
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

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".wtr{position:absolute;left:50%;top:calc(var(--tw)*-.2);width:calc(var(--tw)*" +
    GOTA_LARGURA +
    ");min-width:12px;" +
    "margin-left:calc(var(--tw)*-" +
    GOTA_LARGURA / 2 +
    ");z-index:8;pointer-events:none;animation:wtrbob 1.1s ease-in-out infinite}" +
    ".wtr svg,.wtr img{display:block;width:100%;height:auto;filter:drop-shadow(0 2px 1px rgba(0,0,0,.4));" +
    "-webkit-user-drag:none;user-select:none}" +
    "@keyframes wtrbob{50%{transform:translateY(-4px)}}" +
    /* sem imagem seca: usa filtro. Com imagem seca: sem filtro */
    ".pw.dry:not(.dryimg) .ov .spr{opacity:.72;filter:grayscale(.55) sepia(.25)}" +
    ".pw.dry .ov .pbar{display:none}" +
    "@media (prefers-reduced-motion:reduce){.wtr{animation:none}}";
  document.head.appendChild(st);

  /* gota reserva, desenhada em código (usada se img/gota.png não existir) */
  var DROP_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0C19 10 12 2 12 2z" fill="#5ab8f0" stroke="#1d5a8a" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="9.5" cy="14" rx="1.6" ry="2.6" fill="#fff" opacity=".75"/></svg>';
  var DROP_IMG =
    '<img src="' + GOTA_SRC + '" alt="" draggable="false" aria-hidden="true">';
  var DROP = DROP_SVG;

  /* usa a imagem da gota se ela existir */
  (function () {
    var im = new Image();
    im.onload = function () {
      DROP = DROP_IMG;
      /* troca as gotas que já estão na tela */
      document.querySelectorAll(".wtr").forEach(function (el) {
        el.innerHTML = DROP;
      });
    };
    im.src = GOTA_SRC;
  })();

  /* ---------- regar ---------- */
  function regar(i) {
    var p = S.plots[i];
    if (isEmpty(p)) return toast("Plante algo antes de regar.");
    if (isTree(p)) {
      if (!p.td) return toast("Esta árvore ainda não precisa de rega.");
      p.td = false;
      p.hc = 0;
    } else {
      if (p.wt) return toast("Esta planta já está molhada.");
      p.wt = true;
      p.w = false;
      p.wat = Date.now();
    }
    pop(i, "Regada!");
    sfx("water");
  }

  /* ---------- culturas secam com o tempo ---------- */
  /* devolve quantas secaram agora */
  function secar() {
    var n = 0,
      now = Date.now();
    S.plots.forEach(function (p) {
      if (!isCrop(p) || !p.wt || pronta(p)) return;
      if (CHUVA_REGA && rainOn) {
        p.wat = now; /* chuva mantém molhada */
        return;
      }
      if (!p.wat) p.wat = now; /* save antigo sem horário */
      if (now - p.wat > WET_MS) {
        p.wt = false;
        p.pf = p.pr || 0; /* guarda o progresso: a planta fica parada */
        n++;
      }
    });
    return n;
  }

  /* ---------- árvores secam depois de N colheitas ---------- */
  var _harvestTree = harvestTree;
  harvestTree = function (i) {
    _harvestTree(i);
    var p = S.plots[i];
    p.hc = (p.hc || 0) + 1;
    if (p.hc >= COLHEITAS_ARVORE) {
      p.td = true;
      p.rb = 0;
      toast("A árvore secou! Regue para ela dar frutas de novo.");
    }
  };

  /* toque no canteiro (captura: roda antes do jogo) */
  $("field").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest(".tile");
      if (!b) return;
      var i = +b.dataset.i,
        p = S.plots[i];
      if (!p.on) return; /* comprar canteiro: segue o jogo normal */

      if (S.tool === "water") {
        e.stopPropagation();
        regar(i);
        after();
        return;
      }
      /* com a Mão ou o Fertilizante numa planta seca: avisa em vez de agir */
      if (isDry(p) && (S.tool === "hand" || S.tool === "fert")) {
        e.stopPropagation();
        toast(
          S.tool === "fert"
            ? "Regue antes de usar fertilizante."
            : isTree(p)
              ? "A árvore está seca. Use o Regador para ela dar frutas."
              : "A planta está seca. Use o Regador para ela crescer.",
        );
      }
    },
    true,
  );

  /* ---------- barra de ferramentas ---------- */
  $("tools").addEventListener(
    "click",
    function (e) {
      var b = e.target.closest('.tb[data-t="water"]');
      if (!b) return;
      e.stopPropagation();
      S.tool = S.tool === "water" ? "hand" : "water";
      if (S.tool === "water") toast("Toque numa planta seca para regar.");
      after();
    },
    true,
  );

  function addToolBtns() {
    var t = $("tools");
    if (!t) return;

    var old = t.querySelector('.tb[data-t="waterall"]');
    if (old) old.remove();

    if (t.querySelector('.tb[data-t="water"]')) return;
    var hand = t.querySelector('.tb[data-t="hand"]'),
      w = document.createElement("button");
    w.className = "tb";
    w.dataset.t = "water";
    w.setAttribute("aria-pressed", S.tool === "water");
    w.innerHTML =
      (ICON
        ? '<img class="tico" alt="" src="' + ICON + '">'
        : '<span class="ie">💧</span>') + "Regador";
    t.insertBefore(w, hand ? hand.nextSibling : t.firstChild);
  }

  /* ---------- imagem seca ----------
     O jogo desenha plantas e árvores como background-image num .simg.
     Troca planta_x.png <-> planta_x_seca.png (e arvore_x). Só troca se a
     imagem seca existir, para nunca sumir a planta. */
  var OKI = {};
  function existe(url) {
    if (OKI[url] !== undefined) return OKI[url];
    OKI[url] = null;
    var im = new Image();
    im.onload = function () {
      OKI[url] = true;
      try {
        render();
      } catch (e) {}
    };
    im.onerror = function () {
      OKI[url] = false;
    };
    im.src = url;
    return null;
  }
  function urlDe(s) {
    var m = /url\(["']?([^"')]+)/.exec(s || "");
    return m ? m[1] : null;
  }
  function trocaNome(txt, dry) {
    if (!txt || !/(planta_|arvore_)/.test(txt)) return txt;
    if (dry)
      return /_seca\.png/.test(txt) ? txt : txt.replace(".png", "_seca.png");
    return txt.replace("_seca.png", ".png");
  }
  function trocaImagem(w, dry) {
    var achou = false;
    w.querySelectorAll(".simg").forEach(function (el) {
      var bg = el.style.backgroundImage,
        nb = trocaNome(bg, dry);
      if (dry && nb !== bg && existe(urlDe(nb)) !== true) nb = bg;
      if (nb !== bg) el.style.backgroundImage = nb;
      if (nb && nb.indexOf("_seca") >= 0) achou = true;
    });
    w.classList.toggle("dryimg", achou);
  }

  /* ---------- marcas visuais ---------- */
  function marks() {
    S.plots.forEach(function (p, i) {
      var w = btns[i].w,
        dry = isDry(p),
        el = w.querySelector(".wtr");
      w.classList.toggle("dry", dry);
      trocaImagem(w, dry);
      if (dry && !el) {
        el = document.createElement("div");
        el.className = "wtr";
        el.innerHTML = DROP;
        w.appendChild(el);
      } else if (!dry && el) el.remove();
    });
  }

  var _render = render;
  render = function () {
    secar();
    S.plots.forEach(function (p) {
      if (!p.on) return;
      if (isEmpty(p)) {
        /* canteiro livre: a próxima planta nasce seca */
        delete p.wt;
        delete p.wat;
        delete p.pf;
        delete p.hc;
        delete p.td;
        return;
      }
      if (isTree(p)) {
        delete p.wt;
        if (p.td) p.rb = 0; /* árvore seca: não conta tempo de rebrota */
        return;
      }
      if (p.wt === undefined) p.wt = false; /* planta nova */
      if (!p.wt && CHUVA_REGA && rainOn) {
        p.wt = true;
        p.wat = Date.now();
      }
      if (!p.wt) p.pr = p.pf || 0; /* seca: não cresce */
    });
    _render();
    marks();
    addToolBtns();
  };

  /* confere de segundo em segundo se alguma cultura secou */
  setInterval(function () {
    var n = secar();
    if (n) {
      toast(n > 1 ? n + " plantas secaram!" : "Uma planta secou!");
      after();
    }
  }, 1000);

  /* ---------- tutorial: passo novo depois de "Plante" ---------- */
  try {
    TUT.splice(2, 0, {
      t: "Regue",
      x: "Planta nova nasce seca e só cresce depois de regada. Escolha o Regador e toque em cada planta.",
      el: function () {
        return document.querySelector('.tb[data-t="water"]');
      },
      done: function () {
        return S.plots.some(function (p) {
          return isCrop(p) && p.wt;
        });
      },
    });
  } catch (e) {}

  /* ---------- Ajuda ---------- */
  try {
    var _aj = PANELS.ajuda[1];
    PANELS.ajuda[1] = function () {
      var h = _aj(),
        extra =
          '<p class="txt"><strong>Regador:</strong> planta nova nasce seca (aparece uma gota azul) e só cresce depois de regada. Escolha o Regador e toque em cada planta, uma por uma. A rega das culturas dura alguns minutos: depois a planta seca de novo até você regar outra vez. A chuva mantém as culturas molhadas. Culturas prontas para colher não secam. Árvores secam depois de ' +
          COLHEITAS_ARVORE +
          " colheitas e precisam de rega para dar frutas de novo.</p>",
        k = h.indexOf('<button class="btn" data-act="tut">');
      return k >= 0 ? h.slice(0, k) + extra + h.slice(k) : h + extra;
    };
  } catch (e) {}

  render();
})();
