import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/images/logo.png';
import Footer from '../../components/Tools/Footer';

const Events = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get(`/routes/accounts/events`)
        .then(response => {
            const currentDate = new Date(); 
            const upcomingEvents = response.data.filter(event => new Date(event.eventDate) >= currentDate );
            setEvents(upcomingEvents);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen); 
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
                    <Link className='nav' to="/">Home</Link>
                    <Link className='nav' to="/events">Events</Link>
                    <Link className='nav' to="/about">About us</Link>
                    <Link className='nav' to="/login">Login</Link>
                </div>
            </div>
        </div>

        <div className="pb-6 flex flex-col flex-grow ">
            <div className="py-8 flex flex-col justify-center space-y-8"> 
                <h2 className='text-center text-4xl font-semibold mt-4'>Upcoming Events</h2>
                <div className='overflow-x-auto overflow-y-auto mx-10 max-sm:mx-2 text-sm'>
                    <table className='table-auto w-full'>
                        <thead className='bg-red-800 text-white'>
                            <tr className=''>
                                <th className='font-medium py-2'>Event Name</th>
                                <th className='font-medium py-2'>Date</th>
                                <th className='font-medium py-2'>Volunteers</th>
                                <th className='font-medium py-2'>Materials Needed</th>
                                <th className='font-medium py-2'>Number of Pax</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events ? 
                                events.map((event, index) => (
                                    <tr key={index} className='even:bg-gray-100'>
                                        <td className="py-2 px-4">{event.eventName}</td>
                                        <td className="py-2 px-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">{event.volunteers}</td>
                                        <td className="py-2 px-4">{event.materialsNeeded.join(', ')}</td>
                                        <td className="py-2 px-4">{event.numberOfPax}</td>
                                    </tr>
                                )) 
                            : <p>No Data</p>}
                        </tbody>
                    </table>
                </div> 
            </div>
        </div>
        <Footer/>
    </div>
  );
};

export default Events;
