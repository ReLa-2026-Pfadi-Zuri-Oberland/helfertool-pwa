import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { UserContext } from '../../stores/UserContext';
import { config } from '../../config/config';
import { isMobile } from '../../utils/isMobile';
import reLaLogo from '../../assets/reLaLogo.png';

const Menu = ({ className, grouped = true }) => {
  const { hasPermission } = useContext(UserContext);
  const [isDashboardOpen, setDashboardOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const navs = [
    { text: 'Home', to: `/engagements` },
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
        { text: 'Statistics', to: 'dashboard/statistics' },
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
                      200,
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
                          ),
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
                      ),
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

  return (
    <>
      <nav
        style={{
          gap: '1rem',
          background: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
        }}
        className='pt-1 pb-1 pl-2 pr-2 m-2 d-f f-jb f-ac fade-in'
      >
        <img
          src={reLaLogo}
          style={{
            maxHeight: '70px',
            transition: 'transform 0.3s ease',
          }}
          className='cursor-pointer'
          onClick={() => navigate('/engagements')}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = 'scale(1.05)')
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {isMobile() ? (
          <DehazeIcon
            onClick={() => setIsMobileMenuOpen(true)}
            style={{
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = 'scale(0.9)')
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <Menu className={'col-rela-dark-gray'} />
        )}

        {isMobileMenuOpen ? (
          <div
            className='position-fixed d-f f-jc f-ac'
            style={{
              zIndex: 9999,
              background:
                'linear-gradient(135deg, rgba(106, 12, 0, 0.95) 0%, rgba(183, 28, 28, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100vw',
              animation: 'fadeIn 0.3s ease-out',
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <CloseIcon
              className='position-fixed col-fff'
              fontSize='large'
              style={{
                top: 20,
                right: 20,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                padding: '8px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = 'scale(0.9)')
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
            <div className='d-f fd-c' style={{ gap: '1.5rem' }}>
              <Menu grouped={false} className={'col-fff'} />
            </div>
          </div>
        ) : null}
      </nav>
      {config.isDevView && currentUser && (
        <p>
          Logged in as {currentUser.displayName} {rights}{' '}
          {console.log('Rights', rights)}
        </p>
      )}
      {config.isDevView && !currentUser && <p>Not logged in: {rights}</p>}
    </>
  );
};

export default NavBar;
