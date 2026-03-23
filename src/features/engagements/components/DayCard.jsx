import { Box } from '@mui/material';
import WhiteCard from '../../../components/ui/WhiteCard';
import dayjs from '../../../utils/dayjs';
import pirateHat from '../assets/pirate-hat.svg';

const DayCard = ({ dayUTC }) => {
  const localDate = dayjs(dayUTC).local();
  const dateNumber = localDate.date();
  const isSingleDigit = dateNumber < 10;
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
      className={'mb-2 b-1 b1-s rela-border-col fade-in'}
      style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #fef5f5 100%)',
        overflow: 'visible',
      }}
    >
      <div
        className='position-absolute'
        style={{
          marginTop: '-15px',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      >
        <div className='position-relative'>
          <img
            style={{
              width: '135px',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
              transition: 'transform 0.3s ease',
            }}
            src={pirateHat}
            alt='pirate hat'
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')
            }
          />
          <h1
            style={{
              top: '-5px',
              left: isSingleDigit ? '55px' : '46px',
              transform: 'rotate(-20deg)',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
            }}
            className='position-absolute col-fff'
          >
            {dateNumber}
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
          style={{
            marginTop: '-15px',
            right: 0,
            left: 'auto',
            animation: 'pulse 3s ease-in-out infinite 0.5s',
          }}
        >
          <div className='position-relative'>
            <img
              style={{
                width: '135px',
                transform: 'scaleX(-1)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))',
                transition: 'transform 0.3s ease',
              }}
              src={pirateHat}
              alt='pirate hat'
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  'scaleX(-1) scale(1.1) rotate(5deg)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  'scaleX(-1) scale(1) rotate(0deg)')
              }
            />
            <h1
              style={{
                top: '-5px',
                left: isSingleDigit ? '64px' : '52px',
                transform: 'rotate(20deg)',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
              }}
              className='position-absolute col-fff'
            >
              {dateNumber}
            </h1>
          </div>
        </div>
      </Box>
      <div className='d-f f-ac f-jc'>
        <h1
          className='m-1'
          style={{
            background: 'linear-gradient(135deg, #6a0c00 0%, #b71c1c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            letterSpacing: '1px',
          }}
        >
          {monthArray[localDate.month()]}
        </h1>
      </div>
    </WhiteCard>
  );
};
export default DayCard;
