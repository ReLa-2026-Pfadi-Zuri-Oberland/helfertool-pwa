import WhiteCard from './WhiteCard';

const DashbaordTitleCard = ({ icon, title }) => {
  return (
    <WhiteCard className='d-f f-ac col-rela-dark-red mb-3'>
      {icon}
      <h1 className='deco-underline '>{title}</h1>
    </WhiteCard>
  );
};
export default DashbaordTitleCard;
