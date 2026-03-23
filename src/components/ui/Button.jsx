const Button = ({
  size = 'M',
  variant = 'primary',
  icon,
  disabled = false,
  children,
  className,
  style,
  ...props
}) => {
  return (
    <button
      className={`br-1 d-f f-ac ${
        icon ? 'f-jb' : 'f-jc'
      } btn btn-${size} btn-${variant} ${disabled && 'disabled'} ${className}`}
      disabled={disabled}
      style={{
        minHeight: '44px',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      {...props}
    >
      {icon && <>{icon}</>}
      <div className='d-f f-jc w100p'> {children}</div>
    </button>
  );
};

export default Button;
