import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logoBlack.png';
import authBg from '../../assets/images/authBg.jpg'

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error] = useState('');
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
            alert(response.data.error);
        } else {
            setOtp("");
            alert("Verification successful. Please log in.");
            navigate("/login");
        }
    } catch (error) {
        console.error(error);
        alert("An error occurred during verification. Please try again.");
    }
  };

    const handleCancel = () => {
        navigate('/');
    };

    return (
    <div className="grid place-items-center min-h-screen font-Poppins">
        <div className="bg-[#f2f2f0] rounded-2xl py-10 px-10">
            <a href="/"><img className="w-[330px] h-auto mb-8" src={Logo} alt="Logo" /></a>
            <p className='text-center mb-4 font-medium text-sm'>Please enter the One-Time Password (OTP)  <br/> sent to your email to verify your identity.</p>
            <form onSubmit={verifyUser}>
                <div className="authContainer">
                    <input
                        type="number"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="One Time Password"
                        required
                        className='authFields'
                    />

                </div>
                {error && <p className="text-xs text-red-500 w-[23vw]">{error}</p>}
                <div className="buttonVerify">
                    <button className="authButton" type="submit">Continue</button>
                    <button className="w-full bg-white py-2 rounded-md text-sm" type="button" onClick={handleCancel}>Cancel</button>
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

export default VerifyOTP;
