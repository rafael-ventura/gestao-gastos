
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/home",
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-N7E6KSR4.js",
      "chunk-SSMBZRPG.js",
      "chunk-R546CODF.js",
      "chunk-V6YI52K6.js"
    ],
    "route": "/home"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-RNGHAREZ.js",
      "chunk-SSMBZRPG.js",
      "chunk-V6YI52K6.js"
    ],
    "route": "/informacoes"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-UFGPUYC7.js",
      "chunk-R546CODF.js",
      "chunk-V6YI52K6.js"
    ],
    "route": "/config"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 23900, hash: '431826378774862228b127b36e2ae9e1021a5393c7d3fa6af7dffbfa5fcd2deb', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17474, hash: '5182f670bc984fc3d7a671572368565747c2dd7d753f135466eeb143949e8910', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'home/index.html': {size: 129311, hash: 'b8124fd98eb72cbddda2f2740fdcb116de53a876ee131cc10c1783a5ab66e309', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'informacoes/index.html': {size: 159301, hash: 'cd48e71dd0bc8e82e269e5c5405090cadfec66027415d12eb536a3e7ec2967c4', text: () => import('./assets-chunks/informacoes_index_html.mjs').then(m => m.default)},
    'config/index.html': {size: 220306, hash: '82d1cd580c53337df8aea69b52ca43383b597e9c6f7862c2e85859da4479fca4', text: () => import('./assets-chunks/config_index_html.mjs').then(m => m.default)},
    'styles-52WF6A3K.css': {size: 6979, hash: 'ob/HeOe/41A', text: () => import('./assets-chunks/styles-52WF6A3K_css.mjs').then(m => m.default)}
  },
};
