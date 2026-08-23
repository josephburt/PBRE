import { Devices } from '../enums';
import { InvalidSerialException, UnknownDeviceException } from '../exceptions';

export class PaxSerial {
  readonly serial: string;
  readonly device: Devices;

  constructor(serial: string, device: Devices) {
    if (serial.length !== this.serialLengthFromDevice(device)) {
      throw new InvalidSerialException(
        `Serial should be a string of length 8, provided was of length ${serial.length}`,
      );
    }
    this.serial = serial;
    this.device = device;
  }

  private serialLengthFromDevice(device: Devices): number {
    if (device === Devices.PAX3) {
      return 8;
    } else {
      throw new UnknownDeviceException();
    }
  }

  toString(): string {
    return `PaxSerial: ${this.serial}, DeviceName: ${this.device}`;
  }
}
