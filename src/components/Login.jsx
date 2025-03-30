import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';

import { addUser } from '../firebase/useFireBaseUsers';
import { auth } from '../firebase/firebase';

const provider = new GoogleAuthProvider();

const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    console.log('Starting login...');

    try {
      // Redirect the user for authentication

      if (isMobile()) {
        await signInWithRedirect(auth, provider);
        return;
      }
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  //TODO redirect login not yet working
  useEffect(() => {
    console.log(window.location.href); // Log the URL to check where you are

    const fetchUser = async () => {
      // Only call getRedirectResult after redirecting
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('Got result Login.jsx', result);

        const newUser = result.user;
        setUser(newUser); // Update state with the logged-in user

        // Add user to Firestore or your database
        await addUser({
          name: newUser.displayName,
          email: newUser.email,
          contactPhone: newUser.phoneNumber,
        });
      }
    };

    fetchUser();
  }, []); // Run once on mount to check for the redirect result

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
