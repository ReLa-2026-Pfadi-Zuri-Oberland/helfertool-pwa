import './ReLaCSS.css';
import './cssClasses.css';

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

import DashboardJobType from './pages/Dashboard/JobType/DashboardJobType';
import DashboardJobTypeDetail from './pages/Dashboard/JobType/DashboardJobTypeDetail';
import DashboardLocation from './pages/Dashboard/Location/DashboardLocation';
import DashboardLocationDetail from './pages/Dashboard/Location/DashboardLocationDetail';
import DashboardOrganization from './pages/Dashboard/Organization/DashboardOrganization';
import DashboardOrganizationDetail from './pages/Dashboard/Organization/DashboardOrganizationDetail';
import DashboardShift from './pages/Dashboard/Shift/DashboardShift';
import DashboardShiftDetail from './pages/Dashboard/Shift/DashboardShiftDetail';
import { GenericEdit } from './components/GenericEdit';
import Login from './pages/Login/Login';
import NavBar from './components/NavBar';
import User from './pages/UserProfile/UserProfile';
import { auth } from './firebase/firebase';
import { getRedirectResult } from 'firebase/auth';
// import { getToken, isSupported, onMessage } from 'firebase/messaging';
import { useEffect } from 'react';

// import { messaging } from './firebase/firebase';

const App = () => {
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

      <div className='pr-2 pl-2'>
        <Routes>
          <Route path='/' element={<User />} />
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
            path='dashboard/organizations'
            element={<DashboardOrganization />}
          />
          <Route
            path='dashboard/organization/:id'
            element={<DashboardOrganizationDetail />}
          />
          <Route path='dashboard/locations' element={<DashboardLocation />} />
          <Route
            path='/dashboard/location/:id'
            element={<DashboardLocationDetail />}
          />
          <Route path='dashboard/shifts' element={<DashboardShift />} />
          <Route
            path='/dashboard/shift/:id'
            element={<DashboardShiftDetail />}
          />
          <Route path='dashboard/jobTypes' element={<DashboardJobType />} />
          <Route
            path='/dashboard/jobType/:id'
            element={<DashboardJobTypeDetail />}
          />
          <Route
            path='dashb/jobTypes'
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
