/// <reference types="vite/client" />

declare global {
  interface Window {
    pbreDesktop?: {
      isDesktop: true;
      onBluetoothDevices: (
        callback: (devices: { deviceId: string; deviceName: string }[]) => void,
      ) => () => void;
      selectBluetoothDevice: (deviceId: string) => void;
      cancelBluetooth: () => void;
    };
  }
}

export {};
