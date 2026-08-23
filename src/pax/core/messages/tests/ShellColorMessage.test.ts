import { describe, expect, it } from 'vitest';

import { ShellColors } from '../../../shared/enums';
import { Messages } from '../../../shared/enums/Messages';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import { ShellColorMessage } from '../ShellColorMessage';

const packetWithColor = (color: number): PaxDecryptedPacket => {
  const packet = new PaxDecryptedPacket(new ArrayBuffer(16));
  packet.setUint8(0, Messages.ATTRIBUTE_SHELL_COLOR);
  packet.setUint8(1, color);
  return packet;
};

describe('ShellColorMessage', () => {
  it.each([
    [0, ShellColors.BLACK],
    [1, ShellColors.SILVER],
    [2, ShellColors.ROSE_GOLD],
    [3, ShellColors.TEAL],
    [4, ShellColors.BURGUNDY],
  ])('decodes shell color %s', (raw, expected) => {
    const message = new ShellColorMessage(packetWithColor(raw));
    expect(message.color).toBe(expected);
    expect(message.messageType).toBe(Messages.ATTRIBUTE_SHELL_COLOR);
  });

  it('keeps an unknown color value instead of throwing', () => {
    const message = new ShellColorMessage(packetWithColor(99));
    expect(message.color).toBe(99);
  });
});
