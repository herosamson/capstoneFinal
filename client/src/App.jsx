import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, useNavigate, useLocation  } from 'react-router-dom'

import NotFound from './NotFound.jsx';
<Route path="*" element={<NotFound />} />

/* Auth */
import Login from './view/Auth/Login.jsx';
import Register from './view/Auth/Register.jsx';
import ForgotPassword from './view/Auth/ForgotPassword.jsx';
import VerifyOTP from './view/Auth/VerifyOTP.jsx';
import Verify from './view/Auth/Verify.jsx';
import ResetPassword from './view/Auth/ResetPassword.jsx';

/* User */
import Homepage from './view/User/Homepage.jsx';
import UserHomePage from './view/User/UserHomePage.jsx';
import Donate from './view/User/Donate.jsx';
import CashOthers from './view/User/CashOthers.jsx';
import Receipt from './view/User/Receipt.jsx';
import Profile from './view/User/Profile.jsx';
import Events from './view/User/Events.jsx';
import AboutUs from './view/User/AboutUs.jsx';
import RequestAssistance from './view/User/RequestAssistance.jsx';
import Food from './view/User/Food.jsx';
import Finance from './view/User/Finance.jsx';
import Medical from './view/User/Medical.jsx';
import Legal from './view/User/Legal.jsx';
import Disaster from './view/User/Disaster.jsx';
import Others from './view/User/Others.jsx';

/* Staff */
import Donation from './view/Staff/donations.jsx';
import StaffDashboard from './view/Staff/staffDashboard.jsx';
import Inventory from './view/Staff/inventory.jsx';
import StaffReceipt from './view/Staff/receipt.jsx';

/* Admin */
import Analytics from './view/Admin/analytics.jsx';
import AdminDisaster from './view/Admin/disaster.jsx';
import AdminDonation from './view/Admin/donations.jsx'
import AdminEvents from './view/Admin/events.jsx';
import AdminFinancial from './view/Admin/financial.jsx';
import AdminFood from './view/Admin/food.jsx';
import AdminInventory from './view/Admin/inventory.jsx';
import AdminLegal from './view/Admin/legal.jsx';
import AdminMedical from './view/Admin/medical.jsx';

/* SuperAdmin */
import Activity from './view/SuperAdmin/activity.jsx';
import Admin from './view/SuperAdmin/admin.jsx';
import AnalyticsSA from './view/SuperAdmin/analytics.jsx';
import SuperAdminDashboard from './view/SuperAdmin/dashboard.jsx';
import SuperAdminEvents from './view/SuperAdmin/eventsA.jsx';
import SuperAdminInventory from './view/SuperAdmin/inventoryA.jsx';
import SuperAdminStaff from './view/SuperAdmin/staffA.jsx';

/* Hooks */
import UseInactivityTimeout from './hooks/UseInactivityTimeout.jsx';
import ProtectedRoute from './hooks/protected.jsx';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [firstname, setFirstName] = useState(null);
  const [lastname, setLastName] = useState(null);
  const [contact, setContact] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  axios.defaults.baseURL = /* 'http://localhost:5001' */
  "https://idonate1.onrender.com";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('userRole');
    const storedFirstName = localStorage.getItem('firstname');
    const storedLastName = localStorage.getItem('lastname');
    const storedContact = localStorage.getItem('contact');
  
    if (storedUserId) setUserId(storedUserId);
    if (storedUsername) setUsername(storedUsername);
    if (storedUserRole) setUserRole(storedUserRole);
    if (storedFirstName) setFirstName(storedFirstName);
    if (storedLastName) setLastName(storedLastName);
    if (storedContact) setContact(storedContact);

     // Redirect to the last visited path if user is logged in
     const lastVisitedPath = localStorage.getItem('lastVisitedPath');
     if (storedUserRole) {
      // Redirect users based on role when reopening the site
      if (
        location.pathname === '/' ||
        location.pathname === '/login' ||
        location.pathname === '/register'
      ) {
        switch (storedUserRole) {
          case 'user':
            navigate('/home'); // Donors go to UserHomePage
            break;
          case 'staff':
            navigate('/staffDashboard'); // Staff goes to Staff Dashboard
            break;
          case 'admin':
            navigate('/analytics'); // Admin goes to Admin Analytics
            break;
          case 'superadmin':
            navigate('/analyticsSA'); // SuperAdmin goes to SuperAdmin Analytics
            break;
        }
      } else if (lastVisitedPath) {
        navigate(lastVisitedPath); // Otherwise, go to the last visited path
      }
    }
  }, [navigate, location.pathname]);

  const handleLogin = (userId, username, role, firstname, lastname, contact) => {
    setUserId(userId);
    setUsername(username);
    setUserRole(role);
    setFirstName(firstname);
    setLastName(lastname);
    setLastName(contact);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('userRole', role);
    localStorage.setItem('firstname', firstname);
    localStorage.setItem('lastname', lastname);
    localStorage.setItem('contact', contact);

  };

  return (
    <>
      <UseInactivityTimeout timeout={1800000} />
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/events' element={<Events/>}/>
        <Route path='/about' element={<AboutUs/>}/>
    
        {/* Auth */}
        <Route path='/login' element={<Login onLogin={handleLogin}/>}/>
        <Route path='/register' element={<Register onLogin={handleLogin} />}/>
        <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        <Route path='/verify' element={<VerifyOTP/>}/>
        <Route path='/resetpassword' element={<ResetPassword/>}/>
        <Route path='/verifyR' element={<Verify/>}/>
    
        {/* UserPage */}
        <Route path="/home" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <UserHomePage username={username} firstname={firstname} lastname={lastname} />
          </ProtectedRoute>
        } />
          <Route path="/profile" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Profile username={username} />
          </ProtectedRoute>
        } />
    
        {/* Donate */}
        <Route path="/donate" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Donate />
          </ProtectedRoute>
        } />
        <Route path="/cashothers" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <CashOthers />
          </ProtectedRoute>
        } />
        <Route path="/receipt" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Receipt />
          </ProtectedRoute>
        } />
         <Route path="/others" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Others userId={userId} />
          </ProtectedRoute>
        } />
    
    
        {/* Request Assistance */}
        <Route path="/requestassistance" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <RequestAssistance />
          </ProtectedRoute>
        } />
         <Route path="/food" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Food userId={userId} />
          </ProtectedRoute>
        } />
           <Route path="/finance" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Finance userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/medical" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Medical userId={userId} />
          </ProtectedRoute>
        } />
         <Route path="/legal" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Legal userId={userId} />
          </ProtectedRoute>
        } />
          <Route path="/disaster" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['user']}>
            <Disaster userId={userId} />
          </ProtectedRoute>
        } />


        {/* Staff */}
        <Route path="/staffDashboard" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/donations" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <Donation />
          </ProtectedRoute>
        } />
        <Route path="/inventoryS" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <Inventory userId={userId}/>
          </ProtectedRoute>
        } />
        <Route path="/receiptS" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['staff']}>
            <StaffReceipt />
          </ProtectedRoute>
        } />


        {/* Admin */}
        <Route path="/analytics" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/eventsA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminEvents />
          </ProtectedRoute>
        } />
        <Route path="/foodA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminFood />
          </ProtectedRoute>
        } />
        <Route path="/financialA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminFinancial />
          </ProtectedRoute>
        } />
        <Route path="/medicalA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminMedical />
          </ProtectedRoute>
        } />
        <Route path="/disasterA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminDisaster />
          </ProtectedRoute>
        } />
        <Route path="/legalA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminLegal />
          </ProtectedRoute>
        } />
        <Route path="/inventory" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminInventory userId={userId}/>
          </ProtectedRoute>
        } />
        <Route path="/donateA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminDonation />
          </ProtectedRoute>
        } />

        {/* SuperAdmin */}
        <Route path="/admin" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/analyticsSA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <AnalyticsSA />
          </ProtectedRoute>
        } />
        <Route path="/eventsSA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <SuperAdminEvents />
          </ProtectedRoute>
        } />
        <Route path="/inventorySA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <SuperAdminInventory userId={userId} />
          </ProtectedRoute>
        } />
        <Route path="/staffSA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <SuperAdminStaff />
          </ProtectedRoute>
        } />
        <Route path="/adminSA" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/activity" element={
          <ProtectedRoute userRole={userRole} allowedRoles={['superadmin']}>
            <Activity />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App
