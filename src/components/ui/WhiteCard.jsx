const WhiteCard = ({ children, className, onClick, thin, style }) => {
  return (
    <div
      className={`bcol-fff ${thin ? '' : 'p-2'} ${className ? className : ''}`}
      style={{
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        borderRadius: '16px',
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
};

export default WhiteCard;
