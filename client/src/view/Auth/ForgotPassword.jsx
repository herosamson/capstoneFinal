import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logoBlack.png';
import authBg from '../../assets/images/authBg.jpg'

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/routes/accounts/send-reset-otp`, { email });
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem('userId', response.data.userId);
        alert('OTP has been sent to your email. Please check your inbox.');
        navigate('/verify');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending OTP. Please try again.');
    }
  };

  return (
    <div className="grid place-items-center min-h-screen font-Poppins">
      <div className="bg-[#f2f2f0] rounded-2xl py-10 px-10">
        <a href="/"><img className="w-[330px] h-auto mb-8" src={Logo} alt="Logo" /></a>
        <p className='text-center mb-4 font-medium'>Please enter your email.</p>
        <form onSubmit={handleEmailSubmit}>
          <div className="authContainer">
            <input 
              type="text" 
              className='authFields' 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              maxLength='50'
            />
          </div>

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

export default ForgotPassword;
