import { describe, expect, it } from 'vitest';

import { DynamicModes, Messages } from '../../../shared/enums';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import { DynamicModeMessage } from '../DynamicModeMessage';

const packetWithMode = (mode: number): PaxDecryptedPacket => {
  const packet = new PaxDecryptedPacket(new ArrayBuffer(16));
  packet.setUint8(0, Messages.ATTRIBUTE_DYNAMIC_MODE);
  packet.setUint8(1, mode);
  return packet;
};

describe('DynamicModeMessage', () => {
  it.each([
    [0, DynamicModes.STANDARD],
    [1, DynamicModes.BOOST],
    [2, DynamicModes.EFFICIENCY],
    [3, DynamicModes.STEALTH],
    [4, DynamicModes.FLAVOR],
  ])('decodes dynamic heating mode %s', (raw, expected) => {
    const message = DynamicModeMessage.createWithPacket(packetWithMode(raw));
    expect(message.mode).toBe(expected);
    expect(message.messageType).toBe(Messages.ATTRIBUTE_DYNAMIC_MODE);
  });

  it('creates packet from dynamic mode enum', () => {
    const message = DynamicModeMessage.createWithMode(DynamicModes.BOOST);
    expect(message.mode).toBe(DynamicModes.BOOST);
    expect(message.packet.getUint8(0)).toBe(Messages.ATTRIBUTE_DYNAMIC_MODE);
    expect(message.packet.getUint8(1)).toBe(1);
  });

  it('creates packet for stealth and flavor modes', () => {
    const stealth = DynamicModeMessage.createWithMode(DynamicModes.STEALTH);
    expect(stealth.packet.getUint8(1)).toBe(3);

    const flavor = DynamicModeMessage.createWithMode(DynamicModes.FLAVOR);
    expect(flavor.packet.getUint8(1)).toBe(4);
  });
});
