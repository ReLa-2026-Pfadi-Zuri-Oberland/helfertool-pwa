import { CircularProgress } from '@mui/material';
import { UserContext } from '../../stores/UserContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ permission, children }) => {
  const { hasPermission, loading } = useContext(UserContext);
  if (loading)
    return (
      <div className='w100p h100p d-f f-jc f-ac'>
        <CircularProgress />
      </div>
    );
  return hasPermission(permission) ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
