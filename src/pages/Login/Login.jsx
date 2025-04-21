import './Login.css';

import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
} from 'firebase/auth';

import { addUser } from '../../firebase/useFireBaseUsers';
import { auth } from '../../firebase/firebase';
import { useEffect } from 'react';

const provider = new GoogleAuthProvider();

const Login = () => {
  const user = auth.currentUser;

  const handleLogin = async () => {
    console.log('Starting login...');

    try {
      await signInWithPopup(auth, provider);
      addUser();
    } catch (error) {
      console.error('Login Error: ', error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await getRedirectResult(auth);
      console.log(response);
    };
    fetch();
  }, []);

  return (
    <div className='m-2'>
      {user && (
        <div>
          <h2>Welcome, {user.displayName}</h2>
        </div>
      )}
      <h1 className='col-rela-dark-red m-0'>Login</h1>
      <h4 className='mb-2'>
        Das ReLa26-Lager findet im Juli 2026 statt – vom 13. bis zum 24. Juli
        erwartet dich eine unvergessliche Zeit voller Abenteuer, Gemeinschaft
        und Spaß.
      </h4>
      <h4 className='mb-4'>
        Du möchtest mit dabei sein? Dann melde dich jetzt an – wir freuen uns
        riesig auf dich und können es kaum erwarten, diese besondere Zeit
        gemeinsam mit dir zu erleben!
      </h4>
      <div>
        <button onClick={handleLogin} className='gsi-material-button'>
          <div className='gsi-material-button-state'></div>
          <div className='gsi-material-button-content-wrapper'>
            <div className='gsi-material-button-icon'>
              <svg
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 48 48'
                style={{ display: 'block' }}
              >
                <path
                  fill='#EA4335'
                  d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
                ></path>
                <path
                  fill='#4285F4'
                  d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
                ></path>
                <path
                  fill='#FBBC05'
                  d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
                ></path>
                <path
                  fill='#34A853'
                  d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
                ></path>
                <path fill='none' d='M0 0h48v48H0z'></path>
              </svg>
            </div>
            <span className='gsi-material-button-contents'>
              Sign in with Google
            </span>
            <span style={{ display: 'none' }}>Sign in with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Login;
