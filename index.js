const { app, BrowserWindow } = require('electron');

function createWindow () {
    let win = new BrowserWindow( {
        width: 1000,
        height: 1000,
        // frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    //win.loadFile('pushable.html');
    // win.loadFile('logo_maker.html');
    // win.loadFile('text.html');
    win.loadFile('menu.html');
    // win.webContents.openDevTools();
}
app.whenReady().then(createWindow);