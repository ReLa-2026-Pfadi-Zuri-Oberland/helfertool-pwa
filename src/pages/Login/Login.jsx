import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

import { addUser } from '../../firebase/useFireBaseUsers';
import { auth } from '../../firebase/firebase';
import { isMobile } from '../../helpers/isMobile';

const provider = new GoogleAuthProvider();

const Login = () => {
  const user = auth.currentUser;

  const handleLogin = async () => {
    console.log('Starting login...');

    try {
      // Redirect the user for authentication

      if (isMobile()) {
        const { user } = await signInWithRedirect(auth, provider);
        console.log();
        return;
      }
      // await signInWithRedirect(auth, provider);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await getRedirectResult(auth);
      console.log(response);
    };
    fetch();

    //  await addUser({
    //    name: newUser.displayName,
    //    email: newUser.email,
    //    contactPhone: newUser.phoneNumber,
    //  });
  }, []);

  return (
    <div>
      {isMobile() ? 'Is Mobile: Yes' : 'IsMobile: No'}
      {user ? (
        <div>
          <h2>Welcome, {user.displayName}</h2>
          <img src={user.photoURL} alt='User' />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Login;
