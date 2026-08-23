import { ShellColors } from '@/pax/shared/enums';
import { describe, expect, it } from 'vitest';

import { getShellColorInfo } from './shellColor';

describe('shellColor utility', () => {
  it('returns metadata for known shell colors', () => {
    expect(getShellColorInfo(ShellColors.BLACK)?.name).toBe('Onyx Black');
    expect(getShellColorInfo(ShellColors.SILVER)?.name).toBe('Silver');
    expect(getShellColorInfo(ShellColors.ROSE_GOLD)?.name).toBe('Rose Gold');
    expect(getShellColorInfo(ShellColors.TEAL)?.name).toBe('Sage Teal');
    expect(getShellColorInfo(ShellColors.BURGUNDY)?.name).toBe('Burgundy');
  });

  it('returns undefined for undefined color', () => {
    expect(getShellColorInfo(undefined)).toBeUndefined();
  });
});
