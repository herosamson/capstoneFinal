import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css';
import logo2 from './logo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; 

function Admin() {
  const [users, setUsers] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);  
  const [superAdminPassword, setSuperAdminPassword] = useState('');   
  const [showSuperAdminPassword, setShowSuperAdminPassword] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState(null);  
  const [isAuthorized, setIsAuthorized] = useState(false); 
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    email: '',
    username: '',
    password: '',
  });
  const [newStaff, setNewStaff] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    email: '',
    username: '',
    password: '',
  });
  const [newAdmin, setNewAdmin] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    email: '',
    username: '',
    password: '',
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/users');
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); // Initialize filteredUsers with all users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
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

  const deleteUser = async (id) => {
    try {
      const superAdminUsername = localStorage.getItem('username'); // Get Super Admin username
  
      const response = await fetch(`https://idonate1.onrender.com/routes/accounts/user/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: superAdminUsername }) // ✅ Send SuperAdmin's username
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
        alert('User deleted successfully.');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };
  

  const handleVerifySuperAdmin = async () => {
    try {
      const response = await fetch(`https://idonate1.onrender.com/routes/accounts/verify-superadmin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: superAdminPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setShowPasswordModal(false);
        setSuperAdminPassword('');
        alert('Authorization successful! You can now delete the donor.');
  
        // ✅ Instead of setting a global isAuthorized, store the specific user ID
        setIsAuthorized(deleteUserId);
      } else {
        alert('Authorization failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error verifying super admin:', error);
      alert('An error occurred while verifying password.');
    }
  };
  
  
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'user') {
      setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    } else if (type === 'staff') {
      setNewStaff((prevStaff) => ({ ...prevStaff, [name]: value }));
    } else if (type === 'admin') {
      setNewAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
    }
  };

  const validateUserInput = () => {
    const { firstname, lastname, contact, email, username, password } = newUser;
  
    const isAlphaWithSpaces = (str) => /^[A-Za-z\s]+$/.test(str);
    const isUniqueUsername = (username) => !users.some((user) => user.username === username);
    const isValidPassword = (password) => /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
  // ✅ Allow any valid email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isAlphaWithSpaces(firstname) || !isAlphaWithSpaces(lastname)) {
        alert('First name and Last name should contain letters only (spaces are allowed).');
        return false;
    }

    if (contact.length !== 11 || isNaN(contact) || !/^09\d{9}$/.test(contact)) {
        alert('Please enter a valid Contact Number.');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!isUniqueUsername(username)) {
        alert('Username must be unique.');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
        return false;
    }

    return true;
};

  

  const handleAddUser = async () => {
    if (Object.values(newUser).some((field) => field === '')) {
      alert('Please fill in all fields');
      return;
    }
  
    if (!validateUserInput()) {
      return;
    }
  
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/register-verified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
  
      if (response.ok) {
        const addedUser = await response.json();
        setUsers((prevUsers) => [...prevUsers, addedUser]);
        setFilteredUsers((prevFilteredUsers) => [...prevFilteredUsers, addedUser]);
        alert('User added successfully');
        setShowUserModal(false);
        setNewUser({
          firstname: '',
          lastname: '',
          contact: '',
          email: '',
          username: '',
          password: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Failed to add user: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterUsers(e.target.value);
  };

  const filterUsers = (query) => {
    const lowerCaseQuery = query.toLowerCase();
    const filteredData = users.filter((user) => {
      const firstnameMatch = typeof user.firstname === 'string' && user.firstname.toLowerCase().includes(lowerCaseQuery);
      const lastnameMatch = typeof user.lastname === 'string' && user.lastname.toLowerCase().includes(lowerCaseQuery);
      const contactMatch = user.contact && user.contact.toString().toLowerCase().includes(lowerCaseQuery);
      const emailMatch = typeof user.email === 'string' && user.email.toLowerCase().includes(lowerCaseQuery);
      const usernameMatch = typeof user.username === 'string' && user.username.toLowerCase().includes(lowerCaseQuery);
      
      return firstnameMatch || lastnameMatch || contactMatch || emailMatch || usernameMatch;
    });
  
    setFilteredUsers(filteredData);
  };

  return (
    <div id="containerU">
      <div id="sidebar">
       <ul>
                 <li><img className="logoU" src={logo2} alt="Logo" /></li>
                 <br />
                  <li><Link to="/analyticsSA">Dashboard</Link></li>
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
      <div id="contentU">
        <h1 className='text-3xl font-bold mt-2 mb-4'>Donors Management</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ width: '200px', height: '30px', borderRadius: '5px' }}
          />
        </div>
        <table className='table-auto w-full mt-4 mb-4 '>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th className='font-normal py-1.5 px-2'>First Name</th>
              <th className='font-normal py-1.5 px-2'>Last Name</th>
              <th className='font-normal py-1.5 px-2'>Contact</th>
              <th className='font-normal py-1.5 px-2'>Email</th>
              <th className='font-normal py-1.5 px-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className='even:bg-gray-200'>
                <td className='px-10 py-2'>{user.firstname}</td>
                <td className='px-10 py-2'>{user.lastname}</td>
                <td className='px-10 py-2'>{user.contact}</td>
                <td className='px-10 py-2'>{user.email}</td>
                <td className='px-10 py-2'>
                {isAuthorized === user._id ? (
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-red-700 hover:bg-red-800 duration-200 rounded-md mr-2"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 text-white bg-red-400 hover:bg-red-600 duration-200 rounded-md mr-2"
                    onClick={() => {
                      setDeleteUserId(user._id); // Set the user ID to be deleted
                      setShowPasswordModal(true);
                    }}
                  >
                    Delete
                  </button>
                )}

              </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="px-10 py-1.5 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mt-3 ml-1" onClick={() => setShowUserModal(true)}>Add Donor</button>
      </div>
        {/* User Modal */}
        {showUserModal && (
     <div className="modal-overlayAccounts">
        <div className="modalAccounts">
          <div className="modal-headerAccounts">
          <span className="close-icon" onClick={() => setShowUserModal(false)}>&times;</span>
            <h2 className='text-2xl mb-2'><strong>Add New Donor</strong></h2>
            <input type="text" name="firstname" placeholder="First Name" value={newUser.firstname} onChange={(e) => handleInputChange(e, 'user')} />
            <input type="text" name="lastname" placeholder="Last Name" value={newUser.lastname} onChange={(e) => handleInputChange(e, 'user')} />
            <input type="text" name="contact" placeholder="Contact Number" value={newUser.contact} onChange={(e) => handleInputChange(e, 'user')} />
        
            <input type="text" name="email" placeholder="Email" value={newUser.email} onChange={(e) => handleInputChange(e, 'user')} />
            <input type="text" name="username" placeholder="Username" value={newUser.username} onChange={(e) => handleInputChange(e, 'user')} />
            <div className="password-container">
                <input 
                  type={showUserPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Password" 
                  value={newUser.password} 
                  onChange={(e) => handleInputChange(e, 'user')} 
                />
                <FontAwesomeIcon 
                  icon={showUserPassword ? faEye : faEyeSlash}
                  className="eye-icon"
                  onClick={() => setShowUserPassword(!showUserPassword)}
                />
              </div>
            <button type="button" className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md mt-3 ml-1" onClick={handleAddUser}>Save</button>
          </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Enter your Password</h2>
            <div className="relative">
            <input
              type={showSuperAdminPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={superAdminPassword}
              onChange={(e) => setSuperAdminPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md pr-10"
            />
            <FontAwesomeIcon
              icon={showSuperAdminPassword ? faEye : faEyeSlash}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
              onClick={() => setShowSuperAdminPassword(!showSuperAdminPassword)}
            />
          </div>

            <div className="flex justify-end mt-4">
            <button
                className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2"
                onClick={() => {
                  setShowPasswordModal(false);
                  setSuperAdminPassword('');
                  setDeleteUserId(null);
                  setIsAuthorized(null); 
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                onClick={handleVerifySuperAdmin}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
