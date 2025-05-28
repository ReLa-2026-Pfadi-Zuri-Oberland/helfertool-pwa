import { UserProvider } from '../stores/UserContext';

const AppProvider = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default AppProvider;
