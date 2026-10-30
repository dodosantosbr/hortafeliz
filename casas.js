/* casas.js - casas passam a ser compradas (uma vez) e depois trocadas de graça.
   Carregar DEPOIS do jogo.js (pode ser depois do hud.js). */
(function () {
  /* preço de cada casa. casa1 (padrão) é grátis. Ajuste à vontade. */
  var PRECOS = {
    casa1: 0,
    casa2: 5200,
    casa3: 12200,
    casa4: 2500,
    casa5: 30000,
    casa6: 80000,
    casa7: 250000,
  };
  function preco(id) {
    return PRECOS[id] || 0;
  }

  /* lista de casas que a pessoa já possui (fica salva em S.houses).
     Quem já usa uma casa antes desta mudança ganha essa casa de graça. */
  function donas() {
    if (!Array.isArray(S.houses)) S.houses = [];
    var atual = houseById(S.house).id;
    if (S.houses.indexOf(atual) < 0) S.houses.push(atual);
    if (S.houses.indexOf("casa1") < 0) S.houses.push("casa1");
    return S.houses;
  }

  /* lista da aba "Casas" */
  pDeco = function () {
    var own = donas(),
      atual = houseById(S.house).id;
    return (
      '<p class="note" style="margin-bottom:6px">Compre uma casa uma vez e troque quando quiser entre as que você já tem.</p>' +
      HOUSES.map(function (h) {
        var p = preco(h.id),
          tem = own.indexOf(h.id) >= 0 || p === 0,
          on = h.id === atual,
          sub = on ? "Em uso" : tem ? "Já é sua" : p + " moedas",
          btn;
        if (on) btn = '<button class="btn" disabled>Em uso</button>';
        else if (tem)
          btn =
            '<button class="btn main" data-act="house" data-id="' +
            h.id +
            '">Usar</button>';
        else
          btn =
            '<button class="btn" data-act="buyhouse" data-id="' +
            h.id +
            '">Comprar · ' +
            p +
            "</button>";
        return (
          '<div class="item"><div><strong>' +
          h.nome +
          '</strong><span class="note">' +
          sub +
          '</span></div><div class="acts">' +
          btn +
          "</div></div>"
        );
      }).join("")
    );
  };

  /* compra e troca */
  var _decoAct = decoAct;
  decoAct = function (a, b) {
    if (a === "buyhouse") {
      var h = houseById(b.dataset.id),
        p = preco(h.id),
        own = donas();
      if (own.indexOf(h.id) >= 0) {
        toast("Você já tem esta casa.");
      } else if (S.coins < p) {
        toast("Faltam " + (p - S.coins) + " moedas.");
      } else {
        S.coins -= p;
        own.push(h.id);
        S.house = h.id;
        applyHouse();
        toast("Compra feita: " + h.nome + ".");
        log("Você comprou a " + h.nome + " por " + p + " moedas.");
      }
      after();
      return true;
    }
    if (a === "house") {
      var id = b.dataset.id;
      if (preco(id) > 0 && donas().indexOf(id) < 0) {
        toast("Compre esta casa primeiro.");
        return true;
      }
    }
    return _decoAct(a, b);
  };
})();
