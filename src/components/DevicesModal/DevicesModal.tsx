import { Modal } from '@/components';
import { useDevicesLocalStorage } from '@/hooks';
import { Pax } from '@/pax';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import AddDeviceFooter from '../AddDeviceFooter';
import DeviceCard from './DeviceCard';
import { SUPPORTED_DEVICES } from './constants';

export interface DevicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DevicesModal = ({ open, onOpenChange }: DevicesModalProps) => {
  const [serialInput, setSerialInput] = useState<string | undefined>(undefined);
  const defaultDevice = SUPPORTED_DEVICES[0];
  const [deviceValue, setDeviceValue] =
    useState<Pax.lib.Devices>(defaultDevice);
  const deviceStore = useDevicesLocalStorage();

  const renderCards = () => {
    return deviceStore.store.map(serial => {
      return <DeviceCard key={serial.serial} serial={serial}></DeviceCard>;
    });
  };

  const renderContent = () => {
    return (
      <div className="grid min-h-[175px] grid-cols-1 gap-5 md:grid-cols-2">
        {deviceStore.store.length === 0 ? (
          <div
            className="col-span-full flex flex-col items-center justify-center 
            gap-2 py-6 text-center"
          >
            <TriangleAlert className="h-12 w-12 opacity-50 dark:text-neutral-500" />
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
              No devices saved yet
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              Add your 8-digit serial number below to connect your Pax 3.
            </p>
          </div>
        ) : (
          renderCards()
        )}
      </div>
    );
  };

  const renderFooter = () => {
    return (
      <AddDeviceFooter
        serialInput={serialInput}
        setSerialInput={setSerialInput}
        deviceValue={deviceValue}
        setDeviceValue={setDeviceValue}
      />
    );
  };

  return (
    <Modal
      title={'Your devices'}
      open={open}
      onOpenChange={onOpenChange}
      footer={renderFooter()}
    >
      {renderContent()}
    </Modal>
  );
};

export { DevicesModal };
