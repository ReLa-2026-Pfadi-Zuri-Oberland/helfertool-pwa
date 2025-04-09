const WhiteCard = ({ children, className, onClick, thin }) => {
  return (
    <div
      className={`bcol-fff br-1 ${thin ? '' : 'p-2'} ${
        className ? className : ''
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default WhiteCard;
