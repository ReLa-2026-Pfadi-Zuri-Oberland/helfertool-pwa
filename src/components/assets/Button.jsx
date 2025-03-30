import React from 'react';

const Button = ({ children, className = '', kind = 'primary', ...rest }) => {
  const buttonClassName = `btn btn-${kind} ${className}`;

  return (
    <button className={buttonClassName} {...rest}>
      {children}
    </button>
  );
};

export default Button;
