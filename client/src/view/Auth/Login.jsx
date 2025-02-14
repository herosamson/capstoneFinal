import React, { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Logo from '../../assets/images/logoBlack.png';
import Logo1 from '../../assets/images/logo.png';
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
    setIsIncorrectPassword(false); // Reset incorrect password state before attempt
  
    try {
      console.log("Attempting login with:", loginData);
  
      const response = await axios.post(`/routes/accounts/login`, loginData);
      console.log("Login response:", response.data);
  
      if (response.status === 200) {
        // Extract user details from response
        const { userId, username, role, firstname, lastname, contact, email } = response.data;
  
        setUserRole(role);
        setIsLoggedIn(true);
  
        // Store user details in localStorage
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', role);
        localStorage.setItem('firstname', firstname);
        localStorage.setItem('lastname', lastname);
        localStorage.setItem('contact', contact);
        localStorage.setItem('email', email);
  
        onLogin(userId, username, role, firstname, lastname, contact, email);
      } else {
        setIsIncorrectPassword(true); // Show error if login fails
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setIsIncorrectPassword(true);
    }
  };
  
  


  useEffect(() => {
    if (isLoggedIn) {
      if (userRole === 'superadmin') {
        window.location.href = "/analyticsSA";
      } else if (userRole === 'admin') {
        window.location.href = "/analytics";
      } else if (userRole === 'staff') {
        window.location.href = "/staffDashboard";
      } else {
        window.location.href = "/home";
      }
    }
  }, [isLoggedIn, userRole]);
  

   const [ isOpen, setIsOpen ] = useState(false);
      const [ isScrolled, setIsScrolled ] = useState(false);
    
      const toggleMenu = () => {
        setIsOpen(!isOpen);
      };
      useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 50) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        };
       
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

  return (
    <div className="grid place-items-center min-h-screen font-Poppins">
       <div className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 flex justify-between py-3 px-6 font-Poppins ${isScrolled ? 'bg-red-800' : 'bg-transparent'}`}>
                      <div className="logo">
                          <img src={Logo1} alt="Logo" className='h-auto w-48' />
                      </div>
                      <div className="flex text-white my-auto">
                          <div className="hidden max-sm:block text-3xl cursor-pointer nav" onClick={toggleMenu}>
                              &#9776;
                          </div>
                          <div className={`flex space-x-6 max-sm:flex-col max-sm:items-center max-sm:absolute max-sm:top-[52px] max-sm:right-0 max-sm:w-full max-sm:bg-red-800 max-sm:space-x-0 max-sm:pb-4 max-sm:pt-8 max-sm:text-lg max-sm:space-y-3 ${isOpen ? 'max-sm:flex' : 'max-sm:hidden'}`}>
                              <Link className='nav' to="/">Home</Link>
                              <Link className='nav' to="/events">Events</Link>
                              <Link className='nav' to="/about">About us</Link>
                              <Link className='nav' to="/login">Login</Link>
                          </div>
                      </div>
                  </div>
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
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img className="w-full h-full object-cover" src={authBg} alt="Registration" />
      </div>
    </div>
  );
}

export default Login;
