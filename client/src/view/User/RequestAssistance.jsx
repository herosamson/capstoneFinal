import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Tools/Footer';
import Logo from '../../assets/images/logo.png'
import FoodAssistance from '../../assets/images/foodAssistance.jpg'
import FinancialAssistance from '../../assets/images/nazareno.jpg'
import MedicalAssistance from '../../assets/images/medicalAssistance.jpg'
import LegalAssistance from '../../assets/images/legalAssistance.jpg'
import DisasterAssistance from '../../assets/images/donate2.jpg';
import { MdKeyboardBackspace } from "react-icons/md";

const RequestAssistance = () => {
    const [isOpen, setIsOpen] = useState(false);
    
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
                        <Link className='nav' to="/donate">Donate</Link>
                        <Link className='nav' to="/profile">Profile</Link>
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                    </div>
                </div>
            </div>
            <div className="pb-6 px-40 flex flex-col flex-grow max-xl:px-20 max-lg:px-16 max-md:px-1 max-sm:px-8">
            <Link to="/home" className='mt-4 text-4xl '>
                    <div className="circle"><MdKeyboardBackspace/></div>
                </Link>
                <div className="flex flex-wrap justify-center gap-10 mt-[4%] max-sm:justify-normal max-sm:gap-4 max-sm:mt-[10%]">
                    <Link to="/food" className="border-2 rounded-lg overflow-hidden w-72 transition hover:scale-105 hover:shadow-md duration-200 max-sm:flex max-sm:w-full max-sm:space-x-4">
                        <img src={FoodAssistance} alt="Food Subsidy" className='w-auto h-48 mx-auto max-sm:h-28 max-sm:mx-0'/>
                        <h2 className='text-center font-medium text-xl my-4 max-sm:my-auto max-sm:text-base'>Food Assistance</h2>
                    </Link>
                    
                    <Link to="/finance" className="border-2 rounded-lg overflow-hidden w-72 transition hover:scale-105 hover:shadow-md duration-200 max-sm:flex max-sm:w-full max-sm:space-x-4">
                        <img src={FinancialAssistance} alt="Financial Assistance" className='w-auto h-48 mx-auto max-sm:h-28 max-sm:mx-0'/>
                        <h2 className='text-center font-medium text-xl my-4 max-sm:my-auto max-sm:text-base'>Financial Assistance</h2>
                    </Link>

                    <Link to="/medical" className="border-2 rounded-lg overflow-hidden w-72 transition hover:scale-105 hover:shadow-md duration-200 max-sm:flex max-sm:w-full max-sm:space-x-4">
                        <img src={MedicalAssistance} alt="Medical Assistance" className='w-auto h-48 mx-auto max-sm:h-28 max-sm:mx-0'/>
                        <h2 className='text-center font-medium text-xl my-4 max-sm:my-auto max-sm:text-base'>Medical Assistance</h2>
                    </Link>

                    <Link to="/legal" className="border-2 rounded-lg overflow-hidden w-72 transition hover:scale-105 hover:shadow-md duration-200 max-sm:flex max-sm:w-full max-sm:space-x-4">
                        <img src={LegalAssistance} alt="Legal Assistance" className='w-auto h-48 mx-auto max-sm:h-28 max-sm:mx-0'/>
                        <h2 className='text-center font-medium text-xl my-4 max-sm:my-auto max-sm:text-base'>Legal Assistance</h2>
                    </Link>
                    
                    <Link to="/disaster" className="border-2 rounded-lg overflow-hidden w-72 transition hover:scale-105 hover:shadow-md duration-200 max-sm:flex max-sm:w-full max-sm:space-x-4">
                        <img src={DisasterAssistance} alt="Disaster Relief Assistance" className='w-auto h-48 mx-auto max-sm:h-28 max-sm:mx-0'/>
                        <h2 className='text-center font-medium text-xl my-4 max-sm:my-auto max-sm:text-base'>Disaster Relief Assistance</h2>
                    </Link>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default RequestAssistance
