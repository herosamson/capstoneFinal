import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../assets/images/logoBlack.png';
import authBg from '../../assets/images/authBg.jpg'
import Logo1 from '../../assets/images/logo.png';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
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
      
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); 
  
    if (!userId) {
      alert('User ID is missing. Please try again.');
      return;
    }

    if (
      !password.trim() ||
      password.length < 8 ||
      !/\d/.test(password) ||       
      !/[A-Z]/.test(password) ||     
      !/[\W_]/.test(password)      
    ) {
      setError('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
      return;
    }
  
    try {
      const response = await axios.post(`/routes/accounts/user/change-password/${userId}`, { password });
  
      if (response.data.error) {
        setError(response.data.error);
      } else {
        alert('Password changed successfully. Please log in with your new password.');
        navigate('/login');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while changing the password. Please try again.');
    }
  };
  

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
        <p className='text-center mb-4 font-medium text-sm'>You can now change your password.</p>
        <form onSubmit={handlePasswordChange}>
          <div className="authContainer">
            <input 
              type="password" 
              className='authFields' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter New Password"
              required 
              maxLength='50'
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className='authButton'>Continue</button>
        </form>
      </div>
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <img className="w-full h-full object-cover" src={authBg} alt="Registration" />
      </div>
    </div>
  );
}

export default ResetPassword;
