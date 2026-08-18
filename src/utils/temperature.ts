export type TemperatureUnit = 'C' | 'F';

export const DEVICE_TEMP_MIN_C = 175;
export const DEVICE_TEMP_MAX_C = 215;

export const celsiusToFahrenheit = (celsius: number): number =>
  (celsius * 9) / 5 + 32;

export const fahrenheitToCelsius = (fahrenheit: number): number =>
  ((fahrenheit - 32) * 5) / 9;

export const convertFromCelsius = (
  celsius: number,
  unit: TemperatureUnit,
): number => (unit === 'F' ? celsiusToFahrenheit(celsius) : celsius);

export const convertToCelsius = (
  value: number,
  unit: TemperatureUnit,
): number => (unit === 'F' ? fahrenheitToCelsius(value) : value);

export const clampDeviceTemperatureC = (celsius: number): number =>
  Math.min(DEVICE_TEMP_MAX_C, Math.max(DEVICE_TEMP_MIN_C, celsius));

export const formatTemperature = (
  celsius: number,
  unit: TemperatureUnit,
): string => `${Math.round(convertFromCelsius(celsius, unit))}°${unit}`;
