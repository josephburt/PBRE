import { PaxDecryptedPacket } from '@/pax/containers/lib';
import { DynamicModes, Messages } from '@/pax/shared/enums';
import { getEnumKeyByEnumValue } from '@/pax/shared/utils/getEnumKeyByEnumValue';

import { MessageAbs } from './MessageAbs';
import { ReadAndWriteMessageAbs } from './ReadAndWriteMessageAbs';

export class DynamicModeMessage
  extends ReadAndWriteMessageAbs
  implements MessageAbs
{
  readonly mode: DynamicModes;
  readonly messageType: Messages;
  readonly packet: PaxDecryptedPacket;

  constructor(
    builder:
      | DynamicModeMessageBuilderFromPacket<DynamicModeMessage>
      | DynamicModeMessageBuilderFromMode<DynamicModeMessage>,
  ) {
    super();
    this.messageType = Messages.ATTRIBUTE_DYNAMIC_MODE;
    if (builder instanceof DynamicModeMessageBuilderFromPacket) {
      this.packet = builder.getPacket();
      const rawMode = this.packet.getUint8(1);
      const mode = getEnumKeyByEnumValue(DynamicModes, rawMode);
      this.mode = mode ?? (rawMode as DynamicModes);
    } else if (builder instanceof DynamicModeMessageBuilderFromMode) {
      this.mode = builder.getMode();
      const buffer = new ArrayBuffer(16);
      const view = new PaxDecryptedPacket(buffer);
      view.setUint8(0, this.messageType);
      view.setUint8(1, this.mode);
      this.packet = view;
    } else {
      throw new Error('Invalid builder');
    }
  }

  static createWithPacket(packet: PaxDecryptedPacket): DynamicModeMessage {
    const builder =
      new DynamicModeMessageBuilderFromPacket<DynamicModeMessage>();
    builder.setPacket(packet);
    return new DynamicModeMessage(builder);
  }

  static createWithMode(mode: DynamicModes): DynamicModeMessage {
    const builder = new DynamicModeMessageBuilderFromMode<DynamicModeMessage>();
    builder.setMode(mode);
    return new DynamicModeMessage(builder);
  }
}

export class DynamicModeMessageBuilderFromPacket<T extends DynamicModeMessage> {
  private packet?: PaxDecryptedPacket;

  setPacket(
    packet: PaxDecryptedPacket,
  ): DynamicModeMessageBuilderFromPacket<T> {
    this.packet = packet;
    return this;
  }

  getPacket(): PaxDecryptedPacket {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return this.packet;
  }

  build(ctor: new (builder: DynamicModeMessageBuilderFromPacket<T>) => T): T {
    if (!this.packet) {
      throw new Error('Packet is not set');
    }
    return new ctor(this);
  }
}

export class DynamicModeMessageBuilderFromMode<T extends DynamicModeMessage> {
  private mode?: DynamicModes;

  setMode(mode: DynamicModes): DynamicModeMessageBuilderFromMode<T> {
    this.mode = mode;
    return this;
  }

  getMode(): DynamicModes {
    if (this.mode === undefined) {
      throw new Error('Mode is not set');
    }
    return this.mode;
  }

  build(ctor: new (builder: DynamicModeMessageBuilderFromMode<T>) => T): T {
    if (this.mode === undefined) {
      throw new Error('Mode is not set');
    }
    return new ctor(this);
  }
}
