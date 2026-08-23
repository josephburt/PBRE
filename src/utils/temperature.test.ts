import { describe, expect, it } from 'vitest';

import {
  celsiusToFahrenheit,
  clampDeviceTemperatureC,
  convertFromCelsius,
  convertToCelsius,
  formatTemperature,
} from './temperature';

describe('temperature', () => {
  it('converts Pax setpoint range into Fahrenheit', () => {
    expect(celsiusToFahrenheit(175)).toBeCloseTo(347);
    expect(celsiusToFahrenheit(215)).toBeCloseTo(419);
  });

  it('leaves Celsius values unchanged', () => {
    expect(convertFromCelsius(193, 'C')).toBe(193);
  });

  it('formats rounded display strings', () => {
    expect(formatTemperature(193.4, 'C')).toBe('193°C');
    expect(formatTemperature(193, 'F')).toBe('379°F');
  });

  it('converts a Fahrenheit slider value back to Celsius', () => {
    expect(convertToCelsius(379, 'F')).toBeCloseTo(192.78, 1);
    expect(convertToCelsius(193, 'C')).toBe(193);
  });

  it('clamps writes to the Pax oven range', () => {
    expect(clampDeviceTemperatureC(100)).toBe(175);
    expect(clampDeviceTemperatureC(250)).toBe(215);
    expect(clampDeviceTemperatureC(193)).toBe(193);
  });
});
