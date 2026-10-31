/* ===========================================================
   Horta Feliz - missoes-diarias.js
   Missões que mudam todo dia (à meia-noite, horário do aparelho).
   Carregar DEPOIS de todos os outros scripts (por último no index.html).

   Como funciona:
   - Cada dia sorteia 5 missões de um "pool" (POOL abaixo) + 1 missão bônus
     ("resgate todas as missões do dia").
   - O sorteio usa a data como semente: recarregar a página não muda as missões.
   - Evita repetir os tipos de missão do dia anterior.
   - Metas e recompensas crescem com o seu nível.
   - O progresso conta só o que você faz DEPOIS que as missões do dia nascem.

   Para criar um novo tipo de missão: acrescente um item no POOL
   (e, se precisar de um contador novo, uma função em GET).
   =========================================================== */
(function () {
  var QTD = 5; /* quantas missões normais por dia */

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }
  function r5(n) {
    return Math.max(5, Math.round(n / 5) * 5);
  }
  function dayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function hash(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- contadores de progresso ---------- */
  var GET = {
    planted: function () {
      return S.stats.planted || 0;
    },
    harvested: function () {
      return S.stats.harvested || 0;
    },
    cleaned: function () {
      return S.stats.cleaned || 0;
    },
    sold: function () {
      return S.stats.sold || 0;
    },
    bought: function () {
      return S.stats.bought || 0;
    },
    fertUsed: function () {
      return S.stats.fertUsed || 0;
    },
    tfruit: function () {
      return S.stats.tfruit || 0;
    },
    eggs: function () {
      return S.stats.eggs || 0;
    },
    milk: function () {
      return S.stats.milk || 0;
    },
    bfly: function () {
      return S.stats.bfly || 0;
    },
    xp: function () {
      return totalXp(S.lvl, S.xp);
    },
    crop: function (p) {
      return (S.stats.hb && S.stats.hb[p]) || 0;
    },
    visit: function () {
      var t = new Date().toDateString(),
        n = 0,
        k;
      for (k in S.visit) if (S.visit[k] === t) n++;
      return n;
    },
    bonus: function () {
      return S.dq.list.filter(function (q) {
        return !q.bonus && S.qdone[q.id];
      }).length;
    },
  };

  /* conta ovos e leites produzidos (o jogo só guarda o estoque) */
  var _animals = animals;
  animals = function (dt) {
    var e = S.prod[0],
      m = S.prod[1];
    _animals(dt);
    S.stats.eggs = (S.stats.eggs || 0) + Math.max(0, S.prod[0] - e);
    S.stats.milk = (S.stats.milk || 0) + Math.max(0, S.prod[1] - m);
  };

  var PLURAL = {
    Cenoura: "cenouras",
    Milho: "espigas de milho",
    Tomate: "tomates",
    Morango: "morangos",
    Abóbora: "abóboras",
    Girassol: "girassóis",
  };

  /* ---------- pool de missões ----------
     k: contador | w: peso da recompensa | ok(): pode sortear hoje?
     mk(R, lvl): devolve { t: texto, m: meta, p: parâmetro opcional } */
  var POOL = [
    {
      k: "planted",
      w: 0.9,
      ok: function () {
        return true;
      },
      mk: function (R, l) {
        var m = clamp(4 + Math.round(l * 0.7), 5, 28);
        return { t: "Plante " + m + " sementes", m: m };
      },
    },
    {
      k: "harvested",
      w: 1.0,
      ok: function () {
        return true;
      },
      mk: function (R, l) {
        var m = clamp(5 + l, 6, 30);
        return { t: "Colha " + m + " plantas", m: m };
      },
    },
    {
      k: "crop",
      w: 1.2,
      ok: function () {
        return true;
      },
      mk: function (R, l) {
        var ok = [];
        CROPS.forEach(function (c, i) {
          if (c.lvl <= l) ok.push(i);
        });
        var p = ok[Math.floor(R() * ok.length)];
        var m = Math.max(2, Math.round(9 - p * 1.3)) + Math.floor(l / 6);
        return {
          t: "Colha " + m + " " + (PLURAL[CROPS[p].nome] || CROPS[p].nome),
          m: m,
          p: p,
        };
      },
    },
    {
      k: "cleaned",
      w: 0.8,
      ok: function () {
        return true;
      },
      mk: function (R, l) {
        var m = 3 + Math.floor(l / 4);
        return { t: "Limpe ervas daninhas " + m + " vezes", m: m };
      },
    },
    {
      k: "sold",
      w: 1.0,
      ok: function () {
        return true;
      },
      mk: function (R, l) {
        var m = Math.round((100 + l * 60) / 50) * 50;
        return { t: "Venda " + m + " moedas em colheitas", m: m };
      },
    },
    {
      k: "tfruit",
      w: 1.3,
      ok: function () {
        return S.plots.some(isTree);
      },
      mk: function (R, l) {
        var m = 2 + Math.floor(l / 6);
        return { t: "Colha frutas das árvores " + m + " vezes", m: m };
      },
    },
    {
      k: "fertUsed",
      w: 0.8,
      ok: function () {
        return S.fert >= 1;
      },
      mk: function (R, l) {
        var m = 2 + Math.floor(l / 6);
        return { t: "Use " + m + " fertilizantes", m: m };
      },
    },
    {
      k: "eggs",
      w: 1.0,
      ok: function () {
        return S.coop && S.hens > 0;
      },
      mk: function () {
        return { t: "Receba 6 ovos das galinhas", m: 6 };
      },
    },
    {
      k: "milk",
      w: 1.2,
      ok: function () {
        return S.cows > 0;
      },
      mk: function () {
        return { t: "Receba 3 leites das vacas", m: 3 };
      },
    },
    {
      k: "bfly",
      w: 1.4,
      ok: function () {
        return true;
      },
      mk: function () {
        return { t: "Pegue 1 borboleta dourada", m: 1 };
      },
    },
    {
      k: "bought",
      w: 1.0,
      ok: function () {
        return S.plots.some(function (p, i) {
          return !p.on && adj(i);
        });
      },
      mk: function () {
        return { t: "Compre 1 canteiro novo", m: 1 };
      },
    },
    {
      k: "visit",
      w: 0.8,
      ok: function () {
        return true;
      },
      mk: function (R) {
        var m = 2 + Math.floor(R() * 3);
        return { t: "Visite " + m + " vizinhos", m: m };
      },
    },
    {
      k: "xp",
      w: 1.1,
      ok: function () {
        return true;
      },
      mk: function (R, l) {
        var m = Math.max(20, Math.round((need(l) * 0.2) / 10) * 10);
        return { t: "Ganhe " + m + " XP", m: m };
      },
    },
  ];

  /* ---------- geração do dia ---------- */
  var built = null;

  function create(key, announce) {
    var R = rng(hash(key + "|horta")),
      l = S.lvl,
      prev = (S.dq && S.dq.keys) || [],
      avail = POOL.filter(function (t) {
        return t.ok();
      }),
      pref = avail.filter(function (t) {
        return prev.indexOf(t.k) < 0;
      });
    if (pref.length < QTD) pref = avail;
    /* embaralha de forma determinística */
    for (var i = pref.length - 1; i > 0; i--) {
      var j = Math.floor(R() * (i + 1)),
        x = pref[i];
      pref[i] = pref[j];
      pref[j] = x;
    }
    var list = [],
      keys = [],
      somaCoins = 0;
    pref.slice(0, QTD).forEach(function (t, n) {
      var q = t.mk(R, l),
        coins = r5((30 + l * 10) * t.w),
        r = { coins: coins };
      if (R() < 0.35) r.fert = 1;
      somaCoins += coins;
      keys.push(t.k);
      list.push({
        id: "d" + key + "-" + n,
        k: t.k,
        p: q.p,
        t: q.t,
        m: q.m,
        b: t.k === "visit" ? 0 : GET[t.k](q.p),
        r: r,
      });
    });
    list.push({
      id: "d" + key + "-b",
      k: "bonus",
      t: "Resgate todas as missões do dia",
      m: list.length,
      b: 0,
      bonus: true,
      r: { coins: r5(somaCoins * 0.8), fert: 2 },
    });
    /* limpa registros de resgate de dias anteriores */
    Object.keys(S.qdone).forEach(function (id) {
      if (id.charAt(0) === "d") delete S.qdone[id];
    });
    S.dq = { day: key, keys: keys, list: list };
    if (announce) {
      toast("Novas missões do dia!");
      log("As missões do dia foram renovadas.");
    }
    save();
  }

  function sync() {
    QUESTS.length = 0;
    S.dq.list.forEach(function (q) {
      q.g = function () {
        return Math.max(0, GET[q.k](q.p) - q.b);
      };
      QUESTS.push(q);
    });
    built = S.dq;
  }

  function ensure() {
    var key = dayKey();
    if (!S.dq || S.dq.day !== key) create(key, !!S.dq);
    if (built !== S.dq) sync();
  }

  /* garante missões do dia antes de cada desenho da tela */
  var _render = render;
  render = function () {
    ensure();
    _render.apply(this, arguments);
  };

  /* painel: aviso com o tempo até a renovação */
  var _pm = PANELS.missoes[1];
  PANELS.missoes[1] = function () {
    ensure();
    var d = new Date(),
      fim = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1),
      min = Math.max(1, Math.ceil((fim - d) / 60000)),
      h = Math.floor(min / 60),
      txt = (h ? h + " h " : "") + (min % 60) + " min";
    return (
      '<p class="note" style="margin-bottom:6px">Missões do dia. Novas missões em ' +
      txt +
      ".</p>" +
      _pm()
    );
  };

  ensure();
  render();
})();
