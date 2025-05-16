import './ReLaCSS.css';
import './cssClasses.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken, isSupported, onMessage } from 'firebase/messaging';
import { useContext, useEffect, useState } from 'react';

import ControlledSnackbar from './components/ControlledSnackBar';
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
import ProtectedRoute from './components/ProtectedRoute';
import { Snackbar } from '@mui/material';
import TopSideBar from './components/TopSideBar';
import { UserContext } from './context/UserContext';
import UserProfile from './pages/UserProfile/UserProfile';
import { addUser } from './firebase/useFireBaseUsers';
import { auth } from './firebase/firebase';
import { getRedirectResult } from 'firebase/auth';
import { messaging } from './firebase/firebase';

const App = () => {
  const [messages, setMessages] = useState([]);

  const { loading, currentUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUser = async () => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('Got result App.jsx', result);
        const newUser = result.user;
        addUser(newUser);

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
  if (!isSupported()) {
    console.error('Push messaging is not supported in this browser.');
  }
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey:
          'BGcN5vgj7ODg7OkRypDlAcbVimjJ7flqf_V0jO8r8IkFUsv6d2xZomZ9Qxa-C8E7_4fGHb_iXl3JctwwEOdHDCQ',
      });
      console.log('FCM Token:', token);
    }
  }

  requestPermission();

  onMessage(messaging, (payload) => {
    console.log('Foreground Notification:', payload);
    setMessages([
      ...messages,
      <ControlledSnackbar
        key={new Date().toISOString()}
        title=''
        body='This Snackbar will be dismissed in 5 seconds'
      />,
    ]);
  });

  // Background Notifications part END

  return (
    <>
      {messages}
      {/* <NavBar /> */}
      <TopSideBar>
        {!loading && (
          <Routes>
            <Route path='/' element={<Navigate to='/0/anmelden' />} />
            <Route
              path='/profile'
              element={currentUser ? <UserProfile /> : <Navigate to='/login' />}
            />

            <Route path='/:orgId/anmelden' element={<EngagementList />} />
            <Route path='/:orgId/anmelden/:id' element={<EngagementDetail />} />

            <Route
              path='/dashboard/organizations'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardOrganization />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/organization/:id'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardOrganizationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/locations'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardLocation />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/location/:id'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardLocationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/shifts'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardShift />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/shift/:id'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardShiftDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/jobTypes'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardJobType />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/jobType/:id'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardJobTypeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/engagements'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardEngagement />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/engagement/:id'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardEngagementDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/users'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/user/:id'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardUserDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path='/dashboard/overview'
              element={
                <ProtectedRoute permission='dashboard:view'>
                  <DashboardOverview />
                </ProtectedRoute>
              }
            />

            <Route
              path='/login'
              element={!currentUser ? <Login /> : <Navigate to='/profile' />}
            />
            <Route path='*' element={<h1>404 Not Found</h1>} />
          </Routes>
        )}
      </TopSideBar>
    </>
  );
};

export default App;
