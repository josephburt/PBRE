import { ShellColors } from '@/pax/shared/enums';

export interface ShellColorInfo {
  name: string;
  fillColor: string;
  badgeBg: string;
  badgeText: string;
}

export const SHELL_COLORS_INFO: Record<ShellColors, ShellColorInfo> = {
  [ShellColors.BLACK]: {
    name: 'Onyx Black',
    fillColor: '#2b2b2b',
    badgeBg: 'bg-neutral-800',
    badgeText: 'text-neutral-200',
  },
  [ShellColors.SILVER]: {
    name: 'Silver',
    fillColor: '#a8adb4',
    badgeBg: 'bg-slate-300 dark:bg-slate-700',
    badgeText: 'text-slate-900 dark:text-slate-100',
  },
  [ShellColors.ROSE_GOLD]: {
    name: 'Rose Gold',
    fillColor: '#c48b7f',
    badgeBg: 'bg-rose-200 dark:bg-rose-950',
    badgeText: 'text-rose-900 dark:text-rose-200',
  },
  [ShellColors.TEAL]: {
    name: 'Sage Teal',
    fillColor: '#3d6e67',
    badgeBg: 'bg-emerald-200 dark:bg-emerald-950',
    badgeText: 'text-emerald-900 dark:text-emerald-200',
  },
  [ShellColors.BURGUNDY]: {
    name: 'Burgundy',
    fillColor: '#6b2438',
    badgeBg: 'bg-red-200 dark:bg-red-950',
    badgeText: 'text-red-900 dark:text-red-200',
  },
};

export const getShellColorInfo = (
  color?: ShellColors,
): ShellColorInfo | undefined => {
  if (color === undefined) return undefined;
  return SHELL_COLORS_INFO[color];
};
