import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './medical.css';
import logo2 from './logo2.png';
import axios from 'axios';

function Medical() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const [medicalAssistance, setMedicalAssistance] = useState([]);

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

  // Fetch medical requests from the backend
  const fetchMedicalAssistance = async () => {
    try {
      const response = await axios.get(`/routes/accounts/medical-assistance/all`);
      setMedicalAssistance(response.data);
    } catch (error) {
      console.error('Failed to fetch medical requests:', error);
    }
  };

  // Approve a medical assistance request
  const handleApprove = async (id) => {
    try {
      const response = await axios.put(`/routes/accounts/medical-assistance/${id}/approve`);
      const updatedRequest = response.data;
      setMedicalAssistance(medicalAssistance.map(request =>
        request._id === id ? updatedRequest : request
      ));
      alert('Medical request approved successfully.');
    } catch (error) {
      console.error('Failed to approve medical request:', error);
      alert('Failed to approve medical request. Please try again later.');
    }
  };

  useEffect(() => {
    fetchMedicalAssistance(); // Fetch the medical requests when the component mounts
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
        <h1 className='text-3xl font-bold mt-2 mb-4'>Medical Assistance</h1>
        <table className='table-auto w-full'>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th  className='font-normal py-1.5 px-2'>Name</th>
              <th  className='font-normal py-1.5 px-2'>Type of Medicine</th>
              <th  className='font-normal py-1.5 px-2'>Quantity</th>
              <th  className='font-normal py-1.5 px-2'>Location</th>
              <th  className='font-normal py-1.5 px-2'>Target Date</th>
              <th  className='font-normal py-1.5 px-2'>Contact Number</th>
              <th  className='font-normal py-1.5 px-2'>Reason</th>
              <th  className='font-normal py-1.5 px-2'>Approved</th>
              <th  className='font-normal py-1.5 px-2'>Actions</th> 
            </tr>
          </thead>
          <tbody>
            {medicalAssistance.map((request) => (
              <tr key={request._id} className='even:bg-gray-200'>
                <td  className='px-10 py-2'>{request.name}</td>
                <td  className='px-10 py-2'>{request.typeOfMedicine}</td>
                <td  className='px-10 py-2'>{request.quantity}</td>
                <td  className='px-10 py-2'>{request.location}</td>
                <td  className='px-10 py-2'>{new Date(request.targetDate).toLocaleDateString()}</td>
                <td  className='px-10 py-2'>{request.contactNumber}</td>
                <td  className='px-10 py-2'>{request.reason}</td>
                <td  className='px-10 py-2'>{request.approved ? 'Yes' : 'No'}</td> 
                <td  className='px-10 py-2'>
                {!request.approved ? (
                  <button type="button" className="enable-button" onClick={() => handleApprove(request._id)}>
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

export default Medical;