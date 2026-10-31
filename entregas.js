/* ===========================================================
   Roça Feliz - entregas.js
   Painel "Entregas": o caminhão traz pedidos, você entrega as colheitas
   guardadas no Armazém e ganha moedas + XP (mais bônus a cada 5 entregas).

   Carregar DEPOIS de todos os outros scripts (por último):
     <script src="entregas.js"></script>

   IMAGENS (todas opcionais, o que não existir usa um desenho simples):
     img/caminhao_painel.png | caminhao_vazio.png | caminhao_cheio.png
        (cabeçalho usa o primeiro que existir; o card "Próximo pedido"
         usa caminhao_cheio.png, ou caminhao_vazio.png se faltar)
     img/caminhao_andando_1.png e _2.png   animação ao entregar
     img/entregas/caixote.png              caixote genérico
     img/entregas/caixote_cenoura.png      um caixote por item:
        cenoura milho tomate morango abobora girassol
        laranja manga maca ovo leite
        (maçã também aceita caixote_maçã.png e caixote_maça.png)
     img/icones/prod_<item>.png            ícone pequeno de cada item
        (se faltar, usa o ícone da semente: semente_macieira.png etc.)
   Também aceita as mesmas imagens direto em img/ ou em img/objetos/.
   =========================================================== */
(function () {
  /* ================= CONFIGURAÇÃO ================= */
  var V = "2"; /* mude ao trocar um PNG (evita cache) */
  var SLOTS_MAX = 5; /* máximo de pedidos ao mesmo tempo */
  var WAIT_MIN = 45,
    WAIT_RAND = 30; /* segundos até chegar um pedido novo */
  var SKIP_WAIT = 15; /* segundos de espera ao trocar um pedido */
  var BONUS_EVERY = 5; /* bônus do caminhão a cada N entregas */
  var REWARD_MULT = 1.4; /* pedido paga 40% a mais que vender no armazém */
  var HORA_MS =
    60 * 60 * 1000; /* para TESTAR: 60 * 1000 (1 "hora" = 1 minuto) */
  var ESPERAS_H = [1, 2, 3, 4]; /* esperas entre remessas, em horas */
  var TURBO_H = 24; /* duração do modo rápido do ticket */

  function fmtT(sec) {
    sec = Math.max(0, Math.floor(sec));
    var h = Math.floor(sec / 3600),
      m = Math.floor((sec % 3600) / 60),
      s = sec % 60;
    function p(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return (h ? h + ":" : "") + p(m) + ":" + p(s);
  }
  function emTurbo() {
    return ((S.deliv && S.deliv.fastUntil) || 0) > Date.now();
  }
  function fimDaRemessa() {
    var D = S.deliv,
      h = emTurbo() ? 1 : ESPERAS_H[(D.step || 0) % ESPERAS_H.length];
    if (!emTurbo()) D.step = ((D.step || 0) + 1) % ESPERAS_H.length;
    D.next = Date.now() + h * HORA_MS;
    return h;
  }

  var SLUGS = [
    "cenoura",
    "milho",
    "tomate",
    "morango",
    "abobora",
    "girassol",
    "laranja",
    "manga",
    "maca",
    "ovo",
    "leite",
  ];
  /* nomes de arquivo alternativos (com acento) */
  var ALT = { maca: ["maçã", "maça"] };
  /* se o ícone do produto não existir, usa o ícone da semente da árvore */
  var SEED = {
    cenoura: "cenoura",
    milho: "milho",
    tomate: "tomate",
    morango: "morango",
    abobora: "abobora",
    girassol: "girassol",
    laranja: "laranjeira",
    manga: "mangueira",
    maca: "macieira",
  };
  var TRUCK_C = [
    "caminhao_painel.png",
    "caminhao_vazio.png",
    "caminhao_cheio.png",
    "entregas/caminhao.png",
    "objetos/caminhao.png",
    "caminhao.png",
    "ui/caminhao.png",
  ];
  /* caminhão do card "Próximo pedido" (chegando com a carga) */
  var TRUCK_WAIT = [
    "caminhao_cheio.png",
    "entregas/caminhao_cheio.png",
    "caminhao_vazio.png",
    "entregas/caminhao_vazio.png",
  ];
  var TRUCK_WALK = ["caminhao_andando_1.png", "caminhao_andando_2.png"];
  var CRATE_ANY = [
    "caixote.png",
    "entregas/caixote.png",
    "objetos/caixote.png",
  ];
  function nomes(s) {
    return [s].concat(ALT[s] || []);
  }
  function crateC(s) {
    var l = [];
    nomes(s).forEach(function (n) {
      l.push(
        "caixote_" + n + "s.png",
        "caixote_" + n + ".png",
        "entregas/caixote_" + n + ".png",
        "caixotes/caixote_" + n + ".png",
        "objetos/caixote_" + n + ".png",
        "icones/caixote_" + n + ".png",
      );
    });
    return l;
  }
  function iconC(s) {
    var l = [];
    nomes(s).forEach(function (n) {
      l.push("icones/prod_" + n + ".png", "prod_" + n + ".png");
    });
    if (SEED[s])
      l.push(
        "icones/semente_" + SEED[s] + ".png",
        "semente_" + SEED[s] + ".png",
      );
    return l;
  }

  /* ================= IMAGENS ================= */
  var IMG = {};
  function preload(list) {
    list.forEach(function (p) {
      if (p in IMG) return;
      IMG[p] = false;
      var i = new Image();
      i.onload = function () {
        IMG[p] = true;
        if (open === "entregas") renderPanel();
      };
      i.src = "img/" + p + "?v=" + V;
    });
  }
  function pick(list) {
    for (var k = 0; k < list.length; k++)
      if (IMG[list[k]]) return "img/" + list[k] + "?v=" + V;
    return null;
  }
  var all = [].concat(TRUCK_C, TRUCK_WAIT, TRUCK_WALK, CRATE_ANY);
  SLUGS.forEach(function (s) {
    all = all.concat(crateC(s), iconC(s));
  });
  preload(all);

  /* ================= ITENS ================= */
  function slug(n) {
    return n
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }
  /* chaves: c0..c5 culturas, t0..t2 frutas das árvores, p0..p1 ovo e leite */
  function info(k) {
    var t = k.charAt(0),
      i = +k.slice(1),
      o;
    if (t === "c") {
      o = CROPS[i];
      return {
        nome: o.nome,
        cor: o.cor,
        venda: o.venda,
        xp: o.xp,
        slug: slug(o.nome),
        arr: S.inv,
        i: i,
      };
    }
    if (t === "t") {
      o = TREES[i];
      return {
        nome: o.fruto,
        cor: o.cor,
        venda: o.venda,
        xp: Math.max(1, Math.round(o.xp / o.frutos)),
        slug: slug(o.fruto),
        arr: S.tinv,
        i: i,
      };
    }
    o = PRODS[i];
    return {
      nome: o.nome,
      cor: o.cor,
      venda: o.venda,
      xp: [1, 5][i],
      slug: slug(o.nome),
      arr: S.prod,
      i: i,
    };
  }
  function have(k) {
    var f = info(k);
    return f.arr[f.i] || 0;
  }
  function keys() {
    var a = [];
    CROPS.forEach(function (c, i) {
      if (S.lvl >= c.lvl) a.push("c" + i);
    });
    TREES.forEach(function (c, i) {
      if (S.lvl >= c.lvl) a.push("t" + i);
    });
    if (S.coop && S.hens > 0) a.push("p0");
    if (S.cows > 0) a.push("p1");
    return a;
  }

  /* ================= PEDIDOS ================= */
  function genOrder() {
    var ks = keys().sort(function () {
        return Math.random() - 0.5;
      }),
      nl =
        1 +
        (Math.random() < 0.5 ? 1 : 0) +
        (S.lvl >= 8 && Math.random() < 0.4 ? 1 : 0);
    nl = Math.min(nl, ks.length);
    var lines = [],
      tot = 0,
      xp = 0,
      j;
    for (j = 0; j < nl; j++) {
      var f = info(ks[j]),
        target = ((60 + S.lvl * 25) * (0.7 + Math.random() * 0.6)) / nl,
        n = Math.max(1, Math.min(12, Math.round(target / f.venda)));
      lines.push({ k: ks[j], n: n });
      tot += n * f.venda;
      xp += n * f.xp;
    }
    return {
      lines: lines,
      coins: Math.round(tot * REWARD_MULT),
      xp: Math.max(2, Math.round(xp * 0.6)),
    };
  }
  /* devolve true se uma remessa nova chegou */
  function ensure() {
    var D = S.deliv;
    if (!D || !D.slots) D = S.deliv = { slots: [], n: 0 };
    if (D.next === undefined) D.next = 0;
    if (D.step === undefined) D.step = 0;
    var want = Math.min(SLOTS_MAX, 2 + Math.floor(S.lvl / 4)),
      now = Date.now(),
      ch = false;
    while (D.slots.length < want) D.slots.push({ o: null });
    var vazia = D.slots.every(function (s) {
      return !s.o;
    });
    if (vazia && now >= D.next) {
      D.slots.forEach(function (s) {
        s.o = genOrder();
      });
      D.next = 0;
      ch = true;
    }
    return ch;
  }
  function canDo(o) {
    return o.lines.every(function (l) {
      return have(l.k) >= l.n;
    });
  }
  function readyCount() {
    ensure();
    return S.deliv.slots.filter(function (s) {
      return s.o && canDo(s.o);
    }).length;
  }

  /* ================= PAINEL ================= */
  var TRUCK_SVG =
    '<svg viewBox="0 0 120 70" aria-hidden="true"><ellipse cx="60" cy="64" rx="48" ry="4" fill="#000" opacity=".2"/>' +
    '<g stroke="#3a2418" stroke-width="3" stroke-linejoin="round"><rect x="6" y="14" width="64" height="40" rx="4" fill="#d9582b"/>' +
    '<path d="M70 26h24l14 14v14H70z" fill="#e8c35a"/><path d="M78 30h14l8 10H78z" fill="#8fd4f4"/>' +
    '<circle cx="28" cy="56" r="9" fill="#444"/><circle cx="90" cy="56" r="9" fill="#444"/></g></svg>';

  var CRATE_SVG =
    '<svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#4a2f1c" stroke-width="3" stroke-linejoin="round"><path d="M6 24l26-12 26 12v26L32 62 6 50z" fill="#e0a050"/><path d="M6 24l26 12 26-12M32 36v26" fill="none"/></g></svg>';

  function iconHTML(f) {
    var u = pick(iconC(f.slug));
    return u ? '<img src="' + u + '" alt="">' : "";
  }

  /* caixote de UM item: específico > genérico + ícone do item */
  function crateOne(l) {
    var f = info(l.k),
      u = pick(crateC(f.slug));
    if (u) return '<img src="' + u + '" alt="' + f.nome + '">';
    var g = pick(CRATE_ANY),
      ic = pick(iconC(f.slug));
    return (
      (g ? '<img src="' + g + '" alt="">' : CRATE_SVG) +
      (ic
        ? '<img class="dl-badge" src="' + ic + '" alt="' + f.nome + '">'
        : '<span class="dl-badge dot" style="background:' + f.cor + '"></span>')
    );
  }

  /* 1 item: um caixote. 2 ou 3 itens: um caixote por item, lado a lado */
  function crateHTML(o) {
    var n = o.lines.length;
    if (n === 1) return crateOne(o.lines[0]);
    return (
      '<div class="dl-multi n' +
      n +
      '">' +
      o.lines
        .map(function (l) {
          return "<span>" + crateOne(l) + "</span>";
        })
        .join("") +
      "</div>"
    );
  }

  function pEntregas2() {
    ensure();
    var D = S.deliv,
      now = Date.now(),
      truck = pick(TRUCK_C),
      waitTruck = pick(TRUCK_WAIT),
      prog = D.n % BONUS_EVERY,
      bonus = 100 + 10 * S.lvl,
      turbo = emTurbo(),
      temPedido = D.slots.some(function (s) {
        return s.o;
      }),
      esperaMostrada = false;
    var h =
      '<div class="dl-head"><div class="dl-truck">' +
      (truck ? '<img src="' + truck + '" alt="Caminhão">' : TRUCK_SVG) +
      '</div><div class="dl-info"><strong>Caminhão de entregas</strong>' +
      '<span class="note">' +
      (turbo
        ? "Modo rápido: remessas de 1 hora por mais " +
          fmtT((D.fastUntil - now) / 1000)
        : "Entregue todos os pedidos.") +
      "</span>" +
      '<div class="pb"><i style="width:' +
      (100 * prog) / BONUS_EVERY +
      '%"></i></div>' +
      '<span class="note">Bônus em ' +
      (BONUS_EVERY - prog) +
      (BONUS_EVERY - prog > 1 ? " entregas" : " entrega") +
      ": " +
      bonus +
      " moedas e 1 fertilizante</span></div></div>";

    D.slots.forEach(function (s, i) {
      if (!s.o) {
        if (temPedido || esperaMostrada) return;
        esperaMostrada = true;
        var tk = D.tickets || 0;
        h +=
          '<div class="dl-card wait"><div class="dl-crate truck">' +
          (waitTruck
            ? '<img src="' + waitTruck + '" alt="Caminhão a caminho">'
            : TRUCK_SVG.replace("<svg", '<svg style="opacity:.5"')) +
          '</div><div class="dl-lines"><strong>Próxima remessa</strong><span class="note">O caminhão chega em <span data-until="' +
          D.next +
          '">' +
          fmtT(Math.max(0, (D.next - now) / 1000)) +
          '</span>.</span></div><div class="acts dl-acts">' +
          '<button class="btn main" data-act="tkuse"' +
          (tk ? "" : " disabled") +
          ">Usar ticket (" +
          tk +
          ')</button><button class="btn" data-act="tkbuy">Comprar ticket</button></div></div>';
        return;
      }
      var o = s.o,
        ok = canDo(o);
      h +=
        '<div class="dl-card' +
        (ok ? " ready" : "") +
        '"><div class="dl-crate' +
        (o.lines.length > 1 ? " multi" : "") +
        '">' +
        crateHTML(o) +
        '</div><div class="dl-lines">';
      o.lines.forEach(function (l) {
        var f = info(l.k),
          hv = have(l.k);
        h +=
          '<div class="dl-line' +
          (hv >= l.n ? " ok" : "") +
          '">' +
          iconHTML(f) +
          "<span>" +
          f.nome +
          '</span><span class="q">' +
          Math.min(hv, l.n) +
          "/" +
          l.n +
          "</span></div>";
      });
      h +=
        '<span class="note">Recompensa: ' +
        o.coins +
        " moedas e " +
        o.xp +
        " XP</span></div>" +
        '<div class="acts dl-acts"><button class="btn' +
        (ok ? " main" : "") +
        '" data-act="deliver" data-i="' +
        i +
        '"' +
        (ok ? "" : " disabled") +
        '>Entregar</button><button class="btn" data-act="dskip" data-i="' +
        i +
        '" aria-label="Trocar pedido">Trocar</button></div></div>';
    });
    return h;
  }
  PANELS.entregas = ["Entregas", pEntregas2];

  /* ================= AÇÕES ================= */
  function doDeliver(i) {
    ensure();
    var s = S.deliv.slots[i];
    if (!s || !s.o) return;
    var o = s.o;
    if (!canDo(o)) {
      toast("Faltam itens no armazém para este pedido.");
      return;
    }
    o.lines.forEach(function (l) {
      var f = info(l.k);
      f.arr[f.i] -= l.n;
    });
    S.coins += o.coins;
    S.stats.delivered = (S.stats.delivered || 0) + 1;
    S.deliv.n++;
    s.o = null;
    var msg = "Entrega feita: +" + o.coins + " moedas e " + o.xp + " XP.";
    if (
      S.deliv.slots.every(function (x) {
        return !x.o;
      })
    )
      msg += " Próxima remessa em " + fimDaRemessa() + "h.";
    log("Você fez uma entrega e ganhou " + o.coins + " moedas.");
    if (S.deliv.n % BONUS_EVERY === 0) {
      var b = 100 + 10 * S.lvl;
      S.coins += b;
      S.fert += 1;
      msg =
        "Entrega feita! Bônus do caminhão: +" + b + " moedas e 1 fertilizante.";
      log("Bônus do caminhão: " + b + " moedas e 1 fertilizante.");
    }
    addXp(o.xp);
    toast(msg);
    sfx("sell");
  }
  function doSkip(i) {
    ensure();
    var s = S.deliv.slots[i];
    if (!s || !s.o) return;
    s.o = genOrder();
    toast("Pedido trocado.");
  }

  var _da = decoAct;
  decoAct = function (a, b) {
    if (a === "deliver" || a === "dskip") {
      var i = +b.dataset.i;
      if (a === "deliver") doDeliver(i);
      else doSkip(i);
      after();
      if (a === "deliver") {
        var tr = document.querySelector(".dl-truck");
        if (tr && tr.animate)
          tr.animate(
            [
              { transform: "translateX(0)" },
              { transform: "translateX(22px)" },
              { transform: "translateX(0)" },
            ],
            { duration: 650, easing: "ease-in-out" },
          );
        var im = document.querySelector(".dl-truck img"),
          f1 = pick([TRUCK_WALK[0]]),
          f2 = pick([TRUCK_WALK[1]]);
        if (im && f1 && f2) {
          var orig = im.src,
            n = 0,
            iv = setInterval(function () {
              im.src = n++ % 2 ? f2 : f1;
            }, 150);
          setTimeout(function () {
            clearInterval(iv);
            im.src = orig;
          }, 700);
        }
      }
      return true;
    }
    return _da(a, b);
  };

  /* ===== TICKET: cole daqui para baixo ===== */
  var _da2 = decoAct;
  decoAct = function (a, b) {
    if (a === "tkuse") {
      ensure();
      var D = S.deliv;
      if (!(D.tickets > 0)) toast("Você não tem tickets.");
      else if (
        !D.slots.every(function (s) {
          return !s.o;
        })
      )
        toast("O ticket só vale enquanto o caminhão está a caminho.");
      else {
        D.tickets--;
        D.next = 0;
        D.fastUntil = Date.now() + TURBO_H * HORA_MS;
        ensure();
        toast("Ticket usado! Remessas de 1 hora por 24 horas.");
      }
      after();
      return true;
    }
    if (a === "tkbuy") {
      if (typeof window.rfPagarTicket === "function") {
        window.rfPagarTicket(function (ok) {
          if (!ok) return;
          S.deliv.tickets = (S.deliv.tickets || 0) + 1;
          toast("Ticket comprado!");
          after();
        });
      } else toast("Pagamento ainda não configurado.");
      return true;
    }
    return _da2(a, b);
  };

  /* selo com a quantidade de pedidos prontos no menu */
  var _r = render;
  render = function () {
    _r();
    try {
      badge("entregas", readyCount());
    } catch (e) {}
  };

  /* chegada de pedidos novos e contagem regressiva */
  setInterval(function () {
    if (!S) return;
    var ch = ensure();
    if (open !== "entregas") return;
    if (ch) {
      renderPanel();
      return;
    }
    var els = document.querySelectorAll("[data-until]");
    for (var k = 0; k < els.length; k++) {
      var sec = (+els[k].dataset.until - Date.now()) / 1000;
      els[k].textContent = sec > 0 ? fmt(sec) : "agora";
    }
  }, 1000);

  /* ================= ESTILO ================= */
  var st = document.createElement("style");
  st.textContent =
    /* cabeçalho do caminhão */
    ".dl-head{display:flex;align-items:center;gap:12px;padding:10px;border:2px solid var(--line);border-radius:12px;margin-bottom:10px;background:color-mix(in srgb,var(--leaf) 10%,transparent)}" +
    ".dl-truck{width:92px;flex:none}" +
    ".dl-truck img,.dl-truck svg{display:block;width:100%;height:auto;filter:drop-shadow(0 3px 2px rgba(0,0,0,.3))}" +
    ".dl-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}" +
    ".dl-info .pb{margin-top:4px}" +
    /* cards de pedido */
    ".dl-card{display:flex;align-items:center;gap:10px;padding:10px;border:2px solid var(--line);border-radius:12px;margin-bottom:8px;box-shadow:0 3px 0 rgba(0,0,0,.1)}" +
    ".dl-card.ready{border-color:var(--leaf)}" +
    ".dl-card.wait{opacity:.85}" +
    /* área do caixote (1 item = 64px, vários = mais larga, caminhão = larga) */
    ".dl-crate{position:relative;width:64px;height:64px;flex:none;display:flex;align-items:center;justify-content:center}" +
    ".dl-crate img,.dl-crate svg{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 2px 1px rgba(0,0,0,.3))}" +
    ".dl-crate.multi{width:96px}" +
    ".dl-crate.truck{width:92px}" +
    /* vários itens: um caixote por item, lado a lado em diagonal */
    ".dl-multi{position:relative;width:100%;height:100%}" +
    ".dl-multi span{position:absolute;display:block;width:50%;height:64%}" +
    ".dl-multi span img,.dl-multi span svg{width:100%;height:100%;object-fit:contain}" +
    ".dl-multi.n2 span:nth-child(1){left:0;top:0}" +
    ".dl-multi.n2 span:nth-child(2){right:0;bottom:0}" +
    ".dl-multi.n3 span{width:42%;height:52%}" +
    ".dl-multi.n3 span:nth-child(1){left:0;top:0}" +
    ".dl-multi.n3 span:nth-child(2){right:0;top:0}" +
    ".dl-multi.n3 span:nth-child(3){left:29%;bottom:0}" +
    /* ícone do item sobre o caixote genérico (quando falta o PNG específico) */
    ".dl-badge{position:absolute !important;right:-2px;bottom:-2px;width:45% !important;height:45% !important}" +
    ".dl-badge.dot{border:2px solid #4a2f1c;border-radius:50%}" +
    /* linhas de itens */
    ".dl-lines{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}" +
    ".dl-line{display:flex;align-items:center;gap:6px;font-weight:700}" +
    ".dl-line img{width:22px;height:22px;object-fit:contain;flex:none}" +
    ".dl-line .dot{width:14px;height:14px}" +
    ".dl-line .q{margin-left:auto;padding-left:8px;font-variant-numeric:tabular-nums;color:#c0392b}" +
    ".dl-line.ok .q{color:var(--leaf)}" +
    ".dl-acts{flex-direction:column}" +
    "@media(max-width:420px){.dl-card{flex-wrap:wrap}.dl-acts{flex-direction:row;width:100%}.dl-acts .btn{flex:1}}";
  document.head.appendChild(st);

  render();
})();
