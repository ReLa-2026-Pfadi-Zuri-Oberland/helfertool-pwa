import { Navigate, Route, Routes } from 'react-router-dom';

import DashboardEngagement from '../features/engagements/pages/Dashboard/Engagement/DashboardEngagement';
import DashboardEngagementDetail from '../features/engagements/pages/Dashboard/Engagement/DashboardEngagementDetail';
import DashboardJobType from '../features/engagements/pages/Dashboard/JobType/DashboardJobType';
import DashboardJobTypeDetail from '../features/engagements/pages/Dashboard/JobType/DashboardJobTypeDetail';
import DashboardLocation from '../features/engagements/pages/Dashboard/Location/DashboardLocation';
import DashboardLocationDetail from '../features/engagements/pages/Dashboard/Location/DashboardLocationDetail';
import DashboardOrganization from '../features/engagements/pages/Dashboard/Organization/DashboardOrganization';
import DashboardOrganizationDetail from '../features/engagements/pages/Dashboard/Organization/DashboardOrganizationDetail';
import DashboardOverview from '../features/engagements/pages/Dashboard/Overview/DashboardOverview';
import DashboardShift from '../features/engagements/pages/Dashboard/Shift/DashboardShift';
import DashboardShiftDetail from '../features/engagements/pages/Dashboard/Shift/DashboardShiftDetail';
import DashboardUserDetail from '../features/engagements/pages/Dashboard/Users/DashboardUserDetail';
import DashboardUsers from '../features/engagements/pages/Dashboard/Users/DashboardUsers';
import EngagementDetail from '../features/engagements/pages/EngagementList/EngagementDetail';
import EngagementList from '../features/engagements/pages/EngagementList/EngagementList';
import Login from '../features/engagements/pages/Login/Login';
import ProtectedRoute from '../components/ui/ProtectedRoute';
import TopSideBar from '../components/layout/TopSideBarLayout';
import { UserContext } from '../stores/UserContext';
import UserProfile from '../features/engagements/pages/UserProfile/UserProfile';
import { useContext } from 'react';

const Router = () => {
  //   const [messages, setMessages] = useState([]);

  //   // Background Notifications part START
  //   if (!isSupported()) {
  //     console.error('Push messaging is not supported in this browser.');
  //   }
  //   async function requestPermission() {
  //     const permission = await Notification.requestPermission();
  //     if (permission === 'granted') {
  //       const token = await getToken(messaging, {
  //         vapidKey:
  //           'BGcN5vgj7ODg7OkRypDlAcbVimjJ7flqf_V0jO8r8IkFUsv6d2xZomZ9Qxa-C8E7_4fGHb_iXl3JctwwEOdHDCQ',
  //       });
  //       console.log('FCM Token:', token);
  //     }
  //   }

  //   requestPermission();

  //   onMessage(messaging, (payload) => {
  //     console.log('Foreground Notification:', payload);
  //     setMessages([
  //       ...messages,
  //       <ControlledSnackbar
  //         key={new Date().toISOString()}
  //         title=''
  //         body='This Snackbar will be dismissed in 5 seconds'
  //       />,
  //     ]);
  //   });

  //   // Background Notifications part END

  const { loading, currentUser } = useContext(UserContext);

  return (
    <>
      <TopSideBar>
        {loading && (
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
              path='/dashboard/organization/:organizationId'
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
              path='/dashboard/location/:locationId'
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
              path='/dashboard/shift/:shiftId'
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
              path='/dashboard/jobType/:jobTypeId'
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
              path='/dashboard/engagement/:engagementId'
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
              path='/dashboard/user/:userId'
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

export default Router;
