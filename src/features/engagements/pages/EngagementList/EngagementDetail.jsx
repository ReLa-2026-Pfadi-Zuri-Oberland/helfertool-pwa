import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  registerForEngagement,
  useFireBaseEngagements,
} from '../../hooks/useFireBaseEngagements';
import { useContext, useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../../../components/ui/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DayCard from '../../components/DayCard';
import { Dialog } from '@mui/material';
import EngagementGauge from '../../components/EngagementGauge';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SubjectIcon from '@mui/icons-material/Subject';
import { UserContext } from '../../../../stores/UserContext';
import WhiteCard from '../../../../components/ui/WhiteCard';
import dayjs from 'dayjs';
import { useFireBaseJobTypes } from '../../hooks/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../hooks/useFireBaseLocations';
import { useFireBaseShifts } from '../../hooks/useFireBaseShifts';

const EngagementDetail = () => {
  let navigate = useNavigate();
  let engagementId = useParams().id;
  const { currentUser } = useContext(UserContext);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <div className={`d-f f-jc fd-c`}>
      <DayCard
        day={dayjs(
          shifts.find((shift) => shift.id === engagement.shift)?.startDate
        ).format('DD-MM-YYYY')}
      />
      <WhiteCard className={'mb-3 b1-s rela-border-col'}>
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
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <div style={{ padding: 24 }}>
            <h3>Möchtest du dich definitiv für diesen Einsatz anmelden?</h3>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 16,
                marginTop: 24,
              }}
            >
              <Button onClick={() => setDialogOpen(false)}>Nein</Button>
              <Button
                onClick={() => {
                  registerForEngagement(engagementId);
                  setDialogOpen(false);
                }}
              >
                Ja
              </Button>
            </div>
          </div>
        </Dialog>
        {currentUser && (
          <>
            <Button
              onClick={() => setDialogOpen(true)}
              disabled={engagement.isRegistered}
            >
              ANMELDEN
            </Button>
            {engagement.isRegistered && (
              <div className='d-f f-js f-ac mt-1'>
                <h5 className='m-0 col-rela-dark-red'>
                  Du hast dich bereits für diesen Einsatz registriert. Die
                  zuständige Ressortleitung wird sich kurz vor dem Lager mit den
                  Details bei dir melden.<br></br>
                  Falls du nicht mehr teilnehmen kannst, melde dich bitte unter
                  info@rela26.ch.
                </h5>
              </div>
            )}
          </>
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
