import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';
import logo2 from './logo2.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Administrator() {
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false); 
  const [superAdminPassword, setSuperAdminPassword] = useState('');  
  const [deleteUserId, setDeleteUserId] = useState(null); 
  const [deleteUserRole, setDeleteUserRole] = useState(''); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [superAdmins, setSuperAdmins] = useState([]); 
  const [editAdminId, setEditAdminId] = useState(null);
  const [editSuperAdminId, setEditSuperAdminId] = useState(null); 
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false); 
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showSuperAdminPassword, setShowSuperAdminPassword] = useState(false);
  

  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const [editFormData, setEditFormData] = useState({
    firstname: '', lastname: '', contact: '', address: '', email: '', username: '', password: ''
  });
  const [editSuperAdminFormData, setEditSuperAdminFormData] = useState({
    firstname: '', lastname: '', contact: '', email: '', username: '', password: ''
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
  const [newSuperAdmin, setNewSuperAdmin] = useState({ 
    firstname: '',
    lastname: '',
    contact: '',
    email: '',
    username: '',
    password: '',
  });

  const validateAdminInput = () => {
    const { firstname, lastname, contact, email, username, password, confirmPassword } = newAdmin;
    let errors = [];
  
    // ✅ First name validation
    if (!firstname.trim() || !/^[a-zA-Z\s]*$/.test(firstname)) {
      errors.push('Please enter a valid First name.');
    }
  
    // ✅ Last name validation
    if (!lastname.trim() || !/^[a-zA-Z\s]*$/.test(lastname)) {
      errors.push('Please enter a valid Last name.');
    }
  
    // ✅ Contact number validation (Philippines +63 format - 10 digits)
    if (!/^\d{10}$/.test(contact)) {
      errors.push('Please enter a valid contact number (10 digits).');
    }
  
    // ✅ Email validation (Strict Pattern)
    const emailPattern = /^[a-zA-Z0-9]+(?:[._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }
  
    // ✅ Username validation (No < or > characters)
    if (!username.trim() || /[<>]/.test(username)) {
      errors.push('Please enter a valid Username.');
    }
  
    // ✅ Password validation (8+ characters, 1 uppercase, 1 number, 1 special character)
    if (
      !password.trim() ||
      password.length < 8 ||
      !/\d/.test(password) || // At least one number
      !/[A-Z]/.test(password) || // At least one uppercase letter
      !/[\W_]/.test(password) // At least one special character
    ) {
      errors.push('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
    }
  
    // ✅ Confirm Password match
    if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }
  
    // ✅ Unique checks for Username, Email, and Contact
    if (!isUniqueUsername(username)) {
      errors.push('Username must be unique.');
    }
  
    if (!isUniqueEmail(email)) {
      errors.push('Email is already registered.');
    }
  
    if (!isUniqueContact(contact)) {
      errors.push('Contact number is already registered.');
    }
  
    // ❌ If errors exist, show alert
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
  
    return true;
  };
  
  const validateSuperAdminInput = () => {
    const { firstname, lastname, contact, email, username, password, confirmPassword } = newSuperAdmin;
    let errors = [];
  
    // ✅ First name validation
    if (!firstname.trim() || !/^[a-zA-Z\s]*$/.test(firstname)) {
      errors.push('Please enter a valid First name.');
    }
  
    // ✅ Last name validation
    if (!lastname.trim() || !/^[a-zA-Z\s]*$/.test(lastname)) {
      errors.push('Please enter a valid Last name.');
    }
  
    // ✅ Contact number validation (Philippines +63 format - 10 digits)
    if (!/^\d{10}$/.test(contact)) {
      errors.push('Please enter a valid contact number (10 digits).');
    }
  
    // ✅ Email validation (Strict Pattern)
    const emailPattern = /^[a-zA-Z0-9]+(?:[._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }
  
    // ✅ Username validation (No < or > characters)
    if (!username.trim() || /[<>]/.test(username)) {
      errors.push('Please enter a valid Username.');
    }
  
    // ✅ Password validation (8+ characters, 1 uppercase, 1 number, 1 special character)
    if (
      !password.trim() ||
      password.length < 8 ||
      !/\d/.test(password) || // At least one number
      !/[A-Z]/.test(password) || // At least one uppercase letter
      !/[\W_]/.test(password) // At least one special character
    ) {
      errors.push('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.');
    }
  
    // ✅ Confirm Password match
    if (password !== confirmPassword) {
      errors.push('Passwords do not match.');
    }
  
    // ✅ Unique checks for Username, Email, and Contact
    if (!isUniqueUsername(username)) {
      errors.push('Username must be unique.');
    }
  
    if (!isUniqueEmail(email)) {
      errors.push('Email is already registered.');
    }
  
    if (!isUniqueContact(contact)) {
      errors.push('Contact number is already registered.');
    }
  
    // ❌ If errors exist, show alert
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
  
    return true;
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setAdmins((prevAdmins) => [...prevAdmins, data]);
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
        alert('Administrator added successfully!'); // ✅ Alert on success
      } else {
        alert(`Failed to add administrator: ${data.message}`); // ❌ Show error message
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('An error occurred while adding the administrator. Please try again.');
    }
  };
  

  const handleVerifySuperAdmin = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/verify-superadmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: superAdminPassword }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setIsAuthorized(true); // ✅ Allow delete button to appear
        setShowPasswordModal(false);
        setSuperAdminPassword('');
        alert('Authorization successful! You can now delete this user.');
      } else {
        alert('Authorization failed: ' + data.message);
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error verifying super admin:', error);
      alert('An error occurred while verifying password.');
      setIsAuthorized(false);
    }
  };

  const handleAddSuperAdmin = async () => {
    if (Object.values(newSuperAdmin).some((field) => field === '')) {
      alert('Please fill in all fields');
      return;
    }
    
  
    if (!validateSuperAdminInput()) {
      return;
    }
  
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/superadmin/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSuperAdmin),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuperAdmins((prevSuperAdmins) => [...prevSuperAdmins, data]);
        setShowSuperAdminModal(false);
        setNewSuperAdmin({
          firstname: '',
          lastname: '',
          contact: '',
          email: '',
          username: '',
          password: '',
        });
        alert('Super Administrator added successfully!'); // ✅ Success message
      } else {
        alert(`Failed to add super administrator: ${data.message}`); // ❌ Show error message
      }
    } catch (error) {
      console.error('Error adding superadmin:', error);
      alert('An error occurred while adding the super administrator. Please try again.');
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
    } else if (type === 'superadmin') {
      setNewSuperAdmin((prevSuperAdmin) => ({ ...prevSuperAdmin, [name]: value }));
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchSuperAdmins(); // Fetch SuperAdmins on mount
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/admin');
      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const fetchSuperAdmins = async () => { // Fetch SuperAdmins
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/superadmin/all');
      const data = await response.json();
      setSuperAdmins(data);
    } catch (error) {
      console.error('Error fetching superadmins:', error);
    }
  };

  // DELETE LOGIC - Unified for both Admins and SuperAdmins
  const handleRequestDelete = (id, role) => {
    setDeleteUserId(id);
    setDeleteUserRole(role);
    setShowPasswordModal(true);
    setIsAuthorized(false); // Reset authorization before each new request
  };
  

  const deleteUser = async () => {
    if (!deleteUserId || !deleteUserRole) return;
  
    const superAdminUsername = localStorage.getItem('username'); // Get Super Admin username
  
    const endpoint =
      deleteUserRole === 'admin'
        ? `https://idonate1.onrender.com/routes/accounts/admin/${deleteUserId}`
        : `https://idonate1.onrender.com/routes/accounts/superadmin/delete/${deleteUserId}`;
  
    try {
      const response = await fetch(endpoint, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: superAdminUsername }) // ✅ Send SuperAdmin's username
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (deleteUserRole === 'admin') {
          setAdmins(admins.filter((admin) => admin._id !== deleteUserId));
        } else {
          setSuperAdmins(superAdmins.filter((sa) => sa._id !== deleteUserId)); // ✅ Remove from UI
        }
  
        setDeleteUserId(null);
        setDeleteUserRole('');
        setIsAuthorized(false);
        alert('User deleted successfully.');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };
  
  
  

  const handleEditClick = (admin) => {
    setEditAdminId(admin._id);
    setEditFormData({
      firstname: admin.firstname, lastname: admin.lastname, contact: admin.contact, address: admin.address,
      email: admin.email, username: admin.username, password: ''
    });
  };

  const handleCancelDelete = () => {
    setShowPasswordModal(false);
    setSuperAdminPassword('');
    setDeleteUserId(null);
    setDeleteUserRole('');
    setIsAuthorized(false); // ✅ Reset authorization when canceling
  };  

  const handleEditSuperAdminClick = (sa) => { // Handle editing SuperAdmin
    setEditSuperAdminId(sa._id);
    setEditSuperAdminFormData({
      firstname: sa.firstname, lastname: sa.lastname, contact: sa.contact,
      email: sa.email, username: sa.username, password: ''
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSuperAdminFormChange = (e) => { // Handle SuperAdmin form change
    const { name, value } = e.target;
    setEditSuperAdminFormData({ ...editSuperAdminFormData, [name]: value });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://idonate1.onrender.com/routes/accounts/admin/${editAdminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(admins.map(admin => (admin._id === editAdminId ? data : admin)));
        setEditAdminId(null);
        setEditFormData({ firstname: '', lastname: '', contact: '', address: '', email: '', username: '', password: '' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  const handleEditSuperAdminFormSubmit = async (e) => { // Handle SuperAdmin form submit
    e.preventDefault();
    try {
      const response = await fetch(`https://idonate1.onrender.com/routes/accounts/superadmin/edit/${editSuperAdminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editSuperAdminFormData),
      });
      const data = await response.json();
      if (response.ok) {
        setSuperAdmins(superAdmins.map(sa => (sa._id === editSuperAdminId ? data : sa)));
        setEditSuperAdminId(null);
        setEditSuperAdminFormData({ firstname: '', lastname: '', contact: '', email: '', username: '', password: '' });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating superadmin:', error);
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

  const handleContactChange = (e, type) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.startsWith('63')) value = value.slice(2); // Remove "63" if user types it manually
    if (value.length > 10) value = value.slice(0, 10); // Limit to 10 digits
  
    if (type === 'admin') {
      setNewAdmin((prevAdmin) => ({ ...prevAdmin, contact: value }));
    } else if (type === 'superadmin') {
      setNewSuperAdmin((prevSuperAdmin) => ({ ...prevSuperAdmin, contact: value }));
    } 
  };
  
  return (
    <div id="container">
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
      <div id="content">
        <h1  className='text-3xl font-bold mt-2 mb-4'>Administrator Management</h1>
        <table className='table-auto w-full overflow-x-auto overflow-y-auto max-h-[500px]'>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th className='font-normal py-1.5 px-2'>Firstname</th>
              <th className='font-normal py-1.5 px-2'>Lastname</th>
              <th className='font-normal py-1.5 px-2'>Address</th>
              <th className='font-normal py-1.5 px-2'>Email</th>
              <th className='font-normal py-1.5 px-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="8">No admins found</td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin._id} className='even:bg-gray-200'>
                  {editAdminId === admin._id ? (
                    <>
                      <td className='px-10 py-2'><input className="w-40" type="text" name="firstname" value={editFormData.firstname} onChange={handleEditFormChange} /></td>
                      <td className='px-10 py-2'><input className="w-40" type="text" name="lastname" value={editFormData.lastname} onChange={handleEditFormChange} /></td>
                      <td className='px-10 py-2'><input className="w-60" type="text" name="address" value={editFormData.address} onChange={handleEditFormChange} /></td>
                      <td className='px-10 py-2'><input readOnly
    className="w-60 bg-gray-100 text-gray-500 cursor-not-allowed" type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} /></td>
                      <td className='px-10 py-2'>
                        <button type="button" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mr-2" onClick={handleEditFormSubmit}>Save</button>
                        <button type="button" className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 duration-200 rounded-md mr-2" onClick={() => setEditAdminId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className='px-10 py-2'>{admin.firstname}</td>
                      <td className='px-10 py-2'>{admin.lastname}</td>
                      <td className='px-10 py-2'>{admin.address}</td>
                      <td className='px-10 py-2'>{admin.email}</td>
                      <td className='px-10 py-2'>
                        <button type="button" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mr-2" onClick={() => handleEditClick(admin)}>Edit</button>

                        {!isAuthorized || deleteUserId !== admin._id ? (
                          <button 
                            className="px-4 py-2 text-white bg-red-700 hover:bg-red-800 duration-200 rounded-md mr-2"
                            onClick={() => handleRequestDelete(admin._id, 'admin')}
                          >
                            Delete
                          </button>
                        ) : (
                          <button 
                            className="px-4 py-2 text-white bg-red-400 hover:bg-red-600 duration-200 rounded-md mr-2"
                            onClick={deleteUser} // ✅ Don't pass params here since `deleteUserId` is already set
                          >
                            Delete
                          </button>
                        )}

                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button type="button" className="px-10 py-1.5 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mt-3 ml-1" onClick={() => setShowAdminModal(true)}>Add Administrator</button>
        {showAdminModal && (
  <div className="modal-overlayAccounts">
    <div className="modalAccounts">
      <div className="modal-headerAccounts">
        <span className="close-icon" onClick={() => setShowAdminModal(false)}>&times;</span>
        <h2 className="text-2xl mb-4"><strong>Add New Administrator</strong></h2>

        <div className="authContainer">
          <input 
            type="text" name="firstname" placeholder="First Name" 
            value={newAdmin.firstname} onChange={(e) => handleInputChange(e, 'admin')}
            className="authFields"
          />
        </div>

        <div className="authContainer">
          <input 
            type="text" name="lastname" placeholder="Last Name" 
            value={newAdmin.lastname} onChange={(e) => handleInputChange(e, 'admin')}
            className="authFields"
          />
        </div>

        <div className="authContainer flex gap-2 w-full">
          <span className="p-3 bg-gray-100 border rounded-l-md">+63</span>
          <input
            type="text" name="contact" placeholder="9123456789" 
            value={newAdmin.contact} onChange={(e) => handleContactChange(e, 'admin')}
            className="authFields border-l-0 rounded-r-md flex-grow"
          />
        </div>

        <div className="authContainer">
          <input 
            type="text" name="email" placeholder="Email" 
            value={newAdmin.email} onChange={(e) => handleInputChange(e, 'admin')}
            className="authFields"
          />
        </div>

        <div className="authContainer">
          <input 
            type="text" name="username" placeholder="Username" 
            value={newAdmin.username} onChange={(e) => handleInputChange(e, 'admin')}
            className="authFields"
          />
        </div>

        <div className="authContainer relative">
          <input 
            type={showAdminPassword ? 'text' : 'password'} name="password" placeholder="Password"
            value={newAdmin.password} onChange={(e) => handleInputChange(e, 'admin')}
            className="authFields pr-10"
          />
          <span className="absolute right-3 top-3 cursor-pointer text-gray-500" 
            onClick={() => setShowAdminPassword(!showAdminPassword)}
          >
            {showAdminPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button 
          type="button" className="w-full px-10 py-3 text-white bg-red-800 hover:bg-red-700 rounded-md mt-3"
          onClick={handleAddAdmin}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

{showSuperAdminModal && (
  <div className="modal-overlayAccounts">
    <div className="modalAccounts">
      <div className="modal-headerAccounts">
        <span className="close-icon" onClick={() => setShowSuperAdminModal(false)}>&times;</span>
        <h2 className="text-2xl mb-4"><strong>Add New Super Administrator</strong></h2>

        <div className="authContainer">
          <input 
            type="text" name="firstname" placeholder="First Name" 
            value={newSuperAdmin.firstname} onChange={(e) => handleInputChange(e, 'superadmin')}
            className="authFields"
          />
        </div>

        <div className="authContainer">
          <input 
            type="text" name="lastname" placeholder="Last Name" 
            value={newSuperAdmin.lastname} onChange={(e) => handleInputChange(e, 'superadmin')}
            className="authFields"
          />
        </div>

        <div className="authContainer flex gap-2 w-full">
          <span className="p-3 bg-gray-100 border rounded-l-md">+63</span>
          <input
            type="text" name="contact" placeholder="9123456789" 
            value={newSuperAdmin.contact} onChange={(e) => handleContactChange(e, 'superadmin')}
            className="authFields border-l-0 rounded-r-md flex-grow"
          />
        </div>

        <div className="authContainer">
          <input 
            type="text" name="email" placeholder="Email" 
            value={newSuperAdmin.email} onChange={(e) => handleInputChange(e, 'superadmin')}
            className="authFields"
          />
        </div>

        <div className="authContainer">
          <input 
            type="text" name="username" placeholder="Username" 
            value={newSuperAdmin.username} onChange={(e) => handleInputChange(e, 'superadmin')}
            className="authFields"
          />
        </div>

        <div className="authContainer relative">
          <input 
            type={showSuperAdminPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={newSuperAdmin.password}
            onChange={(e) => handleInputChange(e, 'superadmin')}
            className="authFields pr-10"
          />
          <span className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowSuperAdminPassword(!showSuperAdminPassword)}
          >
            {showSuperAdminPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button 
          type="button" className="w-full px-10 py-3 text-white bg-red-800 hover:bg-red-700 rounded-md mt-3"
          onClick={handleAddSuperAdmin}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}



        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Please Enter your Password</h2>
              <input
                type="password"
                placeholder="Enter Password"
                value={superAdminPassword}
                onChange={(e) => setSuperAdminPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="flex justify-end mt-4">
              <button
                  className="px-4 py-2 bg-gray-400 text-white rounded-md mr-2"
                  onClick={handleCancelDelete} // ✅ Correct function call
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

        <h1 className='text-3xl font-bold mt-10 mb-4'>Super Administrator Management</h1>
        <table className='table-auto w-full overflow-x-auto overflow-y-auto max-h-[500px]'>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th className='font-normal py-1.5 px-2'>Firstname</th>
              <th className='font-normal py-1.5 px-2'>Lastname</th>
              <th className='font-normal py-1.5 px-2'>Email</th>
              <th className='font-normal py-1.5 px-2'>Contact</th>
            </tr>
          </thead>
          <tbody>
            {superAdmins.length === 0 ? (
              <tr>
                <td colSpan="6">No superadmins found</td>
              </tr>
            ) : (
              superAdmins.map((sa) => (
                <tr key={sa._id} className='even:bg-gray-200'>
                  {editSuperAdminId === sa._id ? (
                    <>
                      <td className='px-10 py-2'><input className="w-40" type="text" name="firstname" value={editSuperAdminFormData.firstname} onChange={handleEditSuperAdminFormChange} /></td>
                      <td className='px-10 py-2'><input className="w-40"type="text" name="lastname" value={editSuperAdminFormData.lastname} onChange={handleEditSuperAdminFormChange} /></td>
                      <td className='px-10 py-2'><input  readOnly
    className="w-60 bg-gray-100 text-gray-500 cursor-not-allowed" type="email" name="email" value={editSuperAdminFormData.email} onChange={handleEditSuperAdminFormChange} /></td>
                      <td className='px-10 py-2'><input className="w-60"type="text" name="contact" value={editSuperAdminFormData.contact} onChange={handleEditSuperAdminFormChange} /></td>
                      <td className='px-10 py-2'>
                        <button type="button" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mr-2" onClick={handleEditSuperAdminFormSubmit}>Save</button>
                        <button type="button" className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 duration-200 rounded-md mr-2" onClick={() => setEditSuperAdminId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className='px-10 py-2'>{sa.firstname}</td>
                      <td className='px-10 py-2'>{sa.lastname}</td>
                      <td className='px-10 py-2'>{sa.email}</td>
                      <td className='px-10 py-2'>{sa.contact}</td>
                      
                    </>
                  )}
                </tr>
                
              ))
            )}
          </tbody>
        </table>
        <button type="button" className="px-10 py-1.5 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mt-3 ml-1" onClick={() => setShowSuperAdminModal(true)}>Add Super Administrator</button> 
      </div>
    </div>
  );
}

export default Administrator;
