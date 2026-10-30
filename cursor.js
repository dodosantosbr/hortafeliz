/* ===========================================================
   Roça Feliz - cursor.js
   O ponteiro do mouse muda conforme a ferramenta escolhida
   e conforme o que está embaixo dele.
   Carregar POR ÚLTIMO no index.html:  <script src="cursor.js"></script>

   Regras:
   - Ferramenta Mão (padrão) ......... ponteiro de mão  (ui/tool_mao.png)
   - Ferramenta Regador .............. regador          (ui/tool_regador.png)
   - Ferramenta Fertilizante ......... frasco            (ui/tool_fertilizante.png)
   - Mão sobre canteiro vazio ........ a semente escolhida (icones/semente_*.png)
   - Mão sobre planta pronta ......... luva              (ui/tool_luva.png)
   - Mão sobre planta com erva ....... foice             (ui/tool_foice.png)
   - Com algum painel aberto ......... ponteiro normal

   As imagens são reduzidas na hora (não precisa criar arquivo novo).
   Se alguma imagem faltar, o jogo usa o ponteiro normal naquele caso.
   =========================================================== */
(function () {
  var V = "1"; /* mude ao trocar um PNG (evita cache) */
  /* Tamanho do ponteiro em pixels. NÃO passe de 32: o Chrome troca ponteiros
     maiores que 32x32 pelo ponteiro padrão do Windows perto das bordas da janela. */
  var SIZE_ARROW = 28,
    SIZE_ICON = 32;

  var app = document.getElementById("app"),
    field = document.getElementById("field");
  if (!app || !field) return;

  var CROPF = ["cenoura", "milho", "tomate", "morango", "abobora", "girassol"],
    TREEF = ["laranjeira", "mangueira", "macieira"];
  var FILES = {
    mao: "ui/tool_mao.png",
    fert: "ui/tool_fertilizante.png",
    regador: "ui/tool_regador.png", // <- novo
    inset: "ui/tool_inseticida.png",
    luva: "ui/tool_luva.png",
    foice: "ui/tool_foice.png",
    pa: "ui/tool_pa.png",
  };
  CROPF.concat(TREEF).forEach(function (n) {
    FILES["s_" + n] = "icones/semente_" + n + ".png";
  });

  /* com painel aberto, volta ao ponteiro normal */
  var st = document.createElement("style");
  st.textContent = ".app.modal{cursor:auto !important}";
  document.head.appendChild(st);

  /* ---------- carrega e prepara cada ponteiro ---------- */
  var CUR = {};
  function probe(rel, cb) {
    var base = rel.split("/").pop(),
      list = ["img/" + rel + "?v=" + V, "img/" + base + "?v=" + V];
    (function next(i) {
      if (i >= list.length) return cb(null);
      var im = new Image();
      im.onload = function () {
        cb(im, list[i]);
      };
      im.onerror = function () {
        next(i + 1);
      };
      im.src = list[i];
    })(0);
  }
  /* recorta a margem transparente, reduz e acha o ponto de clique */
  function make(key, im, url) {
    var arrow = key === "mao",
      S0 = arrow ? SIZE_ARROW : SIZE_ICON;
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
      if (x1 <= x0 || y1 <= y0) throw 0;
      var bw = x1 - x0 + 1,
        bh = y1 - y0 + 1,
        k = (S0 - 2) / Math.max(bw, bh),
        dw = Math.max(1, Math.round(bw * k)),
        dh = Math.max(1, Math.round(bh * k)),
        c = document.createElement("canvas");
      c.width = S0;
      c.height = S0;
      var cx = c.getContext("2d"),
        ox = arrow ? 1 : Math.round((S0 - dw) / 2),
        oy = arrow ? 1 : Math.round((S0 - dh) / 2);
      cx.imageSmoothingQuality = "high";
      cx.drawImage(im, x0, y0, bw, bh, ox, oy, dw, dh);
      CUR[key] = {
        u: c.toDataURL("image/png"),
        x: arrow ? 2 : key === "pa" ? 3 : Math.round(S0 / 2),
        y: arrow ? 2 : key === "pa" ? S0 - 3 : Math.round(S0 / 2),
      };
    } catch (e) {
      /* abrindo por file:// o navegador bloqueia o canvas; usa o PNG direto */
      CUR[key] = {
        u: url,
        x: arrow ? 2 : key === "pa" ? 3 : 16,
        y: arrow ? 2 : key === "pa" ? 29 : 16,
      };
    }
  }
  var left = 0;
  Object.keys(FILES).forEach(function (k) {
    left++;
    probe(FILES[k], function (im, url) {
      if (im) make(k, im, url);
      if (--left === 0) {
        prewarm();
        refresh();
      }
    });
  });

  /* ---------- qual ponteiro usar ---------- */
  function css(k, fallback) {
    var c = CUR[k] || CUR.mao;
    return c
      ? 'url("' + c.u + '") ' + c.x + " " + c.y + ", " + fallback
      : fallback === "auto"
        ? ""
        : fallback;
  }
  function seedKey() {
    var n = S.sel >= 10 ? TREEF[S.sel - 10] : CROPF[S.sel];
    return "s_" + n;
  }
  function toolKey() {
    return S.tool === "fert"
      ? "fert"
      : S.tool === "water"
        ? "regador"
        : S.tool === "insect"
          ? "inset"
          : S.tool === "remove"
            ? "pa"
            : "mao";
  }
  function tileKey(i) {
    var p = S.plots[i];
    if (!p || !p.on) return "mao";
    if (S.tool === "remove") return isEmpty(p) ? "mao" : "pa";
    if (S.tool === "water") return "regador";
    if (S.tool === "fert") return "fert";
    if (S.tool === "insect") return "inset";
    if (isEmpty(p)) return seedKey();
    if (isTree(p)) return tReady(p) ? "luva" : "mao";
    if (p.w) return "foice";
    return frac(p) >= 1 ? "luva" : "mao";
  }
  /* só escreve no elemento quando o valor mudou (reescrever igual faz o ponteiro piscar) */
  function setCur(el, v) {
    if (el._cur !== v) {
      el._cur = v;
      el.style.cursor = v;
    }
  }
  /* aquece a imagem de cada ponteiro, para a primeira troca não demorar */
  var warm = null;
  function prewarm() {
    if (warm) warm.remove();
    warm = document.createElement("div");
    warm.setAttribute("aria-hidden", "true");
    warm.style.cssText =
      "position:fixed;left:-20px;top:-20px;width:1px;height:1px;opacity:0;pointer-events:none";
    Object.keys(CUR).forEach(function (k) {
      var d = document.createElement("div");
      d.style.cssText = "width:1px;height:1px;cursor:" + css(k, "auto");
      warm.appendChild(d);
    });
    document.body.appendChild(warm);
  }
  function refresh() {
    if (typeof S === "undefined" || !S) return;
    try {
      setCur(app, css(toolKey(), "auto"));
      /* todos os canteiros já ficam com o ponteiro certo, sem esperar o mouse chegar */
      var tiles = field.querySelectorAll(".tile"),
        i;
      for (i = 0; i < tiles.length; i++)
        setCur(tiles[i], css(tileKey(+tiles[i].dataset.i), "pointer"));
    } catch (e) {}
  }

  /* atualiza na hora em que o jogo redesenha (trocou de ferramenta, plantou, amadureceu) */
  var _render = render;
  render = function () {
    _render.apply(this, arguments);
    refresh();
  };
  setInterval(refresh, 500);
})();
