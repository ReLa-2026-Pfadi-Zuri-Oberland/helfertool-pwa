import {
  removeShift,
  updateShift,
  useFireBaseShifts,
} from '../../../firebase/useFireBaseShifts';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '../../../components/Button/Button';
import EventIcon from '@mui/icons-material/Event';
import GenericInput from '../../../components/GenericInput';
import WhiteCard from '../../../components/WhiteCard';
import { useNavigate } from 'react-router-dom';

const DashboardShiftDetail = () => {
  let navigate = useNavigate();
  const [shifts, loading, error] = useFireBaseShifts();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  // Filter for shift with id from url
  const shiftId = window.location.pathname.split('/').pop();
  const shift = shifts.find((s) => s.id === shiftId);
  if (!shift)
    return (
      <WhiteCard>
        <h3>Schicht mit id "{shiftId}" nicht gefunden</h3>
      </WhiteCard>
    );

  return (
    <WhiteCard>
      <div className='d-f f-js f-ac col-rela-dark-red mb-2'>
        <ArrowBackIcon
          fontSize='large'
          className='mr-2 cursor-pointer'
          onClick={() => {
            navigate('/dashboard/shifts');
          }}
        />
        <EventIcon fontSize='large' className='mr-2' />
        <div className='d-f f-ac '>
          <h2>{shift.name}</h2>
        </div>
      </div>
      <GenericInput
        kind='text'
        displayName='Name'
        updateFunction={(newValue) => updateShift(shift.id, { name: newValue })}
        initialValue={shift.name}
      />
      <GenericInput
        kind='date'
        displayName='Startdatum'
        updateFunction={(newValue) =>
          updateShift(shift.id, { startDate: newValue })
        }
        initialValue={shift.startDate}
      />
      <GenericInput
        kind='date'
        displayName='Enddatum'
        updateFunction={(newValue) =>
          updateShift(shift.id, { endDate: newValue })
        }
        initialValue={shift.endDate}
      />
      <Button
        onClick={() => {
          removeShift(shift.id);
          navigate('/dashboard/shifts');
        }}
      >
        DELETE SHIFT
      </Button>
    </WhiteCard>
  );
};
export default DashboardShiftDetail;
