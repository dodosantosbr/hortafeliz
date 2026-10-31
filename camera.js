/* Roça Feliz - camera.js
   Zoom pequeno + mover a câmera no celular deitado (tela com menos de 520 px de altura).
   - pinça com 2 dedos: aproxima/afasta (de 1x até 2.2x)
   - arrastar: move a câmera (só quando está com zoom)
   - botão redondo "1x": alterna 1x -> 1.5x -> 2x, já centrado na plantação
   - roda do mouse também dá zoom (para testar no PC)
   Só o cenário (fundo, canteiros, bichos) se move; HUD, menus e painéis ficam fixos.
   Em computador com janela normal nada muda. */
(function () {
  var app = document.getElementById("app");
  if (!app) return;
  var MQ = window.matchMedia(
    "(orientation: landscape) and (max-height: 520px)",
  );

  var MIN = 1,
    MAX = 2.2,
    NIVEIS = [1, 1.5, 2],
    LIMITE = 10; /* px de arrasto antes de contar como "mover" (evita atrapalhar o toque) */
  var UI = ".hud,.menu,.tools,.overlay,.tut,#rfMenuBtn,#rfZoomBtn";

  var s = 1,
    tx = 0,
    ty = 0;
  var cam = null,
    btn = null;
  var pts = {};
  var modo = null; /* "pan" | "pinch" */
  var g = {};
  var suprimirAte = 0;

  /* ---------- estilo ---------- */
  var st = document.createElement("style");
  st.textContent =
    "#rfCam{position:absolute;inset:0;transform-origin:0 0}" +
    "#app.rf-cam-on{touch-action:none}" +
    "#app.rf-cam-anim #rfCam{transition:transform .25s ease}" +
    "#rfZoomBtn{display:none}" +
    "#app.rf-cam-on #rfZoomBtn{display:flex;position:absolute;z-index:6;" +
    "right:max(12px,env(safe-area-inset-right,0px));" +
    "bottom:calc(54px + env(safe-area-inset-bottom,0px));" +
    "width:40px;height:40px;padding:0;align-items:center;justify-content:center;" +
    "border-radius:50%;background:var(--hud);color:var(--hud-ink);" +
    "border:2px solid var(--hud-line);box-shadow:0 3px 0 rgba(0,0,0,.35);" +
    "font:700 12px var(--font-body);opacity:.92}" +
    "#app.rf-zoomed #rfZoomBtn{border-color:#ffd54a}";
  document.head.appendChild(st);

  /* ---------- botão de zoom ---------- */
  btn = document.createElement("button");
  btn.id = "rfZoomBtn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Zoom");
  btn.textContent = "1×";
  app.appendChild(btn);

  /* ---------- cenário dentro de um contêiner que recebe o zoom ---------- */
  function moverMundo() {
    [".scene:not(.shade)", "#field", "#scare", "#placed"].forEach(
      function (sel) {
        var el = app.querySelector(sel);
        if (el && !cam.contains(el)) cam.appendChild(el);
      },
    );
  }
  function garantirCam() {
    if (cam) return;
    cam = document.createElement("div");
    cam.id = "rfCam";
    var primeiro = app.querySelector(".scene:not(.shade)");
    if (primeiro && primeiro.parentNode === app)
      Node.prototype.insertBefore.call(app, cam, primeiro);
    else Node.prototype.appendChild.call(app, cam);
    moverMundo();

    /* se algum script inserir/remover algo usando o #app como referência,
       redireciona para onde o elemento realmente está agora */
    var ib = app.insertBefore,
      rc = app.removeChild;
    app.insertBefore = function (n, ref) {
      if (ref && ref.parentNode && ref.parentNode !== app)
        return ref.parentNode.insertBefore(n, ref);
      return ib.call(app, n, ref);
    };
    app.removeChild = function (n) {
      if (n && n.parentNode && n.parentNode !== app)
        return n.parentNode.removeChild(n);
      return rc.call(app, n);
    };
    /* elementos do cenário criados mais tarde também entram no contêiner */
    new MutationObserver(function () {
      if (MQ.matches) moverMundo();
    }).observe(app, { childList: true });
  }

  /* ---------- matemática da câmera ---------- */
  function rel(e) {
    var r = app.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function limitar() {
    var W = app.clientWidth,
      H = app.clientHeight;
    if (s <= MIN) {
      s = MIN;
      tx = 0;
      ty = 0;
      return;
    }
    tx = Math.min(0, Math.max(W - W * s, tx));
    ty = Math.min(0, Math.max(H - H * s, ty));
  }
  var tRaster = null;
  function aplicar() {
    if (!cam) return;
    var neutro = s <= 1.001;
    cam.style.transform = neutro
      ? ""
      : "translate(" +
        tx.toFixed(1) +
        "px," +
        ty.toFixed(1) +
        "px) scale(" +
        s.toFixed(3) +
        ")";
    app.classList.toggle("rf-zoomed", !neutro);
    btn.textContent = (neutro ? "1" : Math.round(s * 10) / 10) + "×";

    /* durante o gesto: camada promovida (fluido). Ao parar: solta e repinta nítido */
    app.classList.add("rf-gesto");
    clearTimeout(tRaster);
    tRaster = setTimeout(function () {
      app.classList.remove("rf-gesto");
    }, 250);
  }
  function zoomEm(c, s1) {
    s1 = Math.min(MAX, Math.max(MIN, s1));
    tx = c.x - (s1 * (c.x - tx)) / s;
    ty = c.y - (s1 * (c.y - ty)) / s;
    s = s1;
    limitar();
    aplicar();
  }
  function reiniciar() {
    s = 1;
    tx = 0;
    ty = 0;
    aplicar();
  }
  function animar() {
    app.classList.add("rf-cam-anim");
    setTimeout(function () {
      app.classList.remove("rf-cam-anim");
    }, 300);
  }

  /* botão: 1x -> 1.5x -> 2x -> 1x, centrando na plantação */
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!MQ.matches) return;
    garantirCam();
    var prox = NIVEIS[0];
    for (var i = 0; i < NIVEIS.length; i++) {
      if (NIVEIS[i] > s + 0.05) {
        prox = NIVEIS[i];
        break;
      }
    }
    animar();
    if (prox <= 1) return reiniciar();
    var W = app.clientWidth,
      H = app.clientHeight;
    var ar = app.getBoundingClientRect();
    var f = app.querySelector("#field");
    var fr = f && f.getBoundingClientRect();
    var c =
      fr && fr.width > 0
        ? {
            x: fr.left + fr.width / 2 - ar.left,
            y: fr.top + fr.height / 2 - ar.top,
          }
        : { x: W / 2, y: H / 2 };
    var wx = (c.x - tx) / s,
      wy = (c.y - ty) / s;
    s = prox;
    tx = W / 2 - s * wx;
    ty = H * 0.46 - s * wy;
    limitar();
    aplicar();
  });

  /* ---------- gestos ---------- */
  function ids() {
    return Object.keys(pts);
  }
  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }
  function meio(a, b) {
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }
  function iniciarPinch() {
    var k = ids(),
      a = pts[k[0]],
      b = pts[k[1]];
    g = { d0: dist(a, b) || 1, s0: s, m0: meio(a, b), tx0: tx, ty0: ty };
    modo = "pinch";
  }
  function baseArrasto() {
    var p = pts[ids()[0]];
    g = { x0: p.x, y0: p.y, tx0: tx, ty0: ty, ativo: false };
  }

  app.addEventListener(
    "pointerdown",
    function (e) {
      if (!MQ.matches || e.target.closest(UI)) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      garantirCam();
      pts[e.pointerId] = rel(e);
      if (ids().length === 2) iniciarPinch();
      else if (ids().length === 1) baseArrasto();
    },
    true,
  );

  window.addEventListener("pointermove", function (e) {
    if (!(e.pointerId in pts)) return;
    pts[e.pointerId] = rel(e);
    var k = ids();
    if (k.length >= 2 && modo === "pinch") {
      var a = pts[k[0]],
        b = pts[k[1]];
      var s1 = Math.min(MAX, Math.max(MIN, (g.s0 * dist(a, b)) / g.d0));
      var m = meio(a, b);
      var wx = (g.m0.x - g.tx0) / g.s0,
        wy = (g.m0.y - g.ty0) / g.s0;
      s = s1;
      tx = m.x - s * wx;
      ty = m.y - s * wy;
      limitar();
      aplicar();
    } else if (k.length === 1 && s > 1.01) {
      var p = pts[k[0]];
      var dx = p.x - g.x0,
        dy = p.y - g.y0;
      if (!g.ativo && Math.hypot(dx, dy) < LIMITE) return;
      g.ativo = true;
      modo = "pan";
      tx = g.tx0 + dx;
      ty = g.ty0 + dy;
      limitar();
      aplicar();
    }
  });

  function soltar(e) {
    if (!(e.pointerId in pts)) return;
    delete pts[e.pointerId];
    if (modo)
      suprimirAte =
        Date.now() + 400; /* o "clique" depois do arrasto não conta */
    var k = ids();
    if (k.length === 0) modo = null;
    else if (k.length === 1) {
      baseArrasto();
      g.ativo = true;
      modo = "pan";
    }
  }
  window.addEventListener("pointerup", soltar);
  window.addEventListener("pointercancel", soltar);

  /* depois de arrastar ou fazer pinça, ignora o clique que o browser gera */
  app.addEventListener(
    "click",
    function (e) {
      if (Date.now() < suprimirAte && !e.target.closest(UI)) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    },
    true,
  );

  /* roda do mouse (teste no PC) */
  app.addEventListener(
    "wheel",
    function (e) {
      if (!MQ.matches || e.target.closest(UI)) return;
      e.preventDefault();
      garantirCam();
      zoomEm(rel(e), s * Math.exp(-e.deltaY * 0.0015));
    },
    { passive: false },
  );

  /* ---------- ligar/desligar conforme a tela ---------- */
  function estado() {
    var on = MQ.matches;
    app.classList.toggle("rf-cam-on", on);
    pts = {};
    modo = null;
    if (on) garantirCam();
    reiniciar();
  }
  window.addEventListener("resize", function () {
    limitar();
    aplicar();
  });
  (MQ.addEventListener
    ? MQ.addEventListener.bind(MQ, "change")
    : MQ.addListener.bind(MQ))(estado);
  estado();
})();
