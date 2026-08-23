import { ShellColors } from '../../shared/enums';
import { Messages } from '../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../shared/models/Packet';
import { getEnumKeyByEnumValue } from '../../shared/utils/getEnumKeyByEnumValue';
import { InvalidPacketTypeException } from '../exceptions';
import { MessageAbs } from './MessageAbs';

export class ShellColorMessage implements MessageAbs {
  readonly color: ShellColors;
  readonly messageType: Messages = Messages.ATTRIBUTE_SHELL_COLOR;
  readonly packet: PaxDecryptedPacket;

  constructor(packet: PaxDecryptedPacket) {
    this.validatePacket(packet);
    this.packet = packet;

    const colorInt = packet.getUint8(1);
    const color = getEnumKeyByEnumValue(ShellColors, colorInt);
    this.color = color ?? (colorInt as ShellColors);
  }

  private validatePacket(packet: PaxDecryptedPacket) {
    if (packet.byteLength <= 1 + 2) {
      throw new InvalidPacketTypeException('Packet too small');
    }
  }
}
