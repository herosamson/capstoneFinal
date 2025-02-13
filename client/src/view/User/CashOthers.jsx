import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Logo from '../../assets/images/logo.png'
import Items from '../../assets/images/items.jpg';
import Cash from '../../assets/images/cash.png';
import { MdKeyboardBackspace } from "react-icons/md";

const CashOthers = () => {
  const navigate = useNavigate(); 
  const [ isOpen, setIsOpen ] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        localStorage.removeItem('firstname');
        localStorage.removeItem('lastname');
        localStorage.removeItem('contact');
        localStorage.removeItem('lastVisitedPath');
        window.location.href = '/'; 
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="font-Poppins min-h-screen flex flex-col">
      <div className={`flex justify-between py-3 px-6 font-Poppins bg-red-800 `}>
        <div className="logo">
            <img src={Logo} alt="Logo" className='h-auto w-48' />
        </div>
        <div className="flex text-white my-auto">
            <div className="hidden max-sm:block text-3xl cursor-pointer nav" onClick={toggleMenu}>
                &#9776;
            </div>
            <div className={`flex space-x-6 max-sm:flex-col max-sm:items-center max-sm:absolute max-sm:top-[52px] max-sm:right-0 max-sm:w-full max-sm:bg-red-800 max-sm:space-x-0 max-sm:pb-4 max-sm:pt-8 max-sm:text-lg max-sm:space-y-3 ${isOpen ? 'max-sm:flex' : 'max-sm:hidden'}`}>
                <Link className='nav' to="/home">Home</Link>
                <Link className="nav" to="/requestassistance">Request</Link>
                <Link className='nav' to="/donate">Donate</Link>
                <Link className='nav' to="/profile">Profile</Link>
                <Link to="/" onClick={handleLogout}>Logout</Link>
            </div>
        </div>
      </div>

      <div className="pb-6 flex flex-col flex-grow px-12">
      <Link to="/home" className='mt-4 text-4xl '>
                    <div className="circle"><MdKeyboardBackspace/></div>
                </Link>
        <div className="flex justify-center items-center space-x-20 mt-[5%] max-xl:space-x-8 max-xl:mx-8 max-md:flex-col max-md:space-x-0 max-md:space-y-8 max-sm:mx-10">
            <div className="border-2 w-1/3 overflow-hidden rounded-xl max-xl:w-1/2 max-md:w-full">
                <img src={Cash} alt="" className='h-72 w-full object-cover max-lg:h-72 max-sm:h-48'/>
                <div className="px-5 py-4">
                  <h1 className='text-3xl font-medium'>Cash</h1>
                  <button className="mt-8 py-2 px-8 rounded-md bg-red-700 text-white hover:bg-red-500 duration-200 max-md:mt-6" onClick={() => navigate('/receipt')}>Donate</button>
                </div>
            </div>

            <div className="border-2 w-1/3 overflow-hidden rounded-xl max-xl:w-1/2 max-md:w-full">
                <img src={Items} alt="" className='h-72 w-full object-cover max-lg:h-72 max-sm:h-48'/>
                <div className="px-5 py-4">
                  <h2 className='text-3xl font-medium'>Items</h2>
                  <button className="mt-8 py-2 px-8 rounded-md bg-red-700 text-white hover:bg-red-500 duration-200 max-md:mt-6" onClick={() => navigate('/others')}>Donate</button> 
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CashOthers;
