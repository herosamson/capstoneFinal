import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png'
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Medical = () => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [name, setName] = useState('');
    const [typeOfMedicine, setTypeOfMedicine] = useState('');
    const [customTypeOfMedicine, setCustomTypeOfMedicine] = useState(''); // New state for custom medicine
    const [quantity, setQuantity] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [location, setLocation] = useState('');
    const [customLocation, setCustomLocation] = useState(''); // New state for custom location
    const [barangay, setBarangay] = useState('');
    const [houseAddress, setHouseAddress] = useState('');
    const [reason, setReason] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [medicalAssistance, setMedicalAssistance] = useState([]);
    const navigate = useNavigate();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const username = localStorage.getItem('username');

    const medicineTypes = [
        "Biogesic", "Neozep", "Solmux", "Ceterizine", "Amlodipine", "Amoxicillin", "Bioflu", 
        "Decolgen", "Tempra", "Medicol", "Tuseran", "Robitussin", "Diatabs", "Dolfenal", 
        "Buscopan", "Ventolin", "Lagundi", "Sinutab", "Others"
    ];

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
  
    const fetchMedicalAssistance = async () => {
        try {
            const response = await axios.get('/routes/accounts/medical-assistance', {
                headers: { username }
            });
            setMedicalAssistance(response.data);

        } catch (error) {
            console.error('Failed to fetch medical requests:', error);
        }
    };
  
    const addMedicalAssistance = async () => {
        const lettersOnlyRegex = /^[A-Za-z\s]+$/;
        if (!name || !typeOfMedicine || !quantity || !contactNumber || !location || !reason || !targetDate || (!barangay && location !== 'Others')) {
            alert('All fields are required.');
            return;
        }

        if (name.includes('<') || name.includes('>') || !lettersOnlyRegex.test(name)) {
            alert('Please enter a valid name.');
            return;
        }
        if (reason.includes('<') || reason.includes('>') || !lettersOnlyRegex.test(reason)) {
            alert('Please enter a valid reason.');
            return;
        }

        if (!/^\d+$/.test(quantity)) {
            alert('Please enter a valid number for Quantity.');
            return;
        }
        
        if (parseInt(quantity, 10) > 100) {
            alert('Quantity cannot exceed 100.');
            return;
        }
        

        if (!/^\d{11}$/.test(contactNumber) || !/^09\d{9}$/.test(contactNumber)) {
            alert('Please enter a valid Contact Number.');
            return;
        }
        

        const fullLocation = location === "Others" ? customLocation : `${location} - ${barangay}, ${houseAddress}`;
        const newRequest = { name, typeOfMedicine: typeOfMedicine === "Others" ? customTypeOfMedicine : typeOfMedicine, quantity, contactNumber, location: fullLocation, reason, targetDate, username };

        try {
            setIsButtonDisabled(true);
            const response = await axios.post(`/routes/accounts/medical-assistance/add`, newRequest, {
                headers: { username }
            });

            setMedicalAssistance([...medicalAssistance, response.data.request]);

            setName('');
            setTypeOfMedicine('');
            setCustomTypeOfMedicine('');
            setQuantity('');
            setContactNumber('');
            setLocation('');
            setCustomLocation('');
            setBarangay('');
            setHouseAddress('');
            setReason('');
            setTargetDate('');

            alert('Please wait for a confirmation text from Quiapo Church on the contact number you provided, and kindly wait for further instructions.');
            alert('Medical request added successfully.');
            navigate('/medical');
        } catch (error) {
            console.error('Failed to add medical assistance:', error.response ? error.response.data : error.message);
            alert('Failed to add medical assistance. Please try again later.');
        } finally {
            setIsButtonDisabled(false); // Re-enable the button after the submission attempt
          }
    };

    useEffect(() => {
    
        fetchMedicalAssistance();
    }, []);
  

    const handleTypeOfMedicineChange = (e) => {
        const selectedMedicine = e.target.value;
        setTypeOfMedicine(selectedMedicine);
        if (selectedMedicine === "Others") {
            setCustomTypeOfMedicine('');
        }
    };

    const handleLocationChange = (e) => {
        const selectedLocation = e.target.value;
        setLocation(selectedLocation);
        setBarangay('');

        if (selectedLocation !== "Others") {
            setCustomLocation('');
        }
    };

    const today = new Date().toISOString().split('T')[0];

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
                <Link to="/requestassistance" className='mt-4 text-4xl '>
                    <div className="circle"><MdKeyboardBackspace/></div>
                </Link>

                <div className="flex justify-center items-center mt-4 space-x-10 max-xl:mx-4 max-lg:flex-col max-lg:space-x-0 max-lg:space-y-4 max-lg:justify-normal text-sm">
                    <form className='flex flex-col space-y-4 border-2 w-1/4 px-6 py-4 rounded-xl max-lg:w-full'>
                        <h3 className='text-xl font-medium text-center'>Medical Assistance</h3>

                        <input
                            type="text"
                            placeholder="Name/ Name of Organization"
                            value={name}
                            onChange={(e) => setName(e.target.value.replace(/[<>]/g, ''))}
                              className="read-only w-full p-2 border rounded-lg"
                        />

                        {typeOfMedicine === "Others" ? (
                        <input
                            type="text"
                            placeholder="Specify Type of Medicine"
                            value={customTypeOfMedicine}
                            onChange={(e) => setCustomTypeOfMedicine(e.target.value.replace(/[<>]/g, ''))}
                              className="read-only w-full p-2 border rounded-lg"
                        />
                        ) : (
                            <select value={typeOfMedicine} onChange={handleTypeOfMedicineChange}   className="read-only w-full p-2 border rounded-lg mx-1">
                                <option value="">Select Type of Medicine</option>
                                {medicineTypes.map((medicine) => (
                                    <option key={medicine} value={medicine}>{medicine}</option>
                                ))}
                            </select>
                        )}

                        <input
                            type="number"
                            placeholder="Quantity"
                            value={quantity}
                            min="1"
                            max="100"
                            onChange={(e) => setQuantity(e.target.value.replace(/[<>]/g, ''))}
                            className="read-only w-full p-2 border rounded-lg"
                        />

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
                                placeholder="Specify Location"
                                value={customLocation}
                                onChange={(e) => setCustomLocation(e.target.value.replace(/[<>]/g, ''))}
                                className="read-only w-full p-2 border rounded-lg"
                            />
                            ) : (
                            <select value={location} onChange={handleLocationChange}   className="read-only w-full p-2 border rounded-lg mx-1">
                                <option value="">Select Location</option>
                                {Object.keys(locations).map((loc) => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                        )}
                        {location && location !== "Others" && (
                        <>
                            <select value={barangay} onChange={(e) => setBarangay(e.target.value)}   className="read-only w-full p-2 border rounded-lg">
                                <option value="">Select Barangay</option>
                                {locations[location].map((brgy) => (
                                    <option key={brgy} value={brgy}>{brgy}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Please Specify Exact Location"
                                value={houseAddress}
                                onChange={(e) => setHouseAddress(e.target.value.replace(/[<>]/g, ''))}
                                 className="read-only w-full p-2 border rounded-lg"
                            />
                        </>
                        )}

                        <input
                            type="text"
                            placeholder="What type of Disease/Illness/Sickness?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value.replace(/[<>]/g, ''))}
                             className="read-only w-full p-2 border rounded-lg"
                        />

                        <h3>Target Date:</h3>
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                            min={today}
                            onKeyDown={(e) => e.preventDefault()} 
                             className="read-only w-full p-2 border rounded-lg"
                        />
                        <button type="button" className="bg-red-800 text-white w-full py-1.5 rounded-md hover:bg-red-600 duration-200" onClick={addMedicalAssistance} disabled={isButtonDisabled}>
                           { "Add Medical Request"}
                        </button>

                    </form>

                    <div className="overflow-x-auto overflow-y-auto max-h-[400px] max-lg:w-full border-2">
                        <table className='table-auto w-full'>
                            <thead className='bg-red-800 text-white'>
                            <tr>
                                <th className='font-normal py-1.5 px-2'>Name</th>
                                <th className='font-normal py-1.5 px-2'>Type Of Medicine</th>
                                <th className='font-normal py-1.5 px-2'>Quantity</th>
                                <th className='font-normal py-1.5 px-2'>Location</th>
                                <th className='font-normal py-1.5 px-2'>Target Date</th>
                                <th className='font-normal py-1.5 px-2'>Contact #</th>
                                <th className='font-normal py-1.5 px-2'>Reason</th>
                                <th className='font-normal py-1.5 px-2'>Approved</th>
                            </tr>
                            </thead>
                            <tbody>
                                {medicalAssistance.map((request) => (
                                    <tr key={request._id} className='even:bg-gray-100'>
                                        <td className='px-10 py-2 max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden'>{request.name}</td>
                                        <td className='px-10 py-2'>{request.typeOfMedicine}</td>
                                        <td className='px-10 py-2'>{request.quantity}</td>
                                        <td className='px-10 py-2 max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden'>{request.location}</td>
                                        <td className='px-10 py-2'>{new Date(request.targetDate).toLocaleDateString()}</td>
                                        <td className='px-10 py-2'>{request.contactNumber}</td>
                                        <td className='px-10 py-2'>{request.reason}</td>
                                        <td className='px-10 py-2'>{request.approved ? 'Yes' : 'No'}</td>
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

export default Medical