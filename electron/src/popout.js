// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer;

let targetCoinTag;

ipc.on('crypto-info', function (event, arg) {
  targetCoinTag = arg;
});

ipc.on('crypto-data', function (event, arg) {
  let coin;
  for (const coinId in arg.data) {
    if (arg.data[coinId].website_slug === targetCoinTag) {
      coin = arg.data[coinId];
      break;
    }
  }
  const img = './coins/64x64/' + coin.website_slug + '.png';
  const price = coin.quotes.USD.price.toFixed(2);
  document.getElementById('main').innerHTML = `
        <img class="crypto-img" src="${img}">
        <span class="crypto-price">$${price}</span>
    `;
});