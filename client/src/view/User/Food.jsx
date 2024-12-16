import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png'
import { MdKeyboardBackspace } from "react-icons/md";

const Food = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [name, setName] = useState('');
    const [typesOfFood, setTypesOfFood] = useState('');
    const [typesOfFoodOther, setTypesOfFoodOther] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [location, setLocation] = useState('');
    const [locationOther, setLocationOther] = useState('');
    const [barangay, setBarangay] = useState('');
    const [houseAddress, setHouseAddress] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [numberOfPax, setNumberOfPax] = useState('');
    const [foodAssistance, setFoodAssistance] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const username = localStorage.getItem('username');
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
    const foodTypes = ["Rice", "Canned Goods", "Instant Noodles", "Coffee", "Biscuits", "Water Bottles", "Others"];
    const locations = {
        "Tondo": Array.from({ length: 267 }, (_, i) => `Barangay ${i + 1}`),
        "San Nicolas": Array.from({ length: 19 }, (_, i) => `Barangay ${268 + i}`),
        "Binondo": Array.from({ length: 10 }, (_, i) => `Barangay ${287 + i}`),
        "Santa Cruz": Array.from({ length: 86 }, (_, i) => `Barangay ${297 + i}`),
        "Quiapo": [...Array.from({ length: 4 }, (_, i) => `Barangay ${306 + i}`), ...Array.from({ length: 12 }, (_, i) => `Barangay ${383 + i}`)],
        "Sampaloc": Array.from({ length: 192 }, (_, i) => `Barangay ${395 + i}`),
        "Santa Mesa": Array.from({ length: 50 }, (_, i) => `Barangay ${587 + i}`),
        "San Miguel": Array.from({ length: 12 }, (_, i) => `Barangay ${637 + i}`),
        "Port Area": Array.from({ length: 5 }, (_, i) => `Barangay ${649 + i}`),
        "Intramuros": Array.from({ length: 5 }, (_, i) => `Barangay ${654 + i}`),
        "Ermita": Array.from({ length: 12 }, (_, i) => `Barangay ${659 + i}`),
        "Paco": Array.from({ length: 26 }, (_, i) => `Barangay ${662 + i}`),
        "Malate": Array.from({ length: 57 }, (_, i) => `Barangay ${688 + i}`),
        "Others": []
    };
  
    const fetchFoodAssistance = async () => {
        try {
            const response = await axios.get(`/routes/accounts/food-assistance`, {
                headers: { username }
            });
            setFoodAssistance(response.data);

        } catch (error) {
            console.error('Failed to fetch food requests:', error);
        }
    };
    
  
    const addFoodAssistance = async () => {
        // Validate Name
        const nameRegex = /^[A-Za-z\s]{1,50}$/;
        if (!name || !nameRegex.test(name)) {
            alert('Please enter a valid name.');
            return;
        }
    
        // Validate Contact Number
        const contactNumberRegex = /^09\d{9}$/;
        if (!contactNumber || !contactNumberRegex.test(contactNumber)) {
            alert('Please enter a valid contact number.');
            return;
        }
    
        // Validate Location
        if (!name || !contactNumber || !location || !targetDate || !numberOfPax || (!barangay && location !== 'Others')) {
            alert('All fields are required.');
            return;
        }
    
        // Validate Custom Food Type
        const selectedFoodType = typesOfFood === "Others" ? typesOfFoodOther : typesOfFood;
        if (typesOfFood === "Others" && (!typesOfFoodOther || typesOfFoodOther.trim() === "")) {
            alert('Please specify the type of food.');
            return;
        }
        // Validate Estimated Number of Pax
        if (!/^\d{1,3}$/.test(numberOfPax)) {
            alert('Estimated number of pax must be a number up to 3 digits only.');
            return;
        }
        // Validate Full Location
        const fullLocation = location === "Others" ? locationOther : `${location} - ${barangay}, ${houseAddress}`;
        const newRequest = { 
            name, 
            typesOfFood: selectedFoodType, 
            contactNumber, 
            location: fullLocation, 
            targetDate, 
            numberOfPax, 
            username,
        };
    
    
        try {
            setIsButtonDisabled(true);
            const response = await axios.post(`/routes/accounts/food-assistance/add`, newRequest, {
                headers: { username }
            });
    
            setFoodAssistance([...foodAssistance, response.data.request]);
            resetForm();
            alert('Food request added successfully.');
        } catch (error) {
            console.error('Failed to add food request:', error.response ? error.response.data : error.message);
            alert('Failed to add food request. Please try again later.');
        } finally {
            setIsButtonDisabled(false); // Re-enable the button after the submission attempt
          }
    };
    
    
  
    const resetForm = () => {
        setName('');
        setTypesOfFood('');
        setTypesOfFoodOther('');
        setContactNumber('');
        setLocation('');
        setLocationOther('');
        setBarangay('');
        setHouseAddress('');
        setTargetDate('');
        setNumberOfPax('');
    };
  
    useEffect(() => {
        fetchFoodAssistance();
    }, []);
    
  
    const handleFoodTypeChange = (e) => {
        const selectedFood = e.target.value;
        if (selectedFood === "Others") {
            setTypesOfFood("Others");
            setTypesOfFoodOther('');
        } else {
            setTypesOfFood(selectedFood);
            setTypesOfFoodOther('');
        }
    };
  
    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setLocation(selectedLocation);
        setBarangay('');
    };
  
    const handleLogout = async () => {
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('userRole');
    
        try {
            const response = await fetch('https://idonate1.onrender.com/routes/accounts/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
        <div className="font-Poppins min-h-screen flex flex-col">
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
                        <Link className='nav' to="/donate">Donate</Link>
                        <Link className='nav' to="/profile">Profile</Link>
                        <Link to="/" onClick={handleLogout}>Logout</Link>
                    </div>
                </div>
            </div>

            <div className="pb-6 flex flex-col flex-grow  px-12">
                <Link to="/requestassistance" className='mt-4 text-4xl '>
                    <div className="circle"><MdKeyboardBackspace/></div>
                </Link>

                <div className="flex justify-center items-center mt-4 space-x-10 max-xl:mx-4 max-lg:flex-col max-lg:space-x-0 max-lg:space-y-4 max-lg:justify-normal text-sm">
                    <form className="flex flex-col space-y-4 border-2 w-1/4 px-6 py-4 rounded-xl max-lg:w-full">
                        <h3 className='text-xl font-medium text-center'>Food Assistance</h3>
                        <input
                            type="text"
                            placeholder="Name/ Name of Organization"
                            value={name}
                            onChange={(e) => setName(e.target.value.replace(/[<>]/g, ''))}
                            className="read-only w-full p-2 border rounded-lg"
                        />
                        <select value={typesOfFood} onChange={handleFoodTypeChange} className="read-only w-full p-2 border rounded-lg mx-1">
                            <option value="">Select Type of Food</option>
                            {foodTypes.map((food) => (
                                <option key={food} value={food}>{food}</option>
                            ))}
                        </select>

                        {typesOfFood === "Others" && (
                            <input
                                type="text"
                                placeholder="Specify Type of Food"
                                value={typesOfFoodOther}
                                onChange={(e) => setTypesOfFoodOther(e.target.value.replace(/[<>]/g, ''))}
                                className="read-only w-full p-2 border rounded-lg"
                            />
                        )}

                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value.replace(/[<>]/g, ''))}
                             className="read-only w-full p-2 border rounded-lg"
                        />

                        {location === "Others" ? (
                            <input
                                type="text"
                                placeholder="Please Specify Exact Location"
                                value={locationOther}
                                onChange={(e) => setLocationOther(e.target.value.replace(/[<>]/g, ''))}
                                className="read-only w-full p-2 border rounded-lg"
                            />
                        ) : (
                            <select value={location} onChange={handleLocationChange} className="read-only w-full p-2 border rounded-lg mx-1">
                                <option value="">Select Location</option>
                                {Object.keys(locations).map((loc) => (
                                <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        )}


                        {location && location !== "Others" && (
                            <>
                                <select value={barangay} onChange={(e) => setBarangay(e.target.value)}  className="read-only w-full p-2 border rounded-lg">
                                <option value="">Select Barangay</option>
                                    {locations[location].map((brgy) => (
                                        <option key={brgy} value={brgy}>{brgy}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="House Address"
                                    value={houseAddress}
                                    onChange={(e) => setHouseAddress(e.target.value.replace(/[<>]/g, ''))}
                                     className="read-only w-full p-2 border rounded-lg"
                                />
                            </>
                        )}
                        <h3>Target Date:</h3>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            min={today}
                            className="read-only w-full p-2 border rounded-lg"
                        />

                        <input
                            type="number"
                            placeholder="Number of Pax"
                            value={numberOfPax}
                            onChange={(e) => setNumberOfPax(e.target.value.replace(/[<>]/g, ''))}
                            min="1"
                            max="200"
                         className="read-only w-full p-2 border rounded-lg"
                        />
                        <button type="button" className="bg-red-800 text-white w-full py-1.5 rounded-md hover:bg-red-600 duration-200" onClick={addFoodAssistance} disabled={isButtonDisabled}>
                            {"Add Food Request"}
                        </button>
                    </form>

                    <div className="overflow-x-auto overflow-y-auto max-h-[350px] max-lg:w-full border-2">
                        <table className='table-auto w-full'>
                            <thead className='bg-red-800 text-white'>
                            <tr>
                                <th className='font-normal py-1.5 px-2 text-left w-[20%]'>Name</th>
                                <th className='font-normal py-1.5 px-2 text-left w-[20%]'>Type of Food</th>
                                <th className='font-normal py-1.5 px-2 text-left w-[15%]'>Target Date</th>
                                <th className='font-normal py-1.5 px-2 text-left w-[10%]'>Contact #</th>
                                <th className='font-normal py-1.5 px-2 text-left w-[15%]'>Location</th>
                                <th className='font-normal py-1.5 px-2 text-left w-[15%]'>Number of Pax</th>
                                <th className='font-normal py-1.5 px-2 text-left w-[10%]'>Approved</th>
                            </tr>
                            </thead>
                            <tbody>
                                {foodAssistance.map((request) => (
                                    <tr key={request._id} className='even:bg-gray-100'>
                                        <td className='text-left px-2 py-2 w-[20%] text-ellipsis whitespace-nowrap overflow-hidden'>{request.name}</td>
                                        <td className='text-left px-2 py-2 w-[15%'>{request.typesOfFood}</td>
                                        <td className='text-left px-2 py-2 w-[15%]'>{new Date(request.targetDate).toLocaleDateString()}</td>
                                        <td className='text-left px-2 py-2 w-[10%]'>{request.contactNumber}</td>
                                        <td className='text-left px-2 py-2 w-[15%] max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden'>{request.location}</td>
                                        <td className='text-left px-2 py-2 w-[10%] max-w-[150px] text-ellipsis whitespace-nowrap overflow-hidden'>{request.numberOfPax}</td>
                                        <td className='text-left px-2 py-2 w-[10%]'>{request.approved ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Food
