import { Pax } from '@/pax';

const LABELS: Record<Pax.lib.HeatingStates, string> = {
  [Pax.lib.HeatingStates.HEATING]: 'Heating',
  [Pax.lib.HeatingStates.READY]: 'Ready',
  [Pax.lib.HeatingStates.BOOSTING]: 'Inhaling',
  [Pax.lib.HeatingStates.COOLING]: 'Cooling',
  [Pax.lib.HeatingStates.STANDBY]: 'Standby',
  [Pax.lib.HeatingStates.OVEN_OFF]: 'Oven off',
  [Pax.lib.HeatingStates.TEMP_SET_MODE]: 'Selecting temperature',
};

export const heatingStateLabel = (
  heaterStatus?: Pax.lib.HeatingStates,
): string => {
  if (heaterStatus === undefined) {
    return 'Waiting for device…';
  }

  return LABELS[heaterStatus] ?? 'Unknown';
};
