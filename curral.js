/* curral.js - carregar DEPOIS do jogo.js
   Coloca as vacas DENTRO do curral.
   Abra o jogo com  #curral  no endereco (ex.: index.html#curral) para arrastar
   a area do curral e copiar os numeros para a linha "var CURRAL" abaixo. */
(function () {
  /* Area do curral em % da tela: [esquerda, topo, largura, altura].
     d = computador, m = celular. */
  var CURRAL = {
    d: [74, 24, 22, 22],
    m: [56, 24, 42, 22],
    l: [76, 38, 20, 26],
  };

  /* Posicao de cada vaca dentro da area (0 a 1 do espaco livre): [x, y] */
  var SLOTS = [
    [0.15, 0.55],
    [0.7, 0.2],
    [0.5, 0.85],
  ];

  var KEY = "rf-curral-v1",
    LOCAL = {},
    EDIT = /curral/.test(location.hash);
  try {
    LOCAL = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch (e) {}

  function mode() {
    var w = window.innerWidth;
    if (w >= 760 && window.innerHeight <= 520) return "l";
    return w >= 760 ? "d" : "m";
  }
  function zone() {
    return LOCAL[mode()] || CURRAL[mode()];
  }

  function placeCows() {
    var app = $("app"),
      W = app.clientWidth,
      H = app.clientHeight,
      z = zone(),
      zx = (z[0] / 100) * W,
      zy = (z[1] / 100) * H,
      zw = (z[2] / 100) * W,
      zh = (z[3] / 100) * H;
    document.querySelectorAll("#flock .cow").forEach(function (c, j) {
      var s = SLOTS[j % SLOTS.length],
        cw = c.offsetWidth || 60,
        ch = c.offsetHeight || cw * 0.64,
        x = zx + Math.max(0, zw - cw) * s[0],
        y = zy + Math.max(0, zh - ch) * s[1];
      c.style.left = (x / W) * 100 + "%";
      c.style.top = (y / H) * 100 + "%";
      c.style.marginLeft = "0";
      c.style.marginTop = "0";
      c.querySelectorAll("img").forEach(function (im) {
        if (!im.complete)
          im.addEventListener("load", placeCows, { once: true });
      });
    });
  }

  var _rf = renderFlock;
  renderFlock = function () {
    _rf();
    placeCows();
  };

  if (EDIT) {
    var app = $("app"),
      box = document.createElement("div"),
      info = document.createElement("div"),
      drag = null;
    box.style.cssText =
      "position:absolute;z-index:8;border:3px dashed #ff4d4d;background:rgba(255,77,77,.18);cursor:move;touch-action:none";
    app.appendChild(box);
    info.style.cssText =
      "position:fixed;left:8px;bottom:8px;z-index:99;max-width:min(92vw,520px);background:#2b2013;color:#fff3d6;border:2px solid #8a6238;border-radius:12px;padding:8px 10px;font:13px/1.4 sans-serif";
    info.innerHTML =
      "<b>Editar curral</b>: arraste o retangulo vermelho.<br>" +
      "<button data-a='w-'>Largura -</button><button data-a='w+'>Largura +</button>" +
      "<button data-a='h-'>Altura -</button><button data-a='h+'>Altura +</button>" +
      "<button data-a='reset'>Limpar</button>" +
      "<textarea readonly rows='3' style='display:block;width:100%;margin-top:4px;font:11px monospace'></textarea>" +
      "<small>Copie o texto e cole no lugar de <code>var CURRAL = ...;</code> no curral.js. Celular e computador sao separados.</small>";
    document.body.appendChild(info);
    var ta = info.querySelector("textarea");
    var round = function (a) {
      return a.map(function (v) {
        return Math.round(v * 10) / 10;
      });
    };
    var draw = function () {
      var z = zone();
      box.style.left = z[0] + "%";
      box.style.top = z[1] + "%";
      box.style.width = z[2] + "%";
      box.style.height = z[3] + "%";
      placeCows();
      ta.value =
        "var CURRAL = " +
        JSON.stringify({
          d: round(LOCAL.d || CURRAL.d),
          m: round(LOCAL.m || CURRAL.m),
          l: round(LOCAL.l || CURRAL.l),
        }) +
        ";";
    };
    var put = function (z) {
      LOCAL[mode()] = round(z);
      try {
        localStorage.setItem(KEY, JSON.stringify(LOCAL));
      } catch (e) {}
      draw();
    };
    box.addEventListener("pointerdown", function (e) {
      drag = {
        x: e.clientX,
        y: e.clientY,
        z: zone().slice(),
        r: app.getBoundingClientRect(),
      };
      box.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    box.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = ((e.clientX - drag.x) / drag.r.width) * 100,
        dy = ((e.clientY - drag.y) / drag.r.height) * 100;
      put([drag.z[0] + dx, drag.z[1] + dy, drag.z[2], drag.z[3]]);
    });
    box.addEventListener("pointerup", function () {
      drag = null;
    });
    info.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var a = b.dataset.a,
        z = zone().slice();
      if (a === "reset") {
        LOCAL = {};
        try {
          localStorage.removeItem(KEY);
        } catch (er) {}
        draw();
        return;
      }
      if (a === "w+") z[2] += 2;
      if (a === "w-") z[2] = Math.max(6, z[2] - 2);
      if (a === "h+") z[3] += 2;
      if (a === "h-") z[3] = Math.max(6, z[3] - 2);
      put(z);
    });
    window.addEventListener("resize", draw);
    draw();
  }

  flockKey = "";
  renderFlock();
})();
