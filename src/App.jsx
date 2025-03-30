import './ReLaCSS.css';

import { Route, Routes } from 'react-router-dom';
import {
  addEngagement,
  removeEngagement,
  updateEngagement,
  useFireBaseEngagements,
} from './firebase/useFireBaseEngagement';
import {
  addJobType,
  removeJobType,
  updateJobType,
  useFireBaseJobTypes,
} from './firebase/useFireBaseJobTypes';
import {
  addLocation,
  removeLocation,
  updateLocation,
  useFireBaseLocations,
} from './firebase/useFireBaseLocations';
import {
  addOrganization,
  removeOrganization,
  updateOrganization,
  useFireBaseOrganizations,
} from './firebase/useFireBaseOrganizations';
import {
  addShift,
  removeShift,
  updateShift,
  useFireBaseShifts,
} from './firebase/useFireBaseShifts';
import {
  addUser,
  removeUser,
  updateUser,
  useFireBaseUsers,
} from './firebase/useFireBaseUsers';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
// import { getToken, isSupported, onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';

import { GenericEdit } from './components/GenericEdit';
import Login from './components/Login';
import NavBar from './components/NavBar';
import { auth } from './firebase/firebase';

// import { messaging } from './firebase/firebase';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('Got result App.jsx', result);
        // After redirect, handle user info
        const newUser = result.user;
        addUser(newUser);

        // Add user to Firestore
        await addUser({
          name: newUser.displayName,
          email: newUser.email,
          contactPhone: newUser.phoneNumber,
        });
      }
    };

    fetchUser();
  }, []);

  // Background Notifications part START

  // async function requestPermission() {
  //   const permission = await Notification.requestPermission();
  //   if (permission === 'granted') {
  //     const token = await getToken(messaging, {
  //       vapidKey:
  //         'BGcN5vgj7ODg7OkRypDlAcbVimjJ7flqf_V0jO8r8IkFUsv6d2xZomZ9Qxa-C8E7_4fGHb_iXl3JctwwEOdHDCQ',
  //     });
  //     console.log('FCM Token:', token);
  //   }
  // }

  // onMessage(messaging, (payload) => {
  //   console.log('Foreground Notification:', payload);
  // });

  // Background Notifications part END

  return (
    <>
      <NavBar />
      {currentUser ? (
        <p>Logged in as {currentUser.displayName}</p>
      ) : (
        <p>Not logged in</p>
      )}

      <div className='p-4'>
        <Routes>
          <Route
            path='/'
            element={
              <h3>This is the home, please select in the nav the according</h3>
            }
          />
          <Route
            path='/users'
            element={
              <GenericEdit
                useFirebase={useFireBaseUsers}
                name={'User'}
                updateFunction={updateUser}
                addFunction={addUser}
                removeFunction={removeUser}
              />
            }
          />
          <Route
            path='/organizations'
            element={
              <GenericEdit
                useFirebase={useFireBaseOrganizations}
                name={'Organization'}
                updateFunction={updateOrganization}
                addFunction={addOrganization}
                removeFunction={removeOrganization}
              />
            }
          />
          <Route
            path='/locations'
            element={
              <GenericEdit
                useFirebase={useFireBaseLocations}
                name={'Location'}
                updateFunction={updateLocation}
                addFunction={addLocation}
                removeFunction={removeLocation}
              />
            }
          />
          <Route
            path='/jobTypes'
            element={
              <GenericEdit
                useFirebase={useFireBaseJobTypes}
                name={'Location'}
                updateFunction={updateJobType}
                addFunction={addJobType}
                removeFunction={removeJobType}
              />
            }
          />
          <Route
            path='/shifts'
            element={
              <GenericEdit
                useFirebase={useFireBaseShifts}
                name={'Shift'}
                updateFunction={updateShift}
                addFunction={addShift}
                removeFunction={removeShift}
              />
            }
          />
          <Route
            path='/engagements'
            element={
              <GenericEdit
                useFirebase={useFireBaseEngagements}
                name={'Engagement'}
                updateFunction={updateEngagement}
                addFunction={addEngagement}
                removeFunction={removeEngagement}
              />
            }
          />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
