import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../../assets/images/logo.png'
import Logo1 from '../../assets/images/logoBlack.png'
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MdKeyboardBackspace } from "react-icons/md";


const Receipt = () => {4
  const dateNow = new Date()
  const tobeSubmitted = dateNow.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit', 
  });

  const formattedDate = dateNow.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long', 
    day: '2-digit',
  }); 

  const [donorDetails, setDonorDetails] = useState({
    name: '',
    amount: '',
    date: tobeSubmitted,
    image: null
  });

  const [proofsOfPayment, setProofsOfPayment] = useState([]);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username'); // Get the username from local storage
  const contact = localStorage.getItem('contact'); 
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (`0${today.getMonth() + 1}`).slice(-2); // Months are zero-based
    const day = (`0${today.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };
  
 const addProofOfPayment = async () => {
  if (!donorDetails.amount || !donorDetails.date || !donorDetails.image) {
    alert('Amount, date, and image are required.');
    return;
  }

  if (!/^\d+$/.test(donorDetails.amount)) {
    alert('Please enter a valid Amount.');
    return;
  }

  const formData = new FormData();
  formData.append('username', username);  // Username from local storage
  formData.append('amount', donorDetails.amount);
  formData.append('date', donorDetails.date);
  formData.append('image', donorDetails.image);  // Image is required
  formData.append('contact', contact);   // Include the contact from local storage

  // Append name only if it's provided
  if (donorDetails.name.trim() !== '') {
    formData.append('name', donorDetails.name);  // Add the optional name here
  }

  try {
    const response = await axios.post('/routes/accounts/addProof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setProofsOfPayment([...proofsOfPayment, response.data]);
    setDonorDetails({
      name: '',
      amount: '',
      date: getTodayDate(),
      image: null,
    });
    setError('');
    alert('Proof of payment added successfully.');
  } catch (error) {
    console.error('Failed to add proof of payment:', error.response ? error.response.data : error.message);
    setError('Failed to add proof of payment. Please try again later.');
    alert('Failed to add proof of payment. Please try again later.');
  }
};



const handleChange = (e) => {
  const { name, value, files } = e.target;

  // Regular expression for validating alphabetic characters and spaces
  const lettersOnlyRegex = /^[A-Za-z\s]*$/;

  if (value && (value.includes('<') || value.includes('>'))) {
    return; // If contains < or >, do not update state
  }

  // Validate name input to allow only letters and spaces
  if (name === 'name' && !lettersOnlyRegex.test(value)) {
    alert('Please enter letters only for the name.');
    return;
  }

  // Validate amount input to allow only numeric characters
  if (name === 'amount' && !/^\d*$/.test(value)) {
    return; // If not numeric characters, do not update state
  }

  if (name === 'image') {
    const file = files[0];

    // Check if the file is a .jpg or .png
    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Proof of payment must be in .jpg or .png format only.');
      return;
    }

    // Display confirmation alert before setting the image
    const isConfirmed = window.confirm('Are you sure that this is the proof of payment?');
    if (isConfirmed) {
      setDonorDetails({
        ...donorDetails,
        [name]: file
      });
    }
  } else {
    setDonorDetails({
      ...donorDetails,
      [name]: value
    });
  }
};



  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await axios.get('/routes/accounts/proofs', {
          params: { username, approved: true }
        });
        setProofsOfPayment(response.data);
      } catch (error) {
        console.error('Error fetching proofs of payment:', error);
      }
    };

    fetchProofs();

    // Set default date to today
    setDonorDetails(prevDetails => ({
      ...prevDetails,
      date: getTodayDate()
    }));
  }, [username]);

  const generatePDF = async (proof) => {
    try {
      const doc = new jsPDF({
        orientation: 'landscape', // Change to landscape for 10.5 x 4.25
        unit: 'in', // Change to inches
        format: [10.5, 4.25], // Set the paper size to 10.5 x 4.25 inches
      });
  
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let currentY = 0.2; // Starting Y position with some margin
  
      const img = new Image();
      img.src = Logo1;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const imgWidth = 2; // Set desired width in inches
        const imgHeight = (img.naturalHeight / img.naturalWidth) * imgWidth; // Maintain aspect ratio
        doc.addImage(img, 'PNG', (pageWidth - imgWidth) / 2, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 0.1; // Increase Y position after adding image
        currentY += 0.3; // Space below the receipt title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('MINOR BASILICA OF THE BLACK NAZARENE', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.2; // Space below the organization name
        currentY += 0.1; // Additional space after line
        doc.text('SAINT JOHN THE BAPTIST | QUIAPO CHURCH', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.1; // Space below the second organization name
        currentY += 0.1; // Space below the second organization name
        doc.setLineWidth(0.02); // Set the line width to a thinner value
        doc.line(1, currentY, pageWidth - 1, currentY); // Draw line after the receipt ID
        currentY += 0.2; // Additional space after line
        currentY += 0.1; // Space below the second organization name
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Donation Receipt', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.4; // Space below the receipt title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const receiptData = [
          { label: 'Name of Donor', value: proof.name || 'Anonymous' },
          { label: 'Amount of Donation', value: `${parseFloat(proof.amount).toLocaleString()} pesos` },
          { label: 'Date of Donation', value: new Date(proof.date).toLocaleDateString() },
        ];
        receiptData.forEach(item => {
          doc.setFont('helvetica', 'bold');
          doc.text(`${item.label}:`, 1, currentY);
          doc.setFont('helvetica', 'normal');
          doc.text(`${item.value}`, 3, currentY); // Adjusted x position for the value
          currentY += 0.3; // Space between items
        });
        doc.setLineWidth(0.02); // Set the line width to a thinner value
        doc.line(1, currentY, pageWidth - 1, currentY); // Draw line after the receipt ID
        currentY += 0.15; // Additional space after line
        currentY += 0.2; // Space before the thank you note
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for your generous donation!', pageWidth / 2, currentY, { align: 'center' });
        currentY += 0.2; // Space below the thank you note
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Receipt generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });
        doc.save(`iDonate_Proof.pdf`);
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  const handleLogout = async () => {
    const username = localStorage.getItem('username'); 
    const role = localStorage.getItem('userRole'); 

    try {
      const response = await fetch('https://idonate1.onrender.com/routes/accounts/logout', { // Ensure the URL is correct
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
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
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
              <Link className='nav' to="/donate">Donate</Link>
              <Link className='nav' to="/profile">Profile</Link>
              <Link to="/" onClick={handleLogout}>Logout</Link>
          </div>
        </div>
      </div>

      <div className="pb-6 flex flex-col flex-grow px-12">
        <Link to="/cashOthers" className='mt-4 text-4xl '>
          <div className="circle"><MdKeyboardBackspace/></div>
        </Link>

        <div className="flex justify-center items-center mt-8 space-x-10 max-xl:mx-4 max-lg:flex-col max-lg:space-x-0 max-lg:space-y-4 max-lg:justify-normal text-sm">
          <form className='space-y-4 border-2 w-1/4 px-6 py-4 rounded-xl max-lg:w-full'>
            <div className="flex flex-col space-y-1.5">
              <label>Name (optional):</label>
              <input type="text" name="name" value={donorDetails.name} onChange={handleChange}
                className="read-only w-full p-2 border rounded-lg"/>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label>Amount of Donation based on Proof of Cash Donation<span className='text-red-600'>*</span> :</label>
              <input
                type="text"
                name="amount"
                maxLength='7'
                value={donorDetails.amount}
                onChange={handleChange}
              className="read-only w-full p-2 border rounded-lg"
                required
                placeholder="Enter amount in numbers"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label>Upload Proof of Cash Donation<span style={{color: 'red'}}> *</span>:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="read-only w-full p-2 border rounded-lg"
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label>Date of Donation<span style={{color: 'red'}}> *</span>: {formattedDate}</label>
            </div>
            <button type="button" className="bg-red-800 text-white w-full py-1.5 rounded-md hover:bg-red-600 duration-200" onClick={addProofOfPayment}>
              Submit
            </button>
          </form>

          <div className="overflow-x-auto overflow-y-auto max-h-[400px] max-lg:w-full border-2">
            <h3 className='bg-red-800 text-white px-4 py-3 text-xl'>Proof of Payment</h3>
            <table className='table-auto w-full'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='font-normal py-1.5 px-2'>Name</th>
                  <th className='font-normal py-1.5 px-2'>Amount</th>
                  <th className='font-normal py-1.5 px-2'>Date</th>
                  <th className='font-normal py-1.5 px-2'>Status</th>
                  <th className='font-normal py-1.5 px-2'>Proof of Donation</th>
                  <th className='font-normal py-1.5 px-2'>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {proofsOfPayment ? 
                  proofsOfPayment.map(proof => (
                    <tr key={proof._id} className='even:bg-gray-100'>
                      <td className='px-10 py-2'>{proof.name || 'Anonymous'}</td>
                      <td className='px-10 py-2'>₱{parseFloat(proof.amount).toLocaleString()}</td>
                      <td className='px-10 py-2'>{new Date(proof.date).toLocaleDateString()}</td>
                      <td className='px-10 py-2'>{proof.approved ? 'Received' : 'Pending'}</td>
                      <td className='flex justify-center items-center py-2'>
                        {proof.imagePath ? (
                          <a 
                            href={`https://idonate1.onrender.com/${proof.imagePath}`}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="bg-red-800 hover:bg-red-700 text-white px-4 rounded-md py-2 duration-200 text-xs"
                          >
                            View
                          </a>
                        ) : 'No Image'}
                      </td>
                      <td className='py-2'>
                        {proof.approved && (
                          <button className="bg-red-800 hover:bg-red-700 text-white px-4 rounded-md py-2 duration-200 text-xs flex mx-auto"  onClick={() => generatePDF(proof)}>Print</button>
                        )}
                      </td>
                    </tr>
                  ))
                  : <p>No data</p>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
