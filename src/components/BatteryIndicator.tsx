import { usePaxContext } from '@/state/hooks';
import {
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  Unplug,
} from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export function BatteryIndicator() {
  const { state } = usePaxContext();
  const percentage = state.batteryPercentage;
  const hasReading = percentage !== undefined;
  const tooltipContent = hasReading
    ? `${Math.round(percentage)}%`
    : 'No reading';

  const getIcon = () => {
    if (!hasReading) {
      return <Unplug />;
    }
    if (percentage < 25) {
      return <Battery />;
    }
    if (percentage < 50) {
      return <BatteryLow />;
    }
    if (percentage < 75) {
      return <BatteryMedium />;
    }
    return <BatteryFull />;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5">
          {getIcon()}
          <span className="min-w-[2.5ch] text-sm font-medium tabular-nums">
            {hasReading ? `${Math.round(percentage)}%` : '—'}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  );
}
