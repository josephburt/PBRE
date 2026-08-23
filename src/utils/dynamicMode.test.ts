import { DynamicModes } from '@/pax/shared/enums';
import { describe, expect, it } from 'vitest';

import {
  ALL_DYNAMIC_MODES,
  DYNAMIC_MODES_INFO,
  getDynamicModeInfo,
} from './dynamicMode';

describe('dynamicMode utility', () => {
  it('contains information for all 5 heating profiles', () => {
    expect(ALL_DYNAMIC_MODES).toHaveLength(5);
    expect(DYNAMIC_MODES_INFO[DynamicModes.STANDARD].name).toBe('Standard');
    expect(DYNAMIC_MODES_INFO[DynamicModes.BOOST].name).toBe('Boost');
    expect(DYNAMIC_MODES_INFO[DynamicModes.EFFICIENCY].name).toBe('Efficiency');
    expect(DYNAMIC_MODES_INFO[DynamicModes.STEALTH].name).toBe('Stealth');
    expect(DYNAMIC_MODES_INFO[DynamicModes.FLAVOR].name).toBe('Flavor');
  });

  it('getDynamicModeInfo returns metadata for given mode', () => {
    const boostInfo = getDynamicModeInfo(DynamicModes.BOOST);
    expect(boostInfo?.name).toBe('Boost');
    expect(boostInfo?.tagline).toBe('Aggressive heat & dense vapor');
  });

  it('getDynamicModeInfo returns undefined when mode is undefined', () => {
    expect(getDynamicModeInfo(undefined)).toBeUndefined();
  });
});
