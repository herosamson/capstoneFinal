import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/logo.png'
import Team from '../../components/Tools/Team.jsx';
import HomeBody from '../../components/Tools/HomeBody.jsx';
import Footer from '../../components/Tools/Footer.jsx'

const Homepage = () => {
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
        <div className='font-Poppins min-h-screen flex flex-col'>
            <div className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 flex justify-between py-3 px-6 font-Poppins ${isScrolled ? 'bg-red-800' : 'bg-transparent'}`}>
                <div className="logo">
                    <img src={Logo} alt="Logo" className='h-auto w-48' />
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
            <div className="pb-6 flex flex-col flex-grow">
                <HomeBody/>
                <Team/>
            </div>
            <Footer/>
        </div>
    )
}

export default Homepage
