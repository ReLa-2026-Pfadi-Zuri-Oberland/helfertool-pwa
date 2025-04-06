import {
  removeEngagement,
  updateEngagement,
  useFireBaseEngagements,
} from '../../../firebase/useFireBaseEngagements';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../../components/Button/Button';
import EventIcon from '@mui/icons-material/Event';
import GenericInput from '../../../components/GenericInput';
import WhiteCard from '../../../components/WhiteCard';
import { useFireBaseJobTypes } from '../../../firebase/useFireBaseJobTypes';
import { useFireBaseLocations } from '../../../firebase/useFireBaseLocations';
import { useFireBaseShifts } from '../../../firebase/useFireBaseShifts';
import { useNavigate } from 'react-router-dom';

const DashboardEngagementDetail = () => {
  let navigate = useNavigate();
  const [engagements, loading, error] = useFireBaseEngagements();
  const [jobTypes, jobTypesLoading, jobTypesError] = useFireBaseJobTypes();
  const [locations, locationsLoading, locationsError] = useFireBaseLocations();
  const [shifts, shiftsLoading, shiftsError] = useFireBaseShifts();
  if (loading || jobTypesLoading || locationsLoading || shiftsLoading)
    return <h3>Loading...</h3>;
  if (error || jobTypesError || locationsError || shiftsError)
    return <h3>Error: {error.message}</h3>;
  // Filter for engagement with id from url
  const engagementId = window.location.pathname.split('/').pop();
  const engagement = engagements.find((eng) => eng.id === engagementId);
  if (!engagement)
    return (
      <WhiteCard>
        <h3>Engagement with id "{engagementId}" not found</h3>
      </WhiteCard>
    );

  if (engagement.jobType) {
    engagement.jobTypeData = jobTypes.find(
      (jobType) => jobType.id === engagement.jobType
    );
  }

  if (engagement.location) {
    engagement.locationData = locations.find(
      (location) => location.id === engagement.location
    );
  }

  if (engagement.shift) {
    engagement.shiftData = shifts.find(
      (shift) => shift.id === engagement.shift
    );
  }
  console.log(engagement);

  return (
    <WhiteCard>
      <div className='d-f f-js f-ac col-rela-dark-red mb-2'>
        <ArrowBackIcon
          fontSize='large'
          className='mr-2 cursor-pointer'
          onClick={() => {
            navigate('/dashboard/engagements');
          }}
        />
        <EventIcon fontSize='large' className='mr-2' />
        <div className='d-f f-ac '>
          <h2>Einsatz</h2>
        </div>
      </div>
      <GenericInput
        kind='select'
        displayName='Job Type'
        updateFunction={(newValue) =>
          updateEngagement(engagement.id, { jobType: newValue })
        }
        data={jobTypes.map((jobType) => ({
          value: jobType.id,
          label: jobType.name,
        }))}
        initialValue={engagement.jobTypeData?.id || ''}
      />
      <GenericInput
        kind='select'
        displayName='Location'
        updateFunction={(newValue) =>
          updateEngagement(engagement.id, { location: newValue })
        }
        data={locations.map((jobType) => ({
          value: jobType.id,
          label: jobType.name,
        }))}
        initialValue={engagement.locationData?.id || ''}
      />
      <GenericInput
        kind='select'
        displayName='Shift'
        updateFunction={(newValue) =>
          updateEngagement(engagement.id, { shift: newValue })
        }
        data={shifts.map((shift) => ({
          value: shift.id,
          label: shift.name,
        }))}
        initialValue={engagement.shiftData?.id || ''}
      />
      <GenericInput
        kind='text'
        displayName='Ziel Helfer für diesen Einsatz'
        updateFunction={(newValue) =>
          updateEngagement(engagement.id, { targetNumberOfHelpers: newValue })
        }
        initialValue={engagement.targetNumberOfHelpers}
      />
      <Button
        onClick={() => {
          removeEngagement(engagement.id);
          navigate('/dashboard/engagements');
        }}
      >
        DELETE ENGAGEMENT
      </Button>
    </WhiteCard>
  );
};
export default DashboardEngagementDetail;
