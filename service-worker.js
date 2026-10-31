/* Roça Feliz - service worker
   Estratégia: imagens (img/ e pwa/) vêm do CACHE; o resto (código) tenta a REDE primeiro (assim você sempre vê a versão nova
   depois de publicar) e usa o CACHE só quando está sem internet.
   Tudo o que o jogo carrega uma vez fica guardado para jogar offline.
   Se mudar muita coisa, aumente VERSAO para limpar o cache antigo. */
var VERSAO = "rf-2";

var NUCLEO = [
  "./",
  "index.html",
  "manifest.json",
  "mobile.css",
  "pwa.js",
  "mobile-ui.js",
  "img/fundo.png",
  "img/fundo_noite.png",
  "pwa/icon-192.png",
  "pwa/icon-512.png",
  "ambiente.js",
  "andar.js",
  "bloqueio.js",
  "burro.js",
  "casas.js",
  "curral.js",
  "cursor.js",
  "entregas.js",
  "espantalho.js",
  "falas.js",
  "hud.js",
  "icones.js",
  "inseticida.js",
  "jogo.js",
  "loja.js",
  "menu-icones.js",
  "noite.js",
  "porco.js",
  "regador.js",
  "regar.js",
  "remover.js",
  "sementes.js",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(VERSAO).then(function (c) {
      /* um a um: se um ficheiro não existir, os outros entram na mesma */
      return Promise.all(
        NUCLEO.map(function (u) {
          return c.add(u).catch(function () {});
        }),
      );
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (ks) {
        return Promise.all(
          ks
            .filter(function (k) {
              return k !== VERSAO;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var mesmo = url.origin === self.location.origin;
  var fonte = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!mesmo && !fonte) return;

  /* IMAGENS: cache primeiro (quase nunca mudam). Poupa centenas de pedidos
     ao GitHub Pages, que bloqueia com "Rate limit exceeded" se houver muitos.
     Se trocar uma imagem, aumente VERSAO para renovar. */
  if (mesmo && /\/(img|pwa)\//.test(url.pathname)) {
    e.respondWith(
      caches.match(req, { ignoreSearch: true }).then(function (r) {
        if (r) return r;
        return fetch(req).then(function (res) {
          if (res && res.ok) {
            var copia = res.clone();
            caches.open(VERSAO).then(function (c) {
              c.put(req, copia);
            });
          }
          return res;
        });
      }),
    );
    return;
  }

  e.respondWith(
    fetch(req)
      .then(function (res) {
        if (res && (res.ok || res.type === "opaque")) {
          var copia = res.clone();
          caches.open(VERSAO).then(function (c) {
            c.put(req, copia);
          });
        }
        return res;
      })
      .catch(function () {
        return caches.match(req, { ignoreSearch: true }).then(function (r) {
          if (r) return r;
          if (req.mode === "navigate") return caches.match("index.html");
          return Response.error();
        });
      }),
  );
});
