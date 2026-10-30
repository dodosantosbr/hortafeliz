/* ===========================================================
   Roça Feliz - hud.js
   Cabeçalho novo: avatar + barra de madeira (nome e XP) + selo de nível,
   moedas logo abaixo e botão "?" no canto direito.
   Carregar POR ÚLTIMO no index.html:  <script src="hud.js"></script>

   Imagens usadas (pasta img/ui/), todas opcionais:
     hud_barra.png   hud_avatar.png   hud_nivel.png   hud_moeda.png
   Se alguma faltar, o jogo usa um desenho de reserva.

   Para ajustar o tamanho, mexa só nas duas linhas marcadas com (*) no CSS:
     --av = tamanho do avatar      --bw = largura da barra
   =========================================================== */
(function () {
  var V = "1"; /* mude ao trocar um PNG (evita cache) */
  var app = document.getElementById("app"),
    hud = document.querySelector(".hud");
  if (!app || !hud) return;
  var coins = hud.querySelector(".coins"),
    who = hud.querySelector(".who"),
    lvl = document.getElementById("lvl"),
    help = document.getElementById("helpb");
  if (!coins || !who || !lvl) return;

  /* ---------- CSS ---------- */
  var st = document.createElement("style");
  st.textContent =
    /* o cabeçalho deixa de ser uma faixa de tela cheia */
    ".hud{left:0 !important;right:auto !important;width:auto !important;display:block !important;pointer-events:none;" +
    "padding:calc(8px + env(safe-area-inset-top,0px)) 0 0 max(10px,env(safe-area-inset-left,0px)) !important;" +
    /* (*) tamanhos */
    "--av:clamp(54px,4.4vw,84px);" +
    "--bw:min(clamp(250px,22vw,430px),calc(100vw - var(--av)*1.18 - 28px))}" +
    ".hud>*{pointer-events:auto}" +
    ".hx-main{display:flex;align-items:center;height:var(--av)}" +
    /* avatar */
    ".hx-av{flex:none;position:relative;z-index:3;width:var(--av);height:var(--av);padding:0;border:0;border-radius:50%;cursor:pointer;" +
    "background:radial-gradient(circle at 35% 30%,#ffe08a,#e3a900 60%,#8a6200);box-shadow:0 3px 0 rgba(0,0,0,.35)}" +
    ".hx-av img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 3px 2px rgba(0,0,0,.35))}" +
    ".hx-av:active{transform:translateY(2px)}" +
    ".hx-av:focus-visible{outline:3px solid #ffd54a;outline-offset:2px}" +
    ".hx.has-avatar .hx-av{background:none;box-shadow:none}" +
    /* barra de madeira (nome + XP) */
    ".hx-bar{position:relative;z-index:1;flex:none;min-width:0;width:var(--bw);aspect-ratio:6/1;" +
    "margin-left:calc(var(--av)*-.3);padding:0 calc(var(--av)*.34 + 3%) 0 calc(var(--av)*.36 + 2%);" +
    "display:flex;flex-direction:column;justify-content:center;gap:2px;" +
    "--xh:clamp(13px,.55vw + 9px,17px);" +
    "border:3px solid #d99a2b;border-radius:999px;background:linear-gradient(#7a4520,#4e2a12);box-shadow:0 3px 0 rgba(0,0,0,.35)}" +
    ".hx.has-barra .hx-bar{border:0;border-radius:0;box-shadow:none;filter:drop-shadow(0 3px 2px rgba(0,0,0,.3))}" +
    ".hx-bar #farm{display:block;font-family:var(--font-display);font-weight:400;font-size:clamp(12px,.35vw + 10px,17px);line-height:1;" +
    "color:#fff3d6;text-shadow:0 2px 0 #2b1608,0 0 4px rgba(0,0,0,.5);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}" +
    ".hx-bar .xpb{height:var(--xh);border:1.5px solid #2b1608;background:rgba(20,10,0,.65)}" +
    ".hx-bar .xpb span{font-size:clamp(9px,.25vw + 8px,12px);font-weight:800;letter-spacing:.02em;color:#fff;line-height:calc(var(--xh) - 3px);text-align:center;" +
    "text-shadow:-1px -1px 0 #1c0e04,1px -1px 0 #1c0e04,-1px 1px 0 #1c0e04,1px 1px 0 #1c0e04,0 2px 0 #1c0e04}" +
    /* selo de nível (o número é desenhado por cima) */
    "#app .hx .lvlb{position:relative;z-index:3;flex:none;width:calc(var(--av)*.8);height:calc(var(--av)*.8);" +
    "margin:0 0 0 calc(var(--av)*-.34);display:grid;place-items:center;padding:0;line-height:1;font-size:calc(var(--av)*.3)}" +
    "#app .hx.has-nivel .lvlb{color:#fff3d6;text-shadow:0 2px 0 #2b1608,0 0 3px #2b1608}" +
    /* moedas, logo abaixo da barra */
    ".hx-sub{display:flex;align-items:center;gap:8px;margin:4px 0 0 calc(var(--av)*.5)}" +
    ".hx-sub .coins{padding:3px 14px 3px 6px;border-color:#d99a2b;font-size:clamp(13px,.3vw + 11px,17px)}" +
    ".hx-sub .coin{width:26px;height:26px}" +
    /* botão ? no canto direito */
    "#helpb.hx-help{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));right:max(12px,env(safe-area-inset-right,0px));z-index:6}" +
    /* aviso (toast) desce no celular para não bater no cabeçalho */
    "@media(max-width:759px){.toast{top:132px}}";
  document.head.appendChild(st);

  /* ---------- monta a estrutura (mantém os ids que o jogo atualiza) ---------- */
  hud.classList.add("hx");
  who.classList.remove("pill", "who");
  who.classList.add("hx-bar");

  var av = document.createElement("button");
  av.type = "button";
  av.className = "hx-av";
  av.setAttribute("aria-label", "Perfil e configurações");
  av.addEventListener("click", function () {
    if (typeof openPanel === "function") openPanel("config");
  });

  var main = document.createElement("div");
  main.className = "hx-main";
  main.appendChild(av);
  main.appendChild(who);
  main.appendChild(lvl);

  var sub = document.createElement("div");
  sub.className = "hx-sub";
  sub.appendChild(coins);

  hud.appendChild(main);
  hud.appendChild(sub);
  if (help) {
    help.classList.add("hx-help");
    app.appendChild(help);
  }

  /* ---------- procura as imagens ---------- */
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
  function addCss(t) {
    st.textContent += t;
  }

  probe("hud_barra.png", function (u) {
    if (!u) return;
    hud.classList.add("has-barra");
    addCss(
      ".hx.has-barra .hx-bar{background:url('" +
        u +
        "') 0 0/100% 100% no-repeat}",
    );
  });
  /* ---------- avatar: menino / menina ---------- */
  var AVKEY = "roca-feliz-avatar";
  var AVATARS = [
    { id: "m", nome: "Menino", file: "hud_avatar.png", url: null },
    { id: "f", nome: "Menina", file: "hud_avatar_2.png", url: null },
  ];
  function avCur() {
    var id = "m";
    try {
      id = localStorage.getItem(AVKEY) || "m";
    } catch (e) {}
    return (
      AVATARS.filter(function (a) {
        return a.id === id;
      })[0] || AVATARS[0]
    );
  }
  function avApply() {
    var a = avCur();
    if (a.url) {
      hud.classList.add("has-avatar");
      av.innerHTML = '<img src="' + a.url + '" alt="" draggable="false">';
    } else {
      hud.classList.remove("has-avatar");
      av.innerHTML = "";
    }
  }
  AVATARS.forEach(function (a) {
    probe(a.file, function (u) {
      a.url = u;
      avApply();
    });
  });

  /* campo "Foto de perfil" no topo das Configurações */
  function avField() {
    var cur = avCur().id;
    return (
      '<div class="field-row"><strong>Foto de perfil</strong><div class="seg">' +
      AVATARS.map(function (a) {
        return (
          '<button class="btn" data-act="avatar" data-v="' +
          a.id +
          '" aria-pressed="' +
          (a.id === cur) +
          '" style="display:flex;align-items:center;gap:8px">' +
          (a.url
            ? '<img src="' +
              a.url +
              '" alt="" width="36" height="36" style="object-fit:contain">'
            : "") +
          a.nome +
          "</button>"
        );
      }).join("") +
      "</div></div>"
    );
  }
  if (typeof PANELS !== "undefined" && PANELS.config) {
    var _pc = PANELS.config[1];
    PANELS.config[1] = function () {
      return avField() + _pc();
    };
  }
  if (typeof decoAct === "function") {
    var _decoAct = decoAct;
    decoAct = function (a, b) {
      if (a === "avatar") {
        try {
          localStorage.setItem(AVKEY, b.dataset.v);
        } catch (e) {}
        avApply();
        renderPanel();
        return true;
      }
      return _decoAct(a, b);
    };
  }
  probe("hud_nivel.png", function (u) {
    if (!u) return;
    hud.classList.add("has-nivel");
    /* a imagem tem o miolo vazado: um disco escuro por baixo deixa o número legível */
    addCss(
      "#app .hx.has-nivel .lvlb{background:url('" +
        u +
        "') center/contain no-repeat,radial-gradient(circle closest-side,#4a2d18 0 50%,transparent 52%) !important;" +
        "border:0 !important;box-shadow:none !important}",
    );
  });
})();
