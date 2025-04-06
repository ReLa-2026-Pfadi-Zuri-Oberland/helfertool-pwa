import {
  addOrganization,
  useFireBaseOrganizations,
} from '../../../firebase/useFireBaseOrganizations';

import BusinessIcon from '@mui/icons-material/Business';
import Button from '../../../components/Button/Button';
import DashbaordTitleCard from '../../../components/DashboardTitleCard';
import DashboardDetailCard from '../../../components/DashboardDetailCard';
import { useNavigate } from 'react-router';

const DashboardOrganization = () => {
  let navigate = useNavigate();
  const [organizations, loading, error] = useFireBaseOrganizations();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  return (
    <>
      <DashbaordTitleCard
        title='Organisationen'
        icon={<BusinessIcon fontSize='large' className='mr-2' />}
      />

      {organizations.map((organization, index) => (
        <DashboardDetailCard
          key={index}
          title={organization.name}
          icon={<BusinessIcon fontSize='large' className='mr-2' />}
          details={['TEMP Details']}
          onNavigate={() => {
            navigate('/dashboard/organization/' + organization.id);
          }}
        />
      ))}

      <Button
        size='L'
        variant='primary'
        onClick={async () => {
          const newOrganizationId = await addOrganization();
          if (newOrganizationId) {
            navigate('/dashboard/organization/' + newOrganizationId);
          }
        }}
      >
        NEUE ORGANISATION
      </Button>
    </>
  );
};
export default DashboardOrganization;
