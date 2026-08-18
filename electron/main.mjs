import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let selectBluetoothCallback;
let selectBluetoothTimeout;

const isPaxDevice = deviceName => /^PAX/i.test(deviceName ?? '');

const createWindow = async () => {
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'icon.png')
    : path.join(__dirname, '../build/icon.png');

  const mainWindow = new BrowserWindow({
    width: 480,
    height: 820,
    minWidth: 400,
    minHeight: 640,
    title: 'PBRE',
    backgroundColor: '#000000',
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const session = mainWindow.webContents.session;

  session.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'bluetooth';
  });

  session.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'bluetooth');
  });

  session.setDevicePermissionHandler(details => {
    return details.deviceType === 'bluetooth';
  });

  session.setBluetoothPairingHandler((details, callback) => {
    callback({ confirmed: true, pin: details.pin });
  });

  mainWindow.webContents.on(
    'select-bluetooth-device',
    (event, deviceList, callback) => {
      event.preventDefault();
      selectBluetoothCallback = callback;
      mainWindow.webContents.send('bluetooth-devices', deviceList);
      const match = deviceList.find(device => isPaxDevice(device.deviceName));
      if (match) {
        callback(match.deviceId);
        selectBluetoothCallback = undefined;
        if (selectBluetoothTimeout) {
          clearTimeout(selectBluetoothTimeout);
          selectBluetoothTimeout = undefined;
        }
        return;
      }
      if (!selectBluetoothTimeout) {
        selectBluetoothTimeout = setTimeout(() => {
          selectBluetoothCallback?.('');
          selectBluetoothCallback = undefined;
          selectBluetoothTimeout = undefined;
        }, 45000);
      }
    },
  );

  ipcMain.removeAllListeners('select-bluetooth-device');
  ipcMain.removeAllListeners('cancel-bluetooth-request');

  ipcMain.on('select-bluetooth-device', (_event, deviceId) => {
    if (!selectBluetoothCallback) return;
    selectBluetoothCallback(deviceId);
    selectBluetoothCallback = undefined;
    if (selectBluetoothTimeout) {
      clearTimeout(selectBluetoothTimeout);
      selectBluetoothTimeout = undefined;
    }
  });

  ipcMain.on('cancel-bluetooth-request', () => {
    selectBluetoothCallback?.('');
    selectBluetoothCallback = undefined;
    if (selectBluetoothTimeout) {
      clearTimeout(selectBluetoothTimeout);
      selectBluetoothTimeout = undefined;
    }
  });

  if (!app.isPackaged) {
    await mainWindow.loadURL(
      process.env.VITE_DEV_SERVER_URL ?? 'http://127.0.0.1:5173',
    );
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  void createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
