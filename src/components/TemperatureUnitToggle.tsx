import { useTemperatureUnit } from '@/hooks/useTemperatureUnit';

import { Button } from './ui/button';

const TemperatureUnitToggle = () => {
  const { unit, toggleUnit } = useTemperatureUnit();

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={toggleUnit}
      aria-label={`Switch temperature unit. Currently Celsius display is ${
        unit === 'C' ? 'on' : 'off'
      }`}
      title={
        unit === 'C' ? 'Showing °C. Click for °F' : 'Showing °F. Click for °C'
      }
    >
      °{unit}
    </Button>
  );
};

export default TemperatureUnitToggle;
