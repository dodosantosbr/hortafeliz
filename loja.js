/* Roça Feliz - loja.js
   Loja em grade com abas (Ferramentas / Animais / Decoração).
   Carregar por ÚLTIMO no index.html, depois de porco.js:
   <script src="loja.js"></script>

   ÍCONES: por padrão usa emojis. Para usar seus PNGs, salve em img/loja/
   com o nome do item sem acento e minúsculo, ex.: img/loja/galinha.png,
   img/loja/vaca.png, img/loja/burro.png, img/loja/fertilizante.png ...
   Se o PNG existir ele aparece; se não, fica o emoji. */
(function () {
  var EMO = {
    fertilizante: "🧪",
    "pacote com 5 fertilizantes": "📦",
    espantalho: "🎃",
    herbicida: "🧴",
    "pacote com 5 herbicidas": "🧴",
    galinheiro: "🛖",
    galinha: "🐔",
    vaca: "🐄",
    burro: "🫏",
    porco: "🐖",
    ovelha: "🐑",
    pato: "🦆",
  };
  var ANIMAIS = [
    "galinheiro",
    "galinha",
    "vaca",
    "burro",
    "porco",
    "ovelha",
    "pato",
    "cabra",
    "cavalo",
  ];
  var TABS = [
    ["ferr", "Ferramentas"],
    ["anim", "Animais"],
    ["deco", "Decoração"],
  ];

  function slug(s) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s*\(.*\)\s*/, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }
  function baseName(n) {
    return n
      .toLowerCase()
      .replace(/\s*\(.*\)\s*/, "")
      .trim();
  }
  function kindOf(n) {
    var b = baseName(n);
    for (var i = 0; i < ANIMAIS.length; i++)
      if (b.indexOf(ANIMAIS[i]) === 0) return "anim";
    return "ferr";
  }
  /* onde procurar a imagem de cada item (dentro de img/), na ordem */
  var V = "2";
  var IMGS = {
    fertilizante: ["ui/tool_fertilizante.png", "ui/menu_fert.png"],
    "pacote com 5 fertilizantes": [
      "ui/menu_fert.png",
      "ui/tool_fertilizante.png",
    ],
    espantalho: ["objetos/espantalho.png"],
    herbicida: [
      "ui/tool_herbicida.png",
      "tool_herbicida.png",
      "ui/tool_inseticida.png",
      "tool_inseticida.png",
      "tool_inseticida.png.png",
    ],
    "pacote com 5 herbicidas": [
      "ui/herbicida_pacote.png",
      "herbicida_pacote.png",
      "ui/inseticida_pacote.png",
      "inseticida_pacote.png",
      "ui/tool_herbicida.png",
      "tool_herbicida.png",
      "tool_inseticida.png",
      "tool_inseticida.png.png",
    ],
  };
  function candidates(name) {
    var b = baseName(name),
      sl = slug(name),
      c = ["loja/" + sl + ".png"];
    if (IMGS[b]) c = c.concat(IMGS[b]);
    else c.push("animais/" + sl + ".png", "objetos/" + sl + ".png");
    c.push(sl + ".png", sl + "_parado.png", "animais/" + sl + "_parado.png");
    return c;
  }
  /* tenta a próxima imagem da lista; se acabar, fica o emoji */
  window.rfShNext = function (im) {
    var l = (im.dataset.c || "").split("|").filter(Boolean);
    var n = l.shift();
    if (!n) {
      im.remove();
      return;
    }
    im.dataset.c = l.join("|");
    im.src = "img/" + n + "?v=" + V;
  };
  function icon(name) {
    var b = baseName(name),
      e = EMO[b] || "🛒",
      l = candidates(name),
      first = l.shift();
    return (
      '<span class="sh-emo">' +
      e +
      '</span><img class="sh-img" alt="" data-c="' +
      l.join("|") +
      '" src="img/' +
      first +
      "?v=" +
      V +
      '" onload="this.previousSibling.style.display=\'none\';this.style.display=\'block\'" onerror="rfShNext(this)">'
    );
  }
  function priceHtml(txt) {
    var m = /^(\d+)\s*moedas$/.exec(txt.trim());
    return m ? '<i class="sh-coin"></i>' + m[1] : esc(txt);
  }

  function card(name, desc, btn, iconHtml) {
    return (
      '<div class="sh-card"><div class="sh-name">' +
      esc(name) +
      '</div><button class="sh-ico" data-say="' +
      esc(desc) +
      '" aria-label="' +
      esc(name) +
      '">' +
      iconHtml +
      "</button>" +
      btn +
      "</div>"
    );
  }

  var ORIG = null;
  function origHtml() {
    var keep = shopTab;
    shopTab = "loja";
    var h;
    try {
      h = ORIG();
    } finally {
      shopTab = keep;
    }
    return h;
  }
  function items(kind) {
    var box = document.createElement("div");
    box.innerHTML = origHtml();
    var out = "",
      seen = {};
    box.querySelectorAll(".item").forEach(function (it) {
      var st = it.querySelector("strong"),
        nt = it.querySelector(".note"),
        b = it.querySelector("button");
      if (!st || !b) return;
      var name = st.textContent.trim();
      if (kindOf(name) !== kind) return;
      var key = baseName(name);
      if (seen[key]) return;
      seen[key] = 1;
      var nb = b.cloneNode(true);
      nb.className = (b.className + " sh-buy").trim();
      nb.innerHTML = priceHtml(b.textContent);
      out += card(
        name,
        nt ? nt.textContent.trim() : "",
        nb.outerHTML,
        icon(name),
      );
    });
    return out;
  }

  /* casas: lê a lista do jogo (pDeco), que o casas.js ajusta com preços e "já é sua" */
  function houses() {
    var box = document.createElement("div");
    box.innerHTML = pDeco();
    var out = "";
    box.querySelectorAll(".item").forEach(function (it) {
      var st = it.querySelector("strong"),
        b = it.querySelector("button");
      if (!st || !b) return;
      var name = st.textContent.trim(),
        h = HOUSES.filter(function (x) {
          return x.nome === name;
        })[0],
        txt = b.textContent.trim(),
        m = /(\d+)\s*$/.exec(txt),
        nb = b.cloneNode(true);
      nb.className = (b.className + " sh-buy").trim();
      nb.innerHTML =
        /^Comprar/.test(txt) && m ? '<i class="sh-coin"></i>' + m[1] : esc(txt);
      out +=
        '<div class="sh-card"><div class="sh-name">' +
        esc(name) +
        '</div><div class="sh-ico sh-house">' +
        (h && h.img
          ? '<img class="sh-img" style="display:block" alt="" src="' +
            h.img +
            '">'
          : '<span class="sh-emo">🏠</span>') +
        "</div>" +
        nb.outerHTML +
        "</div>";
    });
    return out;
  }

  function pLojaGrade() {
    var cur =
      shopTab === "deco" ? "deco" : shopTab === "anim" ? "anim" : "ferr";
    var tabs = TABS.map(function (t) {
      return (
        '<button class="sh-tab' +
        (cur === t[0] ? " on" : "") +
        '" data-act="shoptab" data-v="' +
        t[0] +
        '">' +
        t[1] +
        "</button>"
      );
    }).join("");
    var body = cur === "deco" ? houses() : items(cur);
    var extra = "";
    return (
      '<div class="sh-tabs">' +
      tabs +
      '</div><div class="sh-grid">' +
      body +
      extra +
      "</div>"
    );
  }

  /* substitui o painel da Loja (PANELS guarda a função antiga) */
  /* espera todos os scripts carregarem, para pegar a loja já com Burro e Porco */
  function instalar() {
    if (ORIG) return;
    ORIG = PANELS.loja[1];
    PANELS.loja = ["Loja", pLojaGrade];
  }
  if (document.readyState === "complete") setTimeout(instalar, 0);
  else window.addEventListener("load", instalar);

  /* toque no ícone mostra a descrição */
  $("pbody").addEventListener("click", function (e) {
    var b = e.target.closest(".sh-ico[data-say]");
    if (b && b.dataset.say) toast(b.dataset.say);
  });

  var st = document.createElement("style");
  st.textContent =
    ".panel{max-width:560px}" +
    ".sh-tabs{display:flex;gap:4px;border-bottom:3px solid var(--line);margin:-2px 0 12px;flex-wrap:wrap}" +
    ".sh-tab{border:2px solid var(--line);border-bottom:0;background:color-mix(in srgb,var(--line) 55%,var(--panel));" +
    "color:var(--ink-soft);font-weight:700;font-size:13px;padding:7px 14px;border-radius:10px 10px 0 0;cursor:pointer;margin-bottom:-3px}" +
    ".sh-tab.on{background:var(--panel);color:var(--ink);border-color:var(--hud-line);border-bottom:3px solid var(--panel)}" +
    ".sh-tab:focus-visible{outline:3px solid var(--accent);outline-offset:2px}" +
    ".sh-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}" +
    ".sh-card{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 6px 10px;" +
    "border:2px solid var(--line);border-radius:12px;background:color-mix(in srgb,#fff 40%,var(--panel));box-shadow:0 3px 0 rgba(0,0,0,.1)}" +
    ".sh-name{font-size:12px;font-weight:700;text-align:center;line-height:1.15;min-height:28px;display:flex;align-items:center}" +
    ".sh-ico{position:relative;width:72px;height:72px;border:0;background:none;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
    ".sh-house{width:100%;height:72px;cursor:default}" +
    ".sh-emo{font-size:44px;line-height:1}" +
    ".sh-img{display:none;max-width:100%;max-height:100%;object-fit:contain}" +
    ".sh-buy{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-width:70px;padding:4px 10px;font-size:13px;font-variant-numeric:tabular-nums}" +
    ".sh-coin{width:14px;height:14px;border-radius:50%;flex:none;background:radial-gradient(circle at 35% 30%,#fff1a6,var(--coin) 55%,#b98100);border:2px solid #8a6200}" +
    ".sh-soon{opacity:.6}";
  document.head.appendChild(st);

  /* moeda: procura em img/ui/ e depois direto em img/ (senão fica a moedinha desenhada) */
  (function () {
    var l = ["ui/hud_moeda.png", "hud_moeda.png"],
      mi = new Image();
    mi.onload = function () {
      var sc = document.createElement("style");
      sc.textContent =
        ".sh-coin{width:18px;height:18px;border:0;border-radius:0;background:url(" +
        mi.src +
        ") center/contain no-repeat}";
      document.head.appendChild(sc);
    };
    mi.onerror = function () {
      var n = l.shift();
      if (n) mi.src = "img/" + n + "?v=" + V;
    };
    mi.onerror();
  })();
})();
