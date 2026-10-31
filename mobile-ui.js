/* Roça Feliz - mobile-ui.js
   No celular deitado, os menus ficam RECOLHIDOS para não poluir a tela:
   - ferramentas: aparece só a ferramenta ativa; tocar nela abre a fila toda
   - menu de baixo: abre por um botão redondo (☰) no canto inferior direito
   Em computador (mouse) nada muda. */
(function () {
  var MQ = window.matchMedia(
    "(orientation: landscape) and (max-height: 520px) and (pointer: coarse)",
  );
  var app = document.getElementById("app");
  var tools = document.getElementById("tools");
  var menu = document.querySelector(".menu");
  if (!app || !tools || !menu) return;

  /* botão redondo do menu */
  var btn = document.createElement("button");
  btn.id = "rfMenuBtn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Menu");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><i class="rf-dot"></i>';
  app.appendChild(btn);

  function fecharTudo() {
    app.classList.remove("rf-menu-open", "rf-tools-open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    var abrir = !app.classList.contains("rf-menu-open");
    fecharTudo();
    if (abrir) {
      app.classList.add("rf-menu-open");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  /* ferramentas: 1.º toque abre a fila, 2.º toque escolhe e fecha */
  tools.addEventListener(
    "click",
    function (e) {
      if (!MQ.matches) return;
      if (!e.target.closest(".tb")) return;
      if (app.classList.contains("rf-tools-open")) {
        setTimeout(fecharTudo, 120); /* deixa o jogo tratar o toque primeiro */
        return;
      }
      if (tools.querySelector('.tb[aria-pressed="true"]')) {
        e.stopImmediatePropagation();
        e.preventDefault();
        fecharTudo();
        app.classList.add("rf-tools-open");
      }
    },
    true,
  );

  /* escolher um item do menu fecha a barra (o painel abre por cima) */
  menu.addEventListener("click", function (e) {
    if (MQ.matches && e.target.closest(".mi")) setTimeout(fecharTudo, 0);
  });

  /* tocar fora fecha tudo */
  document.addEventListener(
    "pointerdown",
    function (e) {
      if (!MQ.matches) return;
      if (e.target.closest("#rfMenuBtn, .menu, .tools")) return;
      fecharTudo();
    },
    true,
  );

  /* bolinha vermelha no botão quando há aviso no menu (correio, entregas...) */
  function avisos() {
    var tem = Array.prototype.some.call(
      menu.querySelectorAll(".bdg"),
      function (b) {
        var t = b.textContent.trim();
        return t && t !== "0";
      },
    );
    btn.classList.toggle("rf-tem", tem);
  }
  setInterval(avisos, 1500);
  avisos();

  (MQ.addEventListener ? MQ.addEventListener.bind(MQ, "change") : MQ.addListener.bind(MQ))(
    fecharTudo,
  );
})();
