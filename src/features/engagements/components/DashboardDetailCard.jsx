import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhiteCard from '../../../components/ui/WhiteCard';

const DashboardDetailCard = ({ title, icon, details, onNavigate }) => {
  return (
    <WhiteCard className='mb-2 cursor-pointer' onClick={onNavigate}>
      <div className='d-f f-jb f-ac col-rela-dark-red'>
        <div className='d-f f-ac '>
          {icon}
          <h2>{title}</h2>
        </div>
        <ArrowForwardIcon fontSize='large' />
      </div>
      {details &&
        details.map((detail, index) => {
          <h4 key={index}>{detail}</h4>;
        })}
    </WhiteCard>
  );
};

export default DashboardDetailCard;
