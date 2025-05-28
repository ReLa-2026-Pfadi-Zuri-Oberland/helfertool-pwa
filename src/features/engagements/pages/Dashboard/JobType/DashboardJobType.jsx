import {
  addJobType,
  useFireBaseJobTypes,
} from '../../../hooks/useFireBaseJobTypes';

import Button from '../../../../../components/ui/Button';
import DashbaordTitleCard from '../../../components/DashboardTitleCard';
import DashboardDetailCard from '../../../components/DashboardDetailCard';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router';

const DashboardJobType = () => {
  let navigate = useNavigate();
  const [jobTypes, loading, error] = useFireBaseJobTypes();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  return (
    <>
      <DashbaordTitleCard
        title='Jobtypen'
        icon={<WorkIcon fontSize='large' className='mr-2' />}
      />

      {jobTypes.map((jobType, index) => (
        <DashboardDetailCard
          key={index}
          title={jobType.name}
          icon={<WorkIcon fontSize='large' className='mr-2' />}
          details={['TEMP Details']}
          onNavigate={() => {
            navigate('/dashboard/jobtype/' + jobType.id);
          }}
        />
      ))}

      <Button
        size='L'
        variant='primary'
        onClick={async () => {
          const newJobTypeId = await addJobType();
          if (newJobTypeId) {
            navigate('/dashboard/jobtype/' + newJobTypeId);
          }
        }}
      >
        NEUER JOBTYP
      </Button>
    </>
  );
};
export default DashboardJobType;
