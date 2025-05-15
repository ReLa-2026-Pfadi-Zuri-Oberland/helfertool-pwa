import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  registerForEngagement,
  useFireBaseEngagements,
} from '../../firebase/useFireBaseEngagements';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../components/Button/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DayCard from '../../components/DayCard';
import EngagementGauge from '../../components/EngagementGauge';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SubjectIcon from '@mui/icons-material/Subject';
import { UserContext } from '../../context/UserContext';
import WhiteCard from '../../components/WhiteCard';
import dayjs from 'dayjs';
import { isMobile } from '../../helpers/isMobile';
import { useContext } from 'react';
import { useFireBaseJobTypes } from '../../firebase/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../firebase/useFireBaseLocations';
import { useFireBaseShifts } from '../../firebase/useFireBaseShifts';

const EngagementDetail = () => {
  let navigate = useNavigate();
  let engagementId = useParams().id;
  const { currentUser } = useContext(UserContext);

  const [engagements, loading, error] = useFireBaseEngagements();
  const [shifts, shiftsLoading, shiftsError] = useFireBaseShifts();
  const [locations, locationsLoading, locationsError] = useFireBaseLocations();
  const [jobTypes, jobTypesLoading, jobTypesError] = useFireBaseJobTypes();
  if (loading || shiftsLoading || locationsLoading || jobTypesLoading)
    return <h3>Loading...</h3>;
  if (error || shiftsError || locationsError || jobTypesError)
    return <h3>Error: {error.message}</h3>;

  const engagement = engagements.find((eng) => eng.id === engagementId);

  if (!engagement)
    return (
      <div>
        <h3>Einsatz with id "{engagementId}" nicht gefunden</h3>
      </div>
    );

  const title = jobTypes.find((j) => j.id === engagement.jobType)?.name;
  const location = locations.find((l) => l.id === engagement.location)?.name;
  const locationDescription = locations.find(
    (l) => l.id === engagement.location
  )?.description;
  const date = shifts.find((s) => s.id === engagement.shift)?.startDate;
  const startDate = shifts.find((s) => s.id === engagement.shift)?.startDate;
  const endDate = shifts.find((s) => s.id === engagement.shift)?.endDate;
  const weekDaysGerman = [
    'Sonntag',
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
  ];
  const jobTypeDescription = jobTypes.find(
    (j) => j.id === engagement.jobType
  )?.description;

  return (
    <div className={`d-f f-jc`}>
      <DayCard
        day={dayjs(
          shifts.find((shift) => shift.id === engagement.shift)?.startDate
        ).format('DD-MM-YYYY')}
      />
      <WhiteCard className={'mb-3'}>
        <div className='d-f f-js f-ac col-rela-dark-red mb-2'>
          <ArrowBackIcon
            fontSize='medium'
            className='mr-1 cursor-pointer'
            onClick={() => {
              navigate('/' + engagement.organization + '/anmelden');
            }}
          />
          <h2 className='m-0'>{title}</h2>
        </div>

        <div className='d-f f-jb'>
          <div className=''>
            <div className='d-f f-ac mb-1'>
              <CalendarTodayIcon className='mr-2' />
              <h4 className='m-0'>Tag</h4>
            </div>
            <div className='mb-2'>
              {`${weekDaysGerman[dayjs(date).day()]}, ${dayjs(date).format(
                'DD.MM.YYYY'
              )}`}
            </div>
            <div className='d-f f-ac mb-1'>
              <ScheduleIcon className='mr-2' />
              <h4 className='m-0'>Uhrzeit</h4>
            </div>
            <div className='mb-2'>{`${dayjs(startDate, 'HH:mm').format(
              'HH:mm'
            )} - ${dayjs(endDate, 'HH:mm').format('HH:mm')}`}</div>
            <div className='d-f f-ac mb-1'>
              <PlaceIcon className='mr-2' />
              <h4 className='m-0'>Ort</h4>
            </div>
            <div className='mb-1'>{location}</div>
            <div className='mb-1'>{locationDescription}</div>
            <div className='mb-2'>
              Link: &nbsp;
              <Link
                to={`http://maps.google.com/?q=${locationDescription
                  .split(' ')
                  .join('+')}`}
                target='_blank'
              >
                Google Maps
              </Link>
            </div>
          </div>
          <EngagementGauge
            currentAmountOfHelpers={parseInt(engagement.helpers.length)}
            targetNumberOfHelpers={parseInt(engagement.targetNumberOfHelpers)}
            isRegistered={engagement.isRegistered}
          />
        </div>
        <div className='d-f f-ac mb-1'>
          <SubjectIcon className='mr-2' />
          <h4 className='m-0'>Beschreibung</h4>
        </div>
        <div className='mb-4'>{jobTypeDescription}</div>
        {currentUser && (
          <Button
            onClick={() => registerForEngagement(engagementId)}
            disabled={engagement.isRegistered}
          >
            ANMELDEN
          </Button>
        )}
        {!currentUser && (
          <Button
            onClick={() => navigate('/login')}
            disabled={engagement.isRegistered}
          >
            LOGIN TO REGISTER
          </Button>
        )}
      </WhiteCard>
    </div>
  );
};
export default EngagementDetail;
