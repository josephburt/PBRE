import { Pax } from '@/pax';
import { useCallback, useMemo, useRef } from 'react';

import { PaxBluetoothCharacteristics } from './enums/PaxBluetoothCharacteristics';
import { PaxBluetoothServices } from './enums/PaxBluetoothServices';
import useBluetooth from './useBluetooth';

export interface UsePaxBluetoothServicesState {
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  eventListener: {
    startListening: (callback: (event: Event) => void) => Promise<void>;
    isListenerAdded: boolean;
  };
  readFromMainService: () => Promise<Pax.lib.messages.MessageAbs>;
  writeToMainService: (packet: Pax.lib.PaxEncryptedPacket) => Promise<void>;
}

export const usePaxBluetoothServices = (
  serial: Pax.lib.PaxSerial,
): UsePaxBluetoothServicesState => {
  const {
    connected,
    connect,
    disconnect,
    isListenerAdded,
    readFromCharacteristic,
    addCharacteristicListener,
    writeToCharacteristic,
  } = useBluetooth(
    serial.device,
    PaxBluetoothServices.MainService,
    Object.values(PaxBluetoothServices),
  );

  const pendingPacketsQueue = useMemo<Pax.lib.PaxEncryptedPacket[]>(
    () => [],
    [],
  );
  const isProcessingQueueRef = useRef(false);

  const startListening = useCallback(
    (callback: (event: Event) => void): Promise<void> => {
      if (!connected) return Promise.reject('Not connected');
      if (isListenerAdded) return Promise.reject('Listener already added');

      return addCharacteristicListener(
        PaxBluetoothCharacteristics.Notifications,
        callback,
      );
    },
    [addCharacteristicListener, connected, isListenerAdded],
  );

  const readFromMainService =
    useCallback(async (): Promise<Pax.lib.messages.MessageAbs> => {
      return readFromCharacteristic(
        PaxBluetoothServices.MainService,
        PaxBluetoothCharacteristics.Read,
      ).then(response => {
        const decodedMessage = Pax.api.get(
          new Pax.lib.PaxEncryptedPacket(response.buffer),
          serial,
        );
        return decodedMessage.message;
      });
    }, [readFromCharacteristic, serial]);

  const processWriteQueue = useCallback(async (): Promise<void> => {
    if (isProcessingQueueRef.current) return;
    isProcessingQueueRef.current = true;

    try {
      while (pendingPacketsQueue.length > 0) {
        const packet = pendingPacketsQueue.shift();
        if (!packet) break;

        try {
          await writeToCharacteristic(
            PaxBluetoothServices.MainService,
            PaxBluetoothCharacteristics.Write,
            packet,
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error writing to Pax device:', error);
        }
      }
    } finally {
      isProcessingQueueRef.current = false;
      if (pendingPacketsQueue.length > 0) {
        void processWriteQueue();
      }
    }
  }, [pendingPacketsQueue, writeToCharacteristic]);

  const writeToMainService = useCallback(
    (packet: Pax.lib.PaxEncryptedPacket): Promise<void> => {
      pendingPacketsQueue.push(packet);
      return processWriteQueue();
    },
    [pendingPacketsQueue, processWriteQueue],
  );

  return {
    connect,
    disconnect,
    connected,
    eventListener: {
      startListening,
      isListenerAdded,
    },
    readFromMainService,
    writeToMainService,
  };
};
