import { describe, expect, it } from 'vitest';

import { Messages } from '../../../shared/enums';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import { BatteryPercentageMessage } from '../BatteryPercentageMessage';

describe('BatteryPercentageMessage', () => {
  it('correctly reads battery percentage from packet', () => {
    const packet = new PaxDecryptedPacket(new ArrayBuffer(16));
    packet.setUint8(0, Messages.ATTRIBUTE_BATTERY);
    packet.setUint8(1, 85);

    const message = new BatteryPercentageMessage(packet);
    expect(message.percentage).toBe(85);
    expect(message.messageType).toBe(Messages.ATTRIBUTE_BATTERY);
  });
});
