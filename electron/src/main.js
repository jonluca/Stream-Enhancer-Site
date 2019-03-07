// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, protocol} = require('electron');
const {ipcMain} = require('electron');
require('electron-debug')();
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required');

// handles links `streamenhancer://<something>`
const PROTOCOL_PREFIX = 'streamenhancer';

app.on('ready', init);
app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);
let windows = {};
let passedToken;
let mainWindow;

function init() {
  Menu.setApplicationMenu(null);

  let window = createWindow({
    title: 'StreamEnhancer',
    width: 1200,
    height: 900,
    resizable: true,
    webPreferences: {
      webSecurity: false
    }
  });
  mainWindow = window;
  protocol.registerHttpProtocol(PROTOCOL_PREFIX, (req, cb) => {
    console.log(req.url);
    window.webContents.send('token-load', req.url);
  });
  window.loadFile('./src/index.html');

  window.on('closed', () => {
    app.quit();
  });
  window.openDevTools();
}

// Protocol handler for osx
app.on('open-url', function (event, url) {
  event.preventDefault();
  passedToken = url;
  if (passedToken) {
    let splitToken = passedToken.split("://");
    if (splitToken && splitToken.length === 2) {
      mainWindow.webContents.send('token-load', splitToken[1]);
    }
  }
});

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