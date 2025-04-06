import {
  addEngagement,
  useFireBaseEngagements,
} from '../../../firebase/useFireBaseEngagements';

import Button from '../../../components/Button/Button';
import DashbaordTitleCard from '../../../components/DashboardTitleCard';
import DashboardDetailCard from '../../../components/DashboardDetailCard';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router';

const DashboardEngagements = () => {
  let navigate = useNavigate();
  const [engagements, loading, error] = useFireBaseEngagements();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  return (
    <>
      <DashbaordTitleCard
        title='Einsätze'
        icon={<EventIcon fontSize='large' className='mr-2' />}
      />

      {engagements.map((engagement, index) => (
        <DashboardDetailCard
          key={index}
          title={'Einsatz ' + (index + 1)}
          icon={<EventIcon fontSize='large' className='mr-2' />}
          details={['TEMP Details']}
          onNavigate={() => {
            navigate('/dashboard/engagement/' + engagement.id);
          }}
        />
      ))}

      <Button
        size='L'
        variant='primary'
        onClick={async () => {
          const newEngagementId = await addEngagement();
          if (newEngagementId) {
            navigate('/dashboard/engagement/' + newEngagementId);
          }
        }}
      >
        NEUES ENGAGEMENT
      </Button>
    </>
  );
};
export default DashboardEngagements;
