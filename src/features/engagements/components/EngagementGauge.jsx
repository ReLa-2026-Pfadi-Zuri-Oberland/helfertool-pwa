import { Gauge, gaugeClasses } from '@mui/x-charts';
import { isMobile } from '../../../utils/isMobile';

const EngagementGauge = ({
  currentAmountOfHelpers,
  targetNumberOfHelpers,
  isRegistered,
}) => {
  const mobile = isMobile();
  const current = parseInt(currentAmountOfHelpers);
  const target = parseInt(targetNumberOfHelpers);
  const remaining = target - current;
  const percentage = target > 0 ? (current / target) * 100 : 0;

  // Mobile: Horizontal bar chart
  if (mobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '8px',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#FDE8E7',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: '#6A0C00',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        <div
          style={{
            textAlign: 'center',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#6A0C00',
            letterSpacing: '0.5px',
          }}
        >
          {remaining <= 0 ? (
            <>Keine Plätze mehr frei</>
          ) : (
            <>NOCH {remaining} GESUCHT</>
          )}
        </div>

        {isRegistered && (
          <h5 className='m-0 text-align-center col-rela-dark-red'>
            Du hast dich bereits für <br></br> diesen Einsatz registriert
          </h5>
        )}
      </div>
    );
  }

  // Desktop: Circular gauge
  return (
    <div>
      <Gauge
        value={current}
        valueMax={target}
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
