import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav style={{ gap: '1rem' }}>
    <Link to='/'>Home</Link>
    <Link to='/organizations'>Organizations</Link>
    <Link to='/locations'>Locations</Link>
    <Link to='/jobTypes'>JobTypes</Link>
    <Link to='/shifts'>Shifts</Link>
    <Link to='/users'>Users</Link>
    <Link to='/engagements'>Engagements</Link>
    <Link to='/login'>Login</Link>
  </nav>
);

export default NavBar;
