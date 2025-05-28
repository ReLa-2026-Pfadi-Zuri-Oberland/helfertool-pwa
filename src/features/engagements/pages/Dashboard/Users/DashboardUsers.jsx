import {
  addUser,
  useFireBaseUsers,
} from '../../../../../hooks/useFireBaseUsers';

import Button from '../../../../../components/ui/Button';
import DashbaordTitleCard from '../../../components/DashboardTitleCard';
import DashboardDetailCard from '../../../components/DashboardDetailCard';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';

const DashboardUsers = () => {
  let navigate = useNavigate();
  const [users, loading, error] = useFireBaseUsers();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  return (
    <>
      <DashbaordTitleCard
        title='Benutzer'
        icon={<PersonIcon fontSize='large' className='mr-2' />}
      />

      {users.map((user, index) => (
        <DashboardDetailCard
          key={index}
          title={user.name}
          icon={<PersonIcon fontSize='large' className='mr-2' />}
          details={['TEMP Details']}
          onNavigate={() => {
            navigate('/dashboard/user/' + user.id);
          }}
        />
      ))}

      <Button
        size='L'
        disabled
        variant='primary'
        onClick={async () => {
          const newUserId = await addUser();
          if (newUserId) {
            navigate('/dashboard/user/' + newUserId);
          }
        }}
      >
        NEUE BENUTZER KÖNNEN SICH NUR SELBST REGISTRIEREN
      </Button>
    </>
  );
};
export default DashboardUsers;
