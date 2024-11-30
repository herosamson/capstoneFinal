import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/images/logo.png';
import ProfilePicture from '../../assets/images/profilepic.png';

const Profile = ({ username }) => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]); // This will now hold pending items
  const [pendingItems, setPendingItems] = useState([]); // This will now hold received donations
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ isOpen, setIsOpen ] = useState(false);
  const [editData, setEditData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    address: '',
    username: '',
  });

  console.log(user)


  const toggleMenu = () => {
    setIsOpen(!isOpen);
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

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await axios.get(`/routes/accounts/user/${username}`);
      console.log(userResponse)
      const user = userResponse.data.user;
      const receivedDonations = userResponse.data.donations.filter(donation => donation.received);
      const pendingDonations = userResponse.data.donations.filter(donation => !donation.received);

      setUser(user);
      setDonations(pendingDonations); // Set pending items initially
      setPendingItems(receivedDonations); // Set received items initially
      setEditData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contact: user.contact,
        address: user.address,
        username: user.username,
      });

    } catch (error) {
      console.error("Error fetching data:", error.response ? error.response.data : error.message);
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [username]);
  
  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username, fetchUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.includes('<') || value.includes('>')) {
      return;
    }

    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    const contactRegex = /^09\d{9}$/;

  
    if (!contactRegex.test(editData.contact)) {
      alert('Please enter a valid Contact Number.');
      return;
    }

  if (!editData.address || editData.address.trim() === "") {
    alert('Address is required.');
    return;
  }
  
    try {
      const response = await axios.put(`/routes/accounts/user/${username}`, editData);
      setUser(response.data);
      localStorage.setItem('username', editData.username);
      setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes('Username already taken')) {
          alert('Username is already taken.');
        } else if (error.response.data.message.includes('Email or contact number already in use')) {
          alert('Email or contact number is already in use.');
        } else {
          alert('Error updating user data: ' + error.response.data.message);
        }
      } else {
        setError('Error updating user data');
        console.error("Error updating user data:", error);
      }
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      contact: user?.contact,
      address: user?.address,
      username: user?.username,
    });
  };

  const handleViewItemsDonatedClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /* if (loading) return <div className="loader loader_bubble"></div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>; */

  return (
    <div className="font-Poppins min-h-screen flex flex-col">
      <div className={`flex justify-between py-3 px-6 font-Poppins bg-red-800 `}>
        <div className="logo">
          <img src={Logo} alt="Logo" className='h-auto w-48' />
        </div>
        <div className="flex text-white my-auto">
          <div className="hidden max-sm:block text-3xl cursor-pointer nav" onClick={toggleMenu}>
            &#9776;
          </div>
          <div className={`flex space-x-6 max-sm:flex-col max-sm:items-center max-sm:absolute max-sm:top-[52px] max-sm:right-0 max-sm:w-full max-sm:bg-red-800 max-sm:space-x-0 max-sm:pb-4 max-sm:pt-10 max-sm:text-lg max-sm:space-y-3 ${isOpen ? 'max-sm:flex' : 'max-sm:hidden'}`}>
              <Link className='nav' to="/home">Home</Link>
              <Link className='nav' to="/donate">Donate</Link>
              <Link className='nav' to="/profile">Profile</Link>
              <Link to="/" onClick={handleLogout}>Logout</Link>
          </div>
        </div>
      </div>

      <div className="pb-6 flex flex-col flex-grow max-lg:w-full ml-5">
        <div className="flex justify-center items-center my-[5%] space-x-10 max-xl:mx-4 max-lg:flex-col max-lg:space-x-0 max-lg:space-y-4 max-lg:justify-normal">
          <div className='space-y-4 border-2 w-[20vw] px-6 py-4 rounded-xl max-lg:w-full'>
            {isEditing ? (
              <div className="edit-container">
                <div className="border-2 p-4 border-blue-500">
                  <img src={ProfilePicture} alt="Profile" />
                </div>

                <div className="edit-field">
                  <label className="block mb-2 text-gray-700 mt-2">First Name:</label>
                  <input
                    type="text"
                    name="firstname"
                    value={editData.firstname}
                    onChange={handleChange}
                    className="read-only:bg-gray-100 read-only:text-gray-500 read-only:cursor-not-allowed w-full p-2 border rounded-lg"
                    readOnly
                  />
                </div>

                <div className="edit-field">
                  <label className="block mb-2 text-gray-700">Last Name:</label>
                  <input
                    type="text"
                    name="lastname"
                    value={editData.lastname}
                    onChange={handleChange}
                   className="read-only:bg-gray-100 read-only:text-gray-500 read-only:cursor-not-allowed w-full p-2 border rounded-lg"
                    readOnly
                  />
                </div>

                <div className="edit-field">
                  <label className="block mb-2 text-gray-700" >Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    className="read-only:bg-gray-100 read-only:text-gray-500 read-only:cursor-not-allowed w-full p-2 border rounded-lg"
                    readOnly
                  />
                </div>

                <div className="edit-field">
                  <label className="block mb-2">Contact:</label>
                  <input
                    type="text"
                    name="contact"
                    value={editData.contact}
                    onChange={handleChange}
                    className="read-only w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="edit-field">
                  <label className="block mb-2">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={editData.address}
                    onChange={handleChange}
                    className="read-only w-full p-2 border rounded-lg"
                  />
                </div>

                <div className="button-group">
                  <button type="button" className="px-4 py-1.5 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mt-2 mr-1 ml-1" onClick={handleSave}>Save</button>
                  <button type="button" className="px-4 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md" onClick={handleCancel}>Cancel</button>
                </div>
              </div>
            ) : (

              <div>
                <div className="h-52 w-52 border-2 p-4 border-blue-500 rounded-full overflow-hidden flex justify-center mx-auto">
                  <img src={ProfilePicture} alt="Profile" className='h-auto w-auto object-contain' />
                </div>
                <br></br>
                <div className="space-y-2">
                <p>Name: {user?.firstname} {user?.lastname}</p>
                <p>Email: {user?.email}</p>
                <p>Contact: {user?.contact}</p>
                <p>Address: {user?.address}</p>
                <p>Username: {user?.username}</p>
              </div>
              <div className="flex justify-center mt-6">
              <button
              type="button"
                className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[400px] max-lg:w-full border-2 shadow-md">
            <h3 className='bg-red-800 text-white px-4 py-3 text-2xl '>Pending Item Donations</h3>
            <table className='table-auto w-full'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='font-normal py-2'>Donation ID</th>
                  <th className='font-normal py-2'>Item</th>
                  <th className='font-normal py-2'>Quantity</th>
                  <th className='font-normal py-2'>Date of Delivery</th>
                  <th className='font-normal py-2'>Expiration Date</th>
                  <th className='font-normal py-2'>Status</th>
                </tr>
              </thead>
              <tbody>
                {donations ? 
                  donations.map((donation, index) => (
                    <tr key={index} className='even:bg-gray-100'>
                      <td  className='px-10 py-2' >{donation.donationId}</td>
                      <td  className='px-10 py-2' >{donation.item}</td>
                      <td  className='px-10 py-2' >{`${donation.quantity} ${donation.unit || ''}`}</td>
                      <td  className='px-10 py-2' >{new Date(donation.date).toLocaleDateString()}</td>
                      <td  className='px-10 py-2' >{donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'None'}</td>
                      <td  className='px-10 py-2' >{donation.received ? 'Through System: Delivered' : 'Through System: In Transit'}</td>
                    </tr>
                  ))
                  : <p>No data</p>
                }
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button type="button" className="px-4 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md" onClick={handleViewItemsDonatedClick}>View Items Donated</button>
            </div>
            <br></br>
          </div>
          
        </div>
        {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[80vw] max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Items Donated</h2>
      <div className="overflow-x-auto overflow-y-auto max-h-96">
        {pendingItems.length > 0 ? (
          <table className="table-auto w-full">
            <thead className='bg-red-800 text-white'>
              <tr>
                <th className="font-normal py-2 px-4">Item</th>
                <th className="font-normal py-2 px-4">Quantity</th>
                <th className="font-normal py-2 px-4">Unit</th>
                <th className="font-normal py-2 px-4">Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              {pendingItems.map((item, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className="py-2 px-4">{item.item}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.unit}</td>
                  <td className="py-2 px-4">
                    {item.expirationDate
                      ? new Date(item.expirationDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items donated yet.</p>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-700 duration-200"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </div>

     
    </div>
  );
};

export default Profile;
