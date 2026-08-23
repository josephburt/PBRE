import { describe, expect, it } from 'vitest';

import { Messages } from '../../../shared/enums';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import { HapticsMessage } from '../HapticsMessage';

describe('HapticsMessage', () => {
  it('creates from packet and calculates percentage correctly', () => {
    const packet = new PaxDecryptedPacket(new ArrayBuffer(16));
    packet.setUint8(0, Messages.ATTRIBUTE_HAPTIC_MODE);
    packet.setUint8(1, 64); // 64 / 128 = 0.5

    const message = HapticsMessage.createWithPacket(packet);
    expect(message.percentage).toBe(0.5);
    expect(message.messageType).toBe(Messages.ATTRIBUTE_HAPTIC_MODE);
  });

  it('creates from haptics percentage and sets packet correctly', () => {
    const message = HapticsMessage.createWithHaptics(0.5);
    expect(message.percentage).toBe(0.5);
    expect(message.packet.getUint8(0)).toBe(Messages.ATTRIBUTE_HAPTIC_MODE);
    expect(message.packet.getUint8(1)).toBe(64);
  });

  it('handles 0% and 100% haptics correctly', () => {
    const minMessage = HapticsMessage.createWithHaptics(0);
    expect(minMessage.percentage).toBe(0);
    expect(minMessage.packet.getUint8(1)).toBe(0);

    const maxMessage = HapticsMessage.createWithHaptics(1);
    expect(maxMessage.percentage).toBe(1);
    expect(maxMessage.packet.getUint8(1)).toBe(128);
  });
});
