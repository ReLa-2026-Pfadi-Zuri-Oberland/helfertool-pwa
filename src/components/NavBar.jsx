import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

import Button from './Button/Button';
import CloseIcon from '@mui/icons-material/Close';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { UserContext } from '../context/UserContext';
import { isDevView } from '../helpers/isDevView';
import { isMobile } from '../helpers/isMobile';
import reLaLogo from './assets/reLaLogo.png';
import { usePWAInstall } from 'react-use-pwa-install';

const Menu = ({ className, grouped = true }) => {
  const { hasPermission } = useContext(UserContext);
  const [isDashboardOpen, setDashboardOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const navs = [
    { text: 'Home', to: `0/anmelden` },
    { text: 'Profile', rights: ['user:read'], to: '/profile' },
    { text: 'Login', to: '/login', rights: ['user:login:view'] },
    {
      text: 'Dashboard',
      rights: ['dashboard:view'],
      children: [
        { text: 'Organizations', to: 'dashboard/organizations' },
        { text: 'Locations', to: 'dashboard/locations' },
        { text: 'JobTypes', to: 'dashboard/jobTypes' },
        { text: 'Shifts', to: 'dashboard/shifts' },
        { text: 'Users', to: 'dashboard/users' },
        { text: 'Engagements', to: 'dashboard/engagements' },
      ],
    },
  ];

  return (
    <>
      {navs.map((nav, index) => {
        const isVisible = !nav.rights || hasPermission(nav.rights);
        return (
          isVisible && (
            <div key={index}>
              {nav.children && grouped ? (
                <div
                  className={`d-f fd-c h100p ${className}`}
                  onMouseLeave={() => {
                    const timeout = setTimeout(
                      () => setDashboardOpen(false),
                      200
                    );
                    setHoverTimeout(timeout);
                  }}
                  onMouseEnter={() => {
                    if (hoverTimeout) clearTimeout(hoverTimeout);
                    setDashboardOpen(true);
                  }}
                >
                  <div
                    className='rela-nav text-uppercase text-bold'
                    style={{ cursor: 'pointer' }}
                  >
                    {nav.text}
                  </div>
                  {isDashboardOpen && (
                    <div className='rela-nav-dropdown bcol-fff br-2 p-1 mt-3'>
                      {nav.children.map(
                        (child, subIndex) =>
                          (!child.rights || hasPermission(child.rights)) && (
                            <Link
                              key={subIndex}
                              className={`text-align-center deco-none text-uppercase text-bold rela-nav mb-1 ${className}`}
                              to={child.to}
                            >
                              {child.text}
                            </Link>
                          )
                      )}
                    </div>
                  )}
                </div>
              ) : null}
              {nav.children && !grouped ? (
                <div className='d-f fd-c'>
                  {nav.children.map(
                    (child, subIndex) =>
                      (!child.rights || hasPermission(child.rights)) && (
                        <Link
                          key={subIndex}
                          className={`text-align-center deco-none text-uppercase text-bold rela-nav ${className}`}
                          to={child.to}
                        >
                          {child.text}
                        </Link>
                      )
                  )}
                </div>
              ) : null}
              {!nav.children ? (
                <div className='d-f fd-c'>
                  <Link
                    className={`text-align-center deco-none text-uppercase text-bold rela-nav  ${className}`}
                    to={nav.to}
                  >
                    {nav.text}
                  </Link>
                </div>
              ) : null}
            </div>
          )
        );
      })}
    </>
  );
};

const NavBar = () => {
  let navigate = useNavigate();
  const { currentUser, rights } = useContext(UserContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const install = usePWAInstall();

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
        className='bcol-fff pt-1 pb-1 pl-2 pr-2 m-2 br-2 d-f f-jb f-ac'
      >
        <img
          src={reLaLogo}
          style={{ maxHeight: '70px' }}
          className='cursor-pointer'
          onClick={() => navigate('/0/anmelden')}
        />
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
              <Menu grouped={false} className={'col-fff'} />
            </div>
          </div>
        ) : null}
        {install && <Button onClick={install}>INSTALL APP</Button>}
      </nav>
      {isDevView() && currentUser && (
        <p>
          Logged in as {currentUser.displayName} {rights}{' '}
          {console.log('Rights', rights)}
        </p>
      )}
      {isDevView && !currentUser && <p>Not logged in: {rights}</p>}
    </>
  );
};

export default NavBar;
