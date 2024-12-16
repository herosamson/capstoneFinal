import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './inventory.css';
import { Link } from 'react-router-dom';
import logo2 from './logo2.png';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Inventory() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);
  const [expiredItems, setExpiredItems] = useState([]);
  const handleViewExpiredItems = () => {
    const today = new Date();
    const expired = donations.filter(donation => {
      if (donation.expirationDate) {
        const expirationDate = new Date(donation.expirationDate);
        return expirationDate < today; // Filter expired items
      }
      return false;
    });
    setExpiredItems(expired);
    setIsExpiredModalOpen(true); // Open the modal
  };

  const handleCloseExpiredModal = () => {
    setIsExpiredModalOpen(false);
  };
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const [financialAssistance, setFinancialAssistance] = useState([]);
  const [medicalAssistance, setMedicalAssistance] = useState([]);
  const [legalAssistance, setLegalAssistance] = useState([]);
  const [foodAssistance, setFoodAssistance] = useState([]);
  const [disasterRelief, setDisasterRelief] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [filterCategory, setFilterCategory] = useState('All'); 
  const [filterExpiration, setFilterExpiration] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [consumeQuantity, setConsumeQuantity] = useState(1);
  const [consumeLocation, setConsumeLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        localStorage.clear();
        window.location.href = '/'; 
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Error logging out. Please try again.');
    }
  };

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/routes/accounts/donations/located`);
        setDonations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching donations:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/routes/accounts/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    const fetchFinancialAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/financial-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setFinancialAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch financial assistance requests:', error);
      }
    };

    const fetchMedicalAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/medical-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setMedicalAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch medical assistance requests:', error);
      }
    };

    const fetchLegalAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/legal-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setLegalAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch legal assistance requests:', error);
      }
    };

    const fetchFoodAssistance = async () => {
      try {
        const response = await axios.get(`/routes/accounts/food-assistance/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setFoodAssistance(unapproved);
      } catch (error) {
        console.error('Failed to fetch food assistance requests:', error);
      }
    };

    const fetchDisasterRelief = async () => {
      try {
        const response = await axios.get(`/routes/accounts/disaster-relief/all`);
        const unapproved = response.data.filter(request => !request.approved);
        setDisasterRelief(unapproved);
      } catch (error) {
        console.error('Failed to fetch disaster relief requests:', error);
      }
    };

    fetchEvents();
    fetchFinancialAssistance();
    fetchMedicalAssistance();
    fetchLegalAssistance();
    fetchFoodAssistance();
    fetchDisasterRelief();
  }, []);

  const handleOpenModal = (donation) => {
    setCurrentDonation(donation);
    setConsumeQuantity(1);
    setConsumeLocation('');
    setCustomLocation('');
    setIsCustomLocation(false);
    setSelectedCategory('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDonation(null);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (
      value === 'Events' ||
      value === 'Financial Assistance' ||
      value === 'Medical Assistance' ||
      value === 'Legal Assistance' ||
      value === 'Food Subsidy' ||
      value === 'Disaster Relief'
    ) {
      setIsCustomLocation(false);
      setCustomLocation('');
    } else if (value === 'Others') {
      setIsCustomLocation(true);
      setConsumeLocation('');
    }
  };

  const handleConsumeSubmit = async (e) => {
    e.preventDefault();
  
    let donatedTo;
    if (isCustomLocation) {
      donatedTo = [customLocation.trim()];
      if (donatedTo[0] === '') {
        alert('Please specify a valid location.');
        return;
      }
    } else {
      if (!selectedCategory || !consumeLocation) {
        alert('Please select both category and consumption location.');
        return;
      }
      donatedTo = [`${selectedCategory}: ${consumeLocation}`];
    }
  
    if (!donatedTo || donatedTo.length === 0) {
      alert('Please select or enter a consumption location.');
      return;
    }
  
    if (consumeQuantity < 1 || consumeQuantity > currentDonation.quantity) {
      alert('Please enter a valid quantity to consume.');
      return;
    }
  
    try {
      const response = await axios.put(`/routes/accounts/donations/consume/${currentDonation._id}`, {
        quantity: consumeQuantity,
        donatedTo,
      });
  
      if (response.status === 200) {
        alert('Item consumed successfully.');
        setDonations(donations.map(donation => 
          donation._id === currentDonation._id ? response.data.donation : donation
        ));
        handleCloseModal();
      } else {
        alert('Failed to consume the item.');
      }
    } catch (error) {
      console.error('Error consuming the item:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while consuming the item.');
      }
    }
  };

  const handleFilterStatusChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleFilterExpirationChange = (e) => {
    setFilterExpiration(e.target.value);
  };

  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      if (donation.quantity <= 0) return false;
      if (filterStatus === 'Consumed' && (!donation.donatedTo || donation.donatedTo.length === 0)) return false;
      if (filterStatus === 'Unconsumed' && (donation.donatedTo && donation.donatedTo.length > 0)) return false;
      if (filterCategory !== 'All') {
        const category = donation.item.toLowerCase();
        if (filterCategory === 'Food' && category !== 'food') return false;
        if (filterCategory === 'Hygiene' && category !== 'hygiene') return false;
        if (filterCategory === 'Clothes' && category !== 'clothes') return false;
        if (filterCategory === 'Others' && category !== 'others') return false;
      }
      if (filterExpiration) {
        if (!donation.expirationDate) return false; 
        const expirationDate = new Date(donation.expirationDate);
        return expirationDate <= new Date(filterExpiration);
      }

      return true;
    }).sort((a, b) => b.quantity - a.quantity);
  }, [donations, filterStatus, filterCategory, filterExpiration]);

  const groupedDonations = useMemo(() => {
    const group = {};

    donations.forEach(donation => {
      if (donation.location) {
        const { cabinet, column, row } = donation.location;
        if (!group[cabinet]) {
          group[cabinet] = {};
        }
        if (!group[cabinet][column]) {
          group[cabinet][column] = {};
        }
        group[cabinet][column][row] = donation;
      }
    });

    return group;
  }, [donations]);
  if (loading) return <div class="loader loader_bubble"></div>;
  if (error) {
    return <div className="error-message">Error loading donations. Please try again later.</div>;
  }

  const downloadReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const title = 'MINOR BASILICA OF THE BLACK NAZARENE';
    const textWidth = doc.getTextWidth(title);
    const xPos = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    doc.text(title, xPos, 22);

    const lineY = 28;
    const lineWidth = 1.2;
    doc.setLineWidth(lineWidth);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 30;
    doc.line(margin, lineY, pageWidth - margin, lineY);

    doc.setFontSize(14);
    const title2 = 'SAINT JOHN THE BAPTIST PARISH | QUIAPO CHURCH';
    const textWidth2 = doc.getTextWidth(title2);
    const xPos2 = (doc.internal.pageSize.getWidth() - textWidth2) / 2;
    doc.text(title2, xPos2, 38);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    const reportTitle = 'Inventory Report';
    const textWidth3 = doc.getTextWidth(reportTitle);
    const xPos3 = (doc.internal.pageSize.getWidth() - textWidth3) / 2;
    const reportTitleY = 56;
    doc.text(reportTitle, xPos3, reportTitleY);
    
    doc.setFontSize(12);
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date: ${currentDate}`, margin, 65);

    const tableStartY = 70;

    const tableColumn = ["Donation ID", "Item", "Quantity", "Expiration Date", "Status", "Location", "Donated To"];
    const tableRows = filteredDonations.map(donation => [
      donation.donationId,
      donation.item,
      donation.quantity,
      donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'None',
      Array.isArray(donation.donatedTo) && donation.donatedTo.length > 0 ? 'Consumed' : 'Unconsumed',
      donation.location
        ? `Cabinet ${donation.location.cabinet}: Column ${donation.location.column}, Row ${donation.location.row}`
        : 'Not assigned',
      Array.isArray(donation.donatedTo) && donation.donatedTo.length > 0 ? donation.donatedTo.join(', ') : 'None',
    ]);

    doc.autoTable({
      startY: tableStartY,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: '#740000',
        textColor: 255,
      },
      styles: {
        fillColor: '#FFFFFF',
        textColor: 0,
        fontSize: 10,
      },
      margin: { left: margin, right: margin },
      didDrawPage: function (data) {
      },
    });

    const finalY = doc.lastAutoTable.finalY || tableStartY;
    doc.setFontSize(10);
    doc.save('Inventory_Report.pdf');
  };

  return (
    <div id="containerU">
      <div id="sidebar">
        <ul>
          <li><img className="logoU" src={logo2} alt="Logo" /></li>
          <li><Link to="/analytics">Administrator Dashboard</Link></li>
          <li><Link to="/donateA">Item Donations</Link></li>
          <li><Link to="/eventsA">Events</Link></li>
          <li className="dropdown-toggle" onClick={toggleDropdown}>
            Request Assistance <span className="arrow">&#9660;</span>
          </li>
          {isDropdownOpen && (
            <ul className="dropdown-menuU">
              <li><Link to="/financialA" >Financial Assistance</Link></li>
              <li><Link to="/medicalA" >Medical Assistance</Link></li>
              <li><Link to="/legalA" >Legal Assistance</Link></li>
              <li><Link to="/foodA" >Food Assistance</Link></li>
              <li><Link to="/disasterA" >Disaster Assistance</Link></li>
            </ul>
          )}
          <li><Link to="/inventory">Inventory</Link></li>
    
          <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>
      <div id="contentDInventory">
        <h1 className='text-3xl font-bold mt-2 mb-4'>Inventory</h1>
        <div className="filters">
          <div className="fil">
            <label>Status:</label>
            <select value={filterStatus} onChange={handleFilterStatusChange}>
              <option value="All">All</option>
              <option value="Consumed">Consumed</option>
              <option value="Unconsumed">Unconsumed</option>
            </select>
          </div>
        </div>
        <div className="fil">
            <label>Expiration Date (Before):</label>
            <input
              type="date"
              value={filterExpiration}
              onChange={handleFilterExpirationChange}
            />
          </div>
        <div className="filter-group">
            <button     className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md my-2 mr-2" onClick={downloadReport}>Print Reports</button>
            <button 
            className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md my-2"
            onClick={handleViewExpiredItems}>
            View Expired Items
          </button>
          </div>
        {filteredDonations.length === 0 ? (
          <p className="no-data">No located donations available.</p>
        ) : (
          <>
              <table className='table-auto w-full'>
              <thead className='bg-red-800 text-white'>
                <tr>
                  <th className='font-normal py-1.5 px-2'>Donation ID</th>
                  <th className='font-normal py-1.5 px-2'>Item</th>
                  <th className='font-normal py-1.5 px-2'>Quantity</th>
                  <th className='font-normal py-1.5 px-2'>Expiration Date</th>
                  <th className='font-normal py-1.5 px-2'>Status</th>
                  <th className='font-normal py-1.5 px-2'>Location</th>
                  <th className='font-normal py-1.5 px-2'>Donated To</th> 
                  <th className='font-normal py-1.5 px-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map(donation => (
                  <tr key={donation._id}  className='even:bg-gray-200'>
                    <td className='px-10 py-2'>{donation.donationId}</td>
                    <td className='px-10 py-2'>{donation.item}</td>
                    <td className='px-10 py-2'>{donation.quantity}</td>
                    <td className='px-10 py-2'>{donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'None'}</td>
                    <td className='px-10 py-2'>{Array.isArray(donation.donatedTo) && donation.donatedTo.length > 0 ? 'Consumed' : 'Unconsumed'}</td>
                    <td className='px-10 py-2'>
                      {donation.location
                        ? `Cabinet ${donation.location.cabinet}: Column ${donation.location.column}, Row ${donation.location.row}`
                        : 'Not assigned'}
                    </td>
                    <td className='px-10 py-2'>
                      {Array.isArray(donation.donatedTo) && donation.donatedTo.length > 0 ? (
                        <ul className="donated-to-list">
                          {donation.donatedTo.map((location, index) => (
                            <li key={index}>{location}</li>
                          ))}
                        </ul>
                      ) : (
                        'None'
                      )}
                    </td>
                    <td className='px-10 py-2'>
                      {donation.quantity > 0 ? (
                        <button onClick={() => handleOpenModal(donation)}  className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md my-2">Consume</button>
                      ) : (
                        <span className="out-of-stock">Donated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="summary-section">
              {Object.keys(groupedDonations).length === 0 ? (
                <p>No located donations to display.</p>
              ) : (
                Object.keys(groupedDonations).sort((a, b) => a - b).map(cabinet => (
                  <div key={cabinet} className="cabinet">
                    <h3  className='text-2xl font-bold mt-2 mb-4'><center>Cabinet {cabinet}</center></h3>
                    <div className="columns">
                      {Object.keys(groupedDonations[cabinet]).sort((a, b) => a - b).map(column => (
                        <div key={column} className="column">
                          <h2><center>Column {column}</center></h2>
                          <div className="rows">
                            {Object.keys(groupedDonations[cabinet][column]).sort((a, b) => a - b).map(row => {
                              const donation = groupedDonations[cabinet][column][row];
                              return (
                                <div key={row} className="row">
                                  <center>
                                    <p><strong>Row {row}:</strong></p> </center>
                                    <p><strong>Item:</strong> {donation.item}</p>
                                    <p><strong>Quantity:</strong> {donation.quantity}</p>
                                    <p><strong>Expiration:</strong> {donation.expirationDate ? new Date(donation.expirationDate).toLocaleDateString() : 'None'}</p>
                               
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Consume Modal */}
            {isModalOpen && currentDonation && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h2 className='text-2xl mb-2'> <strong>Consume Donation</strong></h2>
                    <span className="close-button" onClick={handleCloseModal}>&times;</span>
                  </div>
                  <form onSubmit={handleConsumeSubmit}>
                    <div className="modal-body">
                      <label  className="block mb-2">
                        Quantity to Consume:
                        <input
                          type="number"
                          min="1"
                          max={currentDonation.quantity}
                          value={consumeQuantity}
                          onChange={(e) => setConsumeQuantity(parseInt(e.target.value))}
                          required
                           className="read-only w-full p-2 border rounded-lg"
                        />
                      </label>
                      <label className="block mb-2">
                        Consumption Category:
                        <select  className="read-only w-full p-2 border rounded-lg" value={selectedCategory} onChange={handleCategoryChange} required>
                          <option value="" disabled>Select Category</option>
                          <option value="Events">Events</option>
                          <option value="Financial Assistance">Financial Assistance</option>
                          <option value="Medical Assistance">Medical Assistance</option>
                          <option value="Legal Assistance">Legal Assistance</option>
                          <option value="Food Subsidy">Food Subsidy</option>
                          <option value="Disaster Relief">Disaster Relief</option>
                          <option value="Others">Others</option>
                        </select>
                      </label>
                      {selectedCategory === 'Events' && (
                        <label className="block mb-2">
                          Select Event:
                          <select
                            value={consumeLocation}
                            onChange={(e) => setConsumeLocation(e.target.value)}
                            required
                             className="read-only w-full p-2 border rounded-lg"
                          >
                            <option value="" disabled>Select Event</option>
                            {events.map(event => (
                              <option key={event._id} value={event.eventName}>{event.eventName}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selectedCategory === 'Financial Assistance' && (
                        <label  className="block mb-2">
                          Select Financial Assistance Request:
                          <select
                            value={consumeLocation}
                            onChange={(e) => setConsumeLocation(e.target.value)}
                            required
                             className="read-only w-full p-2 border rounded-lg"
                          >
                            <option value="" disabled>Select Request</option>
                            {financialAssistance.map(request => (
                              <option key={request._id} value={request.name}>{request.name}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selectedCategory === 'Medical Assistance' && (
                        <label  className="block mb-2">
                          Select Medical Assistance Request:
                          <select
                            value={consumeLocation}
                            onChange={(e) => setConsumeLocation(e.target.value)}
                            required
                             className="read-only w-full p-2 border rounded-lg"
                          >
                            <option value="" disabled>Select Request</option>
                            {medicalAssistance.map(request => (
                              <option key={request._id} value={request.name}>{request.name}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selectedCategory === 'Legal Assistance' && (
                        <label  className="block mb-2">
                          Select Legal Assistance Request:
                          <select
                            value={consumeLocation}
                            onChange={(e) => setConsumeLocation(e.target.value)}
                            required
                             className="read-only w-full p-2 border rounded-lg"
                          >
                            <option value="" disabled>Select Request</option>
                            {legalAssistance.map(request => (
                              <option key={request._id} value={request.name}>{request.name}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selectedCategory === 'Food Subsidy' && (
                        <label  className="block mb-2">
                          Select Food Subsidy Request:
                          <select
                            value={consumeLocation}
                            onChange={(e) => setConsumeLocation(e.target.value)}
                            required
                             className="read-only w-full p-2 border rounded-lg"
                          >
                            <option value="" disabled>Select Request</option>
                            {foodAssistance.map(request => (
                              <option key={request._id} value={request.name}>{request.name}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selectedCategory === 'Disaster Relief' && (
                        <label  className="block mb-2">
                          Select Disaster Relief Request:
                          <select
                            value={consumeLocation}
                            onChange={(e) => setConsumeLocation(e.target.value)}
                            required
                             className="read-only w-full p-2 border rounded-lg"
                          >
                            <option value="" disabled>Select Request</option>
                            {disasterRelief.map(request => (
                              <option key={request._id} value={request.name}>{request.name}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      {selectedCategory === 'Others' && (
                        <label  className="block mb-2">
                          Specify Location:
                          <input
                            type="text"
                            value={customLocation}
                            onChange={(e) => setCustomLocation(e.target.value)}
                            required={isCustomLocation}
                             className="read-only w-full p-2 border rounded-lg"
                            placeholder="Enter custom location"
                          />
                        </label>
                      )}
                    </div>
                    <div className="modal-buttons">
                      <button type="submit"   className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md" >Submit</button> 
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
         {/* Expired Items Modal */}
         {isExpiredModalOpen && (
          <div className="modal-overlay">
            <div className="modalevents">
              <div className="modal-header">
                <h2 className="text-2xl mb-2"><strong>Expired Items as of Today</strong></h2>
              </div>
              <div className="modal-body">
                {expiredItems.length > 0 ? (
                  <table className="table-auto w-full overflow-x-auto overflow-y-auto max-h-[500px]">
                    <thead className="bg-red-800 text-white ">
                      <tr>
                        <th className="font-normal py-1.5 px-2">Item</th>
                        <th className="font-normal py-1.5 px-2">Expiration Date</th>
                        <th className="font-normal py-1.5 px-2">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiredItems.map((item, index) => (
                        <tr key={index} className="even:bg-gray-200">
                          <td className="px-10 py-2">{item.item}</td>
                          <td className="px-10 py-2">
                            {new Date(item.expirationDate).toLocaleDateString()}
                          </td>
                          <td className="px-10 py-2">
                            {item.location
                              ? `Cabinet ${item.location.cabinet}, Column ${item.location.column}, Row ${item.location.row}`
                              : 'Not assigned'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No expired items found as of today.</p>
                )}
              </div>
              <div className="modal-buttons">
                <button 
                  className="px-10 py-1.5 text-white bg-red-800 hover:bg-red-700 duration-200 rounded-md"
                  onClick={handleCloseExpiredModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
