import { Snackbar } from '@mui/material';
import { useState } from 'react';

const ControlledSnackbar = ({ title, body }) => {
  const [message, setMessage] = useState({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });

  const handleClose = () => {
    setMessage({ ...message, open: false });
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'center', horizontal: 'top' }}
      open={message.open}
      onClose={handleClose}
      autoHideDuration={5000}
      message={title + ' ' + body}
    />
  );
};

export default ControlledSnackbar;
