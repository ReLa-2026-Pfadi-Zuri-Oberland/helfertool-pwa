import {
  removeLocation,
  updateLocation,
  useFireBaseLocations,
} from '../../../hooks/useFireBaseLocations';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../../../../components/ui/Button';
import DomainIcon from '@mui/icons-material/Domain';
import GenericInput from '../../../components/GenericInput';
import WhiteCard from '../../../../../components/ui/WhiteCard';

const DashboardLocationDetail = () => {
  let navigate = useNavigate();
  const { locationId } = useParams();
  const [locations, loading, error] = useFireBaseLocations();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;

  // Filter for location with id from URL
  const location = locations.find((loc) => loc.id === locationId);

  if (!location)
    return (
      <WhiteCard>
        <h3>Location with id "{locationId}" not found</h3>
      </WhiteCard>
    );

  return (
    <WhiteCard>
      <div className='d-f f-js f-ac col-rela-dark-red mb-2'>
        <ArrowBackIcon
          fontSize='large'
          className='mr-2 cursor-pointer'
          onClick={() => {
            navigate('/dashboard/locations');
          }}
        />
        <DomainIcon fontSize='large' className='mr-2' />
        <div className='d-f f-ac '>
          <h2>{location.name}</h2>
        </div>
      </div>
      <GenericInput
        kind='text'
        displayName='Name'
        updateFunction={(newValue) =>
          updateLocation(location.id, { name: newValue })
        }
        initialValue={location.name}
      />
      <GenericInput
        kind='text'
        displayName='Description'
        updateFunction={(newValue) =>
          updateLocation(location.id, { description: newValue })
        }
        initialValue={location.description}
      />
      <Button
        onClick={() => {
          removeLocation(location.id);
          navigate('/dashboard/locations');
        }}
      >
        DELETE LOCATION
      </Button>
    </WhiteCard>
  );
};

export default DashboardLocationDetail;
