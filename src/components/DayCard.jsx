import { Box } from '@mui/material';
import WhiteCard from './WhiteCard';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import pirateHat from './assets/pirate-hat.svg';

const DayCard = ({ day }) => {
  console.log(day);
  dayjs.extend(customParseFormat);
  const date = dayjs(day, 'DD.MM.YYYY');
  const monthArray = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];

  return (
    <WhiteCard
      thin={true}
      className={'mb-2 b-1 b1-s rela-border-col'}
      style={{ position: 'relative' }}
    >
      <div className='position-absolute' style={{ marginTop: '-15px' }}>
        <div className='position-relative'>
          <img style={{ width: '135px' }} src={pirateHat} alt='pirate hat' />
          <h1
            style={{ top: '-5px', left: '55px', transform: 'rotate(-20deg)' }}
            className='position-absolute col-fff'
          >
            {date.date()}
          </h1>
        </div>
      </div>
      <Box
        sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'block',
            lg: 'block',
            xl: 'block',
          },
        }}
      >
        <div
          className='position-absolute'
          style={{ marginTop: '-15px', right: 0, left: 'auto' }}
        >
          <div className='position-relative'>
            <img
              style={{ width: '135px', transform: 'scaleX(-1)' }}
              src={pirateHat}
              alt='pirate hat'
            />
            <h1
              style={{ top: '-5px', left: '60px', transform: 'rotate(20deg)' }}
              className='position-absolute col-fff'
            >
              {date.date()}
            </h1>
          </div>
        </div>
      </Box>
      <div className='d-f f-ac f-jc'>
        <h1 className='m-1'>{monthArray[date.month()]}</h1>
      </div>
    </WhiteCard>
  );
};
export default DayCard;
