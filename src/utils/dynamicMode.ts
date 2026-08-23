import { DynamicModes } from '@/pax/shared/enums';

export interface DynamicModeInfo {
  mode: DynamicModes;
  name: string;
  tagline: string;
  description: string;
  badgeBg: string;
  badgeText: string;
}

export const DYNAMIC_MODES_INFO: Record<DynamicModes, DynamicModeInfo> = {
  [DynamicModes.STANDARD]: {
    mode: DynamicModes.STANDARD,
    name: 'Standard',
    tagline: 'Balanced heat and cooldown',
    description:
      'Classic profile. Heats to setpoint and maintains temperature with gradual idle cooling.',
    badgeBg: 'bg-blue-100 dark:bg-blue-950',
    badgeText: 'text-blue-700 dark:text-blue-300',
  },
  [DynamicModes.BOOST]: {
    mode: DynamicModes.BOOST,
    name: 'Boost',
    tagline: 'Aggressive heat & dense vapor',
    description:
      'Keeps oven hotter longer with fast heat ramp-up and minimal auto-cooling. Ideal for bongs.',
    badgeBg: 'bg-red-100 dark:bg-red-950',
    badgeText: 'text-red-700 dark:text-red-300',
  },
  [DynamicModes.EFFICIENCY]: {
    mode: DynamicModes.EFFICIENCY,
    name: 'Efficiency',
    tagline: 'Automatic session temperature ramp',
    description:
      'Auto-increases oven temperature by 1°C per minute to evenly extract all material.',
    badgeBg: 'bg-emerald-100 dark:bg-emerald-950',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
  },
  [DynamicModes.STEALTH]: {
    mode: DynamicModes.STEALTH,
    name: 'Stealth',
    tagline: 'Dimmed LEDs & fast cooldown',
    description:
      'Dims petals and quickly cools oven between puffs for minimal odor and discreet sessions.',
    badgeBg: 'bg-purple-100 dark:bg-purple-950',
    badgeText: 'text-purple-700 dark:text-purple-300',
  },
  [DynamicModes.FLAVOR]: {
    mode: DynamicModes.FLAVOR,
    name: 'Flavor',
    tagline: 'Fast cooling for maximum terpenes',
    description:
      'Cools quickly after each puff so material only heats during draws, preserving flavor.',
    badgeBg: 'bg-amber-100 dark:bg-amber-950',
    badgeText: 'text-amber-700 dark:text-amber-300',
  },
};

export const ALL_DYNAMIC_MODES: DynamicModeInfo[] =
  Object.values(DYNAMIC_MODES_INFO);

export const getDynamicModeInfo = (
  mode?: DynamicModes,
): DynamicModeInfo | undefined => {
  if (mode === undefined) return undefined;
  return DYNAMIC_MODES_INFO[mode];
};
