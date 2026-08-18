import { TemperatureUnit } from '@/utils/temperature';
import { useLocalStorage } from '@uidotdev/usehooks';

const STORAGE_KEY = 'pbre-temp-unit';

export const useTemperatureUnit = () => {
  const [unit, setUnit] = useLocalStorage<TemperatureUnit>(STORAGE_KEY, 'C');

  const toggleUnit = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  return { unit, setUnit, toggleUnit };
};
