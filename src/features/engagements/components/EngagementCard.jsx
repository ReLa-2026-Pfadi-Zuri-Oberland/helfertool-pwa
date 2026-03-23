import Button from '../../../components/ui/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EngagementGauge from './EngagementGauge';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WhiteCard from '../../../components/ui/WhiteCard';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

const EngagementCard = ({
  id,
  title,
  location,
  start,
  end,
  currentAmountOfHelpers,
  targetNumberOfHelpers,
  isRegistered,
}) => {
  let navigate = useNavigate();
  let routerLocation = useLocation();
  const localStartDate = dayjs(start).local();
  const localEndDate = dayjs(end).local();
  const startDateFormatted = localStartDate.format('DD.MM.YYYY');
  const endDateFormatted = localEndDate.format('DD.MM.YYYY');
  const date =
    startDateFormatted === endDateFormatted
      ? startDateFormatted
      : `${startDateFormatted} - ${endDateFormatted}`;
  const localStartTime = localStartDate.format('HH:mm');
  const localEndTime = localEndDate.format('HH:mm');
  return (
    <WhiteCard
      className={'mb-1 b1-s rela-border-col card-hover fade-in'}
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={() =>
        navigate('/engagements/' + id, {
          state: {
            from: routerLocation.pathname + routerLocation.search,
          },
        })
      }
    >
      <div
        className='d-f f-jb'
        style={{
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          gap: '1rem',
        }}
      >
        <div style={{ flex: 1 }}>
          <h2
            className='mt-1 mb-1'
            style={{
              background: 'linear-gradient(135deg, #6a0c00 0%, #b71c1c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h2>
          <div
            className='d-f f-ac mb-1'
            style={{
              padding: '0.5rem',
              background: 'rgba(245, 191, 190, 0.1)',
              borderRadius: '8px',
              transition: 'background 0.3s ease',
            }}
          >
            <PlaceIcon
              className='mr-1'
              style={{
                color: '#6a0c00',
                fontSize: '20px',
              }}
            />
            <h4 className='m-0'>{location}</h4>
          </div>
          <div
            className='d-f f-ac mb-1'
            style={{
              padding: '0.5rem',
              background: 'rgba(245, 191, 190, 0.1)',
              borderRadius: '8px',
            }}
          >
            <ScheduleIcon
              className='mr-1'
              style={{
                color: '#6a0c00',
                fontSize: '20px',
              }}
            />
            <h4 className='m-0'>{`${localStartTime} - ${localEndTime}`}</h4>
          </div>
          <div
            className='d-f f-ac mb-2'
            style={{
              padding: '0.5rem',
              background: 'rgba(245, 191, 190, 0.1)',
              borderRadius: '8px',
            }}
          >
            <CalendarTodayIcon
              className='mr-1'
              style={{
                color: '#6a0c00',
                fontSize: '20px',
              }}
            />
            <h4 className='m-0'>{date}</h4>
          </div>
          <Button
            size='S'
            onClick={(e) => {
              e.stopPropagation();
              navigate('/engagements/' + id, {
                state: {
                  from: routerLocation.pathname + routerLocation.search,
                },
              });
            }}
            style={{
              width: window.innerWidth < 768 ? '100%' : 'auto',
            }}
          >
            MEHR ERFAHREN
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: window.innerWidth < 768 ? '100%' : '120px',
          }}
        >
          <EngagementGauge
            currentAmountOfHelpers={parseInt(currentAmountOfHelpers)}
            targetNumberOfHelpers={parseInt(targetNumberOfHelpers)}
            isRegistered={isRegistered}
          />
        </div>
      </div>
    </WhiteCard>
  );
};
export default EngagementCard;
