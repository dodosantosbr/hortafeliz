/* ===========================================================
   almofada.js - canteiros "colcha / almofada" estilo Colheita Feliz
   (terra marrom com leivas, terra seca rachada e grama verde amassada
   nos lotes bloqueados), desenhados por código.

   COMO USAR: salve na mesma pasta do index.html e coloque como
   ÚLTIMO <script> do index.html:
       <script src="almofada.js"></script>

   Não usa terra.png / terra-seca.png / grama.png. Cada canteiro é um
   losango 2:1 exato, com cantos arredondados, centro estufado, brilho
   nas bordas de cima e uma costura escura entre um e outro. A moldura
   de pedras (borda-horta.png) continua a mesma.
   =========================================================== */
(function () {
  "use strict";

  /* ================= AJUSTES (mexa à vontade) ================= */

  /* quantas variações de textura (evita todos os canteiros iguais) */
  var VARIANTES = 5;

  /* espessura da almofada nas bordas da frente (% da largura do canteiro) */
  var ESPESSURA = 0.05;

  /* folga entre uma almofada e outra (a costura escura). 3 = padrão */
  var COSTURA = 3;

  /* arredondamento dos cantos: 0 = ponta viva, 0.2 = bem redondo */
  var CANTO = 0.11;

  /* cores da grama (usada pelo contorno/costura da grama) */
  var PAL = {
    grama: {
      side: "#245c18",
      seam: "#19400f",
    },
  };

  /* ================= GEOMETRIA (não precisa mexer) =================
     viewBox 200 x (100 + espessura): losango 2:1 perfeito.
     P(s,t): s anda da ponta esquerda até a de cima, t da esquerda até a de baixo. */
  var TH = Math.round(ESPESSURA * 200);
  var VB_H = 100 + TH;
  var I = COSTURA,
    HX = 100 - I,
    HY = 50 - I;

  function P(s, t) {
    return [I + HX * (s + t), 50 - HY * s + HY * t];
  }
  function xy(p) {
    return p[0].toFixed(1) + "," + p[1].toFixed(1);
  }
  function n1(v) {
    return (Math.round(v * 10) / 10).toString();
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* losango com cantos arredondados (a "almofada") */
  function rdia() {
    var V = [
        [100, I],
        [200 - I, 50],
        [100, 100 - I],
        [I, 50],
      ],
      d = "",
      k,
      v,
      p,
      n,
      a,
      c;
    for (k = 0; k < 4; k++) {
      v = V[k];
      p = V[(k + 3) % 4];
      n = V[(k + 1) % 4];
      a = [v[0] + (p[0] - v[0]) * CANTO, v[1] + (p[1] - v[1]) * CANTO];
      c = [v[0] + (n[0] - v[0]) * CANTO, v[1] + (n[1] - v[1]) * CANTO];
      d += (k ? "L" : "M") + xy(a) + " Q" + xy(v) + " " + xy(c) + " ";
    }
    return d + "Z";
  }
  var TOP = rdia();

  function svg(inner) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 ' +
      VB_H +
      '" width="200" height="' +
      VB_H +
      '">' +
      inner +
      "</svg>"
    );
  }
  function uri(s) {
    return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")';
  }
  function blurF(id, sd) {
    return (
      '<filter id="' +
      id +
      '" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feGaussianBlur stdDeviation="' +
      sd +
      '"/></filter>'
    );
  }

  /* o que dá o volume de almofada: bordas afundando, centro alto,
     brilho nas bordas de trás, sombra nas da frente */
  function pillow(c) {
    var k = 0.58,
      cx = 100,
      cy = 46;
    var inner =
      xy([cx, cy - HY * k]) +
      " " +
      xy([cx + HX * k, cy]) +
      " " +
      xy([cx, cy + HY * k]) +
      " " +
      xy([cx - HX * k, cy]);
    return (
      '<path d="' +
      TOP +
      '" fill="none" stroke="' +
      c.shadow +
      '" stroke-width="22" opacity="' +
      (0.6 * c.ps).toFixed(2) +
      '" filter="url(#b5)"/>' +
      '<polyline points="' +
      I +
      ",50 100," +
      (100 - I) +
      " " +
      (200 - I) +
      ',50" fill="none" stroke="' +
      c.shadow +
      '" stroke-width="15" opacity="' +
      (0.4 * c.ps).toFixed(2) +
      '" filter="url(#b3)"/>' +
      '<polygon points="' +
      inner +
      '" fill="' +
      c.glow +
      '" opacity=".3" filter="url(#b7)"/>' +
      '<polyline points="' +
      (I + 5) +
      ",50 100," +
      (I + 2.6) +
      " " +
      (200 - I - 5) +
      ',50" fill="none" stroke="' +
      c.rim +
      '" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" opacity=".85" filter="url(#b1)"/>'
    );
  }

  /* ================= FORMAS COMPARTILHADAS ================= */
  /* mancha irregular com pontas, em torno de (cs,ct) */
  function mancha(cs, ct, rs, rt, n, r, spike) {
    var pts = [],
      i,
      a,
      k;
    for (i = 0; i < n; i++) {
      a = (i / n) * 6.283;
      k = i % 2 ? 1 : 1 - spike * (0.4 + r() * 0.6);
      pts.push(xy(P(cs + Math.cos(a) * rs * k, ct + Math.sin(a) * rt * k)));
    }
    return pts.join(" ");
  }
  /* pincelada clara: corpo fino e pontudo, com bordas quebradas */
  function pincel(s0, t0, len, w, r) {
    var top = [],
      bot = [],
      n = 9,
      i,
      u,
      pr,
      j;
    for (i = 0; i <= n; i++) {
      u = i / n;
      pr = Math.sin(Math.PI * Math.pow(u, 0.7)) * w;
      j = i % 2 ? 0.55 + r() * 0.3 : 1;
      top.push(xy(P(s0 + pr * j, t0 + u * len + (r() - 0.5) * 0.02)));
      bot.push(xy(P(s0 - pr * 0.35 * (0.6 + r() * 0.6), t0 + u * len)));
    }
    return top.concat(bot.reverse()).join(" ");
  }

  /* ================= TERRA e TERRA SECA (estilo pintado, com leivas) ================= */
  function flatDef() {
    return (
      "<defs>" +
      '<clipPath id="c"><path d="' +
      TOP +
      '"/></clipPath>' +
      blurF("b1", 1.2) +
      blurF("b3", 3) +
      blurF("b5", 5) +
      blurF("b7", 7) +
      "</defs>"
    );
  }

  /* K = paleta. Mesma construção da grama, só muda a cor.
     dryMode = true acrescenta rachaduras (terra seca). */
  function flatSoil(seed, K, dryMode) {
    var r = rng(seed),
      s = "",
      i,
      j,
      a,
      b,
      t,
      pts,
      sj,
      s0,
      t0,
      d,
      ang,
      len;

    /* corpo */
    s += '<path d="' + TOP + '" fill="' + K.BODY + '"/>';

    /* manchas médias, irregulares */
    s +=
      '<polygon points="' +
      mancha(0.34, 0.38, 0.3, 0.34, 14, r, 0.35) +
      '" fill="' +
      K.MID +
      '"/>';
    s +=
      '<polygon points="' +
      mancha(0.78, 0.2, 0.2, 0.24, 12, r, 0.35) +
      '" fill="' +
      K.MID +
      '" opacity=".9"/>';
    s +=
      '<polygon points="' +
      mancha(0.62, 0.8, 0.22, 0.2, 12, r, 0.35) +
      '" fill="' +
      K.MID +
      '" opacity=".85"/>';

    /* escuro grande na frente, com pontas irregulares */
    pts = [P(-0.06, -0.06)];
    for (i = 0; i <= 16; i++) {
      t = -0.06 + (i / 16) * 1.12;
      sj =
        0.16 + 0.1 * Math.sin(t * 5 + r()) + (i % 2 ? 0.02 : 0.13 + r() * 0.1);
      pts.push(P(sj * (1 - Math.abs(t - 0.5) * 0.55), t));
    }
    pts.push(P(-0.06, 1.06));
    s +=
      '<polygon points="' + pts.map(xy).join(" ") + '" fill="' + K.DK + '"/>';
    pts = [P(-0.06, 0.05)];
    for (i = 0; i <= 12; i++) {
      t = 0.05 + (i / 12) * 0.9;
      pts.push(P(0.02 + (i % 2 ? 0.01 : 0.08 + r() * 0.08), t));
    }
    pts.push(P(-0.06, 0.98));
    s +=
      '<polygon points="' + pts.map(xy).join(" ") + '" fill="' + K.DK2 + '"/>';
    /* escuro também no canto de trás (esquerda) */
    s +=
      '<polygon points="' +
      mancha(0.5, -0.02, 0.2, 0.1, 10, r, 0.5) +
      '" fill="' +
      K.DK +
      '" opacity=".9"/>';

    /* pinceladas claras grandes, apontando para o canto direito */
    for (i = 0; i < 5; i++) {
      s +=
        '<polygon points="' +
        pincel(
          0.46 + i * 0.1 + (r() - 0.5) * 0.03,
          0.14 + i * 0.07 + r() * 0.05,
          0.7 - i * 0.07,
          0.07 + (i % 2) * 0.02,
          r,
        ) +
        '" fill="' +
        (i % 2 ? K.PALE2 : K.PALE) +
        '"/>';
    }

    /* rachaduras (só na seca) */
    if (dryMode) {
      for (i = 0; i < 5; i++) {
        s0 = 0.3 + r() * 0.6;
        t0 = 0.12 + r() * 0.76;
        ang = r() * 6.283;
        d = "M" + xy(P(s0, t0));
        for (j = 0; j < 4; j++) {
          ang += (r() - 0.5) * 1.7;
          len = 0.05 + r() * 0.07;
          s0 = Math.min(0.96, Math.max(0.3, s0 + Math.cos(ang) * len));
          t0 = Math.min(0.96, Math.max(0.04, t0 + Math.sin(ang) * len));
          d += " L" + xy(P(s0, t0));
        }
        s +=
          '<path d="' +
          d +
          '" fill="none" stroke="' +
          K.DK2 +
          '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>';
      }
    }

    /* respingos e pontinhos */
    for (i = 0; i < 12; i++) {
      a = P(0.35 + r() * 0.6, 0.15 + r() * 0.75);
      s +=
        '<ellipse cx="' +
        n1(a[0]) +
        '" cy="' +
        n1(a[1]) +
        '" rx="' +
        n1(1 + r() * 2) +
        '" ry=".9" fill="' +
        K.PALE2 +
        '"/>';
    }
    for (i = 0; i < 7; i++) {
      a = P(0.3 + r() * 0.6, 0.3 + r() * 0.65);
      s +=
        '<circle cx="' +
        n1(a[0]) +
        '" cy="' +
        n1(a[1]) +
        '" r="1.1" fill="' +
        K.DK2 +
        '"/>';
    }

    /* borda clara na frente-esquerda e contorno escuro nas outras */
    a = P(0.0, 0.04);
    b = P(0.0, 0.96);
    s +=
      '<path d="M' +
      xy(a) +
      " L" +
      xy(b) +
      '" fill="none" stroke="' +
      K.PALE +
      '" stroke-width="3.6" stroke-linecap="round"/>';
    s +=
      '<polyline points="' +
      xy(P(1, 0.02)) +
      " " +
      xy(P(1, 0.98)) +
      " " +
      xy(P(0.02, 1)) +
      '" fill="none" stroke="' +
      K.DK2 +
      '" stroke-width="3.4" stroke-linejoin="round"/>';

    /* volume bem leve */
    s += pillow({ shadow: K.DK2, ps: 0.25, glow: K.BODY, rim: K.MID });

    return svg(
      flatDef() +
        '<polygon points="100,0 200,50 100,100 0,50" fill="' +
        K.SEAM +
        '"/>' +
        '<path d="' +
        TOP +
        '" transform="translate(0 ' +
        TH +
        ')" fill="' +
        K.SIDE +
        '"/>' +
        '<g clip-path="url(#c)">' +
        s +
        "</g>" +
        '<path d="' +
        TOP +
        '" fill="none" stroke="' +
        K.SEAM +
        '" stroke-width="1.6" stroke-linejoin="round" opacity=".9"/>',
    );
  }

  var K_TERRA = {
    BODY: "#8a5c34",
    MID: "#744a28",
    DK: "#4f2f16",
    DK2: "#3a2110",
    PALE: "#d6a874",
    PALE2: "#b98550",
    SEAM: "#2c180b",
    SIDE: "#3b2212",
  };
  var K_SECA = {
    BODY: "#c4975f",
    MID: "#b0834d",
    DK: "#86602f",
    DK2: "#644221",
    PALE: "#f0d9a6",
    PALE2: "#dcb985",
    SEAM: "#3a2410",
    SIDE: "#583a1c",
  };
  function soil(seed) {
    return flatSoil(seed, K_TERRA, false);
  }
  function dry(seed) {
    return flatSoil(seed, K_SECA, true);
  }

  /* ================= GRAMA (uma folha-almofada por canteiro) ================= */
  function grass(seed) {
    var c = PAL.grama,
      r = rng(seed),
      s = "",
      i,
      a,
      b,
      t,
      pts,
      sj,
      BODY = "#74ab3d",
      MID = "#5a9836",
      DK = "#2e7c29",
      DK2 = "#215f1f",
      PALE = "#cbf2ab",
      PALE2 = "#a6dc80";
    var DEF =
      "<defs>" +
      '<clipPath id="c"><path d="' +
      TOP +
      '"/></clipPath>' +
      '<filter id="b3" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>' +
      '<filter id="b1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2"/></filter>' +
      '<filter id="b5" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<filter id="b7" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>' +
      "</defs>";

    /* corpo */
    s += '<path d="' + TOP + '" fill="' + BODY + '"/>';

    /* manchas médias, irregulares */
    s +=
      '<polygon points="' +
      mancha(0.34, 0.38, 0.3, 0.34, 14, r, 0.35) +
      '" fill="' +
      MID +
      '"/>';
    s +=
      '<polygon points="' +
      mancha(0.78, 0.2, 0.2, 0.24, 12, r, 0.35) +
      '" fill="' +
      MID +
      '" opacity=".9"/>';
    s +=
      '<polygon points="' +
      mancha(0.62, 0.8, 0.22, 0.2, 12, r, 0.35) +
      '" fill="' +
      MID +
      '" opacity=".85"/>';

    /* verde escuro grande na frente, com pontas de capim */
    pts = [P(-0.06, -0.06)];
    for (i = 0; i <= 16; i++) {
      t = -0.06 + (i / 16) * 1.12;
      sj =
        0.16 + 0.1 * Math.sin(t * 5 + r()) + (i % 2 ? 0.02 : 0.13 + r() * 0.1);
      pts.push(P(sj * (1 - Math.abs(t - 0.5) * 0.55), t));
    }
    pts.push(P(-0.06, 1.06));
    s += '<polygon points="' + pts.map(xy).join(" ") + '" fill="' + DK + '"/>';
    pts = [P(-0.06, 0.05)];
    for (i = 0; i <= 12; i++) {
      t = 0.05 + (i / 12) * 0.9;
      pts.push(P(0.02 + (i % 2 ? 0.01 : 0.08 + r() * 0.08), t));
    }
    pts.push(P(-0.06, 0.98));
    s += '<polygon points="' + pts.map(xy).join(" ") + '" fill="' + DK2 + '"/>';
    /* escuro também no canto de trás (esquerda) */
    s +=
      '<polygon points="' +
      mancha(0.5, -0.02, 0.2, 0.1, 10, r, 0.5) +
      '" fill="' +
      DK +
      '" opacity=".9"/>';

    /* pinceladas claras grandes, apontando para o canto direito */
    for (i = 0; i < 5; i++) {
      s +=
        '<polygon points="' +
        pincel(
          0.46 + i * 0.1 + (r() - 0.5) * 0.03,
          0.14 + i * 0.07 + r() * 0.05,
          0.7 - i * 0.07,
          0.07 + (i % 2) * 0.02,
          r,
        ) +
        '" fill="' +
        (i % 2 ? PALE2 : PALE) +
        '"/>';
    }
    /* respingos e pontinhos */
    for (i = 0; i < 12; i++) {
      a = P(0.35 + r() * 0.6, 0.15 + r() * 0.75);
      s +=
        '<ellipse cx="' +
        n1(a[0]) +
        '" cy="' +
        n1(a[1]) +
        '" rx="' +
        n1(1 + r() * 2) +
        '" ry=".9" fill="' +
        PALE2 +
        '"/>';
    }
    for (i = 0; i < 7; i++) {
      a = P(0.3 + r() * 0.6, 0.3 + r() * 0.65);
      s +=
        '<circle cx="' +
        n1(a[0]) +
        '" cy="' +
        n1(a[1]) +
        '" r="1.1" fill="' +
        DK2 +
        '"/>';
    }

    /* borda clara na frente-esquerda e contorno escuro nas outras */
    a = P(0.0, 0.04);
    b = P(0.0, 0.96);
    s +=
      '<path d="M' +
      xy(a) +
      " L" +
      xy(b) +
      '" fill="none" stroke="' +
      PALE +
      '" stroke-width="3.6" stroke-linecap="round"/>';
    s +=
      '<polyline points="' +
      xy(P(1, 0.02)) +
      " " +
      xy(P(1, 0.98)) +
      " " +
      xy(P(0.02, 1)) +
      '" fill="none" stroke="' +
      DK2 +
      '" stroke-width="3.4" stroke-linejoin="round"/>';

    /* volume bem leve */
    s += pillow({ shadow: DK2, ps: 0.25, glow: BODY, rim: MID });

    return svg(
      DEF +
        '<polygon points="100,0 200,50 100,100 0,50" fill="' +
        c.seam +
        '"/>' +
        '<path d="' +
        TOP +
        '" transform="translate(0 ' +
        TH +
        ')" fill="' +
        c.side +
        '"/>' +
        '<g clip-path="url(#c)">' +
        s +
        "</g>" +
        '<path d="' +
        TOP +
        '" fill="none" stroke="' +
        c.seam +
        '" stroke-width="1.6" stroke-linejoin="round" opacity=".9"/>',
    );
  }

  /* ================= CSS ================= */
  var Q = "#app #field .pw";
  var css =
    /* a almofada é desenhada no ::before do canteiro (a espessura passa um pouco da caixa) */
    Q +
    "::before{content:'';display:block!important;position:absolute;left:0;top:0;" +
    "width:100%;height:calc(var(--tw)*" +
    (VB_H / 200).toFixed(3) +
    ");" +
    "background-color:transparent!important;background-repeat:no-repeat!important;" +
    "background-position:0 0!important;background-size:100% 100%!important;" +
    "clip-path:none!important;filter:none!important;pointer-events:none}" +
    Q +
    "::after{display:none!important}" +
    /* o botão fica transparente e clicável só dentro do losango */
    Q +
    " .tile{background:none!important;transform:none!important;filter:none!important;" +
    "clip-path:polygon(50% 2%,98% 50%,50% 98%,2% 50%)!important}" +
    Q +
    " .tile:focus-visible{outline:none}" +
    /* feedback: passar o mouse / comprar / foco */
    Q +
    ":has(.tile:not(.lock):hover)::before," +
    Q +
    ":has(.tile.lock.buy:hover)::before{filter:brightness(1.12)!important}" +
    Q +
    ":has(.tile:focus-visible)::before{filter:brightness(1.22)!important}" +
    Q +
    ":has(.tile.armed)::before{filter:brightness(1.28) saturate(1.25)!important}";

  var k, v, nth;
  for (k = 1; k <= VARIANTES; k++) {
    v = k * 977;
    nth =
      ":nth-child(" +
      VARIANTES +
      "n+" +
      (k === VARIANTES ? VARIANTES : k) +
      ")";
    css +=
      Q +
      ".bed:not(.dry)" +
      nth +
      "::before{background-image:" +
      uri(soil(v)) +
      "!important}" +
      Q +
      ".bed.dry" +
      nth +
      "::before{background-image:" +
      uri(dry(v + 31)) +
      "!important}" +
      Q +
      ":not(.bed)" +
      nth +
      "::before{background-image:" +
      uri(grass(v + 77)) +
      "!important}";
  }

  var st = document.createElement("style");
  st.id = "almofada-css";
  st.textContent = css;
  document.head.appendChild(st);
})();
