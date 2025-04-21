import { updateUser, useFireBaseUsers } from '../../firebase/useFireBaseUsers';

import Button from '../../components/Button/Button';
import GenericInput from '../../components/GenericInput';
import WhiteCard from '../../components/WhiteCard';
import { auth } from '../../firebase/firebase';
import littlePirate from './assets/little-pirate.png';
import { signOut } from 'firebase/auth';
import { usePWAInstall } from 'react-use-pwa-install';

const UserProfile = () => {
  const [users, loading, error] = useFireBaseUsers();
  const install = usePWAInstall();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;

  const userId = auth.currentUser?.uid;
  const user = users.find((user) => user.id === userId);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user)
    return (
      <WhiteCard>
        <h3>User with id "{userId}" not found</h3>
      </WhiteCard>
    );

  return (
    <>
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
            updateFunction={(newValue) =>
              updateUser(user.id, { name: newValue })
            }
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
            updateFunction={(newValue) =>
              updateUser(user.id, { city: newValue })
            }
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
        </WhiteCard>
        <div className='d-f'>
          {install && (
            <Button className='mr-2' onClick={install}>
              INSTALL APP
            </Button>
          )}
          <Button variant='secondary' onClick={handleLogout}>
            LOGOUT
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
