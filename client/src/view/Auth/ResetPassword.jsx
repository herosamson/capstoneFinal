import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logoBlack.png';
import authBg from '../../assets/images/authBg.jpg'

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
      alert('User ID is missing. Please try again.');
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
