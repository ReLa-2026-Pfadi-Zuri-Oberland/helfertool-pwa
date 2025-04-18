const WhiteCard = ({ children, className, onClick, thin, style }) => {
  return (
    <div
      className={`bcol-fff br-1 ${thin ? '' : 'p-2'} ${
        className ? className : ''
      }`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default WhiteCard;
