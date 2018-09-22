// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const ipc = require('electron').ipcRenderer;

ipc.on('crypto-data', function (event, arg) {
  refreshTable(arg);
});

function refreshTable(arg) {
  document.getElementById('main').innerHTML = '';
  for (const coinId in arg.data) {
    const coin = arg.data[coinId];
    const img = './coins/32x32/' + coin.website_slug + '.png';
    const percentChangeClass = coin.quotes.USD.percent_change_24h > 0 ? 'green' : 'red';
    let newElement = `
        <div class="crypto">
            <div class="crypto-info">
                <img class="crypto-img" src="${img}"/>
                <span class="crypto-name">${coin.name}</span>
            </div>
            <div class="crypto-price">$${coin.quotes.USD.price} USD</div>
            <div class="crypto-change ${percentChangeClass}">${coin.quotes.USD.percent_change_24h} %</div>
            <button class="btn btn-popout" id="btn-popup-${coin.website_slug}">Popout</button>
        </div>`;
    document.getElementById('main').innerHTML += newElement;
  }
  const popoutBtns = document.querySelectorAll('.btn-popout');
  for (let i = 0; i < popoutBtns.length; i++) {
    const popoutBtn = popoutBtns[i];
    popoutBtn.addEventListener('click', (event) => {
      const btnId = event.target.id.substring(10);
      ipc.send('crypto-popout', btnId);
    });
  }
}