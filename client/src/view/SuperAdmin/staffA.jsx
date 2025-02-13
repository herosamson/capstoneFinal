import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './staffA.css';
import logo2 from './logo2.png';
import axios from 'axios';

function Staff() {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editStaffId, setEditStaffId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false); 
  const [superAdminPassword, setSuperAdminPassword] = useState(''); 
  const [deleteUserId, setDeleteUserId] = useState(null); 
  const [isAuthorized, setIsAuthorized] = useState(false); 
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [newStaff, setNewStaff] = useState({
    firstname: '',
    lastname: '',
    contact: '',
    address: '',
    email: '',
    username: '',
    password: '',
  });
  const [showStaffModal, setShowStaffModal] = useState(false);
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
      alert('Authorization successful! You can now delete the selected staff member.');

      // ✅ Instead of setting a global isAuthorized, store the specific user ID
      setIsAuthorized(deleteUserId);
    } else {
      alert('Authorization failed: ' + data.message);
      setIsAuthorized(null);
    }
  } catch (error) {
    console.error('Error verifying super admin:', error);
    alert('An error occurred while verifying password.');
    setIsAuthorized(null);
  }
};


const handleRequestDelete = (id) => {
  setDeleteUserId(id);
  setShowPasswordModal(true);
  setIsAuthorized(false); // Reset authorization when a new request is made
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

  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/staff');
      const data = await response.json();
      if (Array.isArray(data)) {
        setStaff(data);
      } else {
        setStaff([]);
        console.error('Expected an array but got:', data);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const superAdminUsername = localStorage.getItem('username'); // Get Super Admin username
  
      const response = await fetch(`https://idonate1.onrender.com/routes/accounts/staff/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: superAdminUsername }) // ✅ Send SuperAdmin's username
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setStaff(staff.filter(staffMember => staffMember._id !== id));
        setDeleteUserId(null);
        alert('Staff member deleted successfully.');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      alert('Failed to delete staff member.');
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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (staffMember) => {
    setEditStaffId(staffMember._id);
    setEditFormData({
      firstname: staffMember.firstname,
      lastname: staffMember.lastname,
      email: staffMember.email,
      contact: staffMember.contact,
      username: staffMember.username,
    });
    setNewPassword('');
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://idonate1.onrender.com/routes/accounts/staff/${editStaffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      if (newPassword) {
        const passwordResponse = await fetch(`https://idonate1.onrender.com/routes/accounts/staff/${editStaffId}/password`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword })
        });
        const passwordData = await passwordResponse.json();
        if (!passwordResponse.ok) {
          alert(passwordData.message);
          return;
        }
      }

      fetchStaff(); // Refresh staff list
      alert(data.message);
      setEditStaffId(null);
      setEditFormData({});
      setNewPassword('');
    } catch (error) {
      console.error('Error updating staff member:', error);
      alert('Failed to update staff member');
    }
  };

  const handleCancelEdit = () => {
    setEditStaffId(null);
    setEditFormData({});
    setNewPassword('');
  };

  const handleCancelDelete = () => {
    setShowPasswordModal(false);
    setSuperAdminPassword('');
    setDeleteUserId(null);
    setIsAuthorized(null); // ✅ Reset authorization when canceling
  };

  const filteredStaff = staff.filter(staffMember => {
    const searchLower = searchQuery.toLowerCase();
    const firstnameMatch = staffMember.firstname.toLowerCase().includes(searchLower);
    const lastnameMatch = staffMember.lastname.toLowerCase().includes(searchLower);
    const emailMatch = staffMember.email.toLowerCase().includes(searchLower);
    const contactMatch = staffMember.contact.toLowerCase().includes(searchLower);
    const usernameMatch = staffMember.username.toLowerCase().includes(searchLower);
    return firstnameMatch || lastnameMatch || emailMatch || contactMatch || usernameMatch;
  });

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
        <h1 className='text-3xl font-bold mt-2 mb-4'>Staff Management</h1>
        <div className="search-container" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'flex-start' }}>
          <input
            type="text"
            placeholder="Search staff..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ width: '200px', height: '30px', borderRadius: '5px' }}
          />
        </div>
        <table className='table-auto w-full mt-4 mb-4'>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th className='font-normal py-1.5 px-2'>First Name</th>
              <th className='font-normal py-1.5 px-2'>Last Name</th>
              <th className='font-normal py-1.5 px-2'>Email</th>
              <th className='font-normal py-1.5 px-2'>Contact</th>
              <th className='font-normal py-1.5 px-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staffMember) => (
              <tr key={staffMember._id} className='even:bg-gray-200'>
                {editStaffId === staffMember._id ? (
                  <>
                    <td className='px-10 py-2'><input className="w-40" type="text" name="firstname" value={editFormData.firstname} onChange={handleEditFormChange} /></td>
                    <td className='px-10 py-2'><input className="w-40" type="text" name="lastname" value={editFormData.lastname} onChange={handleEditFormChange} /></td>
                    <td className='px-10 py-2'><input  readOnly
    className="w-60 bg-gray-100 text-gray-500 cursor-not-allowed"type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} /></td>
                    <td className='px-10 py-2'><input className="w-60" type="text" name="contact" value={editFormData.contact} onChange={handleEditFormChange} /></td>
                    <td className='px-10 py-2'>
                      <button type="button" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mr-2" onClick={handleEditFormSubmit}>Save</button>
                      <button type="button" className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 duration-200 rounded-md mr-2" onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className='px-10 py-2'>{staffMember.firstname}</td>
                    <td className='px-10 py-2'>{staffMember.lastname}</td>
                    <td className='px-10 py-2'>{staffMember.email}</td>
                    <td className='px-10 py-2'>{staffMember.contact}</td>
                    <td className='px-10 py-2'>
                      <button type="button" className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mr-2" onClick={() => handleEditClick(staffMember)}>Edit</button>
                      {isAuthorized === staffMember._id ? (
                      <button
                        type="button"
                        className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 duration-200 rounded-md mr-2"
                        onClick={() => handleDelete(staffMember._id)}
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-4 py-2 text-white bg-red-600 hover:bg-red-800 duration-200 rounded-md mr-2"
                        onClick={() => {
                          setDeleteUserId(staffMember._id); // ✅ Store the ID of the user requesting deletion
                          setShowPasswordModal(true);
                        }}
                      >
                        Request Delete
                      </button>
                    )}

                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <button type="button" className="px-10 py-1.5 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mt-3 ml-1" onClick={() => setShowStaffModal(true)}>Add Staff</button>
      </div>
      {/* Staff Modal */}
      {showStaffModal && (
        <div className="modal-overlayAccounts">
        <div className="modalAccounts">
          <div className="modal-headerAccounts">
          <span className="close-icon" onClick={() => setShowStaffModal(false)}>&times;</span>
            <h2 className='text-2xl mb-4'><strong>Add New Staff</strong></h2>
            <input type="text" name="firstname" placeholder="First Name" value={newStaff.firstname} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="lastname" placeholder="Last Name" value={newStaff.lastname} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="contact" placeholder="Contact Number" value={newStaff.contact} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="address" placeholder="Address" value={newStaff.address} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="email" placeholder="Email" value={newStaff.email} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="text" name="username" placeholder="Username" value={newStaff.username} onChange={(e) => handleInputChange(e, 'staff')} />
            <input type="password" name="password" placeholder="Password" value={newStaff.password} onChange={(e) => handleInputChange(e, 'staff')} />
            <button type="button" className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md mt-3 ml-1" onClick={handleAddStaff}>Save</button>
          </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Enter Super Admin Password</h2>
            <input
              type="password"
              placeholder="Super Admin Password"
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

    </div>
  );
}

export default Staff;
