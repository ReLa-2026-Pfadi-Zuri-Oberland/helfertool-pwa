import './ReLaCSS.css';
import './cssClasses.css';

import { Route, Routes } from 'react-router-dom';

import DashboardEngagement from './pages/Dashboard/Engagement/DashboardEngagement';
import DashboardEngagementDetail from './pages/Dashboard/Engagement/DashboardEngagementDetail';
import DashboardJobType from './pages/Dashboard/JobType/DashboardJobType';
import DashboardJobTypeDetail from './pages/Dashboard/JobType/DashboardJobTypeDetail';
import DashboardLocation from './pages/Dashboard/Location/DashboardLocation';
import DashboardLocationDetail from './pages/Dashboard/Location/DashboardLocationDetail';
import DashboardOrganization from './pages/Dashboard/Organization/DashboardOrganization';
import DashboardOrganizationDetail from './pages/Dashboard/Organization/DashboardOrganizationDetail';
import DashboardOverview from './pages/Dashboard/Overview/DashboardOverview';
import DashboardShift from './pages/Dashboard/Shift/DashboardShift';
import DashboardShiftDetail from './pages/Dashboard/Shift/DashboardShiftDetail';
import DashboardUserDetail from './pages/Dashboard/Users/DashboardUserDetail';
import DashboardUsers from './pages/Dashboard/Users/DashboardUsers';
import EngagementDetail from './pages/EngagementList/EngagementDetail';
import EngagementList from './pages/EngagementList/EngagementList';
import Login from './pages/Login/Login';
import NavBar from './components/NavBar';
import UserProfile from './pages/UserProfile/UserProfile';
import { addUser } from './firebase/useFireBaseUsers';
import { auth } from './firebase/firebase';
import { getRedirectResult } from 'firebase/auth';
import { useEffect } from 'react';

// import { getToken, isSupported, onMessage } from 'firebase/messaging';

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
          <Route path='/' element={<h1>No Org selected</h1>} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path=':orgId/anmelden' element={<EngagementList />} />
          <Route path=':orgId/anmelden/:id' element={<EngagementDetail />} />

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
            path='dashboard/engagements'
            element={<DashboardEngagement />}
          />
          <Route
            path='/dashboard/engagement/:id'
            element={<DashboardEngagementDetail />}
          />
          <Route path='dashboard/users' element={<DashboardUsers />} />
          <Route path='/dashboard/user/:id' element={<DashboardUserDetail />} />
          <Route path='dashboard/overview' element={<DashboardOverview />} />

          <Route path='/login' element={<Login />} />
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
