import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './activity.css';
import logo2 from './logo2.png';

function Activity() {
  const [logs, setLogs] = useState([]);
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  useEffect(() => {
    fetch('https://idonate1.onrender.com/routes/accounts/activity-logs')
      .then(response => response.json())
      .then(data => setLogs(data))
      .catch(error => console.error('Error fetching activity logs:', error));
  }, []);

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
    <div id="container">
      <div id="sidebar">
      <ul>
          <li><img className="logoU" src={logo2} alt="Logo" /></li>
          <br />
          <li className="dropdown-toggle" onClick={toggleDropdownA}>
            Accounts Management<span className="arrow">&#9660;</span>
          </li>
          {isDropdownOpenA && (
            <ul className="dropdown-menuU">
          <li><Link to="/admin">Donors </Link></li>
          <li><Link to="/adminSA">Administrators </Link></li>
          <li><Link to="/staffSA">Staff </Link></li>
            </ul>
          )}
          <li><Link to="/eventsSA">Events</Link></li>
          <li><Link to="/inventorySA">Inventory</Link></li>
          <li><Link to="/activity">Activity Logs</Link></li>
          <br />
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="content">
        <h1  className='text-3xl font-bold mt-2 mb-4'>Activity Logs</h1>
        <table className='table-auto w-full'>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th className='font-normal py-1.5 px-2'>Username</th>
              <th className='font-normal py-1.5 px-2'>Role</th>
              <th className='font-normal py-1.5 px-2'>Action</th>
              <th className='font-normal py-1.5 px-2'>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index} className='even:bg-gray-200'>
                <td className='px-10 py-2'>{log.user}</td>
                <td className='px-10 py-2'>{log.role}</td>
                <td className='px-10 py-2'>{log.action}</td>
                <td className='px-10 py-2'>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Activity;
