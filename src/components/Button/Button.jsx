const Button = ({
  size = 'M',
  variant = 'primary',
  icon,
  disabled = false,
  children,
  ...props
}) => {
  return (
    <button
      className={`br-1 d-f f-ac f-jc btn btn-${size} btn-${variant} ${
        disabled && 'disabled'
      }`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className='btn-icon'>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
