import WhiteCard from './WhiteCard';
import dayjs from 'dayjs';
import pirateHat from './assets/pirate-hat.png';

const DayCard = ({ day }) => {
  console.log(day);
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
    <WhiteCard thin={true} className={'mb-2'}>
      <div className='position-absolute' style={{ marginTop: '-45px' }}>
        <div className='position-relative'>
          <img src={pirateHat} alt='pirate hat' />
          <h1
            style={{ top: '25px', left: '65px', transform: 'rotate(-20deg)' }}
            className='position-absolute col-fff'
          >
            {date.date()}
          </h1>
        </div>
      </div>
      <div className='d-f f-ac'>
        <div className='w50p'></div>
        <h1 className='m-1'>{monthArray[date.month()]}</h1>
      </div>
    </WhiteCard>
  );
};
export default DayCard;
