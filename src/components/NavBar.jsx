import { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav style={{ gap: '1rem' }} className='bcol-fff p-1'>
        <Link to='/'>Home</Link>
        <Link to='dashboard/organizations'>Organizations</Link>
        <Link to='dashboard/locations'>Locations</Link>
        <Link to='dashboard/jobTypes'>JobTypes</Link>
        <Link to='dashboard/shifts'>Shifts</Link>
        <Link to='dashboard/users'>Users</Link>
        <Link to='dashboard/engagements'>Engagements</Link>
        <Link to='/login'>Login</Link>
      </nav>
      {currentUser ? (
        <p>Logged in as {currentUser.displayName}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </>
  );
};

export default NavBar;
