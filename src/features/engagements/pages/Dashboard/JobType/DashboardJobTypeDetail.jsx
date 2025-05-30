import {
  removeJobType,
  updateJobType,
  useFireBaseJobTypes,
} from '../../../hooks/useFireBaseJobTypes';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../../../../components/ui/Button';
import GenericInput from '../../../../../components/ui/GenericInput';
import WhiteCard from '../../../../../components/ui/WhiteCard';
import WorkIcon from '@mui/icons-material/Work';

const DashboardJobTypeDetail = () => {
  let navigate = useNavigate();
  const { jobTypeId } = useParams();
  const [jobTypes, loading, error] = useFireBaseJobTypes();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  // Filter for job type with id from url
  const jobType = jobTypes.find((job) => job.id === jobTypeId);
  if (!jobType)
    return (
      <WhiteCard>
        <h3>Job Type with id "{jobTypeId}" not found</h3>
      </WhiteCard>
    );

  return (
    <WhiteCard>
      <div className='d-f f-js f-ac col-rela-dark-red mb-2'>
        <ArrowBackIcon
          fontSize='large'
          className='mr-2 cursor-pointer'
          onClick={() => {
            navigate('/dashboard/jobTypes');
          }}
        />
        <WorkIcon fontSize='large' className='mr-2' />
        <div className='d-f f-ac '>
          <h2>{jobType.name}</h2>
        </div>
      </div>
      <GenericInput
        kind='text'
        displayName='Name'
        updateFunction={(newValue) =>
          updateJobType(jobType.id, { name: newValue })
        }
        initialValue={jobType.name}
      />
      <GenericInput
        kind='text'
        displayName='Description'
        updateFunction={(newValue) =>
          updateJobType(jobType.id, { description: newValue })
        }
        initialValue={jobType.description}
      />
      <Button
        onClick={() => {
          removeJobType(jobType.id);
          navigate('/dashboard/jobTypes');
        }}
      >
        DELETE JOB TYPE
      </Button>
    </WhiteCard>
  );
};
export default DashboardJobTypeDetail;
