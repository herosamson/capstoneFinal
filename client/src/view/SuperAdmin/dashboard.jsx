import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css';
import logo2 from './logo2.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

function Admin() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/users');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const validateUserInput = () => {
    const { firstname, lastname, contact, email, username, password } = newUser;
    const errors = [];

    // First name validation
    if (!firstname.trim() || !/^[a-zA-Z\s]+$/.test(firstname)) {
      errors.push('Please enter a valid First name.');
    }

    // Last name validation
    if (!lastname.trim() || !/^[a-zA-Z\s]+$/.test(lastname)) {
      errors.push('Please enter a valid Last name.');
    }

    // Contact number validation (Only for Philippines)
    if (!/^\d{10}$/.test(contact)) {
      errors.push('Please enter a valid 10-digit contact number.');
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9]+(?:[._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }

    // Username validation
    if (!username.trim() || /[<>]/.test(username)) {
      errors.push('Please enter a valid Username.');
    }

    // Password validation (at least 8 characters, one uppercase, one number, and one special character)
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

  const handleAddUser = async () => {
    if (Object.values(newUser).some((field) => field === '')) {
      alert('Please fill in all fields.');
      return;
    }

    if (!validateUserInput()) {
      return;
    }

    // Include the country code for Philippines
    const formattedUser = { ...newUser, contact: `+63${newUser.contact}` };

    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/register-verified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server Error:', data);
        alert(`Failed to add user: ${data.message}`);
        return;
      }

      alert('User added successfully!');
      setUsers([...users, data]);
      setFilteredUsers([...filteredUsers, data]);
      setShowUserModal(false);
      setNewUser({
        firstname: '',
        lastname: '',
        contact: '',
        address: '',
        email: '',
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const lowerCaseQuery = e.target.value.toLowerCase();
    setFilteredUsers(
      users.filter(
        (user) =>
          user.firstname.toLowerCase().includes(lowerCaseQuery) ||
          user.lastname.toLowerCase().includes(lowerCaseQuery) ||
          user.email.toLowerCase().includes(lowerCaseQuery) ||
          user.username.toLowerCase().includes(lowerCaseQuery)
      )
    );
  };
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div id="containerU">
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

      <div id="contentU">
        <h1 className="text-3xl font-bold mt-2 mb-4">Donors Management</h1>
        <div className="search-container">
          <input type="text" placeholder="Search user..." value={searchQuery} onChange={handleSearchChange} />
        </div>
        <table className="table-auto w-full mt-4 mb-4">
          <thead className="bg-red-800 text-white">
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.address}</td>
                <td>{user.contact}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => alert('Delete functionality here')} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setShowUserModal(true)} className="bg-green-600 text-white px-6 py-2 rounded">Add Donor</button>
      </div>

      {showUserModal && (
        <div className="modal-overlayAccounts">
          <div className="modalAccounts">
            <span onClick={() => setShowUserModal(false)} className="close-icon">&times;</span>
            <h2>Add New Donor</h2>
            <input type="text" name="firstname" placeholder="First Name" onChange={handleInputChange} />
            <input type="text" name="lastname" placeholder="Last Name" onChange={handleInputChange} />
            <input type="text" name="contact" placeholder="Contact" onChange={handleInputChange} />
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
            <button onClick={handleAddUser}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
