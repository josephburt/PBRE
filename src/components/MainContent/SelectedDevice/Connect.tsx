import { PaxPairing } from '@/components/Graphics';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks';
import { usePaxContext } from '@/state/hooks';
import { DesktopBluetoothDevice } from '@/types';
import { getShellColorInfo } from '@/utils/shellColor';
import { BluetoothIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface IConnectProps {
  connect: () => Promise<void>;
}

export function Connect(props: IConnectProps) {
  const { state } = usePaxContext();
  const isMobile = useIsMobile();
  const isDesktop = Boolean(window.pbreDesktop);
  const [devices, setDevices] = useState<DesktopBluetoothDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const shellInfo = getShellColorInfo(state.shellColor);

  useEffect(() => {
    if (!window.pbreDesktop) {
      return;
    }

    return window.pbreDesktop.onBluetoothDevices(found => {
      setDevices(found);
      setScanning(true);
    });
  }, []);

  const handleConnect = async () => {
    setScanning(true);
    setDevices([]);
    try {
      await props.connect();
    } finally {
      setScanning(false);
    }
  };

  const paxDevices = devices.filter(device =>
    /^PAX/i.test(device.deviceName || ''),
  );

  return (
    <div className="flex flex-col gap-6 self-center">
      <PaxPairing
        parallax={!isMobile}
        pulsatingLightSpeed={'slow'}
        pairingAnimation
        fillColor={shellInfo?.fillColor}
      />

      <Button
        onClick={() => void handleConnect()}
        variant="secondary"
        disabled={scanning && isDesktop}
      >
        {scanning && isDesktop ? 'Looking for Pax…' : 'Connect'}
      </Button>

      {isDesktop && paxDevices.length > 0 ? (
        <div className="flex flex-col gap-2">
          {paxDevices.map(device => (
            <Button
              key={device.deviceId}
              variant="outline"
              onClick={() =>
                window.pbreDesktop?.selectBluetoothDevice(device.deviceId)
              }
            >
              {device.deviceName || device.deviceId}
            </Button>
          ))}
        </div>
      ) : null}

      {isDesktop && scanning ? (
        <Button
          variant="ghost"
          onClick={() => {
            window.pbreDesktop?.cancelBluetooth();
            setScanning(false);
          }}
        >
          Cancel
        </Button>
      ) : null}

      <Alert>
        <BluetoothIcon className="h-4 w-4" />
        <AlertTitle>Pairing mode</AlertTitle>
        <AlertDescription>
          Shake your device until you see the blue light.
        </AlertDescription>
      </Alert>
    </div>
  );
}
