import { createContext, useContext } from 'react';

export const useAuth = () => {
  const AuthContext = createContext();

  return useContext(AuthContext);
};
