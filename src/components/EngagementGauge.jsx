import { Gauge, gaugeClasses } from '@mui/x-charts';

const EngagementGauge = ({
  currentAmountOfHelpers,
  targetNumberOfHelpers,
  isRegistered,
}) => {
  return (
    <div>
      <Gauge
        value={parseInt(currentAmountOfHelpers)}
        valueMax={parseInt(targetNumberOfHelpers)}
        height={150}
        width={150}
        sx={() => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: '1rem',
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: '#6A0C00',
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: '#FDE8E7',
          },
        })}
        text={({ value, valueMax }) =>
          valueMax - value <= 0
            ? 'Keine Plätze \n mehr frei'
            : `NOCH ${valueMax - value} \n GESUCHT`
        }
      />

      {isRegistered && (
        <h5 className='m-0 text-align-center col-rela-dark-red'>
          Du hast dich bereits für <br></br> diesen Einsatz registriert
        </h5>
      )}
    </div>
  );
};

export default EngagementGauge;
