import { PaxActions } from './actions';
import { PaxState } from './types';

export const initialPaxState: PaxState = {
  actualTemperature: 0,
  heaterSetPointTemperature: 0,
  heatingState: undefined,
  colorTheme: undefined,
  batteryPercentage: undefined,
  brightness: undefined,
  haptics: undefined,
};

const reducer = (state: PaxState, action: PaxActions): PaxState => {
  switch (action.type) {
    case 'SET_ACTUAL_TEMPERATURE':
      return { ...state, actualTemperature: action.payload };
    case 'SET_HEATER_SETPOINT_TEMPERATURE':
      return { ...state, heaterSetPointTemperature: action.payload };
    case 'SET_HEATING_STATE':
      return { ...state, heatingState: action.payload };
    case 'SET_COLOR_THEME':
      return { ...state, colorTheme: action.payload };
    case 'SET_BATTERY_PERCENTAGE':
      return { ...state, batteryPercentage: action.payload };
    case 'SET_BRIGHTNESS':
      return { ...state, brightness: action.payload };
    case 'SET_HAPTICS':
      return { ...state, haptics: action.payload };
    case 'SET_SHELL_COLOR':
      return { ...state, shellColor: action.payload };
    case 'SET_DYNAMIC_MODE':
      return { ...state, dynamicMode: action.payload };
    case 'RESET_PAX_STATE':
      return initialPaxState;
    default:
      return state;
  }
};

export default reducer;
