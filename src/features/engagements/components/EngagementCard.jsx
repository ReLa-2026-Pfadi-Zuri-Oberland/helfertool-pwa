import Button from '../../../components/ui/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EngagementGauge from './EngagementGauge';
import PlaceIcon from '@mui/icons-material/Place';
import ScheduleIcon from '@mui/icons-material/Schedule';
import WhiteCard from '../../../components/ui/WhiteCard';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const EngagementCard = ({
  id,
  title,
  location,
  start,
  end,
  currentAmountOfHelpers,
  targetNumberOfHelpers,
  isRegistered,
  orgId,
}) => {
  let navigate = useNavigate();
  const date = dayjs(start).local().format('DD.MM.YYYY');
  const localStartTime = dayjs(start).local().format('HH:mm');
  const localEndTime = dayjs(end).local().format('HH:mm');
  return (
    <WhiteCard className={'mb-1 b1-s rela-border-col'}>
      <div className='d-f f-jb'>
        <div>
          <h2 className='mt-1 mb-1'>{title}</h2>
          <div className='d-f f-ac'>
            <PlaceIcon className='mr-1' />
            <h4 className='m-1'>{location}</h4>
          </div>
          <div className='d-f f-ac'>
            <ScheduleIcon className='mr-1' />
            <h4 className='m-1'>{`${localStartTime} - ${localEndTime}`}</h4>
          </div>
          <div className='d-f f-ac mb-2'>
            <CalendarTodayIcon className='mr-1' />
            <h4 className='m-1'>{date}</h4>
          </div>
          <Button
            size='S'
            onClick={() => navigate('/' + orgId + '/anmelden/' + id)}
          >
            MEHR ERFAHREN
          </Button>
        </div>
        <EngagementGauge
          currentAmountOfHelpers={parseInt(currentAmountOfHelpers)}
          targetNumberOfHelpers={parseInt(targetNumberOfHelpers)}
          isRegistered={isRegistered}
        />
      </div>
    </WhiteCard>
  );
};
export default EngagementCard;
