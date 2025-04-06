const WhiteCard = ({ children, className, onClick }) => {
  return (
    <div className={`bcol-fff br-1 p-2 ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default WhiteCard;
