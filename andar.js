/* andar.js - carregar DEPOIS de todos os outros scripts.
   Animações no próprio bicho; cachorro e galinha também andam de verdade.
   1) Bichos do #placed: animação por quadros (img/<bicho>_<acao>.png) ou animação simples.
   2) Galinhas e vaca: animação por quadros (img/galinha_*.png, img/vaca_*.png).
   3) Galinhas e cachorro andam (img/<bicho>_andar.png), sem mexer na posição base.
   4) Galinhas e pintinho perto do galinheiro.
   5) Vaca no meio do cercado.
   6) Falas automáticas dos bichos (balãozinho).
   7) Lama embaixo do porco. */
(function () {
  if (/editar/.test(location.hash)) return;

  /* ================= CONFIGURAÇÃO ================= */
  var REDUZ =
    window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var V = "4"; /* mude ao trocar um PNG (evita cache) */
  var DUR_PULO = 0.45;
  var PERTO_GALINHEIRO = true; /* false = não mexe na posição das galinhas/pintinho */

  /* Vaca no meio do cercado (o cercado faz parte do fundo.png, então é em % da tela).
     X maior = mais pra direita, Y maior = mais pra baixo. false = não mexe na vaca. */
  var VACA_NO_CERCADO = true;
  var CERCADO_X = 84.5;
  var CERCADO_Y = 50;
  var AFASTA = 7; /* distância entre duas vacas (% da largura) */

  /* Lama embaixo do porco.
     LAMA_W = largura da lama (% da largura do porco).
     LAMA_Y = quanto ela desce abaixo dos pés (% da largura do porco): maior = mais baixo.
     LAMA_X = deslocamento horizontal (% da largura da lama): 50 = centralizada. */
  var LAMA = true;
  var LAMA_W = 99; /* tamanho: era 150 */
  var LAMA_Y = 2; /* altura: sobe junto com o tamanho */
  var LAMA_X = 50; /* 50 = centralizada */

  /* Falas automáticas: balãozinho em cima de um bicho, de tempos em tempos. */
  var FALAS_AUTO = true;
  var FALA_MIN = 3; /* intervalo mínimo entre falas (segundos) */
  var FALA_MAX = 8; /* intervalo máximo */
  var FALA_DUR = 2.6; /* quanto tempo o balão fica na tela (segundos) */
  var FALAS = {
    cachorro: ["Au au!"],
    porco: ["Óinc óinc!"],
    cabra: ["Méééé!"],
    burro: ["Iiiaaa!"],
    ovelha: ["Béé!"],
    pato: ["Quá!"],
    pintinho: ["Piu piu!"],
    gato: ["Miau!"],
  };
  var FALA_GALINHA = ["Có có!"];
  var FALA_VACA = ["Muuu!"];

  /* Nº de quadros: faixas com quadros QUADRADOS (ex.: 2048x512 = 4 quadros).
     Se alguma faixa tiver quadros não quadrados, mude para false e acerte o "n" nas tabelas. */
  var QUADRADO = true;

  /* Andar de verdade (só bichos que têm img/<bicho>_andar.png) */
  var ANDAR = true;
  var ANDAR_VEL = 0.25; /* larguras do bicho por segundo (menor = anda mais devagar) */
  var ANDAR_ALCANCE = 0.6; /* até onde se afasta do lugar, em larguras do bicho (cada lado) */
  var ANDAR_CHANCE = 0.5; /* chance de andar ao sair do "parado" */

  /* Animação simples (bichos sem PNG de quadros) */
  var TIPOS = {
    cachorro: "farejar",
    pintinho: "bicar",
    pato: "bicar",
    porco: "farejar",
    cabra: "pastar",
    burro: "pastar",
    ovelha: "pastar",
  };

  /* Animação por quadros. Arquivo: img/<bicho>_<acao>.png
     n = nº de quadros (só se QUADRADO for false), fps = quadros por segundo,
     voltas = repetições antes de voltar ao "parado".
     "parado" é obrigatório, "dormir" toca à noite, "andar" é tratado à parte
     (anda de lado a lado), as outras entram no sorteio. */
  var ANIM = {
    pintinho: {
      parado: { n: 4, fps: 4 },
      bicar: { n: 6, fps: 8, voltas: 3 },
      dormir: { n: 2, fps: 1.5 },
    },
    cachorro: {
      parado: { n: 4, fps: 4 },
      farejar: { n: 6, fps: 8, voltas: 3 },
      dormir: { n: 2, fps: 1.5 },
      andar: { n: 6, fps: 9 },
    },
    pato: { parado: { n: 4, fps: 4 }, bicar: { n: 6, fps: 8, voltas: 3 } },
    porco: { parado: { n: 4, fps: 4 }, farejar: { n: 6, fps: 8, voltas: 3 } },
    cabra: { parado: { n: 4, fps: 4 }, pastar: { n: 6, fps: 6, voltas: 3 } },
    burro: { parado: { n: 4, fps: 4 }, pastar: { n: 6, fps: 6, voltas: 3 } },
    ovelha: { parado: { n: 4, fps: 4 }, pastar: { n: 6, fps: 6, voltas: 3 } },
    gato: { parado: { n: 4, fps: 4 }, dormir: { n: 2, fps: 1.5 } },
    galinha: {
      parado: { n: 4, fps: 4 },
      bicar: { n: 6, fps: 8, voltas: 3 },
      dormir: { n: 2, fps: 1.5 },
      andar: { n: 6, fps: 9 },
    },
    vaca: {
      parado: { n: 4, fps: 4 },
      pastar: { n: 6, fps: 6, voltas: 3 },
      dormir: { n: 2, fps: 1.5 },
    },
  };

  /* ================= AUXILIARES ================= */
  function $(id) {
    return document.getElementById(id);
  }
  function rnd(a, b) {
    return a + Math.random() * (b - a);
  }
  function pick(a) {
    return a[Math.floor(Math.random() * a.length)];
  }
  function carrega(nome) {
    return new Promise(function (ok) {
      var i = new Image(),
        src = "img/" + nome + ".png?v=" + V;
      i.onload = function () {
        ok({ src: src, w: i.naturalWidth, h: i.naturalHeight });
      };
      i.onerror = function () {
        ok(null);
      };
      i.src = src;
    });
  }

  var st = document.createElement("style");
  st.textContent =
    ".pi .qd,.hen .qd,.cow .qd{width:100%;background-repeat:no-repeat;pointer-events:none;" +
    "transform-origin:50% 100%;filter:drop-shadow(0 3px 2px rgba(0,0,0,.28))}" +
    /* lama: posição vertical e horizontal calculadas pelo posLama() */
    ".lama{position:absolute;left:0;top:0;width:" +
    LAMA_W +
    "%;height:auto;max-width:none;" +
    "z-index:-1;pointer-events:none;display:block}" +
    /* balão de fala */
    ".fala{position:absolute;z-index:7;pointer-events:none;white-space:nowrap;" +
    "background:#fffdf2;color:#2c3a20;border:2px solid #3a2f2a;border-radius:12px;" +
    "padding:3px 9px;font:700 12px/1.3 var(--font-body,sans-serif);" +
    "box-shadow:0 2px 0 rgba(0,0,0,.25);animation:falaup " +
    FALA_DUR +
    "s ease-out forwards}" +
    ".fala::after{content:'';position:absolute;left:50%;bottom:-7px;margin-left:-5px;" +
    "border:5px solid transparent;border-top:6px solid #3a2f2a;border-bottom:0}" +
    ".fala::before{content:'';position:absolute;left:50%;bottom:-4px;margin-left:-3px;z-index:1;" +
    "border:3px solid transparent;border-top:4px solid #fffdf2;border-bottom:0}" +
    "@keyframes falaup{0%{opacity:0;transform:translateY(6px) scale(.85)}" +
    "12%{opacity:1;transform:translateY(0) scale(1)}80%{opacity:1;transform:translateY(-4px)}" +
    "100%{opacity:0;transform:translateY(-10px)}}" +
    "@media (prefers-reduced-motion:reduce){.fala{animation:falafade " +
    FALA_DUR +
    "s linear forwards}@keyframes falafade{0%,85%{opacity:1}100%{opacity:0}}}";
  if (VACA_NO_CERCADO)
    st.textContent +=
      "#flock .cow{left:var(--vx," +
      CERCADO_X +
      "%) !important;top:var(--vy," +
      CERCADO_Y +
      "%) !important;" +
      "margin:0 !important;animation:none !important;transform:none !important;transition:none !important}";
  document.head.appendChild(st);

  /* carrega todas as faixas uma vez: EST[bicho][acao] */
  var EST = {};
  function carregaTudo() {
    var jobs = [];
    Object.keys(ANIM).forEach(function (id) {
      EST[id] = {};
      Object.keys(ANIM[id]).forEach(function (k) {
        jobs.push(
          carrega(id + "_" + k).then(function (r) {
            if (!r) return;
            var d = ANIM[id][k],
              n = QUADRADO ? Math.max(1, Math.round(r.w / r.h)) : d.n;
            EST[id][k] = { r: r, n: n, fps: d.fps, voltas: d.voltas || 1 };
            console.info(
              "[andar.js] " +
                id +
                "_" +
                k +
                ": " +
                r.w +
                "x" +
                r.h +
                " -> " +
                n +
                " quadro(s)",
            );
          }),
        );
      });
    });
    return Promise.all(jobs);
  }

  /* ================= MOTOR DE QUADROS ================= */
  var lista = []; /* todos os bichos animados (placed, galinhas, vaca) */

  function quadro(b) {
    var s = b.est[b.nome];
    b.d.style.backgroundPosition =
      (s.n > 1 ? (b.q / (s.n - 1)) * 100 : 0) + "% 0";
  }
  function troca(b, nome) {
    var s = b.est[nome];
    if (!s) return;
    b.nome = nome;
    b.q = 0;
    b.t = 0;
    b.voltas = 0;
    b.d.style.aspectRatio = s.r.w / s.n + " / " + s.r.h;
    b.d.style.backgroundImage = "url('" + s.r.src + "')";
    b.d.style.backgroundSize = s.n * 100 + "% 100%";
    quadro(b);
  }
  function criaQuadros(el, id, pula) {
    var est = EST[id];
    if (!est || !est.parado) return null;
    var img = el.querySelector("img:not(.lama),svg");
    if (!img) return null;
    var d = document.createElement("div");
    d.className = "qd";
    el.insertBefore(d, img);
    img.style.display = "none";
    img.classList.remove("wander");
    img.classList.remove("idle");
    img.style.animation = "none";
    var b = {
      modo: "quadros",
      el: el,
      d: d,
      est: est,
      acoes: Object.keys(est).filter(function (k) {
        return k !== "parado" && k !== "dormir" && k !== "andar";
      }),
      nome: "",
      q: Math.floor(rnd(0, 3)),
      t: 0,
      voltas: 0,
      espera: rnd(1, 6),
      pulo: 0,
      pula: !!pula,
      dx: 0,
      dir: 1,
      tAndar: 0,
      anda: ANDAR && !!est.andar,
    };
    troca(b, "parado");
    if (pula)
      el.addEventListener("pointerdown", function () {
        if (b.pulo > 0) return;
        b.pulo = DUR_PULO;
        try {
          appPop(el, "♥");
        } catch (e) {}
      });
    lista.push(b);
    return b;
  }
  function atualizaQuadros(b, dt, noite) {
    var alvo = noite ? (b.est.dormir ? "dormir" : "parado") : null;
    if (alvo && b.nome !== alvo) troca(b, alvo);
    if (!alvo && b.nome === "dormir") troca(b, "parado");

    var s = b.est[b.nome];
    if (!REDUZ) {
      b.t += dt;
      var passo = 1 / s.fps;
      while (b.t >= passo) {
        b.t -= passo;
        b.q++;
        if (b.q >= s.n) {
          b.q = 0;
          b.voltas++;
          if (
            b.nome !== "parado" &&
            b.nome !== "dormir" &&
            b.nome !== "andar" &&
            b.voltas >= s.voltas
          ) {
            troca(b, "parado");
            b.espera = rnd(2, 6);
            s = b.est[b.nome];
            passo = 1 / s.fps;
          }
        }
        quadro(b);
      }
      if (!noite && b.nome === "parado" && (b.acoes.length || b.anda)) {
        b.espera -= dt;
        if (b.espera <= 0) {
          if (b.anda && (!b.acoes.length || Math.random() < ANDAR_CHANCE)) {
            var lim = ANDAR_ALCANCE * b.el.offsetWidth;
            b.dir =
              b.dx > lim * 0.5
                ? -1
                : b.dx < -lim * 0.5
                  ? 1
                  : Math.random() < 0.5
                    ? -1
                    : 1;
            b.tAndar = rnd(1.5, 3.5);
            troca(b, "andar");
          } else {
            troca(b, b.acoes[Math.floor(Math.random() * b.acoes.length)]);
          }
        }
      }
      if (b.nome === "andar") {
        var W = b.el.offsetWidth,
          lim2 = ANDAR_ALCANCE * W;
        b.dx += b.dir * ANDAR_VEL * W * dt;
        b.tAndar -= dt;
        if (Math.abs(b.dx) >= lim2) {
          b.dx = Math.max(-lim2, Math.min(lim2, b.dx));
          b.tAndar = 0;
        }
        if (b.tAndar <= 0) {
          troca(b, "parado");
          b.espera = rnd(2, 6);
        }
      }
    }
    var hop = 0;
    if (b.pulo > 0) {
      b.pulo -= dt;
      hop =
        Math.sin(Math.PI * (1 - Math.max(0, b.pulo) / DUR_PULO)) *
        0.3 *
        b.el.offsetWidth;
    }
    var tr = "";
    if (b.dx) tr += "translateX(" + b.dx.toFixed(1) + "px) ";
    if (hop) tr += "translateY(" + -hop.toFixed(1) + "px) ";
    if (b.dir < 0) tr += "scaleX(-1)";
    b.d.style.transform = tr || "none";
  }

  /* ================= ANIMAÇÃO SIMPLES ================= */
  function criaSimples(el, id) {
    var img = el.querySelector("img:not(.lama)");
    if (!img) return null;
    if (!img.classList.contains("wander") && !TIPOS[id]) return null;
    img.classList.remove("wander");
    img.classList.remove("idle");
    img.style.animation = "none";
    img.style.transform = "none";
    img.style.transformOrigin = "50% 100%";
    img.style.willChange = "transform";
    var b = {
      modo: "simples",
      el: el,
      img: img,
      tipo: TIPOS[id] || "pastar",
      acao: "nada",
      espera: rnd(0.5, 4),
      inc: 0,
      tempo: rnd(0, 10),
      pulo: 0,
    };
    el.addEventListener("pointerdown", function () {
      if (b.pulo > 0) return;
      b.pulo = DUR_PULO;
      try {
        appPop(el, "♥");
      } catch (e) {}
    });
    lista.push(b);
    return b;
  }
  function atualizaSimples(b, dt, noite) {
    b.tempo += dt;
    var hop = 0,
      sy = 1,
      alvoInc = 0;
    if (noite) {
      sy = 0.94 + 0.015 * Math.sin(b.tempo * 1.2);
    } else if (!REDUZ) {
      sy = 1 + 0.012 * Math.sin(b.tempo * 2.2);
      b.espera -= dt;
      if (b.espera <= 0) {
        b.acao = Math.random() < 0.7 ? b.tipo : "nada";
        b.espera = rnd(2.5, 6);
      }
      if (b.acao === "bicar")
        alvoInc =
          Math.sin(b.tempo * 1.7) > -0.2
            ? Math.max(0, Math.sin(b.tempo * 15)) * 18
            : 0;
      else if (b.acao === "pastar") alvoInc = 10 + 3 * Math.sin(b.tempo * 2.5);
      else if (b.acao === "farejar") alvoInc = 6 + 5 * Math.sin(b.tempo * 9);
    }
    if (b.pulo > 0) {
      b.pulo -= dt;
      hop =
        Math.sin(Math.PI * (1 - Math.max(0, b.pulo) / DUR_PULO)) *
        0.3 *
        b.el.offsetWidth;
    }
    b.inc +=
      (alvoInc - b.inc) * Math.min(1, dt * (b.acao === "bicar" ? 18 : 7));
    b.img.style.transform =
      "translateY(" +
      (-hop).toFixed(2) +
      "px) rotate(" +
      b.inc.toFixed(2) +
      "deg) scaleY(" +
      sy.toFixed(3) +
      ")";
  }

  /* ================= BICHOS DO #placed ================= */
  function prepara(el) {
    var id = el.dataset.id;
    if (!criaQuadros(el, id, true)) criaSimples(el, id);
    /* a lama entra DEPOIS, para a animação não confundir a lama com o porco */
    if (LAMA && id === "porco" && !el.querySelector(".lama")) {
      var l = document.createElement("img");
      l.className = "lama";
      l.src = "img/lama.png?v=" + V;
      l.alt = "";
      el.appendChild(l);
    }
  }

  /* ================= GALINHAS E VACA ================= */
  function paraEl(el) {
    if (!el || el._parada) return;
    el._parada = 1;
    el.style.setProperty("animation", "none", "important");
    el.style.setProperty("animation-name", "none", "important");
    el.style.setProperty("transform", "none", "important");
    el.style.setProperty("transition", "none", "important");
  }
  function ligaFlock(el, id) {
    if (!el || el.hidden) return;
    /* se o jogo trocou o conteúdo e a animação sumiu, refaz */
    if (el.dataset.qd && !el.querySelector(".qd")) {
      delete el.dataset.qd;
      lista = lista.filter(function (b) {
        return b.el !== el;
      });
    }
    if (el.dataset.qd) return;
    if (id === "galinha") paraEl(el);
    if (criaQuadros(el, id, false)) el.dataset.qd = "1";
  }
  function varre() {
    /* tira da lista os bichos que o jogo removeu (ele recria as galinhas ao comprar) */
    lista = lista.filter(function (b) {
      return document.body.contains(b.el);
    });
    paraEl($("hen"));
    document.querySelectorAll("#flock .hen").forEach(paraEl);
    ligaFlock($("hen"), "galinha");
    document.querySelectorAll("#flock .hen").forEach(function (e) {
      ligaFlock(e, "galinha");
    });
    document.querySelectorAll("#flock .cow").forEach(function (e) {
      ligaFlock(e, "vaca");
    });
  }

  /* ================= GALINHAS E PINTINHO PERTO DO GALINHEIRO ================= */
  function perto() {
    var coop = document.querySelector("svg.coop");
    if (!coop || typeof S === "undefined" || !S || !S.coop) return;
    var cr = coop.getBoundingClientRect();
    if (!cr.width) return;
    var cx = cr.left + cr.width / 2;
    var hens = [$("hen")].concat(
      Array.prototype.slice.call(document.querySelectorAll("#flock .hen")),
    );
    var vis = hens.filter(function (h) {
      return h && !h.hidden && h.offsetParent;
    });
    vis.forEach(function (h, i) {
      var pr = h.offsetParent.getBoundingClientRect(),
        w = h.offsetWidth || 40,
        hh = h.offsetHeight || 40,
        dx = (i - (vis.length - 1) / 2) * (cr.width * 0.3),
        row = i % 2 ? 0.1 : -0.05;
      h.style.setProperty(
        "left",
        cx + dx - pr.left - w / 2 + "px",
        "important",
      );
      h.style.setProperty(
        "top",
        cr.bottom - pr.top - hh * (0.75 + row) + "px",
        "important",
      );
      h.style.setProperty("margin", "0", "important");
    });
    var pi = document.querySelector('.pi[data-id="pintinho"]');
    if (pi && pi.offsetParent) {
      var pp = pi.offsetParent.getBoundingClientRect();
      pi.style.setProperty(
        "left",
        cr.right - pp.left - cr.width * 0.1 + "px",
        "important",
      );
      pi.style.setProperty(
        "top",
        cr.bottom - pp.top - (pi.offsetHeight || 20) * 0.9 + "px",
        "important",
      );
    }
  }

  /* ================= VACA NO MEIO DO CERCADO ================= */
  function vacaNoCercado() {
    var ap = $("app");
    if (!ap) return;
    var cows = Array.prototype.filter.call(
      document.querySelectorAll("#flock .cow"),
      function (c) {
        return !c.hidden && c.offsetParent;
      },
    );
    if (!cows.length) return;
    var ar = ap.getBoundingClientRect();
    cows.forEach(function (c, i) {
      var pr = c.offsetParent.getBoundingClientRect(),
        w = c.offsetWidth || 60,
        h = c.offsetHeight || 50,
        dx = (i - (cows.length - 1) / 2) * (AFASTA / 100) * ar.width,
        dy = (i % 2 ? 1 : -1) * (cows.length > 1 ? 0.02 * ar.height : 0),
        cx = ar.left + (CERCADO_X / 100) * ar.width + dx,
        cy = ar.top + (CERCADO_Y / 100) * ar.height + dy;
      c.style.setProperty("--vx", cx - pr.left - w / 2 + "px");
      c.style.setProperty("--vy", cy - pr.top - h / 2 + "px");
    });
  }

  /* ================= FALAS AUTOMÁTICAS ================= */
  var ultimaFala = "";
  function candidatosFala() {
    var out = [];
    document.querySelectorAll("#placed .pi[data-id]").forEach(function (el) {
      var f = FALAS[el.dataset.id];
      if (f) out.push({ el: el, txt: pick(f), id: el.dataset.id });
    });
    var hens = [$("hen")].concat(
      Array.prototype.slice.call(document.querySelectorAll("#flock .hen")),
    );
    hens.forEach(function (h, i) {
      if (h && !h.hidden && h.offsetParent)
        out.push({ el: h, txt: pick(FALA_GALINHA), id: "hen" + i });
    });
    document.querySelectorAll("#flock .cow").forEach(function (c, i) {
      if (!c.hidden && c.offsetParent)
        out.push({ el: c, txt: pick(FALA_VACA), id: "cow" + i });
    });
    return out;
  }
  function falar() {
    var ap = $("app");
    if (!ap) return;
    var noite = ap.getAttribute("data-phase") === "night",
      ov = $("overlay");
    if (noite || document.hidden || (ov && !ov.hidden)) return;
    var cand = candidatosFala().filter(function (c) {
      return c.id !== ultimaFala;
    });
    if (!cand.length) return;
    var c = pick(cand);
    /* mede o que está visível do bicho (o quadro animado ou a imagem) */
    var alvo =
      c.el.querySelector(".qd") ||
      c.el.querySelector("img:not(.lama),svg") ||
      c.el;
    var r = alvo.getBoundingClientRect();
    if (!r.width || !r.height) return;
    ultimaFala = c.id;
    var ar = ap.getBoundingClientRect(),
      b = document.createElement("div");
    b.className = "fala";
    b.textContent = c.txt;
    ap.appendChild(b);
    var w = b.offsetWidth,
      h = b.offsetHeight,
      x = r.left - ar.left + r.width / 2 - w / 2,
      y = r.top - ar.top - h - 8;
    b.style.left = Math.max(4, Math.min(ar.width - w - 4, x)) + "px";
    b.style.top = Math.max(60, y) + "px";
    setTimeout(
      function () {
        b.remove();
      },
      FALA_DUR * 1000 + 100,
    );
  }
  function agendaFala() {
    setTimeout(
      function () {
        try {
          falar();
        } catch (e) {}
        agendaFala();
      },
      rnd(FALA_MIN, FALA_MAX) * 1000,
    );
  }

  /* ================= LAMA NOS PÉS DO PORCO ================= */
  /* Usa as medidas do próprio quadro animado (.qd): o fundo da lama fica
     LAMA_Y% abaixo dos pés, centrada no porco. Roda a cada quadro, no loop. */
  function posLama() {
    document.querySelectorAll("#placed .pi .lama").forEach(function (l) {
      var el = l.parentNode,
        d = el.querySelector(".qd");
      if (!d || !d.offsetWidth) return;
      var W = d.offsetWidth,
        lw = (W * LAMA_W) / 100,
        lh = l.offsetHeight || lw * 0.4375;
      l.style.left = d.offsetLeft + W / 2 - (lw * LAMA_X) / 100 + "px";
      l.style.top =
        d.offsetTop + d.offsetHeight + (LAMA_Y / 100) * W - lh + "px";
    });
  }

  /* ================= LOOP ================= */
  var app = null,
    ultimo = 0;
  function loop(agora) {
    var dt = Math.min(0.1, (agora - ultimo) / 1000 || 0);
    ultimo = agora;
    var ar = app.getBoundingClientRect(),
      noite = app.getAttribute("data-phase") === "night";
    /* quem está mais embaixo na tela fica na frente (só os do #placed) */
    lista.forEach(function (b) {
      if (b.el.classList.contains("pi")) {
        var r = b.el.getBoundingClientRect();
        b.el.style.zIndex = Math.round(((r.bottom - ar.top) / ar.height) * 100);
      }
    });
    if (VACA_NO_CERCADO) vacaNoCercado();
    lista.forEach(function (b) {
      if (b.modo === "quadros") atualizaQuadros(b, dt, noite);
      else atualizaSimples(b, dt, noite);
    });
    if (LAMA) posLama();
    requestAnimationFrame(loop);
  }

  /* ================= INÍCIO ================= */
  app = $("app");
  carregaTudo().then(function () {
    /* galinhas e vaca: varre sempre (o jogo recria quando você compra) */
    setInterval(varre, 400);
    varre();
    if (PERTO_GALINHEIRO) {
      setInterval(perto, 400);
      window.addEventListener("resize", perto);
      perto();
    }
    if (FALAS_AUTO) setTimeout(agendaFala, 4000);
    /* bichos do #placed: o assets.js cria depois de carregar as imagens, então espera aparecerem */
    var tentativas = 0,
      espera = setInterval(function () {
        tentativas++;
        var els = document.querySelectorAll("#placed .pi");
        if (els.length) {
          clearInterval(espera);
          Array.prototype.forEach.call(els, prepara);
        } else if (tentativas > 60) clearInterval(espera);
      }, 300);
    requestAnimationFrame(loop);
  });
})();
