import { Logout, Menu, Smartphone } from '@mui/icons-material';
import {
  updateUser,
  useFireBaseUsers,
} from '../../../../hooks/useFireBaseUsers';

import Button from '../../../../components/ui/Button';
import GenericInput from '../../../../components/ui/GenericInput';
import { Grid } from '@mui/material';
import WhiteCard from '../../../../components/ui/WhiteCard';
import { auth } from '../../../../lib/firebase';
import littlePirate from '../../assets/little-pirate.png';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { usePWAInstall } from 'react-use-pwa-install';

const UserProfile = () => {
  const [users, loading, error] = useFireBaseUsers();
  const install = usePWAInstall();
  const navigate = useNavigate();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;

  const userId = auth.currentUser?.uid;
  const user = users.find((user) => user.id === userId);

  const handleLogout = async () => {
    await signOut(auth);
  };

  console.log('user', user, users);
  if (!user)
    return (
      <WhiteCard>
        <h3>User with id "{userId}" not found</h3>
        <Button variant='secondary' onClick={handleLogout}>
          LOGOUT
        </Button>
      </WhiteCard>
    );

  return (
    <div>
      <img
        src={littlePirate}
        alt='little pirate'
        className='ml-3'
        style={{ marginBottom: '-10px' }}
      />
      <WhiteCard className={'mb-2'}>
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
          updateFunction={(newValue) =>
            updateUser(user.id, { email: newValue })
          }
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
          updateFunction={(newValue) =>
            updateUser(user.id, { street: newValue })
          }
          initialValue={user.street}
        />
        <GenericInput
          kind='text'
          displayName='Stadt'
          updateFunction={(newValue) => updateUser(user.id, { city: newValue })}
          initialValue={user.city}
        />
        <GenericInput
          className={'m-0'}
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
      </WhiteCard>
      <Grid container columns={16} spacing={2}>
        <Grid item size={{ xs: 8, sm: 8, md: 4, lg: 4 }}>
          <Button
            icon={<Menu />}
            className={'w100p'}
            variant='primary'
            onClick={() => navigate('/0/anmelden')}
          >
            HELFENDENEINSATZ
          </Button>
        </Grid>
        {install && (
          <Grid item size={{ xs: 8, sm: 8, md: 4, lg: 4 }}>
            <Button icon={<Smartphone />} className={'w100p'} onClick={install}>
              INSTALL APP
            </Button>
          </Grid>
        )}
        <Grid
          item
          size={{ xs: 16, sm: 16, md: 4, lg: 4 }}
          offset={{ md: 4, lg: 4 }}
        >
          <Button
            icon={<Logout />}
            className={'w100p'}
            variant='secondary'
            onClick={handleLogout}
          >
            LOGOUT
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserProfile;
