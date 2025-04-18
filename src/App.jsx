import './ReLaCSS.css';
import './cssClasses.css';

import { Navigate, Route, Routes } from 'react-router-dom';
import { useContext, useEffect } from 'react';

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
import { UserContext } from './context/UserContext';
import UserProfile from './pages/UserProfile/UserProfile';
import { addUser } from './firebase/useFireBaseUsers';
import { auth } from './firebase/firebase';
import { getRedirectResult } from 'firebase/auth';

// ProtectedRoute component
const ProtectedRoute = ({ permission, children }) => {
  const { hasPermission } = useContext(UserContext);
  return hasPermission(permission) ? children : <Navigate to='/login' />;
};

const App = () => {
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

  return (
    <>
      <NavBar />

      <div className='pr-2 pl-2'>
        <Routes>
          <Route path='/' element={<Navigate to='/0/anmelden' />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path=':orgId/anmelden' element={<EngagementList />} />
          <Route path=':orgId/anmelden/:id' element={<EngagementDetail />} />

          <Route
            path='dashboard/organizations'
            element={
              <ProtectedRoute permission='dashboard:view'>
                <DashboardOrganization />
              </ProtectedRoute>
            }
          />
          <Route
            path='dashboard/organization/:id'
            element={
              <ProtectedRoute permission='dashboard:view'>
                <DashboardOrganizationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path='dashboard/locations'
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
            path='dashboard/shifts'
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
            path='dashboard/jobTypes'
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
            path='dashboard/engagements'
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
            path='dashboard/users'
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
            path='dashboard/overview'
            element={
              <ProtectedRoute permission='dashboard:view'>
                <DashboardOverview />
              </ProtectedRoute>
            }
          />

          <Route path='/login' element={<Login />} />
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </>
  );
};

export default App;
