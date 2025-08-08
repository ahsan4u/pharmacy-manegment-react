const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mongod, backend, win;


app.on('second-instance', () => {
    if (win) {
        if (win.isMinimized()) win.restore();
        win.focus();
    }
});


const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) return app.quit();

function createWindow() {
    win = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadURL('http://localhost:8000');
}


function startMongoDB() {
    const mongoPath = path.join(process.resourcesPath, 'mongodb', 'mongod.exe');
    const dataPath = path.join(app.getPath('userData'), 'mongodb-data');

    if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
    mongod = spawn(mongoPath, ['--dbpath', dataPath], { stdio: 'ignore' });
}



app.whenReady().then(async () => {
    backend = await require('./server/src/app');
    startMongoDB();
    createWindow();
});

app.on('before-quit', () => {
    if (mongod) mongod.kill();
    if (backend) backend.close(() => console.log('Server closed'));
})