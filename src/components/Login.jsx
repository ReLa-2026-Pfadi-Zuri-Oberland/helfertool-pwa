import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { addUser } from '../firebase/useFireBaseUsers';
import { auth } from '../firebase/firebase';

const provider = new GoogleAuthProvider();

const Login = () => {
  const handleLogin = async () => {
    console.log('Starting login...');
    try {
      const result = await signInWithPopup(auth, provider);

      await addUser({
        name: result.user.displayName,
        email: result.user.email,
        contactPhone: result.user.phoneNumber,
      });
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      {auth && auth.currentUser && JSON.stringify(auth.currentUser)}
      {auth.currentUser ? (
        <div>
          <h2>Welcome, {auth.currentUser.displayName}</h2>
          <img src={auth.currentUser.photoURL} alt='User' />
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Sign in with Google</button>
      )}
    </div>
  );
};
export default Login;
