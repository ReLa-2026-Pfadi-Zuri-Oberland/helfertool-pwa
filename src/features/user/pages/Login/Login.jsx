import './Login.css';

import {
  GoogleAuthProvider,
  getRedirectResult,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

import { Grid, TextField, Alert, Divider } from '@mui/material';
import Logo from '../../assets/logo.jpg';
import WhiteCard from '../../../../components/ui/WhiteCard';
import { addUser } from '../../../../hooks/useFireBaseUsers';
import { auth } from '../../../../lib/firebase';
import { useEffect, useState } from 'react';

const provider = new GoogleAuthProvider();

const Login = () => {
  const user = auth.currentUser;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  const handleGoogleLogin = async () => {
    console.log('Starting Google login...');
    setError('');
    setSuccess('');

    try {
      await signInWithPopup(auth, provider);
      addUser();
    } catch (error) {
      console.error('Login Error: ', error);
      setError(error.message);
    }
  };

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Bitte E-Mail und Passwort eingeben');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      addUser();
      setSuccess('Erfolgreich eingeloggt!');
    } catch (error) {
      console.error('Login Error: ', error);
      if (error.code === 'auth/user-not-found') {
        setError('Benutzer nicht gefunden');
      } else if (error.code === 'auth/wrong-password') {
        setError('Falsches Passwort');
      } else if (error.code === 'auth/invalid-email') {
        setError('Ungültige E-Mail-Adresse');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Ungültige Anmeldedaten');
      } else {
        setError(error.message);
      }
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || !displayName) {
      setError('Bitte alle Felder ausfüllen');
      return;
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
      addUser();
      setSuccess('Konto erfolgreich erstellt!');
      setIsSignUp(false);
    } catch (error) {
      console.error('Sign Up Error: ', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('E-Mail-Adresse wird bereits verwendet');
      } else if (error.code === 'auth/invalid-email') {
        setError('Ungültige E-Mail-Adresse');
      } else if (error.code === 'auth/weak-password') {
        setError('Passwort ist zu schwach');
      } else {
        setError(error.message);
      }
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Bitte E-Mail-Adresse eingeben');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Passwort-Reset-E-Mail wurde gesendet!');
      setIsResetPassword(false);
    } catch (error) {
      console.error('Password Reset Error: ', error);
      if (error.code === 'auth/user-not-found') {
        setError('Benutzer nicht gefunden');
      } else if (error.code === 'auth/invalid-email') {
        setError('Ungültige E-Mail-Adresse');
      } else {
        setError(error.message);
      }
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
    <Grid columns={16} container>
      <Grid
        item
        size={{ xs: 16, sm: 16, md: 10, lg: 10 }}
        offset={{ xs: 0, sm: 0, md: 3, lg: 3 }}
      >
        <WhiteCard thin className={' b1-s rela-border-col pr-2 pl-2 pt-4 pb-4'}>
          {user && (
            <div>
              <h2>Welcome, {user.displayName}</h2>
            </div>
          )}
          <h1 className='col-rela-dark-red mt-0 mr-0 ml-0 mb-4 text-align-center'>
            Einloggen und durchstarten!
          </h1>
          <h5 className='mb-2 text-align-center'>
            Das ReLa26-Lager findet im Juli 2026 statt – vom 13. bis zum 24.
            Juli erwartet dich eine unvergessliche Zeit voller Abenteuer,
            Gemeinschaft und Spaß.
          </h5>
          <Grid container columns={16}>
            <Grid item size={8} offset={{ xs: 4, sm: 4, md: 4, lg: 4 }}>
              <img className='img-w' src={Logo} />
            </Grid>
          </Grid>
          <h5 className='mb-4 text-align-center'>
            Du möchtest mit dabei sein? Dann melde dich jetzt an – wir freuen
            uns riesig auf dich und können es kaum erwarten, diese besondere
            Zeit gemeinsam mit dir zu erleben!
          </h5>
          {error && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity='success' sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <div className='d-f f-jc'>
            <button onClick={handleGoogleLogin} className='gsi-material-button'>
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

          <Divider sx={{ my: 3 }}>ODER</Divider>

          {isResetPassword ? (
            <>
              <h3 className='text-align-center mb-3'>Passwort zurücksetzen</h3>
              <form onSubmit={handlePasswordReset}>
                <TextField
                  fullWidth
                  label='E-Mail'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin='normal'
                  required
                />
                <button
                  type='submit'
                  className='gsi-material-button'
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  <div className='gsi-material-button-state'></div>
                  <div className='gsi-material-button-content-wrapper'>
                    <span className='gsi-material-button-contents'>
                      Reset-E-Mail senden
                    </span>
                  </div>
                </button>
                <div className='text-align-center mt-3'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsResetPassword(false);
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Zurück zum Login
                  </button>
                </div>
              </form>
            </>
          ) : isSignUp ? (
            <>
              <h3 className='text-align-center mb-3'>Konto erstellen</h3>
              <form onSubmit={handleSignUp}>
                <TextField
                  fullWidth
                  label='Name'
                  type='text'
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  margin='normal'
                  required
                />
                <TextField
                  fullWidth
                  label='E-Mail'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin='normal'
                  required
                />
                <TextField
                  fullWidth
                  label='Passwort'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin='normal'
                  required
                  helperText='Mindestens 6 Zeichen'
                />
                <button
                  type='submit'
                  className='gsi-material-button'
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  <div className='gsi-material-button-state'></div>
                  <div className='gsi-material-button-content-wrapper'>
                    <span className='gsi-material-button-contents'>
                      Konto erstellen
                    </span>
                  </div>
                </button>
                <div className='text-align-center mt-3'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsSignUp(false);
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Bereits ein Konto? Einloggen
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3 className='text-align-center mb-3'>Mit E-Mail einloggen</h3>
              <form onSubmit={handleEmailPasswordLogin}>
                <TextField
                  fullWidth
                  label='E-Mail'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin='normal'
                  required
                />
                <TextField
                  fullWidth
                  label='Passwort'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin='normal'
                  required
                />
                <button
                  type='submit'
                  className='gsi-material-button'
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  <div className='gsi-material-button-state'></div>
                  <div className='gsi-material-button-content-wrapper'>
                    <span className='gsi-material-button-contents'>
                      Einloggen
                    </span>
                  </div>
                </button>
                <div className='text-align-center mt-3'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsResetPassword(true);
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      marginRight: '16px',
                    }}
                  >
                    Passwort vergessen?
                  </button>
                  <button
                    type='button'
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                      setSuccess('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#1976d2',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Konto erstellen
                  </button>
                </div>
              </form>
            </>
          )}
        </WhiteCard>
      </Grid>
    </Grid>
  );
};

export default Login;
