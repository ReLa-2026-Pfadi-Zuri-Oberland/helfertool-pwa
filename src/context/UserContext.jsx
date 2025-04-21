import React, { createContext, useEffect, useState } from 'react';

import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useFireBaseUsers } from '../firebase/useFireBaseUsers';

// Define rights per role
const ROLE_RIGHTS = {
  admin: ['user:read', 'dashboard:view'],
  default: ['user:read'],
  unknown: ['user:login:view'],
};

// Create context
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

// Provider
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [roles, setRoles] = useState([]); // multiple roles
  const [rights, setRights] = useState([]);
  const [users, loading, error] = useFireBaseUsers();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user && !loading && !error) {
        const userRoles = users.find((u) => u.id === user.uid)?.roles || [];
        const fetchedRoles = Array.from(new Set([...userRoles, 'default']));
        setRoles(fetchedRoles);

        const mergedRights = Array.from(
          new Set(fetchedRoles.flatMap((role) => ROLE_RIGHTS[role] || []))
        );
        setRights(mergedRights);
      } else {
        const unknownRoles = ['unknown'];
        setRoles(unknownRoles);

        const mergedRights = Array.from(
          new Set(unknownRoles.flatMap((role) => ROLE_RIGHTS[role] || []))
        );
        setRights(mergedRights);
      }
    });

    return () => unsubscribe();
  }, [users, error, loading]);

  // Utility function
  const hasPermission = (right) => {
    const checkRights = Array.isArray(right) ? right : [right];
    const result = checkRights.every((r) => rights.includes(r));
    return result;
  };
  return (
    <UserContext.Provider
      value={{ currentUser, roles, rights, hasPermission, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};
