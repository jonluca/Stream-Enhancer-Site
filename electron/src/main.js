// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron');
app.commandLine.appendArgument("--disable-web-security");
require('electron-debug')();

const fetch = require('node-fetch');
const {ipcMain} = require('electron');

app.on('ready', init);

let windows = {};

function init() {
  Menu.setApplicationMenu(null);

  let window = createWindow({
    title: 'StreamEnhancer',
    width: 800,
    height: 600,
    resizable: true,
    webPreferences: {
      webSecurity: false
    }
  });
  window.loadFile('./src/index.html');
  window.webContents.on('did-finish-load', () => {
  });

  window.on('closed', () => {
    app.quit();
  });

  // ipcMain.on('crypto-popout', (event, arg) => {
  //   let targetCoin;
  //   for (const coinId in cryptoData.data) {
  //     if (cryptoData.data[coinId].website_slug === arg) {
  //       targetCoin = cryptoData.data[coinId];
  //       break;
  //     }
  //   }
  //   let popout = createWindow({
  //     title: `${targetCoin.name} Popout`,
  //     width: 500,
  //     height: 100,
  //     frame: false,
  //     transparent: true,
  //     resizable: false,
  //     alwaysOnTop: true
  //   });
  //   popout.loadFile('./src/popout.html');
  //   popout.webContents.on('did-finish-load', () => {
  //     popout.send('crypto-info', arg);
  //     popout.send('crypto-data', cryptoData);
  //   });
  // });
}

function createWindow(params) {
  const win = new BrowserWindow(params);
  let winId = win.id;
  windows[winId] = win;
  win.on('closed', () => {
    delete windows[winId];
  });

  return win;
}

app.on('window-all-closed', function () {
  app.quit();
});