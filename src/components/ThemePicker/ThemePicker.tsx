import { ColorTheme } from '@/pax/shared/types/colorTheme';

import { ThemeCircle } from './ThemeCircle';
import { PaxLightTheme } from './colors';

export interface IThemePickerProps {
  colorThemes?: PaxLightTheme[];
  selectedThemeIndex?: number;
  onClick?: (selectedTheme: ColorTheme) => void;
  loading?: boolean;
}

export function ThemePicker(props: IThemePickerProps) {
  if (props.loading ?? !props.colorThemes) {
    return (
      <div className="flex w-full animate-pulse flex-row justify-center gap-4">
        <div className="flex flex-col items-center gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ThemeCircle className="bg-neutral-200 hover:cursor-default dark:bg-neutral-800" />
          <div className="h-4 w-12 rounded bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row flex-wrap justify-center gap-4">
      {props.colorThemes.map((theme, index) => {
        return (
          <div key={index} className="flex flex-col items-center gap-1">
            <ThemeCircle
              style={{
                backgroundImage: `linear-gradient(to bottom, 
                    rgb(${theme.theme.regulating.color1.red}, 
                        ${theme.theme.regulating.color1.green}, 
                        ${theme.theme.regulating.color1.blue}), 
                    rgb(${theme.theme.regulating.color2.red}, 
                        ${theme.theme.regulating.color2.green}, 
                        ${theme.theme.regulating.color2.blue}))`,
              }}
              selected={index === props.selectedThemeIndex}
              onClick={() => props.onClick?.(theme.theme)}
            />
            <p className="text-center text-sm">{theme.name}</p>
          </div>
        );
      })}
    </div>
  );
}
