import { describe, expect, it } from 'vitest';

import { HeatingStates } from '../../../shared/enums';
import { PaxDecryptedPacket } from '../../../shared/models/Packet';
import { HeatingStateMessage } from '../HeatingStateMessage';

const packetWithState = (state: number): PaxDecryptedPacket => {
  const packet = new PaxDecryptedPacket(new ArrayBuffer(16));
  packet.setUint8(1, state);
  return packet;
};

describe('HeatingStateMessage', () => {
  it.each([
    [0, HeatingStates.HEATING],
    [1, HeatingStates.READY],
    [2, HeatingStates.BOOSTING],
    [3, HeatingStates.COOLING],
    [4, HeatingStates.STANDBY],
    [5, HeatingStates.OVEN_OFF],
    [6, HeatingStates.TEMP_SET_MODE],
  ])('decodes heating state %s', (raw, expected) => {
    const message = new HeatingStateMessage(packetWithState(raw));
    expect(message.heatingState).toBe(expected);
  });

  it('keeps an unknown state instead of throwing', () => {
    const message = new HeatingStateMessage(packetWithState(9));
    expect(message.heatingState).toBe(9);
  });
});
