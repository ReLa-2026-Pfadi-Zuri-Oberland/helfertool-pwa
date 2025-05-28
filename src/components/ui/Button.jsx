const Button = ({
  size = 'M',
  variant = 'primary',
  icon,
  disabled = false,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`br-1 d-f f-ac ${
        icon ? 'f-jb' : 'f-jc'
      } btn btn-${size} btn-${variant} ${disabled && 'disabled'} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <>{icon}</>}
      <div className='d-f f-jc w100p'> {children}</div>
    </button>
  );
};

export default Button;
