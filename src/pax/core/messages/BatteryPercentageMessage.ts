import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { MessageAbs } from './MessageAbs';

export class BatteryPercentageMessage implements MessageAbs {
  readonly percentage: number;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  constructor(packet: PaxDecryptedPacket) {
    const percentage = packet.getUint8(1);
    this.percentage = percentage;
    this.messageType = Messages.ATTRIBUTE_BATTERY;
    this.packet = packet;
  }
}
