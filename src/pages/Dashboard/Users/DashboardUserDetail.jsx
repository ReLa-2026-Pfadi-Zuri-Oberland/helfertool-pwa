import {
  removeUser,
  updateUser,
  useFireBaseUsers,
} from '../../../firebase/useFireBaseUsers';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../../components/Button/Button';
import GenericInput from '../../../components/GenericInput';
import PersonIcon from '@mui/icons-material/Person';
import WhiteCard from '../../../components/WhiteCard';

const DashboardUserDetail = () => {
  let navigate = useNavigate();
  const { userId } = useParams();
  const [users, loading, error] = useFireBaseUsers();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;

  // Filter for user with id from URL
  const user = users.find((usr) => usr.id === userId);

  if (!user)
    return (
      <WhiteCard>
        <h3>User with id "{userId}" not found</h3>
      </WhiteCard>
    );

  return (
    <WhiteCard>
      <div className='d-f f-js f-ac col-rela-dark-red mb-2'>
        <ArrowBackIcon
          fontSize='large'
          className='mr-2 cursor-pointer'
          onClick={() => {
            navigate('/dashboard/users');
          }}
        />
        <PersonIcon fontSize='large' className='mr-2' />
        <div className='d-f f-ac '>
          <h2>{user.name}</h2>
        </div>
      </div>
      <GenericInput
        kind='text'
        displayName='Name'
        updateFunction={(newValue) => updateUser(user.id, { name: newValue })}
        initialValue={user.name}
      />
      <GenericInput
        kind='email'
        readOnly={true}
        displayName='Email'
        updateFunction={(newValue) => updateUser(user.id, { email: newValue })}
        initialValue={user.email}
      />
      <GenericInput
        kind='phone'
        displayName='Telefon'
        updateFunction={(newValue) =>
          updateUser(user.id, { contactPhone: newValue })
        }
        initialValue={user.contactPhone}
      />
      <GenericInput
        kind='text'
        displayName='Strasse'
        updateFunction={(newValue) => updateUser(user.id, { street: newValue })}
        initialValue={user.street}
      />
      <GenericInput
        kind='text'
        displayName='Stadt'
        updateFunction={(newValue) => updateUser(user.id, { city: newValue })}
        initialValue={user.city}
      />
      <GenericInput
        kind='select'
        displayName='T-Shirt Grösse'
        updateFunction={(newValue) =>
          updateUser(user.id, { tShirtSize: newValue })
        }
        initialValue={user.tShirtSize}
        data={[
          { value: 'XS', label: 'XS' },
          { value: 'S', label: 'S' },
          { value: 'M', label: 'M' },
          { value: 'L', label: 'L' },
          { value: 'XL', label: 'XL' },
        ]}
      />
      <Button
        onClick={() => {
          removeUser(user.id);
          navigate('/dashboard/users');
        }}
      >
        ENTFERNE BENUTZER
      </Button>
    </WhiteCard>
  );
};

export default DashboardUserDetail;
