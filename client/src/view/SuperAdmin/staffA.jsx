import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // 👁️ Import icons
import './staffA.css';
import logo2 from './logo2.png';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ Password visibility state
  const [newStaff, setNewStaff] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/staff');
      const data = await response.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({ ...prevStaff, [name]: value }));
  };

  const validateStaffInput = () => {
    const { firstname, lastname, contact, email, username, password } = newStaff;
    const errors = [];

    if (!firstname.trim() || !/^[a-zA-Z\s]+$/.test(firstname)) {
      errors.push('Please enter a valid First name.');
    }

    if (!lastname.trim() || !/^[a-zA-Z\s]+$/.test(lastname)) {
      errors.push('Please enter a valid Last name.');
    }

    if (!/^\d{10}$/.test(contact)) {
      errors.push('Please enter a valid 10-digit contact number.');
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }

    if (!username.trim() || /[<>]/.test(username)) {
      errors.push('Please enter a valid Username.');
    }

    if (
      !password.trim() ||
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[\W_]/.test(password)
    ) {
      errors.push('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleAddStaff = async () => {
    if (Object.values(newStaff).some((field) => field === '')) {
      alert('Please fill in all fields');
      return;
    }

    if (!validateStaffInput()) {
      return;
    }

    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/stafff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server Error:', data);
        alert(`Failed to add staff: ${data.message}`);
        return;
      }

      alert('Staff added successfully!');
      setStaff([...staff, data]);
      setShowStaffModal(false);
      setNewStaff({
        firstname: '',
        lastname: '',
        contact: '',
        address: '',
        email: '',
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('An error occurred while adding the staff.');
    }
  };
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };

  return (
    <div id="container">
      <div id="sidebar">
           <ul>
                                <li><img className="logoU" src={logo2} alt="Logo" /></li>
                                <br />
                                 <li><Link to="/analyticsSA">Dashboard</Link></li>
                                <li className="dropdown-toggle" onClick={toggleDropdown}>
                                  Accounts Management<span className="arrow">&#9660;</span>
                                </li>
                                {isDropdownOpen && (
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
        <h1 className='text-3xl font-bold mt-2 mb-4'>Staff Management</h1>
        <div className="search-container">
          <input type="text" placeholder="Search staff..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={() => setShowStaffModal(true)} className="bg-green-600 text-white px-6 py-2 rounded">Add Staff</button>
      </div>

      {showStaffModal && (
        <div className="modal-overlayAccounts">
          <div className="modalAccounts">
            <span onClick={() => setShowStaffModal(false)} className="close-icon">&times;</span>
            <h2>Add New Staff</h2>
            <input type="text" name="firstname" placeholder="First Name" onChange={handleInputChange} />
            <input type="text" name="lastname" placeholder="Last Name" onChange={handleInputChange} />
            <input type="text" name="contact" placeholder="Contact Number" onChange={handleInputChange} />
            <input type="text" name="address" placeholder="Address" onChange={handleInputChange} />
            <input type="text" name="email" placeholder="Email" onChange={handleInputChange} />
            <input type="text" name="username" placeholder="Username" onChange={handleInputChange} />

            {/* 👁️ Password Input with Toggle */}
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
                style={{ paddingRight: '40px' }} // Space for eye icon
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button onClick={handleAddStaff} className="bg-red-800 text-white px-4 py-2 rounded">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
