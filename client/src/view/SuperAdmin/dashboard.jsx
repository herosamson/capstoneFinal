import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './dashboard.css';
import logo2 from './logo2.png';

function Admin() {
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });
  const [newStaff, setNewStaff] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });
  const [newAdmin, setNewAdmin] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchStaff();
    fetchAdmins();
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

  const fetchStaff = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/staff');
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/admin');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
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
      await fetch(`https://idonate1.onrender.com/routes/accounts/user/${id}`, { method: 'DELETE' });
      setUsers(users.filter((user) => user._id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
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
    const isValidEmail = (email) => email.endsWith('@gmail.com') || email.endsWith('@yahoo.com');
    const isUniqueUsername = (username) => !users.some((user) => user.username === username);
    const isValidPassword = (password) => /^(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    if (!isAlphaWithSpaces(firstname) || !isAlphaWithSpaces(lastname)) {
        alert('First name and Last name should contain letters only (spaces are allowed).');
        return false;
    }

    if (contact.length !== 11 || isNaN(contact) || !/^09\d{9}$/.test(contact)) {
        alert('Please enter a valid Contact Number.');
        return false;
    }

    if (!isValidEmail(email)) {
        alert('Email should be either @gmail.com or @yahoo.com.');
        return false;
    }

    if (!isUniqueUsername(username)) {
        alert('Username must be unique.');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and contain at least 1 number.');
        return false;
    }

    return true;
};

const validateStaffInput = () => {
    const { firstname, lastname, contact, email, username, password } = newStaff;

    const isAlphaWithSpaces = (str) => /^[A-Za-z\s]+$/.test(str);
    const isValidEmail = (email) => email.endsWith('@gmail.com') || email.endsWith('@yahoo.com');
    const isUniqueUsername = (username) => 
        !users.some((user) => user.username === username) &&
        !staff.some((staff) => staff.username === username) &&
        !admins.some((admin) => admin.username === username);
    const isUniqueContact = (contact) => 
        !users.some((user) => user.contact === contact) &&
        !staff.some((staff) => staff.contact === contact) &&
        !admins.some((admin) => admin.contact === contact);
    const isUniqueEmail = (email) => 
        !users.some((user) => user.email === email) &&
        !staff.some((staff) => staff.email === email) &&
        !admins.some((admin) => admin.email === email);
    const isValidPassword = (password) => /^(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    if (!isAlphaWithSpaces(firstname) || !isAlphaWithSpaces(lastname)) {
        alert('First name and Last name should contain letters only (spaces are allowed).');
        return false;
    }

    if (contact.length !== 11 || isNaN(contact) || !isUniqueContact(contact) || !/^09\d{9}$/.test(contact)) {
        alert('Please enter a valid Contact Number.');
        return false;
    }

    if (!isValidEmail(email) || !isUniqueEmail(email)) {
        alert('Email should be either @gmail.com or @yahoo.com and unique.');
        return false;
    }

    if (!isUniqueUsername(username)) {
        alert('Username must be unique.');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and contain at least 1 number.');
        return false;
    }

    return true;
};

const validateAdminInput = () => {
    const { firstname, lastname, contact, email, username, password } = newAdmin;

    const isAlphaWithSpaces = (str) => /^[A-Za-z\s]+$/.test(str);
    const isValidEmail = (email) => email.endsWith('@gmail.com') || email.endsWith('@yahoo.com');
    const isUniqueUsername = (username) => 
        !users.some((user) => user.username === username) &&
        !staff.some((staff) => staff.username === username) &&
        !admins.some((admin) => admin.username === username);
    const isUniqueContact = (contact) => 
        !users.some((user) => user.contact === contact) &&
        !staff.some((staff) => staff.contact === contact) &&
        !admins.some((admin) => admin.contact === contact);
    const isUniqueEmail = (email) => 
        !users.some((user) => user.email === email) &&
        !staff.some((staff) => staff.email === email) &&
        !admins.some((admin) => admin.email === email);
    const isValidPassword = (password) => /^(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

    if (!isAlphaWithSpaces(firstname) || !isAlphaWithSpaces(lastname)) {
        alert('First name and Last name should contain letters only (spaces are allowed).');
        return false;
    }

    if (contact.length !== 11 || isNaN(contact) || !isUniqueContact(contact) || !/^09\d{9}$/.test(contact)) {
        alert('Please enter a valid Contact Number.');
        return false;
    }

    if (!isValidEmail(email) || !isUniqueEmail(email)) {
        alert('Email should be either @gmail.com or @yahoo.com and unique.');
        return false;
    }

    if (!isUniqueUsername(username)) {
        alert('Username must be unique.');
        return false;
    }

    if (!isValidPassword(password)) {
        alert('Password must be at least 8 characters long and contain at least 1 number.');
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
          address: '',
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

      if (response.ok) {
        const addedStaff = await response.json();
        setStaff((prevStaff) => [...prevStaff, addedStaff]);
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
      } else {
        console.error('Failed to add staff');
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const handleAddAdmin = async () => {
    if (Object.values(newAdmin).some((field) => field === '')) {
      alert('Please fill in all fields');
      return;
    }

    if (!validateAdminInput()) {
      return;
    }

    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        const addedAdmin = await response.json();
        setAdmins((prevAdmins) => [...prevAdmins, addedAdmin]);
        setShowAdminModal(false);
        setNewAdmin({
          firstname: '',
          lastname: '',
          contact: '',
          address: '',
          email: '',
          username: '',
          password: '',
        });
      } else {
        console.error('Failed to add admin');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
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
      const addressMatch = typeof user.address === 'string' && user.address.toLowerCase().includes(lowerCaseQuery);
      const emailMatch = typeof user.email === 'string' && user.email.toLowerCase().includes(lowerCaseQuery);
      const usernameMatch = typeof user.username === 'string' && user.username.toLowerCase().includes(lowerCaseQuery);
      
      return firstnameMatch || lastnameMatch || contactMatch || addressMatch || emailMatch || usernameMatch;
    });
  
    setFilteredUsers(filteredData);
  };

  return (
    <div id="containerU">
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
              <th className='font-normal py-1.5 px-2'>Address</th>
              <th className='font-normal py-1.5 px-2'>Email</th>
              <th className='font-normal py-1.5 px-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className='even:bg-gray-200'>
                <td className='px-10 py-2'>{user.firstname}</td>
                <td className='px-10 py-2'>{user.lastname}</td>
                <td className='px-10 py-2'>{user.address}</td>
                <td className='px-10 py-2'>{user.email}</td>
                <td className='px-10 py-2'>
                  <button type="button" className="deleteBtn" onClick={() => deleteUser(user._id)}>Delete</button>
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
            <input type="text" name="address" placeholder="Address" value={newUser.address} onChange={(e) => handleInputChange(e, 'user')} />
            <input type="text" name="email" placeholder="Email" value={newUser.email} onChange={(e) => handleInputChange(e, 'user')} />
            <input type="text" name="username" placeholder="Username" value={newUser.username} onChange={(e) => handleInputChange(e, 'user')} />
            <input type="password" name="password" placeholder="Password" value={newUser.password} onChange={(e) => handleInputChange(e, 'user')} />
            <button type="button" className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md mt-3 ml-1" onClick={handleAddUser}>Save</button>
          </div>
          </div>
        </div>
      )}
      {/* Staff Modal */}
      {showStaffModal && (
        <div className="modal-overlayAccounts">
        <div className="modalAccounts">
        <span className="close-icon" onClick={() => setShowStaffModal(false)}>&times;</span>
          <div className="modal-headerAccounts">
            <h2>Add New Staff</h2>
            <input type="text" name="firstname" placeholder="First Name" value={newStaff.firstname} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="lastname" placeholder="Last Name" value={newStaff.lastname} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="contact" placeholder="Contact Number" value={newStaff.contact} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="address" placeholder="Address" value={newStaff.address} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="email" placeholder="Email" value={newStaff.email} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="username" placeholder="Username" value={newStaff.username} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="password" name="password" placeholder="Password" value={newStaff.password} onChange={(e) => handleInputChange(e, 'staff')} />
            <button type="button" className="sBtn1" onClick={handleAddStaff}>Save</button>
          </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {showAdminModal && (
        <div className="modal-overlayAccounts">
        <div className="modalAccounts">
        <span className="close-icon" onClick={() => setShowAdminModal(false)}>&times;</span>
          <div className="modal-headerAccounts">
            <h2>Add New Admin</h2>
            <input type="text" name="firstname" placeholder="First Name" value={newAdmin.firstname} onChange={(e) => handleInputChange(e, 'admin')} />
            <input type="text" name="lastname" placeholder="Last Name" value={newAdmin.lastname} onChange={(e) => handleInputChange(e, 'admin')} />
            <input type="text" name="contact" placeholder="Contact Number" value={newAdmin.contact} onChange={(e) => handleInputChange(e, 'admin')} />
            <input type="text" name="address" placeholder="Address" value={newAdmin.address} onChange={(e) => handleInputChange(e, 'admin')} />
            <input type="text" name="email" placeholder="Email" value={newAdmin.email} onChange={(e) => handleInputChange(e, 'admin')} />
            <input type="text" name="username" placeholder="Username" value={newAdmin.username} onChange={(e) => handleInputChange(e, 'admin')} />
            <input type="password" name="password" placeholder="Password" value={newAdmin.password} onChange={(e) => handleInputChange(e, 'admin')} />
            <button type="button" className="sBtn1" onClick={handleAddAdmin}>Save</button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
