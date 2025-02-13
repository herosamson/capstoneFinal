import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Finance = () => {
    const [isOpen, setIsOpen] = useState(false);
      const navigate = useNavigate();
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [financialAssistance, setFinancialAssistance] = useState([]);
    const [error, setError] = useState('');

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const username = localStorage.getItem('username');
    const today = new Date().toISOString().split('T')[0];

    const reasonOptions = [
        "Educational Support", 
        "Food Assistance", 
        "Medical Expenses", 
        "Burial Assistance", 
        "Disability Support", 
        "Others"
    ];

    useEffect(() => {
        
        fetchFinancialAssistance();
    }, []);

    const fetchFinancialAssistance = async () => {
        try {
            const response = await axios.get(`/routes/accounts/financial-assistance`, {
                headers: { username }
            });
            setFinancialAssistance(response.data);
            
        } catch (error) {
            console.error('Failed to fetch financial requests:', error);
        }
    };

    const addFinancialAssistance = async () => {

        const lettersOnlyRegex = /^[A-Za-z\s]+$/;

        if (!name || !amount || !contactNumber || !reason || !targetDate || (reason === 'Others' && !customReason)) {
            alert('All fields are required.');
            return;
        }

        if (name.includes('<') || name.includes('>') || !lettersOnlyRegex.test(name)) {
            alert('Please enter a valid name.');
            return;
        }

        if (reason === 'Others' && (customReason.includes('<') || customReason.includes('>') || !lettersOnlyRegex.test(customReason))) {
            alert('Invalid characters in Reason field.');
            return;
        }

        if (!/^\d+$/.test(amount) || parseInt(amount, 10) > 10000) {
            alert('Please enter a valid number for Amount not exceeding 10,000.');
            return;
        }

        if (!/^09\d{9}$/.test(contactNumber)) {
            alert('Please enter a valid Contact Number.');
            return;
        }

        const finalReason = reason === 'Others' ? customReason : reason;
        const newRequest = { 
            name, 
            amount, 
            contactNumber, 
            reason: finalReason, 
            targetDate, 
            username,
        };

        try {
            setIsButtonDisabled(true);
            const response = await axios.post(`/routes/accounts/financial-assistance/add`, newRequest, {
                headers: { username }
            });

            setFinancialAssistance([...financialAssistance, response.data]);

            setName('');
            setAmount('');
            setContactNumber('');
            setReason('');
            setCustomReason('');
            setTargetDate('');
            setError('');

            alert('Please wait for a confirmation text from Quiapo Church on the contact number you provided, and kindly wait for further instructions.');
            alert('Financial request added successfully.');
            navigate('/home');
        } catch (error) {
            console.error('Failed to add financial request:', error.response ? error.response.data : error.message);
            setError('Failed to add financial request. Please try again later.');
            alert('Failed to add financial request. Please try again later.');
        } finally {
            setIsButtonDisabled(false); 
          }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value.includes('<') || value.includes('>')) return;

        switch (name) {
        case 'name':
            setName(value);
            break;
        case 'amount':
            setAmount(value);
            break;
        case 'contactNumber':
            setContactNumber(value);
            break;
        case 'targetDate':
            setTargetDate(value);
            break;
        default:
            break;
        }
    };

    const handleReasonChange = (e) => {
        const selectedReason = e.target.value;
        setReason(selectedReason);
        if (selectedReason !== "Others") setCustomReason('');
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
                    <form className="flex flex-col space-y-4 border-2 w-1/4 px-6 py-4 rounded-xl max-lg:w-full">
                        <h3 className='text-xl font-medium text-center'>Financial Assistance</h3>

                        <input
                            type="text"
                            name="name"
                            placeholder="Name/ Name of Organization"
                            value={name}
                            onChange={handleChange}
                             className="read-only w-full p-2 border rounded-lg"
                        />

                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value > 10000 ? 10000 : e.target.value)}
                            min="1"
                            max="10000"
                             className="read-only w-full p-2 border rounded-lg"
                        />

                        <input
                            type="text"
                            name="contactNumber"
                            placeholder="Contact Number"
                            value={contactNumber}
                            onChange={handleChange}
                           className="read-only w-full p-2 border rounded-lg"
                        />
                        
                        {reason === "Others" ? (
                            <input
                                type="text"
                                placeholder="Specify Reason"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                className="read-only w-full p-2 border rounded-lg"
                            />
                        ) : (
                            <select value={reason} onChange={handleReasonChange}   className="read-only w-full p-2 border rounded-lg mx-1">
                                <option value="">Select Reason</option>
                                {reasonOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        )}
                        <h3>Target Date:</h3>
                        <input
                            type="date"
                            name="targetDate"
                            value={targetDate}
                            onChange={handleChange}
                            min={today}
                             className="read-only w-full p-2 border rounded-lg"
                        />
                        <button type="button" className="bg-red-800 text-white w-full py-1.5 rounded-md hover:bg-red-600 duration-200" onClick={addFinancialAssistance} disabled={isButtonDisabled} >
                            { "Add Financial Request"}
                        </button>
                    </form>

                    <div className="overflow-x-auto overflow-y-auto max-h-[400px] max-lg:w-full border-2">
                        <table className='table-auto w-full'>
                            <thead className='bg-red-800 text-white'>
                            <tr>
                                <th className='font-normal py-1.5 px-2'>Name</th>
                                <th className='font-normal py-1.5 px-2'>Amount</th>
                                <th className='font-normal py-1.5 px-2'>Target Price</th>
                                <th className='font-normal py-1.5 px-2'>Contact #</th>
                                <th className='font-normal py-1.5 px-2'>Reason</th>
                                <th className='font-normal py-1.5 px-2'>Approved</th>
                            </tr>
                            </thead>
                            <tbody>
                                {financialAssistance.map((request) => (
                                    <tr key={request._id} className='even:bg-gray-100'>
                                        <td className='px-10 py-2'>{request.name}</td>
                                        <td className='px-10 py-2'>{request.amount}</td>
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

export default Finance