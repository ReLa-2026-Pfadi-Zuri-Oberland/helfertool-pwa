import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { auth } from '../firebase/firebase';
import { isMobile } from '../helpers/isMobile';
import { onAuthStateChanged } from 'firebase/auth';
import reLaLogo from './assets/reLaLogo.png';

const Menu = ({ className }) => {
  const navs = [
    { text: 'Home', to: '/' },
    { text: 'Organizations', to: 'dashboard/organizations' },
    { text: 'Locations', to: 'dashboard/locations' },
    { text: 'JobTypes', to: 'dashboard/jobTypes' },
    { text: 'Shifts', to: 'dashboard/shifts' },
    { text: 'Users', to: 'dashboard/users' },
    { text: 'Engagements', to: 'dashboard/engagements' },
    { text: 'Profile', to: '/profile' },
    { text: 'Login', to: '/login' },
  ];

  return (
    <>
      {navs.map((nav, index) => (
        <Link
          key={index}
          className={`text-align-center deco-none text-uppercase text-bold rela-nav ${className}`}
          to={nav.to}
        >
          {nav.text}
        </Link>
      ))}
    </>
  );
};
const NavBar = () => {
  let navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav
        style={{
          gap: '1rem',
          background: 'rgba(255, 255, 255, 0.54)',
          // position: 'fixed',
          // top: 0,
          // left: 0,
          // zIndex: 1000,
        }}
        className='bcol-fff pt-1 pb-1 pl-2 pr-2 m-2 br-1 d-f f-jb f-ac'
      >
        <img src={reLaLogo} className='w25p' onClick={() => navigate('/')} />
        {isMobile() ? (
          <DehazeIcon onClick={() => setIsMobileMenuOpen(true)} />
        ) : (
          <Menu className={'col-rela-dark-gray'} />
        )}
        {isMobileMenuOpen ? (
          <div
            className='position-fixed d-f f-jc f-ac'
            style={{
              zIndex: 9999,
              backgroundColor: 'rgba(85, 85, 85, 0.9)',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100vw',
              transition: 'opacity 3s ease',
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CloseIcon
              className='position-fixed col-fff'
              fontSize='large'
              style={{ top: 10, right: 20 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className='d-f fd-c'>
              <Menu className={'col-fff'} />
            </div>
          </div>
        ) : null}
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
