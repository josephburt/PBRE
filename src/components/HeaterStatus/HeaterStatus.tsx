import { Pax } from '@/pax';

import { heatingStateLabel } from './heatingStateLabel';

interface HeaterStatusProps {
  heaterStatus?: Pax.lib.HeatingStates;
}

const HeaterStatus = ({ heaterStatus }: HeaterStatusProps) => {
  return (
    <div className="text-center text-lg font-medium tracking-tight">
      {heatingStateLabel(heaterStatus)}
    </div>
  );
};

export default HeaterStatus;
