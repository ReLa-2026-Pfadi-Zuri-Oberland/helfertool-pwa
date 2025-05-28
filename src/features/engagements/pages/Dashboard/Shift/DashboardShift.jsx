import { addShift, useFireBaseShifts } from '../../../hooks/useFireBaseShifts';

import Button from '../../../../../components/ui/Button';
import DashbaordTitleCard from '../../../components/DashboardTitleCard';
import DashboardDetailCard from '../../../components/DashboardDetailCard';
import ScheduleIcon from '@mui/icons-material/Schedule';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router';

const DashboardShift = () => {
  let navigate = useNavigate();
  const [shifts, loading, error] = useFireBaseShifts();
  if (loading) return <h3>Loading...</h3>;
  if (error) return <h3>Error: {error.message}</h3>;
  return (
    <>
      <DashbaordTitleCard
        title='Schichten'
        icon={<ScheduleIcon fontSize='large' className='mr-2' />}
      />

      {shifts.map((shift, index) => (
        <DashboardDetailCard
          key={index}
          title={`${dayjs(shift.startDate).format('DD.MM.YYYY')} ${shift.name}`}
          icon={<ScheduleIcon fontSize='large' className='mr-2' />}
          details={['TEMP Details']}
          onNavigate={() => {
            navigate('/dashboard/shift/' + shift.id);
          }}
        />
      ))}

      <Button
        size='L'
        variant='primary'
        onClick={async () => {
          const newShiftId = await addShift();
          if (newShiftId) {
            navigate('/dashboard/shift/' + newShiftId);
          }
        }}
      >
        NEUE SCHICHT
      </Button>
    </>
  );
};
export default DashboardShift;
