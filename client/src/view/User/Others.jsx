import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import { MdKeyboardBackspace } from "react-icons/md";

const Others = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [donations, setDonations] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [item, setItem] = useState('');
  const [customItem, setCustomItem] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');
  const [category, setCategory] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const categoryItems = {
    Food: [
      'Canned Goods',
      'Instant Noodles',
      'Rice',
      'Water',
      'Other',
    ],
    Clothes: [
      'T-Shirt',
      'Socks',
      'Blanket',
      'Sando',
      'Shorts',
      'Other',
    ],
    Hygiene: [
      'Shampoo',
      'Soap',
      'Tampons',
      'Toothbrush',
      'Toothpaste',
      'Other',
    ],
    Others: [],
    DisasterRelief: [
      'Canned Goods',
      'Instant Noodles',
      'Water',
      'Rice',
      'Other',
    ],
  };

  const unitOptions = {
    default: ["Piece(s)", "Pack(s)", "Box(es)", "Sack(s)", "Bottle(s)",  "Other"],
    DisasterRelief: ["Piece(s)", "Pack(s)", "Box(es)", "Bottle(s)",  "Other"],
    Food: ["Piece(s)", "Pack(s)", "Box(es)", "Sack(s)", "Bottle(s)", "Other"],
    Clothes: ["Piece(s)", "Other"],
    Hygiene: ["Piece(s)", "Other"],
    Others: ["Piece(s)", "Pack(s)", "Box(es)", "Other"],
  };

  const unitLimits = {
    "Piece(s)": 1000000,
    "Pack(s)": 1000,
    "Box(es)": 1000,
    "Sack(s)": 1000,
    "Bottle(s)": 1000,
    "Can(s)": 1000,
  };

  useEffect(() => {
    fetchDonations();
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
                localStorage.clear();
                window.location.href = '/'; 
            } else {
                alert("Logout failed");
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const fetchDonations = async () => {
        try {
            const response = await axios.get('/routes/accounts/donations');
            const donations = response.data;

            const username = localStorage.getItem('username');
            if (!username) {
                console.error('Username not found in localStorage');
                return;
            }

            const userDonations = donations.filter(donation => donation.user && donation.user.username === username);
            setDonations(userDonations);
        } catch (err) {
            console.error('Error fetching donations:', err);
        }
    };

    const addItem = () => {
        const username = localStorage.getItem('username');
        if (!username) {
            setError('User not logged in');
            return;
        }
        if (!category) {
            alert('Category is required.');
            return;
        }
        if (!item && !customItem) {
            alert('Item is required.');
            return;
        }
        if (item === 'Other' || category === 'Others') {
            if (!customItem.trim() || !/^[A-Za-z\s]+$/.test(customItem)) {
                alert('Please enter a valid custom item using letters only.');
                return;
            }
        }
        if (!quantity) {
            alert('Quantity is required.');
            return;
        }
        if (!unit && !customUnit) {
            alert('Unit is required.');
            return;
        }
        if (unit === 'Other' && (!customUnit.trim() || !/^[A-Za-z\s]+$/.test(customUnit))) {
            alert('Please enter a valid custom unit.');
            return;
        }
        if (!/^\d+$/.test(quantity) || parseInt(quantity, 10) <= 0) {
            alert('Please enter a valid Quantity.');
            return;
        }
    
        const selectedUnit = unit === 'Other' ? customUnit : unit;
        const limit = unitLimits[selectedUnit] || null;
    
        if (limit !== null && parseInt(quantity, 10) > limit) {
            alert(`Quantity for ${selectedUnit} cannot exceed ${limit}.`);
            return;
        }
    
        const selectedItem = category === 'Others' ? customItem : (item === 'Other' ? customItem : item);
        const normalizedItem = selectedItem.toLowerCase();
    
        if (pendingItems.some(pendingItem => pendingItem.item.toLowerCase() === normalizedItem)) {
            alert('This item is already in the pending list.');
            return;
        }
    
        const newItem = { 
            item: selectedItem, 
            quantity, 
            unit: selectedUnit, 
            expirationDate, 
            username, 
            category 
        };
    
        // Add the item to the pending list
        setPendingItems([...pendingItems, newItem]);
    
        // Clear all fields and reset dropdowns
        setCategory(null);
        setItem(null);
        setCustomItem('');
        setQuantity('');
        setUnit(null);
        setCustomUnit('');
        setExpirationDate('');
        setError('');

        alert('Successfully added an item! If you want to submit, select a delivery date and Submit.');
    };
    
    
    
    const submitItems = async () => {
        const username = localStorage.getItem('username');
        if (!username) {
        setError('User not logged in');
        return;
        }

        if (!date) {
        alert('Date of Delivery is required.');
        return;
        }

        try {
            setIsButtonDisabled(true);
            const itemsToSubmit = pendingItems.map(pendingItem => ({
                item: pendingItem.item,
                quantity: pendingItem.quantity,
                unit: pendingItem.unit,
                expirationDate: pendingItem.expirationDate,
                username,
                category: pendingItem.category
            }));

            const response = await axios.post('/routes/accounts/donations/add', {
                items: itemsToSubmit,
                date,
                username
            });

            setDonations([...donations, ...response.data.donations]);
            setPendingItems([]);
            setDate('');
            setError('');

            alert('Please check and take note of the donation ID of these item/s from the profile page. An email has also been sent to your email.\n\nThank you for your in-kind donation!');

            navigate('/profile');
        } catch (err) {
            console.error('Error submitting items:', err.response ? err.response.data : err.message);
            alert('Error submitting items.');
        } finally {
    setIsButtonDisabled(false); // Re-enable the button after the submission attempt
  }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const lettersOnlyRegex = /^[A-Za-z\s]+$/; // Allows only letters and spaces
    
        if (value.includes('<') || value.includes('>')) {
            return; // Prevents potential XSS attack
        }
    
        switch (name) {
            case 'category':
                setCategory(value);
                setItem('');
                setCustomItem('');
                setUnit('');
                setCustomUnit('');
                break;
    
            case 'item':
                setItem(value);
                setCustomItem(''); 
                setUnit('');
                setCustomUnit('');
                break;
    
            case 'customItem':
                if (lettersOnlyRegex.test(value) || value === '') {
                    setCustomItem(value);
                } else {
                    alert('Please enter letters only for custom items.');
                }
                break;
    
            case 'quantity':
                setQuantity(value);
                break;
    
            case 'unit':
                setUnit(value);
                setCustomUnit('');
                break;
    
            case 'customUnit':
                if (lettersOnlyRegex.test(value) || value === '') {
                    setCustomUnit(value);
                } else {
                    alert('Please enter letters only for custom units.');
                }
                break;
    
            case 'date':
                setDate(value);
                break;
    
            case 'expirationDate':
                setExpirationDate(value);
                break;
    
            default:
                break;
        }
    };
    
      const getFilteredUnits = () => {
        if (category === 'Food' || category === 'DisasterRelief') {
          switch (item) {
            case 'Canned Goods':
            case 'Instant Noodles':
              return ['Piece(s)', 'Box(es)','Other'];
            case 'Rice':
              return ['Sack(s)','Other'];
            case 'Water':
              return ['Bottle(s)','Other'];
            default:
              return unitOptions[category || 'default'];
          }
        }
        return unitOptions[category || 'default'];
      };
      
  
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='font-Poppins min-h-screen flex flex-col'>
            <div className={`flex justify-between py-3 px-6 font-Poppins bg-red-800 `}>
                <div className="logo">
                    <img src={Logo} alt="Logo" className='h-auto w-48' />
                </div>
                <div className="flex text-white my-auto">
                    <div className="hidden max-sm:block text-3xl cursor-pointer nav" onClick={toggleMenu}>
                        &#9776;
                    </div>  
                    <div className={`flex space-x-6 max-sm:flex-col max-sm:items-center max-sm:absolute max-sm:top-[52px] max-sm:right-0 max-sm:w-full max-sm:bg-red-800 max-sm:space-x-0 max-sm:pb-4 max-sm:pt-8 max-sm:text-lg max-sm:space-y-3 ${isOpen ? 'max-sm:flex' : 'max-sm:hidden'}`}>
                        <Link className='nav' to="/home">Home</Link>
                        <Link className="nav" to="/requestassistance">Request</Link>
                        <Link className='nav' to="/donate">Donate</Link>
                        <Link className='nav' to="/profile">Profile</Link>
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                    </div>
                </div>
            </div>

            <div className="pb-6 flex flex-col flex-grow  px-12">
                <Link to="/cashothers" className='mt-4 text-4xl '>
                    <div className="circle"><MdKeyboardBackspace/></div>
                </Link>

                <div className="flex justify-center mt-4 space-x-10 max-xl:mx-4 max-lg:flex-col max-lg:space-x-0 max-lg:space-y-4 max-lg:justify-normal text-sm">
                    <div className="w-1/4 max-lg:w-full space-y-8">
                        <form className="flex flex-col space-y-4 border-2 px-6 py-4 rounded-xl">
                            <label htmlFor="category">Category<span className='text-red-800' > *</span>:</label>
                            <select 
                                id="category"
                                value={category || ''} 
                                onChange={handleChange} 
                                name="category" 
                                required
                                className='border-2 py-2 px-2 text-xs'
                            >
                                <option value="">Select Category</option>
                                <option value="Food">Food</option>
                                <option value="Clothes">Clothes</option>
                                <option value="Hygiene">Hygiene Kit</option>
                                <option value="DisasterRelief">Disaster Relief</option>
                                <option value="Others">Others</option>
                            </select>

                            {category === 'Others' ? (
                                <>
                                    <label htmlFor="customItem">Item<span style={{color: 'red'}}> *</span>:</label>
                                    <input
                                        type="text"
                                        value={customItem}
                                        onChange={handleChange}
                                        name="customItem"
                                        placeholder="Specify item"
                                        required
                                        className=' w-full border-2 py-2 px-2 text-xs'
                                    />
                                </>
                            ) : (
                                <>
                                    <label htmlFor="item">Item<span style={{color: 'red'}}> *</span>:</label>
                                    <select
                                        id="item"
                                        value={item || ''}
                                        onChange={handleChange}
                                        name="item"
                                        required
                                        className='border-2 py-2 px-2 text-xs'
                                    >
                                        <option value="">Select Item</option>
                                        {category && (categoryItems[category] || []).map((itm, idx) => (
                                            itm !== 'Other' ? <option key={idx} value={itm}>{itm}</option> : <option key={idx} value="Other">Other</option>
                                        ))}
                                    </select>
                                    {item === 'Other' && (
                                    <input
                                        type="text"
                                        value={customItem}
                                        onChange={handleChange}
                                        name="customItem"
                                        placeholder="Specify item"
                                        required
                                        className=' w-full border-2 py-2 px-2 text-xs'
                                    />
                                    )}
                                </>
                            )}

                            {(item || customItem) && (
                                <>
                                    <label htmlFor="unit">Unit<span className="text-red-800"> *</span>:</label>
                                    <select
                                    id="unit"
                                    value={unit || ''}
                                    onChange={handleChange}
                                    name="unit"
                                    required
                                    className="border-2 py-2 px-2 text-xs"
                                    >
                                    <option value="">Select Unit</option>
                                    {getFilteredUnits().map((unitOption, idx) => (
                                        <option key={idx} value={unitOption}>{unitOption}</option>
                                    ))}
                                    </select>
                                    {unit === 'Other' && (
                                    <input
                                        type="text"
                                        value={customUnit}
                                        onChange={handleChange}
                                        name="customUnit"
                                        placeholder="Enter unit"
                                        required
                                        className='w-full border-2 py-2 px-2 text-xs'
                                    />
                                    )}
                                </>
                            )}

                            {(item || customItem) && (
                                <>
                                    <label htmlFor="quantity">Quantity<span style={{color: 'red'}}> *</span>:</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={handleChange}
                                        name="quantity"
                                        placeholder="Quantity"
                                        min="0"
                                        max={unitLimits[unit] || ''}
                                        required
                                        className='w-full border-2 py-2 px-2 text-xs'
                                    />
                                </>
                                )}
                            {category === 'Food' && (
                                <>
                                    <label htmlFor="expirationDate">(If necessary) Expiration Date:</label>
                                    <input
                                        type="date"
                                        value={expirationDate}
                                        onChange={handleChange}
                                        name="expirationDate"
                                        min={today}
                                        onKeyDown={(e) => e.preventDefault()} 
                                        className='w-full border-2 py-2 px-2 text-xs'
                                    />
                                </>
                            )}

                            <button type="button" className="bg-red-800 text-white w-full py-1.5 rounded-md hover:bg-red-600 duration-200" onClick={addItem}>Add Item</button>
                        </form>

                        {pendingItems.length > 0 && (
                        <div className="flex flex-col space-y-4 border-2 px-6 py-4 rounded-xl">
                            <h3>Date of Delivery<span style={{color: 'red'}}> *</span>:</h3>
                            <input
                            type="date"
                            value={date}
                            onChange={handleChange}
                            name="date"
                            min={today}
                            required
                            className="w-full border-2 py-2 px-2 text-xs"
                            />
                            <button
                            className="bg-red-800 text-white w-full py-1.5 rounded-md hover:bg-red-600 duration-200"
                            onClick={submitItems}
                            disabled={isButtonDisabled}
                            >
                            Submit
                            </button>
                        </div>
                        )}

                    </div>

                    <div className="">
                        <h3 className='bg-white rounded-lg shadow-md border text-xl font-medium py-3 px-3 max-lg:w-full'>For Receiving Donations of Items</h3>
                        <div className=" overflow-x-auto overflow-y-auto max-h-[400px] max-lg:w-full">
                            {pendingItems.length > 0 && (
                                <table className='bg-white table-auto w-full'>
                                    <thead className='bg-red-800  text-white py-1.5 rounded-md w-full duration-200'>
                                    <tr>
                                        <th className='font-normal py-1.5 px-2'>Item</th>
                                        <th className='font-normal py-1.5 px-2'>Quantity</th>
                                        <th className='font-normal py-1.5 px-2'>Unit</th>
                                        <th className='font-normal py-1.5 px-2'>Expiration Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {pendingItems.map((pendingItem, index) => (
                                            <tr key={index} className='even:bg-white-100'>
                                                <td className='px-10 py-2'>{pendingItem.item}</td>
                                                <td className='px-10 py-2'>{pendingItem.quantity}</td>
                                                <td className='px-10 py-2'>{pendingItem.unit}</td>
                                                <td className='px-10 py-2'>{pendingItem.expirationDate ? new Date(pendingItem.expirationDate).toLocaleDateString() : 'None'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Others