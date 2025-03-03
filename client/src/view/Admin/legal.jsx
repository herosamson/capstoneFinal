import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './legal.css';
import logo2 from './logo2.png';
import axios from 'axios';


function Legal() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [legalRequests, setLegalRequests] = useState([]);
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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


  const fetchLegalRequests = async () => {
    try {
      const response = await axios.get(`/routes/accounts/legal-assistance/all`);
      setLegalRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch legal requests:', error);
    }
  };

  const approveRequest = async (id) => {
    try {
      const response = await axios.put(`/routes/accounts/legal-assistance/${id}/approve`);
      
      if (response.status === 200) {
        alert('Request approved, and an email has been sent to the applicant!');
        setLegalRequests(prevState =>
          prevState.map(request =>
            request._id === id ? { ...request, approved: true } : request
          )
        );
      }
    } catch (error) {
      console.error('Failed to approve legal request:', error);
      alert('Failed to approve legal request. Please try again later.');
    }
  };
  
  useEffect(() => {
    fetchLegalRequests();
  }, []);

  return (
    <div id="containerU">
      <div id="sidebar">
      <ul>
          <li><img className="logoU" src={logo2} alt="Logo" /></li>
          <li><Link to="/analytics">Administrator Dashboard</Link></li>
          <li><Link to="/donateA">Item Donations</Link></li>
          <li><Link to="/eventsA">Events</Link></li>
          <li className="dropdown-toggle" onClick={toggleDropdown}>
            Request Assistance <span className="arrow">&#9660;</span>
          </li>
          {isDropdownOpen && (
            <ul className="dropdown-menuU">
              <li><Link to="/financialA" >Financial Assistance</Link></li>
              <li><Link to="/medicalA" >Medical Assistance</Link></li>
              <li><Link to="/legalA" >Legal Assistance</Link></li>
              <li><Link to="/foodA" >Food Assistance</Link></li>
              <li><Link to="/disasterA" >Disaster Assistance</Link></li>
            </ul>
          )}
          <li><Link to="/inventory">Inventory</Link></li>
       
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="contentD">
        <h1 className='text-3xl font-bold mt-2 mb-4'>Legal Assistance</h1>
        <table className='table-auto w-full'>
            <thead className='bg-red-800 text-white'>
            <tr>
              <th  className='font-normal py-1.5 px-2'>Name</th>
              <th  className='font-normal py-1.5 px-2'>Type of Legal Assistance</th>
              <th  className='font-normal py-1.5 px-2'>Contact Number</th>
              <th  className='font-normal py-1.5 px-2'>Target Date</th>
              <th  className='font-normal py-1.5 px-2'>Approved</th>
              <th  className='font-normal py-1.5 px-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {legalRequests.map((request) => (
              <tr key={request._id} className='even:bg-gray-200'>
                <td className='px-10 py-2'>{request.name}</td>
                <td className='px-10 py-2'>{request.legalType}</td>
                <td className='px-10 py-2'>{request.contactNumber}</td>
                <td className='px-10 py-2'>{new Date(request.targetDate).toLocaleDateString()}</td>
                <td className='px-10 py-2'>{request.approved ? 'Yes' : 'No'}</td>
                <td className='px-10 py-2'>
                {!request.approved ? (
                  <button type="button" className="enable-button" onClick={() => approveRequest(request._id)}>
                    Approve
                  </button>
                ) : (
                  <span>Approved</span>
                )}
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Legal;
