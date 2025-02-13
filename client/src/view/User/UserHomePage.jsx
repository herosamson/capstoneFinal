import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/Tools/Footer';
import Logo from '../../assets/images/logo.png';
import UserHomeBody from '../../components/Tools/UserHomeBody.jsx';
import BPI from '../../assets/images/bpi.png';
import BDO from '../../assets/images/bdo.jpg';
import Gcash from '../../assets/images/gcash.png';
import Maya from '../../assets/images/maya.jpg';
import { FaCheckCircle } from 'react-icons/fa';

const UserHomePage = ({ firstname }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    if (firstname) {
      toast(<CustomToastMessage firstname={firstname} />, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }, [firstname]);

  const handleLogout = async () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');

    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, role }),
      });

      if (response.ok) {
        alert("You have successfully logged out!");
        localStorage.clear();
        window.location.href = '/';
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const CustomToastMessage = ({ firstname }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FaCheckCircle style={{ marginRight: '10px', color: 'green', fontSize: '20px' }} />
      <span>Welcome, {firstname}!</span>
    </div>
  );

  const handleContainerClick = () => {
    navigate('/receipt');
  };

  return (
    <div className="font-Poppins min-h-screen flex flex-col">
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 flex justify-between py-3 px-6 ${
          isScrolled ? 'bg-red-800' : 'bg-transparent'
        }`}
      >
        <div className="logo">
          <img src={Logo} alt="Logo" className="h-auto w-48" />
        </div>
        <div className="flex text-white my-auto">
          <div className="hidden max-sm:block text-3xl cursor-pointer nav" onClick={toggleMenu}>
            &#9776;
          </div>
          <div
            className={`flex space-x-6 max-sm:flex-col max-sm:items-center max-sm:absolute max-sm:top-[52px] max-sm:right-0 max-sm:w-full max-sm:bg-red-800 max-sm:space-x-0 max-sm:pb-4 max-sm:pt-8 max-sm:text-lg max-sm:space-y-3 ${
              isOpen ? 'max-sm:flex' : 'max-sm:hidden'
            }`}
          >
            <Link className="nav" to="/home">Home</Link>
            <Link className="nav" to="/requestassistance">Request</Link>
            <Link className="nav" to="/cashothers">Donate</Link>
            <Link className="nav" to="/profile">Profile</Link>
            <Link to="/" onClick={handleLogout}>Logout</Link>
          </div>
        </div>
      </div>
      <div className="pb-6 flex flex-col flex-grow">
        <UserHomeBody />
        <div className="flex flex-col items-center space-y-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[{ name: 'BPI', img: BPI }, { name: 'BDO', img: BDO }, { name: 'Paymaya', img: Maya }, { name: 'GCash', img: Gcash }].map((option, index) => (
              <div key={index} onClick={handleContainerClick} className="border-2 w-full overflow-hidden cursor-pointer hover:bg-gray-100">
                <div className="flex items-center justify-center w-full h-44 overflow-hidden">
                  <img src={option.img} alt={option.name} className="h-full w-full object-cover" />
                </div>
                <div className="px-4 py-2 space-y-2">
                  <p className="text-2xl font-semibold text-blue-500">{option.name}</p>
                  {option.name === 'BPI' && (
                    <>
                      <p>Account Name: RCAM-Minor Basilica of the Black Nazarene</p>
                      <p>Peso Savings Account # 2273-0504-37</p>
                      <p>Dollars Savings Account # 2274-0026-22</p>
                      <p>Swift Code - BIC: B O P I P H M M</p>
                    </>
                  )}
                  {option.name === 'BDO' && (
                    <>
                      <p>Account Name: RCAM-Minor Basilica of the Black Nazarene</p>
                      <p>Peso Savings Account # 00454-0037-172</p>
                      <p>Dollars Savings Account # 10454-0037-164</p>
                      <p>Swift Code - BIC: B N O R P H M M</p>
                    </>
                  )}
                  {option.name === 'Paymaya' && (
                    <>
                      <p>Mobile Number: 0961 747 7003</p>
                      <p>Name: Rufino Sescon, Jr.</p>
                    </>
                  )}
                  {option.name === 'GCash' && (
                    <>
                      <p>Mobile Number: 0966 863 9861</p>
                      <p>Name: Rufino Sescon, Jr.</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default UserHomePage;
