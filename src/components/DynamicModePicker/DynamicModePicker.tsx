import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DynamicModes } from '@/pax/shared/enums';
import { ALL_DYNAMIC_MODES, getDynamicModeInfo } from '@/utils/dynamicMode';
import { Flame, Gauge, Info, Moon, Sparkles, Zap } from 'lucide-react';
import React, { useState } from 'react';

export interface DynamicModePickerProps {
  currentMode?: DynamicModes;
  disabled?: boolean;
  onSelectMode: (mode: DynamicModes) => void;
}

const MODE_ICONS: Record<
  DynamicModes,
  React.ComponentType<{ className?: string }>
> = {
  [DynamicModes.STANDARD]: Flame,
  [DynamicModes.BOOST]: Zap,
  [DynamicModes.EFFICIENCY]: Gauge,
  [DynamicModes.STEALTH]: Moon,
  [DynamicModes.FLAVOR]: Sparkles,
};

export const DynamicModePicker = ({
  currentMode = DynamicModes.STANDARD,
  disabled = false,
  onSelectMode,
}: DynamicModePickerProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const activeInfo = getDynamicModeInfo(currentMode);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Heating Profile
          </p>
          <button
            type="button"
            onClick={() => setShowInfo(prev => !prev)}
            className="text-neutral-400 transition-colors hover:text-neutral-600 
            dark:text-neutral-500 dark:hover:text-neutral-300"
            title="Profile details"
            aria-label="Toggle profile descriptions"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
        {activeInfo && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${activeInfo.badgeBg} 
            ${activeInfo.badgeText}`}
          >
            {activeInfo.name}
          </span>
        )}
      </div>

      {/* Mode Grid */}
      <div className="grid grid-cols-5 gap-1.5">
        {ALL_DYNAMIC_MODES.map(item => {
          const Icon = MODE_ICONS[item.mode];
          const isSelected = currentMode === item.mode;

          return (
            <Button
              key={item.mode}
              variant={isSelected ? 'default' : 'outline'}
              size="sm"
              disabled={disabled}
              onClick={() => onSelectMode(item.mode)}
              className={`flex h-16 flex-col items-center justify-center gap-1 p-1 text-center 
              transition-all ${
                isSelected
                  ? 'shadow-sm ring-2 ring-primary ring-offset-1 dark:ring-offset-neutral-900'
                  : 'opacity-80 hover:bg-neutral-100 hover:opacity-100 dark:hover:bg-neutral-800/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="line-clamp-1 text-[10px] font-medium leading-tight">
                {item.name}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Active profile description or expandable guide */}
      {activeInfo && (
        <Card
          className="border-neutral-200/80 bg-neutral-50/50 p-2.5 text-xs 
        dark:border-neutral-800 dark:bg-neutral-900/50"
        >
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            {activeInfo.name}:{' '}
            <span className="font-normal text-neutral-600 dark:text-neutral-400">
              {activeInfo.tagline}
            </span>
          </p>
          {showInfo && (
            <p
              className="mt-1 border-t border-neutral-200/60 pt-1.5 text-[11px] 
            leading-relaxed text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
            >
              {activeInfo.description}
            </p>
          )}
        </Card>
      )}
    </div>
  );
};
