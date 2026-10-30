/* sementes.js - novo menu de sementes (grade de cartões).
   Carregar DEPOIS de todos os outros scripts (pode ser depois do andar.js).
   Não mexe no resto do jogo: só troca a função que desenha o painel "Sementes".
   A escolha continua usando o mesmo código do jogo (data-act="pick" / "pickt"). */
(function () {
  if (typeof PANELS === "undefined" || !PANELS.sementes) return;

  var V = "2"; /* mude ao trocar um PNG de semente (evita cache) */
  var ICO = {
    Cenoura: "cenoura",
    Milho: "milho",
    Tomate: "tomate",
    Morango: "morango",
    Abóbora: "abobora",
    Girassol: "girassol",
    Laranjeira: "laranjeira",
    Mangueira: "mangueira",
    Macieira: "macieira",
  };

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    ".panel:has(.sx){max-width:min(96vw,1240px);width:96vw}" +
    ".panel:has(.sx) .pbody{padding:14px 18px 18px;overflow-x:hidden}" +
    ".panel:has(.sx) .phead{padding:14px 20px}" +
    ".panel:has(.sx) .phead h2{font-size:28px}" +
    ".sx-top{position:sticky;top:-14px;z-index:3;display:flex;align-items:center;" +
    "justify-content:space-between;gap:10px;margin:-4px 0 12px;padding:4px 0 10px;" +
    "background:var(--panel);border-bottom:2px solid var(--line)}" +
    ".sx-tabs{display:flex;gap:8px}" +
    ".sx-tab{border:3px solid var(--line);background:transparent;color:var(--ink);" +
    "border-radius:12px;padding:7px 16px;font:700 15px var(--font-body);cursor:pointer;" +
    "box-shadow:0 3px 0 rgba(0,0,0,.14)}" +
    ".sx-tab[aria-pressed=true]{background:var(--leaf);border-color:var(--leaf);color:#fff}" +
    ".sx-coins{display:flex;align-items:center;gap:6px;background:var(--hud);color:var(--hud-ink);" +
    "border:2px solid var(--hud-line);border-radius:999px;padding:4px 12px 4px 6px;" +
    "font-weight:700;font-variant-numeric:tabular-nums}" +
    ".sx-c{width:18px;height:18px;border-radius:50%;flex:none;border:2px solid #8a6200;" +
    "background:radial-gradient(circle at 35% 30%,#fff1a6,var(--coin) 55%,#b98100)}" +
    ".sx-help{margin:0 0 12px;color:var(--ink-soft);font-size:13px;line-height:1.45}" +
    ".sx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(172px,1fr));gap:14px;align-items:stretch}" +
    ".sx-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;" +
    "text-align:center;padding:14px 10px 10px;border:3px solid var(--line);border-radius:16px;" +
    "background:linear-gradient(var(--panel),color-mix(in srgb,var(--line) 30%,var(--panel)));" +
    "color:var(--ink);font:inherit;cursor:pointer;box-shadow:0 4px 0 rgba(0,0,0,.14);" +
    "transition:transform .08s,box-shadow .08s}" +
    ".sx-card:hover{transform:translateY(-2px)}" +
    ".sx-card:active{transform:translateY(2px);box-shadow:0 1px 0 rgba(0,0,0,.14)}" +
    ".sx-card:focus-visible{outline:3px solid var(--accent);outline-offset:2px}" +
    ".sx-card.sel{border-color:var(--leaf);box-shadow:0 0 0 3px color-mix(in srgb,var(--leaf) 35%,transparent)," +
    "0 4px 0 rgba(0,0,0,.14)}" +
    ".sx-card.lock{cursor:not-allowed;opacity:.62;filter:grayscale(.55)}" +
    ".sx-card.lock:hover{transform:none}" +
    ".sx-ok{position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;" +
    "background:var(--leaf);color:#fff;font-weight:700;line-height:26px;text-align:center;" +
    "border:2px solid #fff;box-shadow:0 2px 0 rgba(0,0,0,.25)}" +
    ".sx-lk{position:absolute;top:8px;left:8px;display:flex;align-items:center;gap:3px;" +
    "background:var(--hud);color:var(--hud-ink);border-radius:999px;padding:2px 9px 2px 6px;" +
    "font-size:12px;font-weight:700}" +
    ".sx-lk svg{width:13px;height:13px}" +
    ".sx-ic{width:80px;height:80px;object-fit:contain;filter:drop-shadow(0 3px 2px rgba(0,0,0,.28))}" +
    ".sx-fb{width:64px;height:64px;border-radius:50%;margin:8px 0;border:3px solid rgba(0,0,0,.3);" +
    "box-shadow:inset 0 -6px 0 rgba(0,0,0,.12)}" +
    ".sx-name{font-family:var(--font-display);font-size:19px;line-height:1.1}" +
    ".sx-price{display:inline-flex;align-items:center;gap:5px;font-weight:700;" +
    "background:var(--hud);color:var(--hud-ink);border-radius:999px;padding:3px 11px 3px 6px;" +
    "font-variant-numeric:tabular-nums}" +
    ".sx-price.no{background:#8a2a22}" +
    ".sx-price .sx-c{width:15px;height:15px}" +
    ".sx-stats{display:grid;grid-template-columns:1fr 1fr;gap:6px 8px;width:100%;margin-top:2px;" +
    "padding-top:8px;border-top:2px dashed var(--line)}" +
    ".sx-stats span{display:flex;flex-direction:column;font-size:11px;color:var(--ink-soft);" +
    "text-transform:uppercase;letter-spacing:.04em;font-weight:700;line-height:1.2}" +
    ".sx-stats b{color:var(--ink);font-size:14px;text-transform:none;letter-spacing:0;" +
    "font-variant-numeric:tabular-nums}" +
    ".sx-stats b.g{color:var(--leaf)}" +
    ".sx-btn{width:100%;margin-top:2px;padding:7px 0;border-radius:10px;font-weight:700;" +
    "border:2px solid var(--leaf);color:var(--leaf);background:transparent}" +
    ".sx-card.sel .sx-btn{background:var(--leaf);color:#fff}" +
    ".sx-card.lock .sx-btn{border-color:var(--line);color:var(--ink-soft)}" +
    "@media(max-width:760px){.panel:has(.sx){width:100%}.sx-grid{grid-template-columns:1fr 1fr;gap:8px}}" +
    "@media(max-width:420px){.sx-grid{grid-template-columns:1fr 1fr;gap:8px}" +
    ".sx-ic{width:64px;height:64px}.sx-name{font-size:17px}.sx-stats b{font-size:13px}}";
  document.head.appendChild(st);
  /* ---------- imagens que o jogo já tem ---------- */
  var PROD = {
    Cenoura: "cenoura",
    Milho: "milho",
    Tomate: "tomate",
    Morango: "morango",
    Abóbora: "abobora",
    Girassol: "girassol",
    Laranjeira: "laranja",
    Mangueira: "manga",
    Macieira: "maca",
  };
  function probe(name, cb) {
    var list = ["img/ui/" + name + "?v=" + V, "img/" + name + "?v=" + V];
    (function next(i) {
      if (i >= list.length) return cb(null);
      var im = new Image();
      im.onload = function () {
        cb(list[i]);
      };
      im.onerror = function () {
        next(i + 1);
      };
      im.src = list[i];
    })(0);
  }
  var st3 = document.createElement("style");
  st3.textContent =
    ".sx-stats b{display:inline-flex;align-items:center;gap:4px}" +
    ".sx-stats b .sx-c{width:17px;height:17px}" +
    ".sx-pi{width:22px;height:22px;object-fit:contain;flex:none}" +
    ".sx-tab{display:inline-flex;align-items:center;gap:6px}" +
    ".sx-tab img{width:24px;height:24px;object-fit:contain}";
  document.head.appendChild(st3);
  /* moeda: a mesma do cabeçalho */
  probe("hud_moeda.png", function (u) {
    if (!u) return;
    st3.textContent +=
      ".sx-c{background:url('" +
      u +
      "') center/contain no-repeat !important;" +
      "border:0 !important;box-shadow:none !important}" +
      ".sx-price .sx-c{width:20px;height:20px}" +
      ".sx-coins .sx-c{width:24px;height:24px}";
  });
  var MO = '<i class="sx-c"></i>';
  function pi(nome) {
    var s = PROD[nome];
    return s
      ? '<img class="sx-pi" alt="" draggable="false" src="img/icones/prod_' +
          s +
          ".png?v=" +
          V +
          '" onerror="this.remove()">'
      : "";
  }
  function tabIco(slug) {
    return (
      '<img alt="" draggable="false" src="img/icones/semente_' +
      slug +
      ".png?v=" +
      V +
      '" onerror="this.remove()">'
    );
  }

  /* ---------- ícone com plano B (se o PNG não existir, vira uma bolinha colorida) ---------- */
  window.sxErr = function (im) {
    var slug = im.getAttribute("data-s"),
      t = +im.getAttribute("data-t") || 0;
    if (t === 0) {
      im.setAttribute("data-t", "1");
      im.src = "img/semente_" + slug + ".png?v=" + V;
    } else {
      var d = document.createElement("div");
      d.className = "sx-fb";
      d.style.background = im.getAttribute("data-c");
      if (im.parentNode) im.parentNode.replaceChild(d, im);
    }
  };
  function icone(nome, cor) {
    var slug = ICO[nome] || "";
    return (
      '<img class="sx-ic" alt="" draggable="false" data-s="' +
      slug +
      '" data-c="' +
      cor +
      '" src="img/icones/semente_' +
      slug +
      ".png?v=" +
      V +
      '" onerror="sxErr(this)">'
    );
  }

  var LOCK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>';

  function st2(label, valor, cls) {
    return (
      "<span>" +
      label +
      "<b" +
      (cls ? ' class="' + cls + '"' : "") +
      ">" +
      valor +
      "</b></span>"
    );
  }

  function card(o) {
    /* o: {nome, cor, custo, lvl, sel, act, i, stats, tipo} */
    var lock = S.lvl < o.lvl,
      semGrana = !lock && S.coins < o.custo;
    var corpo =
      (lock
        ? '<span class="sx-lk">' + LOCK + "Nível " + o.lvl + "</span>"
        : o.sel
          ? '<span class="sx-ok">✔</span>'
          : "") +
      icone(o.nome, o.cor) +
      '<span class="sx-name">' +
      o.nome +
      "</span>" +
      '<span class="sx-price' +
      (semGrana ? " no" : "") +
      '"><i class="sx-c"></i>' +
      o.custo +
      "</span>" +
      '<span class="sx-stats">' +
      o.stats +
      "</span>" +
      '<span class="sx-btn">' +
      (lock ? "Bloqueada" : o.sel ? "Escolhida" : "Escolher") +
      "</span>";
    if (lock)
      return (
        '<div class="sx-card lock" aria-disabled="true" aria-label="' +
        o.nome +
        ", libera no nível " +
        o.lvl +
        '">' +
        corpo +
        "</div>"
      );
    return (
      '<button class="sx-card' +
      (o.sel ? " sel" : "") +
      '" data-act="' +
      o.act +
      '" data-i="' +
      o.i +
      '" aria-pressed="' +
      !!o.sel +
      '">' +
      corpo +
      "</button>"
    );
  }

  /* ---------- painel ---------- */
  function pSementesNovo() {
    var tabs = [
      ["cult", "Culturas"],
      ["arv", "Árvores"],
    ]
      .map(function (x) {
        return (
          '<button class="sx-tab" data-act="seedtab" data-v="' +
          x[0] +
          '" aria-pressed="' +
          (seedTab === x[0]) +
          '">' +
          x[1] +
          "</button>"
        );
      })
      .join("");
    var top =
      '<div class="sx-top"><div class="sx-tabs">' +
      tabs +
      '</div><div class="sx-coins" title="Suas moedas"><i class="sx-c"></i>' +
      S.coins +
      "</div></div>";
    var h;
    if (seedTab === "arv") {
      h =
        '<p class="sx-help">Árvores ocupam um canteiro. Depois de crescer, dão frutas várias vezes: a cada colheita, começa um tempo de rebrota.</p>' +
        '<div class="sx-grid">' +
        TREES.map(function (c, i) {
          return card({
            nome: c.nome,
            cor: c.cor,
            custo: c.custo,
            lvl: c.lvl,
            sel: S.sel === 10 + i,
            act: "pickt",
            i: i,
            stats:
              st2("Cresce em", fmt(c.tempo)) +
              st2("Rebrota", fmt(c.rebrota)) +
              st2("Dá", c.frutos + " " + c.fruto.toLowerCase() + "s") +
              st2("Cada fruta", c.venda, "g") +
              st2("XP", "+" + c.xp) +
              st2("Por colheita", c.frutos * c.venda, "g"),
          });
        }).join("") +
        "</div>";
    } else {
      h =
        '<div class="sx-grid">' +
        CROPS.map(function (c, i) {
          return card({
            nome: c.nome,
            cor: c.cor,
            custo: c.custo,
            lvl: c.lvl,
            sel: S.sel === i,
            act: "pick",
            i: i,
            stats:
              st2("Cresce em", fmt(c.tempo)) +
              st2("Vende por", c.venda, "g") +
              st2("XP", "+" + c.xp) +
              st2("Lucro", "+" + (c.venda - c.custo), "g"),
          });
        }).join("") +
        "</div>";
    }
    return '<div class="sx">' + top + h + "</div>";
  }

  PANELS.sementes[1] = pSementesNovo;
  try {
    pSementes = pSementesNovo;
  } catch (e) {}
})();
