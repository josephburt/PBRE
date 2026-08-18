import { TemperatureUnit, formatTemperature } from '@/utils/temperature';

import { CircularProgressBar } from './ui/progress-bar';

interface TemperatureProgressProps {
  connected: boolean;
  heaterSetPointTemperature: number;
  actualTemperature: number;
  unit: TemperatureUnit;
  minTemperature?: number;
  maxTemperature?: number;
}

const TemperatureProgress = ({
  connected,
  heaterSetPointTemperature,
  actualTemperature,
  unit,
  minTemperature = 175,
  maxTemperature = 215,
}: TemperatureProgressProps) => {
  const buildDefaultProgress = () => {
    return (
      <div className="animate-pulse">
        <CircularProgressBar percentage={0} />
      </div>
    );
  };

  const m = (1 - 0.01) / (maxTemperature - minTemperature);
  const percentage = m * (actualTemperature - minTemperature) + 0.01;

  if (!connected) {
    return buildDefaultProgress();
  }

  if (heaterSetPointTemperature === 0 && actualTemperature === 0) {
    return buildDefaultProgress();
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <CircularProgressBar
        percentage={percentage}
        label={formatTemperature(actualTemperature, unit)}
      />
      {heaterSetPointTemperature > 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Set {formatTemperature(heaterSetPointTemperature, unit)}
        </p>
      ) : null}
    </div>
  );
};

export default TemperatureProgress;
