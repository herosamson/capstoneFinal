import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';
import logo2 from './logo2.png';

function Administrator() {
  const [users, setUsers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]); // New state for SuperAdmins
  const [editAdminId, setEditAdminId] = useState(null);
  const [editSuperAdminId, setEditSuperAdminId] = useState(null); // State for editing SuperAdmins
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSuperAdminModal, setShowSuperAdminModal] = useState(false); // State for SuperAdmin modal
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const [editFormData, setEditFormData] = useState({
    firstname: '', lastname: '', contact: '', address: '', email: '', username: '', password: ''
  });
  const [editSuperAdminFormData, setEditSuperAdminFormData] = useState({
    firstname: '', lastname: '', contact: '', email: '', username: '', password: ''
  });
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
  const [newSuperAdmin, setNewSuperAdmin] = useState({ // State for new SuperAdmin
    firstname: '',
    lastname: '',
    contact: '',
    email: '',
    username: '',
    password: '',
  });

  // Validation functions (reuse or adapt as needed)
  const validateAdminInput = () => {
    const { firstname, lastname, contact, email, username, password } = newAdmin;

    const isAlphaWithSpaces = (str) => /^[A-Za-z\s]+$/.test(str);
    const isValidEmail = (email) => email.endsWith('@gmail.com') || email.endsWith('@yahoo.com');
    const isUniqueUsername = (username) => 
        !users.some((user) => user.username === username) &&
        !staff.some((staff) => staff.username === username) &&
        !admins.some((admin) => admin.username === username) &&
        !superAdmins.some((sa) => sa.username === username); // Ensure uniqueness across SuperAdmins
    const isUniqueContact = (contact) => 
        !users.some((user) => user.contact === contact) &&
        !staff.some((staff) => staff.contact === contact) &&
        !admins.some((admin) => admin.contact === contact) &&
        !superAdmins.some((sa) => sa.contact === contact);
    const isUniqueEmail = (email) => 
        !users.some((user) => user.email === email) &&
        !staff.some((staff) => staff.email === email) &&
        !admins.some((admin) => admin.email === email) &&
        !superAdmins.some((sa) => sa.email === email);
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
        alert('Email should be @gmail.com and unique.');
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

  const validateSuperAdminInput = () => {
    const { firstname, lastname, contact, email, username, password } = newSuperAdmin;

    const isAlphaWithSpaces = (str) => /^[A-Za-z\s]+$/.test(str);
    const isValidEmail = (email) => email.endsWith('@gmail.com') || email.endsWith('@yahoo.com');
    const isUniqueUsername = (username) => 
        !users.some((user) => user.username === username) &&
        !staff.some((staff) => staff.username === username) &&
        !admins.some((admin) => admin.username === username) &&
        !superAdmins.some((sa) => sa.username === username);
    const isUniqueContact = (contact) => 
        !users.some((user) => user.contact === contact) &&
        !staff.some((staff) => staff.contact === contact) &&
        !admins.some((admin) => admin.contact === contact) &&
        !superAdmins.some((sa) => sa.contact === contact);
    const isUniqueEmail = (email) => 
        !users.some((user) => user.email === email) &&
        !staff.some((staff) => staff.email === email) &&
        !admins.some((admin) => admin.email === email) &&
        !superAdmins.some((sa) => sa.email === email);
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
        alert('Email should be @gmail.com and unique.');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSuperAdmin),
      });

      if (response.ok) {
        const addedSuperAdmin = await response.json();
        setSuperAdmins((prevSuperAdmins) => [...prevSuperAdmins, addedSuperAdmin]);
        setShowSuperAdminModal(false);
        setNewSuperAdmin({
          firstname: '',
          lastname: '',
          contact: '',
          email: '',
          username: '',
          password: '',
        });
      } else {
        console.error('Failed to add superadmin');
      }
    } catch (error) {
      console.error('Error adding superadmin:', error);
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

  const deleteAdmin = async (id) => {
    try {
      await fetch(`https://idonate1.onrender.com/routes/accounts/admin/${id}`, { method: 'DELETE' });
      setAdmins(admins.filter((admin) => admin._id !== id));
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const deleteSuperAdmin = async (id) => { // Delete SuperAdmin
    try {
      await fetch(`https://idonate1.onrender.com/routes/accounts/superadmin/delete/${id}`, { method: 'DELETE' });
      setSuperAdmins(superAdmins.filter((sa) => sa._id !== id));
    } catch (error) {
      console.error('Error deleting superadmin:', error);
    }
  };

  const handleEditClick = (admin) => {
    setEditAdminId(admin._id);
    setEditFormData({
      firstname: admin.firstname, lastname: admin.lastname, contact: admin.contact, address: admin.address,
      email: admin.email, username: admin.username, password: ''
    });
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
                        <button type="button" className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 duration-200 rounded-md mr-2" onClick={() => deleteAdmin(admin._id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button type="button" className="px-10 py-1.5 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mt-3 ml-1" onClick={() => setShowAdminModal(true)}>Add Administrator</button>
        {/* Admin Modal */}
        {showAdminModal && (
          <div className="modal-overlayAccounts">
            <div className="modalAccounts">
              <div className="modal-headerAccounts">
              <span className="close-icon" onClick={() => setShowAdminModal(false)}>&times;</span>
                <h2 className='text-2xl mb-4'><strong>Add New Administrator</strong></h2>
                <input type="text" name="firstname" placeholder="First Name" value={newAdmin.firstname} onChange={(e) => handleInputChange(e, 'admin')} />
                <input type="text" name="lastname" placeholder="Last Name" value={newAdmin.lastname} onChange={(e) => handleInputChange(e, 'admin')} />
                <input type="text" name="contact" placeholder="Contact Number" value={newAdmin.contact} onChange={(e) => handleInputChange(e, 'admin')} />
                <input type="text" name="address" placeholder="Address" value={newAdmin.address} onChange={(e) => handleInputChange(e, 'admin')} />
                <input type="text" name="email" placeholder="Email" value={newAdmin.email} onChange={(e) => handleInputChange(e, 'admin')} />
                <input type="text" name="username" placeholder="Username" value={newAdmin.username} onChange={(e) => handleInputChange(e, 'admin')} />
                <input type="password" name="password" placeholder="Password" value={newAdmin.password} onChange={(e) => handleInputChange(e, 'admin')} />
                <button type="button" className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md mt-3 ml-1" onClick={handleAddAdmin}>Save</button>
              </div>
            </div>
          </div>
        )}
        {/* SuperAdmin Modal */}
        {showSuperAdminModal && (
          <div className="modal-overlayAccounts">
            <div className="modalAccounts">
              <div className="modal-headerAccounts">
              <span className="close-icon" onClick={() => setShowSuperAdminModal(false)}>&times;</span>
                <h2 className='text-2xl mb-4'><strong>Add New Super Administrator</strong></h2>
                <input type="text" name="firstname" placeholder="First Name" value={newSuperAdmin.firstname} onChange={(e) => handleInputChange(e, 'superadmin')} />
                <input type="text" name="lastname" placeholder="Last Name" value={newSuperAdmin.lastname} onChange={(e) => handleInputChange(e, 'superadmin')} />
                <input type="text" name="contact" placeholder="Contact Number" value={newSuperAdmin.contact} onChange={(e) => handleInputChange(e, 'superadmin')} />
                <input type="text" name="email" placeholder="Email" value={newSuperAdmin.email} onChange={(e) => handleInputChange(e, 'superadmin')} />
                <input type="text" name="username" placeholder="Username" value={newSuperAdmin.username} onChange={(e) => handleInputChange(e, 'superadmin')} />
                <input type="password" name="password" placeholder="Password" value={newSuperAdmin.password} onChange={(e) => handleInputChange(e, 'superadmin')} />
                <button type="button" className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md mt-3 ml-1" onClick={handleAddSuperAdmin}>Save</button>
              </div>
            </div>
          </div>
        )}

        {/* SuperAdmin Table */}
        <h1 className='text-3xl font-bold mt-10 mb-4'>Super Administrator Management</h1>
        <table className='table-auto w-full overflow-x-auto overflow-y-auto max-h-[500px]'>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th className='font-normal py-1.5 px-2'>Firstname</th>
              <th className='font-normal py-1.5 px-2'>Lastname</th>
              <th className='font-normal py-1.5 px-2'>Email</th>
              <th className='font-normal py-1.5 px-2'>Contact</th>
              <th className='font-normal py-1.5 px-2'>Actions</th>
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
                      <td className='px-10 py-2'>
                        <button type="button" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mr-2" onClick={() => handleEditSuperAdminClick(sa)}>Edit</button>
                        <button type="button" className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 duration-200 rounded-md mr-2" onClick={() => deleteSuperAdmin(sa._id)}>Delete</button>
                      </td>
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
