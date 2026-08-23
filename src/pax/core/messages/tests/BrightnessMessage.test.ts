import { describe, expect, it } from 'vitest';

import { Messages } from '../../../shared/enums';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import { BrightnessMessage } from '../BrightnessMessage';

describe('BrightnessMessage', () => {
  it('creates from packet and calculates percentage correctly', () => {
    const packet = new PaxDecryptedPacket(new ArrayBuffer(16));
    packet.setUint8(0, Messages.ATTRIBUTE_BRIGHTNESS);
    packet.setUint8(1, 64); // 64 / 128 = 0.5

    const message = BrightnessMessage.createWithPacket(packet);
    expect(message.brightness).toBe(0.5);
    expect(message.messageType).toBe(Messages.ATTRIBUTE_BRIGHTNESS);
  });

  it('creates from brightness percentage and sets packet correctly', () => {
    const message = BrightnessMessage.createWithBrightness(0.75);
    expect(message.brightness).toBe(0.75);
    expect(message.packet.getUint8(0)).toBe(Messages.ATTRIBUTE_BRIGHTNESS);
    expect(message.packet.getUint8(1)).toBe(96); // 0.75 * 128 = 96
  });

  it('handles 0% brightness correctly', () => {
    const message = BrightnessMessage.createWithBrightness(0);
    expect(message.brightness).toBe(0);
    expect(message.packet.getUint8(1)).toBe(0);
  });
});
