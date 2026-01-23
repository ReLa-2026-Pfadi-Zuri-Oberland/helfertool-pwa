import { useFireBaseEngagements } from '../../engagements/hooks/useFireBaseEngagements';
import { useFireBaseShifts } from '../../engagements/hooks/useFireBaseShifts';
import { useFireBaseJobTypes } from '../../engagements/hooks/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../engagements/hooks/useFireBaseLocations';
import WhiteCard from '../../../components/ui/WhiteCard';
import { auth } from '../../../lib/firebase';
import dayjs from '../../../utils/dayjs';
import { useNavigate } from 'react-router-dom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';

const MyUpcomingEngagements = () => {
  const navigate = useNavigate();
  const [engagements, engagementsLoading, engagementsError] =
    useFireBaseEngagements();
  const [shifts, shiftsLoading, shiftsError] = useFireBaseShifts();
  const [jobTypes, jobTypesLoading, jobTypesError] = useFireBaseJobTypes();
  const [locations, locationsLoading, locationsError] = useFireBaseLocations();

  const loading =
    engagementsLoading || shiftsLoading || jobTypesLoading || locationsLoading;
  const error =
    engagementsError || shiftsError || jobTypesError || locationsError;

  if (loading)
    return (
      <WhiteCard className={'mb-2'}>
        <h3>Lade Einsätze...</h3>
      </WhiteCard>
    );
  if (error)
    return (
      <WhiteCard className={'mb-2'}>
        <h3>Fehler: {error.message}</h3>
      </WhiteCard>
    );

  const userId = auth.currentUser?.uid;

  // Filter engagements where user is registered
  const myEngagements = engagements.filter((engagement) =>
    engagement.helpers.includes(userId),
  );

  // Get current time
  const now = dayjs();

  // Filter and enrich upcoming engagements
  const upcomingEngagements = myEngagements
    .map((engagement) => {
      const shift = shifts.find((s) => s.id === engagement.shift);
      const jobType = jobTypes.find((jt) => jt.id === engagement.jobType);
      const location = locations.find((l) => l.id === engagement.location);

      if (!shift) return null;

      return {
        id: engagement.id,
        title: jobType?.name || 'Unbekannter Job',
        location: location?.name || 'Unbekannter Ort',
        start: shift.startDate,
        end: shift.endDate,
      };
    })
    .filter((engagement) => engagement !== null)
    .filter((engagement) => dayjs(engagement.start).isAfter(now))
    .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
    .slice(0, 3); // Only show next 3 engagements

  if (upcomingEngagements.length === 0) {
    return (
      <WhiteCard className={'mb-2'}>
        <h3 className='mt-1 mb-1'>Meine nächsten Einsätze</h3>
        <p className='m-0'>Du hast keine anstehenden Einsätze.</p>
      </WhiteCard>
    );
  }

  return (
    <WhiteCard className={'mb-2'}>
      <h3 className='mt-1 mb-2'>Meine nächsten Einsätze</h3>
      {upcomingEngagements.map((engagement, index) => {
        const date = dayjs(engagement.start).local().format('DD.MM.YYYY');
        const localStartTime = dayjs(engagement.start).local().format('HH:mm');
        const localEndTime = dayjs(engagement.end).local().format('HH:mm');

        return (
          <div
            key={engagement.id}
            className='cursor-pointer'
            onClick={() => navigate('/0/anmelden/' + engagement.id)}
            style={{
              padding: '12px',
              marginBottom:
                index < upcomingEngagements.length - 1 ? '8px' : '0',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = '#f5f5f5')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
          >
            <h4 className='mt-0 mb-1'>{engagement.title}</h4>
            <div className='d-f f-ac mb-05' style={{ fontSize: '14px' }}>
              <CalendarTodayIcon
                style={{ fontSize: '16px', marginRight: '8px' }}
              />
              <span>{date}</span>
            </div>
            <div className='d-f f-ac mb-05' style={{ fontSize: '14px' }}>
              <ScheduleIcon style={{ fontSize: '16px', marginRight: '8px' }} />
              <span>{`${localStartTime} - ${localEndTime}`}</span>
            </div>
            <div className='d-f f-ac' style={{ fontSize: '14px' }}>
              <PlaceIcon style={{ fontSize: '16px', marginRight: '8px' }} />
              <span>{engagement.location}</span>
            </div>
          </div>
        );
      })}
    </WhiteCard>
  );
};

export default MyUpcomingEngagements;

// Made with Bob
