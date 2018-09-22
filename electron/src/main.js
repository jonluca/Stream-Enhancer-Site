// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron');
app.commandLine.appendArgument("--disable-web-security");
require('electron-debug')();

app.on('ready', init);

let windows = {};

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
  window.loadFile('./src/index.html');
  window.webContents.on('did-finish-load', () => {
  });

  window.on('closed', () => {
    app.quit();
  });

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