import { Pax } from '@/pax';

export interface PaxState {
  actualTemperature: number;
  heaterSetPointTemperature: number;
  heatingState?: Pax.lib.HeatingStates;
  colorTheme?: Pax.lib.ColorTheme;
  batteryPercentage?: number;
  brightness?: number;
  haptics?: number;
}
