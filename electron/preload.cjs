const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('pbreDesktop', {
  isDesktop: true,
  onBluetoothDevices: callback => {
    const listener = (_event, devices) => {
      callback(devices);
    };
    ipcRenderer.on('bluetooth-devices', listener);
    return () => {
      ipcRenderer.removeListener('bluetooth-devices', listener);
    };
  },
  selectBluetoothDevice: deviceId => {
    ipcRenderer.send('select-bluetooth-device', deviceId);
  },
  cancelBluetooth: () => {
    ipcRenderer.send('cancel-bluetooth-request');
  },
});
