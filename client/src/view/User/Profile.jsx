import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/images/logo.png';
import ProfilePicture from '../../assets/images/profilepic.png';

const Profile = ({ username }) => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]); 
  const [pendingItems, setPendingItems] = useState([]); 
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
    username: '',
  });

  const handleChangeContact = (e) => {
    let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    if (selectedCountryCode in countryStartingDigits) {
      const validStarts = countryStartingDigits[selectedCountryCode];

      if (inputValue.length > 0 && !validStarts.includes(inputValue[0])) {
        inputValue = validStarts[0] + inputValue.slice(1);
      }
    }

    // Define max length based on country
    const maxDigits = selectedCountryCode === '+63' ? 10 : 10; 
    inputValue = inputValue.substring(0, maxDigits);

    // Format the number for readability
    let formattedNumber = '';
    if (inputValue.length > 0) formattedNumber += inputValue.substring(0, 3);
    if (inputValue.length > 3) formattedNumber += ' ' + inputValue.substring(3, 6);
    if (inputValue.length > 6) formattedNumber += ' ' + inputValue.substring(6, maxDigits);

    setEditData({ ...editData, contact: formattedNumber });
  };

    const [selectedCountryCode, setSelectedCountryCode] = useState('+63');
    const countryCodes = [
      { code: '+1', country: 'United States' },
      { code: '+44', country: 'United Kingdom' },
      { code: '+63', country: 'Philippines' },
      { code: '+91', country: 'India' },
      { code: '+81', country: 'Japan' },
      { code: '+61', country: 'Australia' },
      { code: '+49', country: 'Germany' },
      { code: '+33', country: 'France' },
      { code: '+39', country: 'Italy' },
      { code: '+86', country: 'China' },
      { code: '+82', country: 'South Korea' },
      { code: '+7', country: 'Russia' },
      { code: '+55', country: 'Brazil' },
      { code: '+27', country: 'South Africa' },
      { code: '+34', country: 'Spain' },
      { code: '+971', country: 'United Arab Emirates' },
      { code: '+92', country: 'Pakistan' },
      { code: '+20', country: 'Egypt' },
      { code: '+62', country: 'Indonesia' },
      { code: '+64', country: 'New Zealand' },
      { code: '+353', country: 'Ireland' },
      { code: '+31', country: 'Netherlands' },
      { code: '+46', country: 'Sweden' },
      { code: '+41', country: 'Switzerland' },
      { code: '+32', country: 'Belgium' },
      { code: '+45', country: 'Denmark' },
      { code: '+52', country: 'Mexico' },
      { code: '+972', country: 'Israel' },
      { code: '+66', country: 'Thailand' },
      { code: '+65', country: 'Singapore' },
      { code: '+47', country: 'Norway' },
      { code: '+420', country: 'Czech Republic' },
      { code: '+48', country: 'Poland' },
      { code: '+43', country: 'Austria' },
      { code: '+36', country: 'Hungary' },
      { code: '+351', country: 'Portugal' },
      { code: '+375', country: 'Belarus' },
      { code: '+380', country: 'Ukraine' },
      { code: '+30', country: 'Greece' },
      { code: '+57', country: 'Colombia' },
      { code: '+98', country: 'Iran' },
      { code: '+90', country: 'Turkey' },
      { code: '+56', country: 'Chile' },
      { code: '+233', country: 'Ghana' },
      { code: '+234', country: 'Nigeria' },
      { code: '+264', country: 'Namibia' },
      { code: '+258', country: 'Mozambique' },
      { code: '+94', country: 'Sri Lanka' },
      { code: '+975', country: 'Bhutan' },
      { code: '+372', country: 'Estonia' },
      { code: '+591', country: 'Bolivia' },
      { code: '+597', country: 'Suriname' },
      { code: '+675', country: 'Papua New Guinea' },
      { code: '+54', country: 'Argentina' },
      { code: '+507', country: 'Panama' },
      { code: '+592', country: 'Guyana' },
    ];

  const countryStartingDigits = {
    '+1': ['2', '3', '4', '5', '6', '7', '8', '9'], 
    '+44': ['7'],    
    '+63': ['9'],      
    '+91': ['6', '7', '8', '9'], 
    '+81': ['7', '8', '9'], 
    '+61': ['4'],   
    '+49': ['1'],    
    '+33': ['6', '7'], 
    '+39': ['3'],   
    '+86': ['1'],    
    '+82': ['1'],       
    '+7': ['9'],     
    '+55': ['9'],      
    '+27': ['6', '7', '8'], 
    '+34': ['6', '7'], 
    '+971': ['5'],     
    '+92': ['3'],     
    '+20': ['1'],     
    '+62': ['8'],    
    '+64': ['2', '3', '4', '5', '6', '7', '8', '9'], 
    '+353': ['8'],    
    '+31': ['6'],     
    '+46': ['7'],   
    '+41': ['7'],    
    '+32': ['4'],   
    '+45': ['2', '3', '4', '5', '6', '7'],
    '+52': ['1'],      
    '+972': ['5'],    
    '+66': ['6', '8', '9'], 
    '+65': ['8', '9'], 
    '+47': ['4', '9'],  
    '+420': ['6', '7'], 
    '+48': ['5', '6', '7', '8'], 
    '+43': ['6'],    
    '+36': ['2', '3', '4', '5', '6', '7'],
    '+351': ['9'],    
    '+375': ['2', '3', '4', '5'], 
    '+380': ['6', '7', '9'], 
    '+30': ['6', '9'],  
    '+57': ['3'],     
    '+98': ['9'],    
    '+90': ['5'],     
    '+56': ['9'],     
    '+233': ['2', '5'],
    '+234': ['7', '8', '9'], 
    '+264': ['8'],   
    '+258': ['8', '9'], 
    '+94': ['7'],      
    '+975': ['1', '7'], 
    '+372': ['5'],     
    '+591': ['6', '7'], 
    '+597': ['8'],    
    '+675': ['7'],    
    '+54': ['1', '2', '3', '4', '5', '6', '7', '8', '9'], 
    '+507': ['6'],    
    '+592': ['6', '7'], 
  };
  
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
      console.log("Fetched User Data:", userResponse.data);
  
      const user = userResponse.data.user;
      const receivedDonations = userResponse.data.donations.filter(donation => donation.received);
      const pendingDonations = userResponse.data.donations.filter(donation => !donation.received);
  
      setUser(user);
      setDonations(pendingDonations); 
      setPendingItems(receivedDonations); 
  
      let extractedCountryCode = '+63';
      let extractedContact = user.contact;
  
      countryCodes.forEach((country) => {
        if (user.contact.startsWith(country.code)) {
          extractedCountryCode = country.code;
          extractedContact = user.contact.replace(country.code, '').trim();
        }
      });
  
      setEditData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contact: extractedContact,
        username: user.username,
      });
  
      setSelectedCountryCode(extractedCountryCode);
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
    let errors = [];

    if (selectedCountryCode === '+63') {
      if (!/^9\d{9}$/.test(editData.contact.replace(/\s/g, ''))) {
        errors.push('Philippines contact number must start with 9 and be 10 digits long.');
      }
    } 

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    try {
      await axios.put(`/routes/accounts/user/${username}`, {
        ...editData,
        contact: `${selectedCountryCode} ${editData.contact}`,
      });

      alert("Profile updated successfully!");
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile.");
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      contact: user?.contact,
      username: user?.username,
    });
  };

  const handleViewItemsDonatedClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
              <Link className="nav" to="/requestassistance">Request</Link>
              <Link className='nav' to="/cashothers">Donate</Link>
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
                  <div className="flex">
                    <input
                      type="text"
                      name="contact"
                      value={editData.contact}
                      onChange={handleChangeContact}
                      className="border-l-0 rounded-r-md flex-grow p-2"
                      placeholder="Enter Contact Number"
                      required
                    />
                  </div>
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
                <p>Username: {user?.username}</p>
              </div>
              <div className="flex justify-center mt-6">
              
            </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[400px] max-lg:w-full border-2 shadow-md">
            <h3 className='bg-red-800 text-white px-4 py-3 text-2xl '>For Receiving Donations of Items</h3>
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
              <button type="button" className="px-4 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md" onClick={handleViewItemsDonatedClick}>View Donated Items</button>
            </div>
            <br></br>
          </div>
          
        </div>
        {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-[80vw] max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Donated Items</h2>
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
