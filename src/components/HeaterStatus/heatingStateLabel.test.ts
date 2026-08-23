import { Pax } from '@/pax';
import { describe, expect, it } from 'vitest';

import { heatingStateLabel } from './heatingStateLabel';

describe('heatingStateLabel', () => {
  it('labels a lip-detect boost as inhaling instead of N/A', () => {
    expect(heatingStateLabel(Pax.lib.HeatingStates.BOOSTING)).toBe('Inhaling');
  });

  it('labels every known heating state', () => {
    expect(heatingStateLabel(Pax.lib.HeatingStates.HEATING)).toBe('Heating');
    expect(heatingStateLabel(Pax.lib.HeatingStates.READY)).toBe('Ready');
    expect(heatingStateLabel(Pax.lib.HeatingStates.COOLING)).toBe('Cooling');
    expect(heatingStateLabel(Pax.lib.HeatingStates.STANDBY)).toBe('Standby');
    expect(heatingStateLabel(Pax.lib.HeatingStates.OVEN_OFF)).toBe('Oven off');
    expect(heatingStateLabel(Pax.lib.HeatingStates.TEMP_SET_MODE)).toBe(
      'Selecting temperature',
    );
  });

  it('does not show N/A while waiting or for an unknown code', () => {
    expect(heatingStateLabel(undefined)).toBe('Waiting for device…');
    expect(heatingStateLabel(99 as Pax.lib.HeatingStates)).toBe('Unknown');
    expect(heatingStateLabel(undefined)).not.toBe('N/A');
  });
});
