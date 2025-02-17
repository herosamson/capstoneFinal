import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './donations.css'; 
import { Link } from 'react-router-dom';
import logo2 from './logo2.png';
import logo1 from './logo1.png'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Donations = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenV, setModalOpenV] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [location, setLocation] = useState({ cabinet: '', column: '', row: '' });
  const [locationError, setLocationError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newDonation, setNewDonation] = useState({
    name: '',
    contact: '',
    item: '',
    quantity: '',
    expirationDate: '',
    dateOfDelivery: '',
  });
  const [addDonationError, setAddDonationError] = useState('');
  const [addCabinetModalOpen, setAddCabinetModalOpen] = useState(false);
  const [newCabinet, setNewCabinet] = useState({
    cabinetNumber: '',
    columns: '',
    rows: '',
  });
  const [addCabinetError, setAddCabinetError] = useState('');
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const [cabinets, setCabinets] = useState([]);
  const [availableCabinets, setAvailableCabinets] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [availableRows, setAvailableRows] = useState([]);

  const fetchCabinets = async () => {
    try {
      const response = await axios.get('/routes/accounts/cabinets');
      setCabinets(response.data);
    } catch (error) {
      console.error('Error fetching cabinets:', error);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchCabinets();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/routes/accounts/donations');
      const sortedDonations = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDonations(sortedDonations);
    } catch (error) {
      setError('Error fetching donations');
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to mark this donation as received?")) {
      return;
    }
  
    try {
      const response = await axios.put(`https://idonate1.onrender.com/routes/accounts/donations/accept/${id}`);
  
      if (response.status === 200) {
        setDonations((prevDonations) =>
          prevDonations.map((donation) =>
            donation._id === id ? { ...donation, received: true } : donation
          )
        );
  
        alert("Donation marked as received. An email has been sent to the donor.");
      } else {
        alert("Failed to mark donation as received.");
      }
    } catch (error) {
      console.error("Error accepting donation:", error);
      alert("Failed to accept donation. Please try again later.");
    }
  };

  const handleView = (donation) => {
    setSelectedDonation(donation);
    setModalOpenV(true);
  };

  const handleLocate = (donation) => {
    setSelectedDonation(donation);
    setLocation({ cabinet: '', column: '', row: '' });
    setLocationError('');
    setModalOpen(true);
  };

  const submitLocation = async () => {
    const { cabinet, column, row } = location;

    if (cabinet === '' || column === '' || row === '') {
      setLocationError('Cabinet, Column, and Row are required.');
      return;
    }

    try {
      const response = await axios.put(`/routes/accounts/donations/locate/${selectedDonation._id}`, {
        cabinet: Number(cabinet),
        column: Number(column),
        row: Number(row),
      });

      setDonations((prevDonations) =>
        prevDonations.map((donation) =>
          donation._id === selectedDonation._id ? response.data.donation : donation
        )
      );

      alert('Location assigned successfully.');
      setModalOpen(false);
    } catch (error) {
      console.error('Error assigning location:', error);
      setLocationError(error.response?.data?.message || 'Failed to assign location.');
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
      alert('Error logging out. Please try again.');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDonations = donations.filter(donation => {
    const searchLower = searchQuery.toLowerCase();
    const donationIdMatch =  (donation.donationId || '').toLowerCase().includes(searchLower);
    const itemMatch = donation.item.toLowerCase().includes(searchLower);
    const contactMatch = typeof donation.contact === 'string' && donation.contact.toLowerCase().includes(searchLower);
    const dateMatch = new Date(donation.date).toLocaleDateString().toLowerCase().includes(searchLower);
    const cabinetMatch = donation.location?.cabinet?.toString().includes(searchLower);
    const columnMatch = donation.location?.column?.toString().includes(searchLower);
    const rowMatch = donation.location?.row?.toString().includes(searchLower);
    return donationIdMatch || itemMatch || contactMatch || dateMatch || cabinetMatch || columnMatch || rowMatch;
  });

  const imageToBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous'); // To handle CORS issues
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  const generatePDF = async (donation) => {
    try {
      const logoBase64 = await imageToBase64(logo1);
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [54, 85.6], // ID-1 size: 85.6mm x 54mm
      });

      const imgProps = doc.getImageProperties(logoBase64);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const logoWidth = 50; // Adjust as needed
      const logoHeight = (imgProps.height * logoWidth) / imgProps.width;
      const logoX = (pdfWidth - logoWidth) / 2;
      doc.addImage(logoBase64, 'PNG', logoX, 5, logoWidth, logoHeight);
      const item = donation.item;
      const expirationDate = donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'N/A';
      const locationText = donation.location 
        ? `Cabinet ${donation.location.cabinet}: Column ${donation.location.column}, Row ${donation.location.row}`
        : 'N/A';
      const donationId = donation.donationId;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(12);

      let yPosition = 25; 

      const content = [
        { label: 'Item:', value: item },
        { label: 'Expiration Date:', value: expirationDate },
        { label: 'Location:', value: locationText },
      ];

      content.forEach((entry) => {
        const text = `${entry.label} ${entry.value}`;
        const textWidth = doc.getTextWidth(text);
        doc.text(text, (pdfWidth - textWidth) / 2, yPosition);
        yPosition += 6; 
      });

      doc.setFontSize(8);
      const donationIdText = `Donation ID: ${donationId}`;
      const donationIdWidth = doc.getTextWidth(donationIdText);
      doc.text(donationIdText, (pdfWidth - donationIdWidth) / 2, 50); // Adjust y position as needed

      doc.save(`Donation_${donationId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleAddDonationSubmit = async (e) => {
    e.preventDefault();
    setAddDonationError('');

    if (!newDonation.name || !newDonation.contact || !newDonation.item || !newDonation.quantity || !newDonation.dateOfDelivery) {
      setAddDonationError('Please fill in all required fields.');
      return;
    }
    const contactRegex = /^09\d{9}$/;
    if (!contactRegex.test(newDonation.contact)) {
      setAddDonationError('Contact must start with "09" and be exactly 11 digits.');
      return;
    }

    const today = new Date();
    const deliveryDate = new Date(newDonation.dateOfDelivery);
    today.setHours(0, 0, 0, 0);
    deliveryDate.setHours(0, 0, 0, 0);
    if (deliveryDate > today) {
      setAddDonationError('Date of Delivery cannot be in the future.');
      return;
    }
    try {
      const donationData = {
        name: newDonation.name,
        contact: newDonation.contact,
        item: newDonation.item,
        quantity: newDonation.quantity,
        expirationDate: newDonation.expirationDate || null,
        dateOfDelivery: newDonation.dateOfDelivery,
      };
      const response = await axios.post('/routes/accounts/donations/addSingle', donationData);
      if (response.status === 201) {
        setAddModalOpen(false);
        setNewDonation({
          name: '',
          contact: '',
          item: '',
          quantity: '',
          expirationDate: '',
          dateOfDelivery: '',
        });
        setDonations((prevDonations) => [response.data.donation, ...prevDonations]);
      } else {
        setAddDonationError('Failed to add donation. Please try again.');
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      setAddDonationError(error.response?.data?.message || 'Failed to add donation.');
    }
  };

  const handleAddCabinetSubmit = async (e) => {
    e.preventDefault();
    setAddCabinetError('');

    const { cabinetNumber, columns, rows } = newCabinet;
    if (!cabinetNumber || !columns || !rows) {
      setAddCabinetError('Please fill in all required fields.');
      return;
    }

    if (columns < 1 || columns > 10 || rows < 1 || rows > 10) {
      setAddCabinetError('Columns and Rows must be between 1 and 10.');
      return;
    }

    try {
      const response = await axios.post('/routes/accounts/addCabinet', {
        cabinetNumber: Number(cabinetNumber),
        columns: Number(columns),
        rows: Number(rows),
      });

      if (response.status === 201) {
        alert('Cabinet added successfully.');
        setAddCabinetModalOpen(false);
        setNewCabinet({
          cabinetNumber: '',
          columns: '',
          rows: '',
        });
        fetchCabinets(); // Refresh the cabinets list
      } else {
        setAddCabinetError('Failed to add cabinet. Please try again.');
      }
    } catch (error) {
      console.error('Error adding cabinet:', error);
      setAddCabinetError(error.response?.data?.message || 'Failed to add cabinet.');
    }
  };

  const computeAvailableCabinets = () => {
    const available = cabinets.filter((cabinet) => {
      for (let col = 1; col <= cabinet.columns; col++) {
        const occupiedRows = donations.filter(
          (donation) =>
            donation.location?.cabinet === cabinet.cabinetNumber &&
            donation.location?.column === col
        ).length;
  
        if (occupiedRows < cabinet.rows) {
          return true; // At least one slot is available
        }
      }
      return false;
    }).map((cabinet) => cabinet.cabinetNumber);
  
    setAvailableCabinets(available);
  };
  

  const computeAvailableColumns = (cabinetNumber) => {
    const cabinet = cabinets.find(
      (cabinet) => cabinet.cabinetNumber === Number(cabinetNumber)
    );
    if (!cabinet) {
      setAvailableColumns([]); // Clear if no cabinet found
      return;
    }
  
    // Restrict to actual number of columns for this cabinet
    const available = Array.from({ length: cabinet.columns }, (_, i) => i + 1).filter((col) => {
      const occupiedRows = donations.filter(
        (donation) =>
          donation.location?.cabinet === Number(cabinetNumber) &&
          donation.location?.column === col
      ).length;
  
      return occupiedRows < cabinet.rows; // Column has available rows
    });
  
    setAvailableColumns(available); // Update state with filtered columns
  };
  
  const computeAvailableRows = (cabinetNumber, columnNumber) => {
    const cabinet = cabinets.find(
      (cabinet) => cabinet.cabinetNumber === Number(cabinetNumber)
    );
    if (!cabinet) {
      setAvailableRows([]);
      return;
    }
  
    const occupiedRows = donations
      .filter(
        (donation) =>
          donation.location?.cabinet === Number(cabinetNumber) &&
          donation.location?.column === Number(columnNumber)
      )
      .map((donation) => donation.location?.row);
  
    const available = Array.from({ length: cabinet.rows }, (_, i) => i + 1).filter(
      (row) => !occupiedRows.includes(row)
    );
  
    setAvailableRows(available);
  };
  
  
  

  useEffect(() => {
    if (modalOpen) {
      computeAvailableCabinets();
    }
  }, [modalOpen, donations, cabinets]);

  useEffect(() => {
    if (location.cabinet && location.column) {
      const remainingRows = availableRows.length;
      if (remainingRows > 0) {
        // Continue with the current column as there are still available rows
        computeAvailableRows(location.cabinet, location.column);
      } else {
        // All rows are occupied, move to the next column
        computeAvailableColumns(location.cabinet);
        setLocation(prev => ({ ...prev, column: '', row: '' }));
      }
    } else {
      setAvailableRows([]);
    }
  }, [location.cabinet, location.column]);
  

  useEffect(() => {
    if (location.cabinet && location.column) {
      const remainingRows = availableRows.length;
      if (remainingRows === 0) {
        // Automatically select the next available column
        const nextAvailableColumn = availableColumns.find(col => col !== Number(location.column));
        if (nextAvailableColumn) {
          setLocation(prev => ({ ...prev, column: nextAvailableColumn, row: '' }));
          computeAvailableRows(location.cabinet, nextAvailableColumn);
        } else {
          // No more available columns in this cabinet, consider switching cabinets
          // You can prompt the user here or auto-switch to another cabinet if needed
        }
      }
    }
  }, [availableRows]);
  
  const getAvailableCabinetNumbers = () => {
    const usedCabinetNumbers = cabinets.map(cabinet => cabinet.cabinetNumber);
    return Array.from({ length: 10 }, (_, i) => i + 1).filter(number => !usedCabinetNumbers.includes(number));
  };
  const getAvailableColumns = (cabinetNumber) => {
    const cabinet = cabinets.find(c => c.cabinetNumber === cabinetNumber);
    const usedColumns = cabinet ? cabinet.locations.map(location => location.column) : [];
    return Array.from({ length: 10 }, (_, i) => i + 1).filter(col => !usedColumns.includes(col));
  };
  
  const getAvailableRows = (cabinetNumber, column) => {
    const cabinet = cabinets.find(c => c.cabinetNumber === cabinetNumber);
    const usedRows = cabinet ? cabinet.locations.filter(loc => loc.column === column).map(loc => loc.row) : [];
    return Array.from({ length: 10 }, (_, i) => i + 1).filter(row => !usedRows.includes(row));
  };
  

  if (loading) return <div class="loader loader_bubble"></div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="containerD">
      <div id="sidebar">
       <ul>
                <li><img className="logoD" src={logo2} alt="Logo" /></li>
                <br />
                <br />
                <li><Link to="/staffDashboard">Staff Dashboard</Link></li>
                <li><Link to="/donations">Item Donations</Link></li>
                <li><Link to="/receiptS">Cash Donations</Link></li>
                <li><Link to="/inventoryS">Inventory</Link></li>
                <br />
                <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
              </ul>
      </div>
      <div id="contentD">
        <h2 className='text-3xl font-bold mt-2 mb-4'>Receiving and Tracking of Item Donations from Donors</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search donations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            style={{ width: '200px', height: '30px', borderRadius: '5px' }}
          />
        </div>
        <button 
        type="button"
           className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md mr-3 my-3"
            onClick={() => setAddModalOpen(true)}
            disabled={getAvailableCabinetNumbers().length === 0 && cabinets.length >= 10}
          >
            Add Donation
          </button>
         
          {getAvailableCabinetNumbers().length === 0 && (
            <p className="info">All cabinet numbers (1-10) are in use. Cannot add more cabinets.</p>
          )}
      <table className='table-auto w-full'>
  <thead className='bg-red-800 text-white'>
    <tr>
      <th className='font-normal py-1.5 px-2'>Donation ID</th>
      <th className='font-normal py-1.5 px-2'>Item</th>
      <th className='font-normal py-1.5 px-2'>Quantity</th>
      <th className='font-normal py-1.5 px-2'>Date of Delivery</th>
      <th className='font-normal py-1.5 px-2'>Status</th>
      <th className='font-normal py-1.5 px-2'>Location</th>
      <th className='font-normal py-1.5 px-2'>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredDonations
      .slice() // Create a shallow copy
      .sort((a, b) => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const dateA = new Date(a.date).toISOString().split('T')[0];
        const dateB = new Date(b.date).toISOString().split('T')[0];

        // Prioritize items matching today's date
        if (dateA === today && dateB !== today) return -1;
        if (dateB === today && dateA !== today) return 1;

        // Otherwise, sort earlier dates first (descending order)
        return new Date(b.date) - new Date(a.date);
      })
      .map((donation) => (
        <tr key={donation._id} className='even:bg-gray-200'>
          <td className='px-10 py-2'>{donation.donationId}</td>
          <td className='px-10 py-2'>{donation.item}</td>
          <td className='px-10 py-2'>
            {donation.unit ? `${donation.quantity} ${donation.unit}` : donation.quantity}
          </td>
          <td className='px-10 py-2'>{new Date(donation.date).toLocaleDateString()}</td>
          <td className='px-10 py-2'>
            {donation.user ? (
              donation.received ? 'Through system: Delivered' : 'Through system: In Transit'
            ) : (
              'Through walk-in: Delivered'
            )}
          </td>
          <td className='px-10 py-2'>
            {donation.location && donation.location.cabinet
              ? `Cabinet ${donation.location.cabinet}: Column ${donation.location.column}, Row ${donation.location.row}`
              : 'Not assigned'}
          </td>
          <td className='px-10 py-2'>
            {donation.user ? (
              !donation.received ? (
                <button
                type="button"
                  className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md"
                  onClick={() => handleAccept(donation._id)}
                >
                  Receive
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                  type="button"
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 duration-200 rounded-md"
                    onClick={() => handleView(donation)}
                  >
                    View
                  </button>
                  {!donation.location && (
                    <button
                    type="button"
                      className="px-4 py-2 text-white bg-blue-800 hover:bg-blue-900 duration-200 rounded-md"
                      onClick={() => handleLocate(donation)}
                    >
                      Locate
                    </button>
                  )}
                  {donation.location && (
                    <button
                    type="button"
                      className="px-4 py-2 text-white bg-blue-800 hover:bg-blue-900 duration-200 rounded-md"
                      onClick={() => generatePDF(donation)}
                    >
                      Print Location
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="flex space-x-1">
                <button
                type="button"
                  className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 duration-200 rounded-md"
                  onClick={() => handleView(donation)}
                >
                  View
                </button>
                {!donation.location ? (
                  <button
                  type="button"
                    className="px-4 py-2 text-white bg-blue-800 hover:bg-blue-900 duration-200 rounded-md"
                    onClick={() => handleLocate(donation)}
                  >
                    Locate
                  </button>
                ) : (
                  <button
                  type="button"
                    className="px-4 py-2 text-white bg-blue-800 hover:bg-blue-900 duration-200 rounded-md"
                    onClick={() => generatePDF(donation)}
                  >
                    Print Location
                  </button>
                )}
              </div>
            )}
          </td>
        </tr>
      ))}
  </tbody>
</table>

        {addModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close-button" onClick={() => setAddModalOpen(false)}>&times;</span>
              <h2 className='text-2xl mb-2'><strong>Add Donation for Walk-in Donor</strong></h2>
              <form onSubmit={handleAddDonationSubmit}>
                <div className="form-group">
                  <label  className="block mb-2">Name:</label>
                  <input
                    type="text"
                    value={newDonation.name}
                    onChange={(e) => setNewDonation({ ...newDonation, name: e.target.value })}
                    required
                     className="read-only w-full p-2 border rounded-lg"
                     maxLength='50'
                  />
                </div>
                <div className="form-group">
                  <label  className="block mb-2">Contact:</label>
                  <input
                    type="text" // Changed from "number" to "text" to allow leading zeros
                    value={newDonation.contact}
                    onChange={(e) => setNewDonation({ ...newDonation, contact: e.target.value })}
                    required
                     className="read-only w-full p-2 border rounded-lg"
                    placeholder="e.g., 09123456789"
                  />
                </div>
                <div className="form-group">
                  <label  className="block mb-2">Item:</label>
                  <input
                    type="text"
                    value={newDonation.item}
                    onChange={(e) => setNewDonation({ ...newDonation, item: e.target.value })}
                    required
                     className="read-only w-full p-2 border rounded-lg"
                     maxLength='20'
                  />
                </div>
                <div className="form-group">
                  <label  className="block mb-2">Quantity:</label>
                  <input
                    type="number"
                    value={newDonation.quantity}
                    onChange={(e) => setNewDonation({ ...newDonation, quantity: e.target.value })}
                    required
                     className="read-only w-full p-2 border rounded-lg"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label  className="block mb-2">Expiration Date (Optional):</label>
                  <input
                    type="date"
                    value={newDonation.expirationDate}
                     className="read-only w-full p-2 border rounded-lg"
                     min={new Date().toISOString().split('T')[0]} // Restrict to today or future dates
                    onChange={(e) => setNewDonation({ ...newDonation, expirationDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label  className="block mb-2">Date of Delivery:</label>
                  <input
                    type="date"
                    value={newDonation.dateOfDelivery}
                    onChange={(e) => setNewDonation({ ...newDonation, dateOfDelivery: e.target.value })}
                    required
                     className="read-only w-full p-2 border rounded-lg"
                    max={new Date().toISOString().split("T")[0]} // Prevent future dates
                  />
                </div>
                {addDonationError && <p className="error">{addDonationError}</p>}
                <button type="submit"   className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md mt-3 ml-1">Submit</button>
              </form>
            </div>
          </div>
        )}
       {addCabinetModalOpen && (
  <div className="modal-overlay">
    <div className="modal">
      <span className="close-button" onClick={() => setAddCabinetModalOpen(false)}>&times;</span>
      <form onSubmit={handleAddCabinetSubmit}>
        <div className="form-group">
        <center> <label className="block mb-2 ml-5"><strong>Cabinet Number:</strong></label>
          <select
            value={newCabinet.cabinetNumber}
            onChange={(e) => setNewCabinet({ ...newCabinet, cabinetNumber: e.target.value })}
            required
               className="read-only w-full p-2 border rounded-lg"
          >
            <option    className="read-only w-full p-2 border rounded-lg" value="">Select Cabinet Number</option>
            {getAvailableCabinetNumbers().length > 0 ? (
              getAvailableCabinetNumbers().map(number => (
                <option key={number} value={number}>{number}</option>
              ))
            ) : (
              <option    className="read-only w-full p-2 border rounded-lg" value="" disabled>No Cabinets Available</option>
            )}
          </select></center>
        </div>
        <div className="form-group">
        <center>  <label className="block mb-2"><strong>Columns:</strong></label>
          <select
            value={newCabinet.columns}
            onChange={(e) => setNewCabinet({ ...newCabinet, columns: e.target.value })}
            required
          >
            <option value="">Select Number of Columns</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(number => (
              <option key={number} value={number}>{number}</option>
            ))}
          </select></center>
        </div>
        <div className="form-group">
        <center> <label className="block mb-2"><strong>Rows:</strong></label>
          <select
            value={newCabinet.rows}
            onChange={(e) => setNewCabinet({ ...newCabinet, rows: e.target.value })}
            required
               className="read-only w-full p-2 border rounded-lg"
          >
            <option value="">Select Number of Rows</option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map(number => (
              <option key={number} value={number}>{number}</option>
            ))}
          </select></center>
        </div>
        {addCabinetError && <p className="error">{addCabinetError}</p>}
        <center> <button type="submit"  className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md mt-2" disabled={getAvailableCabinetNumbers().length === 0}>
          Add Cabinet
        </button></center>
        {getAvailableCabinetNumbers().length === 0 && (
          <p className="error">All cabinet numbers (1-10) are already in use.</p>
        )}
      </form>
    </div>
  </div>
)}

{modalOpen && (
  <div className="modal-overlay">
    <div className="modal">
      <span className="close-button" onClick={() => setModalOpen(false)}>&times;</span>
      {!selectedDonation?.location ? (
        <div className="modal-headerAccounts">
         <h2 className='text-2xl mb-3'><strong>Assign Location</strong></h2>
         <div className="available-info">
  <ul>
    <li><strong>Available Cabinets:</strong> {availableCabinets.join(', ') || 'None'}</li>
    {location.cabinet && (
      <li><strong>Available Columns in Cabinet {location.cabinet}:</strong> {availableColumns.join(', ') || 'None'}</li>
    )}
    {location.cabinet && location.column && (
      <li><strong>Available Rows in Column {location.column}:</strong> {availableRows.join(', ') || 'None'}</li>
    )}
  </ul>
</div>

          <form>
            <div className="form-group">
            <center> <label className="block mb-2"><strong>Cabinet:</strong></label>
            <select
                value={location.cabinet}
                onChange={(e) => {
                  setLocation({ ...location, cabinet: e.target.value, column: '', row: '' });
                  computeAvailableColumns(e.target.value);
                  setAvailableRows([]); // Clear rows when cabinet changes
                }}
                required
                className="read-only w-full p-2 border rounded-lg"
              >
                <option value="">Select Cabinet</option>
                {availableCabinets.map(cabinetNumber => (
                  <option key={cabinetNumber} value={cabinetNumber}>
                    {cabinetNumber}
                  </option>
                ))}
              </select></center>
            </div>
            {availableColumns.length > 0 && (
  <div className="form-group">
   <center> <label className="block mb-2"><strong>Column:</strong></label>
   <select
                  value={location.column}
                  onChange={(e) => {
                    setLocation({ ...location, column: e.target.value, row: '' });
                    computeAvailableRows(location.cabinet, e.target.value);
                  }}
                  required
                  className="read-only w-full p-2 border rounded-lg"
                >
                  <option value="">Select Column</option>
                  {availableColumns.map(col => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select></center>
  </div>
)}

{availableRows.length > 0 && (
  <div className="form-group">
   <center> <label className="block mb-2"><strong>Row:</strong></label>
   <select
                  value={location.row}
                  onChange={(e) => setLocation({ ...location, row: e.target.value })}
                  required
                  className="read-only w-full p-2 border rounded-lg"
                >
                  <option value="">Select Row</option>
                  {availableRows.map(row => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </select></center>
  </div>
)}

            
            {locationError && <p className="error">{locationError}</p>}
            <center> <button type="button" onClick={submitLocation} className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md mt-2">Submit</button></center>
          </form>
        </div>
      ) : (
        <>
          <h2 className='text-2xl mb-2'><strong>Donor Details</strong></h2>
          {selectedDonation && (
            <div>
              <p><strong>UserID:</strong> {selectedDonation.user?._id || 'N/A'}</p>
              <p><strong>First Name:</strong> {selectedDonation.user?.firstname || selectedDonation.firstname || 'N/A'}</p>
              <p><strong>Last Name:</strong> {selectedDonation.user?.lastname || selectedDonation.lastname || 'N/A'}</p>
              <p><strong>Contact:</strong> {selectedDonation.user?.contact || selectedDonation.contact || 'N/A'}</p>
              <p><strong>Location:</strong> Cabinet {selectedDonation.location.cabinet}: Column {selectedDonation.location.column}, Row {selectedDonation.location.row}</p>
            </div>
          )}
        </>
      )}
    </div>
  </div>
)}

        {modalOpenV && (
          <div className="modal-overlay">
            <div className="modal">
              <span className="close-button" onClick={() => setModalOpenV(false)}>&times;</span>
              <h2 className='text-2xl mb-5'><strong>Donor Details</strong></h2>
              {selectedDonation ? (
                selectedDonation.user ? (
                  <div>
                    <p className=' mb-2'><strong>Donor Name:</strong> {selectedDonation.user.firstname} {selectedDonation.user.lastname}</p>
                    <p className=' mb-2'><strong>Contact:</strong> {selectedDonation.user.contact}</p>
                  </div>
                ) : (
                  <div>
                    <p className=' mb-2'><strong>Name:</strong> {selectedDonation.firstname} {selectedDonation.lastname}</p>
                    <p className=' mb-2'><strong>Contact:</strong> {selectedDonation.contact}</p>
                  </div>
                )
              ) : (
                <p>No donation selected.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donations;
