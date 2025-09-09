
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
    'index.csr.html': {size: 23900, hash: '32c66d1d06eb1e645c7b1ad3bd50a6140fa457d2c89cec654a76624cbd1012a5', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17474, hash: '251f4e6977e76a948de9a8055e40e6b6b59a7571f5ceb79503a96a92dfcf4e17', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'informacoes/index.html': {size: 159301, hash: '9623fe71de122b38550e796eb71e5afb231864194f20e5873fedf134483cc1c6', text: () => import('./assets-chunks/informacoes_index_html.mjs').then(m => m.default)},
    'config/index.html': {size: 220306, hash: '20cb31be72148111254cd6231fc5b358b47e97140de804d32fd05df6fbd88273', text: () => import('./assets-chunks/config_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 129311, hash: 'cc683c129a559e9666de6e7a7a7c6b7f2f6ea3e5299e06fe5fb0476b64eb0cd7', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'styles-52WF6A3K.css': {size: 6979, hash: 'ob/HeOe/41A', text: () => import('./assets-chunks/styles-52WF6A3K_css.mjs').then(m => m.default)}
  },
};
