/* ===========================================================
   Roça Feliz - tools-icones.js
   Barra de ferramentas de cima (Semente, Mão, Regador, Fertilizante,
   Herbicida, Colher tudo, Limpar tudo, Remover): só o ícone, sem o título.
   - O número de Fertilizante e Herbicida aparece numa bolha dourada no canto de cima do botão.
   - O nome aparece ao passar o mouse e fica para leitores de tela.
   - Botão sem ícone mantém o texto (para não ficar um botão vazio).

   Carregar POR ÚLTIMO no index.html (depois de regador.js e cursor.js):
     <script src="tools-icones.js"></script>
   =========================================================== */
(function () {
  var tools = document.getElementById("tools");
  if (!tools) return;

  /* tamanho do ícone em pixels */
  var ICON = 30;

  var st = document.createElement("style");
  st.textContent =
    "#tools .tb img.tico{width:" +
    ICON +
    "px;height:" +
    ICON +
    "px}" +
    /* número dentro de uma bolha no cantinho de cima do botão */
    "#tools .tb{position:relative;overflow:visible}" +
    "#tools .tb .cnt{position:absolute;top:-9px;right:-9px;z-index:2;min-width:22px;height:22px;padding:0 5px;" +
    "box-sizing:border-box;display:grid;place-items:center;border-radius:999px;" +
    "font-family:var(--font-display,Georgia,serif);font-weight:400;font-size:13px;line-height:1;letter-spacing:.02em;" +
    "color:#4a2610;text-shadow:0 1px 0 rgba(255,255,255,.55);" +
    "background:radial-gradient(circle at 35% 30%,#fff0b0,#f2b92a 60%,#c98a10);" +
    "border:2px solid #4e2a12;box-shadow:0 2px 0 rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.6);pointer-events:none}" +
    "#tools .tb .cnt.zero{background:radial-gradient(circle at 35% 30%,#e6dccb,#a89a84 65%,#7d705c);color:#3a2a18}";
  document.head.appendChild(st);

  function apply() {
    tools.querySelectorAll(".tb").forEach(function (b) {
      if (b.dataset.ti) return;
      if (!b.querySelector("img,svg,.ie,.dot"))
        return; /* sem ícone: mantém o texto */
      b.dataset.ti = "1";

      var txt = b.textContent.trim(),
        m = /\((\d+)\)\s*$/.exec(txt),
        label = txt.replace(/\s*\(\d+\)\s*$/, "");
      if (!label) return;

      b.title = label + (m ? " (" + m[1] + ")" : "");
      b.setAttribute(
        "aria-label",
        (b.dataset.t === "seed" ? "Semente: " : "") +
          label +
          (m ? " (" + m[1] + ")" : ""),
      );

      /* tira o texto solto do botão (o ícone fica) */
      Array.prototype.slice.call(b.childNodes).forEach(function (n) {
        if (n.nodeType === 3) b.removeChild(n);
      });

      /* mantém só o número, numa bolha no canto do botão */
      if (m) {
        var c = document.createElement("span");
        c.className = "cnt" + (m[1] === "0" ? " zero" : "");
        c.textContent = m[1];
        b.appendChild(c);
      }
    });
  }

  /* o jogo redesenha a barra toda a cada meio segundo e o assets.js põe os
     ícones depois disso. Por isso observamos a própria barra: assim o texto
     é tirado sempre que os ícones já estão no lugar. */
  new MutationObserver(apply).observe(tools, { childList: true });
  apply();
})();
