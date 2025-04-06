import {
  addLocation,
  useFireBaseLocations,
} from '../../../firebase/useFireBaseLocations';

import Button from '../../../components/Button/Button';
import DashbaordTitleCard from '../../../components/DashboardTitleCard';
import DashboardDetailCard from '../../../components/DashboardDetailCard';
import PlaceIcon from '@mui/icons-material/Place';
import { useNavigate } from 'react-router';

const DashboardLocation = () => {
  let navigate = useNavigate();
  const [locations, loading, error] = useFireBaseLocations();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  return (
    <>
      <DashbaordTitleCard
        title='Standorte'
        icon={<PlaceIcon fontSize='large' className='mr-2' />}
      />

      {locations.map((location, index) => (
        <DashboardDetailCard
          key={index}
          title={location.name}
          icon={<PlaceIcon fontSize='large' className='mr-2' />}
          details={['TEMP Details']}
          onNavigate={() => {
            navigate('/dashboard/location/' + location.id);
          }}
        />
      ))}

      <Button
        size='L'
        variant='primary'
        onClick={async () => {
          const newLocationId = await addLocation();
          if (newLocationId) {
            navigate('/dashboard/location/' + newLocationId);
          }
        }}
      >
        NEUER STANDORT
      </Button>
    </>
  );
};
export default DashboardLocation;
