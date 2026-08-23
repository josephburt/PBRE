import { usePaxBluetoothServices, useTemperatureUnit } from '@/hooks';
import { BaseBluetoothException } from '@/hooks/usePaxBluetoothServices/useBluetooth/exceptions';
import { Pax } from '@/pax';
import { post } from '@/pax/containers/api';
import {
  BatteryPercentageMessage,
  BrightnessMessage,
  ColorThemeMessage,
  HapticsMessage,
  HeaterSetPointMessage,
  RequestStatusMessage,
  ShellColorMessage,
} from '@/pax/core/messages';
import { Messages } from '@/pax/shared/enums';
import { ColorTheme } from '@/pax/shared/types';
import { usePaxContext } from '@/state/hooks';
import { getShellColorInfo } from '@/utils/shellColor';
import {
  DEVICE_TEMP_MAX_C,
  DEVICE_TEMP_MIN_C,
  clampDeviceTemperatureC,
  convertFromCelsius,
  convertToCelsius,
  formatTemperature,
} from '@/utils/temperature';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect } from 'react';

import HeaterStatus from '../HeaterStatus';
import TemperatureProgress from '../TemperatureProgress';
import { ThemePicker } from '../ThemePicker';
import { hardcodedThemes } from '../ThemePicker/colors';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Connect } from './SelectedDevice/Connect';

interface SelectedDeviceProps {
  currentDevice: Pax.lib.PaxSerial;
  openDevicesModal: () => void;
}

const STATUS_ATTRIBUTES = [
  Messages.ATTRIBUTE_HEATING_STATE,
  Messages.ATTRIBUTE_ACTUAL_TEMP,
  Messages.ATTRIBUTE_HEATER_SET_POINT,
  Messages.ATTRIBUTE_CURRENT_TARGET_TEMP,
  Messages.ATTRIBUTE_BATTERY,
  Messages.ATTRIBUTE_COLOR_THEME,
  Messages.ATTRIBUTE_BRIGHTNESS,
  Messages.ATTRIBUTE_HAPTIC_MODE,
  Messages.ATTRIBUTE_SHELL_COLOR,
];

export const SelectedDevice = ({ currentDevice }: SelectedDeviceProps) => {
  const { state, actions } = usePaxContext();
  const { unit } = useTemperatureUnit();
  const bluetoothState = usePaxBluetoothServices(currentDevice);
  const shellInfo = getShellColorInfo(state.shellColor);

  const messagesConsumer = useCallback(() => {
    if (!bluetoothState.connected) {
      return;
    }

    bluetoothState
      .readFromMainService()
      .then(message => {
        if (message instanceof Pax.lib.messages.UnknownMessage) {
          return;
        }
        if (message instanceof Pax.lib.messages.ActualTemperatureMessage) {
          actions.setActualTemperature(message.temperature);
        }
        if (message instanceof Pax.lib.messages.HeaterSetPointMessage) {
          actions.setHeaterSetPointTemperature(message.temperature);
        }
        if (message instanceof Pax.lib.messages.HeatingStateMessage) {
          actions.setHeatingState(message.heatingState);
        }
        if (message instanceof Pax.lib.messages.ColorThemeMessage) {
          actions.setColorTheme(message.theme);
        }
        if (message instanceof BatteryPercentageMessage) {
          actions.setBatteryPercentage(message.percentage);
        }
        if (message instanceof BrightnessMessage) {
          actions.setBrightness(message.brightness);
        }
        if (message instanceof HapticsMessage) {
          actions.setHaptics(message.percentage);
        }
        if (message instanceof ShellColorMessage) {
          actions.setShellColor(message.color);
        }
      })
      .catch(e => {
        if (e instanceof BaseBluetoothException) {
          // eslint-disable-next-line no-console
          console.error('messagesConsumer', String(e));
        }
      });
  }, [actions, bluetoothState]);

  useEffect(() => {
    if (
      bluetoothState.connected &&
      !bluetoothState.eventListener.isListenerAdded
    ) {
      void bluetoothState.eventListener.startListening(messagesConsumer);
    }
  }, [bluetoothState, messagesConsumer]);

  useEffect(() => {
    if (!bluetoothState.connected) {
      actions.resetPaxState();
    }
  }, [actions, bluetoothState.connected]);

  useEffect(() => {
    if (!bluetoothState.connected) {
      return;
    }

    const toPost = post(
      RequestStatusMessage.createWithMessage(STATUS_ATTRIBUTES),
      currentDevice,
    );
    void bluetoothState.writeToMainService(toPost.packet);
    // Request once per successful connection, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bluetoothState.connected, currentDevice.serial]);

  if (!bluetoothState.connected) {
    return (
      <div className="mx-3 flex flex-grow justify-center">
        <Connect connect={bluetoothState.connect} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6 self-center">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {shellInfo ? (
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border border-black/20 
              shadow-sm dark:border-white/20"
              style={{ backgroundColor: shellInfo.fillColor }}
            />
          ) : null}
          <span
            className="text-xs font-semibold uppercase tracking-wider text-neutral-500 
            dark:text-neutral-400"
          >
            {currentDevice.device}
            {shellInfo ? ` · ${shellInfo.name}` : ''}
          </span>
        </div>
        <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
          {currentDevice.serial}
        </span>
      </div>
      <TemperatureProgress
        connected={bluetoothState.connected}
        heaterSetPointTemperature={state.heaterSetPointTemperature}
        actualTemperature={state.actualTemperature}
        unit={unit}
      />
      <HeaterStatus heaterStatus={state.heatingState} />
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Temperature
          </p>
          <p className="text-sm font-medium">
            {state.heaterSetPointTemperature > 0
              ? formatTemperature(state.heaterSetPointTemperature, unit)
              : '—'}
          </p>
        </div>
        <Slider
          disabled={!bluetoothState.connected}
          min={Math.round(convertFromCelsius(DEVICE_TEMP_MIN_C, unit))}
          max={Math.round(convertFromCelsius(DEVICE_TEMP_MAX_C, unit))}
          step={1}
          value={[
            Math.round(
              convertFromCelsius(
                state.heaterSetPointTemperature || DEVICE_TEMP_MIN_C,
                unit,
              ),
            ),
          ]}
          onValueChange={value => {
            actions.setHeaterSetPointTemperature(
              clampDeviceTemperatureC(convertToCelsius(value[0], unit)),
            );
          }}
          onValueCommit={value => {
            const celsius = clampDeviceTemperatureC(
              convertToCelsius(value[0], unit),
            );
            actions.setHeaterSetPointTemperature(celsius);
            const toPost = post(
              HeaterSetPointMessage.createWithTemperature(celsius),
              currentDevice,
            );
            void bluetoothState.writeToMainService(toPost.packet);
          }}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Brightness
        </p>
        <Slider
          disabled={!bluetoothState.connected}
          max={1}
          step={0.1}
          value={state.brightness ? [state.brightness] : [0]}
          onValueChange={value => {
            actions.setBrightness(value[0]);
          }}
          onValueCommit={value => {
            const toPost = post(
              BrightnessMessage.createWithBrightness(value[0]),
              currentDevice,
            );
            void bluetoothState.writeToMainService(toPost.packet);
          }}
        />
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Vibration
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            How hard the Pax buzzes when it is ready or you take a hit
          </p>
        </div>
        <Slider
          disabled={!bluetoothState.connected}
          max={1}
          step={0.1}
          value={state.haptics ? [state.haptics] : [0]}
          onValueChange={value => {
            actions.setHaptics(value[0]);
          }}
          onValueCommit={value => {
            const toPost = post(
              HapticsMessage.createWithHaptics(value[0]),
              currentDevice,
            );
            void bluetoothState.writeToMainService(toPost.packet);
          }}
        />
      </div>
      <ThemePicker
        loading={!bluetoothState.connected}
        colorThemes={hardcodedThemes}
        selectedThemeIndex={hardcodedThemes.findIndex(theme =>
          isEqual(theme.theme, state.colorTheme),
        )}
        onClick={(selectedTheme: ColorTheme) => {
          const toPost = post(
            ColorThemeMessage.createWithTheme(selectedTheme),
            currentDevice,
          );
          bluetoothState
            .writeToMainService(toPost.packet)
            .then(() => {
              actions.setColorTheme(selectedTheme);
            })
            .catch(e => {
              if (e instanceof BaseBluetoothException) {
                // eslint-disable-next-line no-console
                console.error('ThemePicker', String(e));
              }
            });
        }}
      />
      <Button onClick={bluetoothState.disconnect} variant="secondary">
        Disconnect
      </Button>
    </div>
  );
};
