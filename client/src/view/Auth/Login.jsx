import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '../../assets/images/logoBlack.png';
import authBg from '../../assets/images/authBg.jpg'

const Login = ({ onLogin }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ isIncorrectPassword, setIsIncorrectPassword ] = useState(false);
  const [ userRole, setUserRole ] = useState(null);
  const [ showPassword, setShowPassword ] = useState(false); 
  const [ loginData, setLoginData ] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/routes/accounts/login`, loginData);
      const { userId, username, role, firstname, lastname, contact } = response.data;

      setUserRole(role);
      setIsLoggedIn(true);

      // Store user details in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', role);
      localStorage.setItem('firstname', firstname);
      localStorage.setItem('lastname', lastname);
      localStorage.setItem('contact', contact);

      onLogin(userId, username, role, firstname, lastname, contact);
    } catch (error) {
      setIsIncorrectPassword(true);
    }
  };


  if (isLoggedIn) {
    if (userRole === 'superadmin') {
      return <Navigate to="/admin" />;
    } else if (userRole === 'admin') {
      return <Navigate to="/analytics" />;
    } else if (userRole === 'staff') {
      return <Navigate to="/staffDashboard" />;
    } else {
      return <Navigate to="/home" />;
    }
  }

  return (
    <div className="grid place-items-center min-h-screen font-Poppins">
      <div className="bg-[#f2f2f0] rounded-2xl py-10 px-10">
        <a href="/"><img className="w-[330px] h-auto mb-8" src={Logo} alt="Logo" /></a>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <div className="authContainer">
              <input 
                type="text" 
                className='authFields' 
                value={loginData.username} 
                onChange={(e) => setLoginData({...loginData, username: e.target.value})} 
                placeholder="Username" 
                required 
                maxLength='50'
              />
            </div>

            <div className='authContainer' >
              <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                  className='authFields'
              />
              <span
                className="my-auto mr-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <span>
            {isIncorrectPassword && (
              <p className="text-sm text-red-400">
                Incorrect username or password.
              </p>
            )}
          </span>

          <div className="">
            <Link to="/forgotpassword" className='flex justify-end text-blue-500 text-sm underline hover:text-blue-700 mt-2 mb-2'>Forgot password?</Link>
            <button type="submit" className='authButton'>Login</button>
            <p className='text-center text-sm'>Don't have an account? <Link to="/register" className='text-blue-500 underline hover:text-blue-700'>Sign up</Link></p>
          </div>
        </form>
      </div>

      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <img className="w-full h-full object-cover" src={authBg} alt="Registration" />
      </div>
    </div>
  );
}

export default Login;
