import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logoBlack.png';
import authBg from '../../assets/images/authBg.jpg'

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const verifyUser = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('User ID is missing. Please try the process again.');
      return;
    }

    try {
      const response = await axios.post(`/routes/accounts/verify-otp`, { userId, otp });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        alert('Verification successful. Please reset your password.');
        navigate('/resetpassword');
      }
    } catch (error) {
      console.error('Error:', error);  // Debugging log
      setError('Invalid code. Please check your email.');
    }
  };

  return (
    <div className="grid place-items-center min-h-screen font-Poppins">
      <div className="bg-[#f2f2f0] rounded-2xl py-10 px-10">
        <a href="/"><img className="w-[330px] h-auto mb-8" src={Logo} alt="Logo" /></a>
        <p className='text-center mb-4 font-medium text-sm'>Please enter your OTP that was sent to your email.</p>
        <form onSubmit={verifyUser}>
          <div className="authContainer">
            <input 
              type="text" 
              className='authFields' 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="One Time Password"
              required
            />
          </div>
          {error && <span className="error-text">{error}</span>}

          <button type="submit" className='authButton'>Verify</button>
        </form>
      </div>
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <img className="w-full h-full object-cover" src={authBg} alt="Registration" />
      </div>
    </div>
  );
}

export default VerifyOTP;
