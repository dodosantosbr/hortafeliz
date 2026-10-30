/* Roça Feliz - pwa.js
   1) registra o service worker (só quando publicado em https)
   2) cria o aviso "Gire o celular" (o CSS está no mobile.css)
   3) tenta travar a tela na horizontal (funciona no Android; o iPhone ignora)
   4) bloqueia o zoom por pinça do Safari */
(function () {
  /* 1) service worker - não registra no Live Server (127.0.0.1) para não
     confundir o teste com ficheiros em cache */
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if ("serviceWorker" in navigator && location.protocol === "https:" && !local) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js").catch(function () {});
    });
  }

  /* 2) aviso de girar */
  var r = document.createElement("div");
  r.id = "rotate";
  r.setAttribute("role", "alert");
  r.innerHTML =
    '<div class="rot-ico" aria-hidden="true"></div>' +
    "<p>Gire o celular para jogar</p>";
  document.body.appendChild(r);

  /* 3) trava na horizontal (precisa de um toque; falha em silêncio se não puder) */
  function travar() {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(function () {});
      }
    } catch (e) {}
  }
  document.addEventListener("touchend", travar, { once: true });
  document.addEventListener("click", travar, { once: true });

  /* 4) sem zoom por pinça no iOS */
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });
})();
