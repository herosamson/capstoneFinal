import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './receipt.css';
import logo2 from './logo2.png';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ReceiptS() {
  const [proofs, setProofs] = useState([]);
  const [filteredProofs, setFilteredProofs] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedProof, setSelectedProof] = useState(null);
  const [hiddenProofs, setHiddenProofs] = useState([]);
  const handleInvalidPayment = async (id) => {
    if (!id) return;
  
    try {
      await axios.patch(`https://idonate1.onrender.com/routes/accounts/proofs/${id}/reject`);
  
      alert("The donor has been notified that the proof of donation is invalid.");
  
      // Remove permanently from UI
      setProofs((prev) => prev.filter(proof => proof._id !== id));
      setFilteredProofs((prev) => prev.filter(proof => proof._id !== id));
  
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error rejecting donation:", error);
      alert("Failed to mark the donation as invalid. Please try again later.");
    }
  };
  
  
  
  
  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await axios.get(`https://idonate1.onrender.com/routes/accounts/proofs/all`);
        const sortedProofs = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        // Filter out rejected donations & hide approved ones
        const visibleProofs = sortedProofs.filter(proof => !proof.rejected); 
  
        setProofs(visibleProofs);
        setFilteredProofs(visibleProofs);
      } catch (error) {
        console.error('Error fetching proofs of Donation Verification:', error);
        alert('Failed to fetch proofs of Donation Verification. Please try again later.');
      }
    };

    fetchProofs();
  }, []);

  useEffect(() => {
    const filterProofs = () => {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
      let filtered;
      if (filter === 'Today') {
        filtered = proofs.filter(proof => new Date(proof.date) >= todayStart);
      } else if (filter === 'This Week') {
        filtered = proofs.filter(proof => new Date(proof.date) >= weekStart);
      } else if (filter === 'This Month') {
        filtered = proofs.filter(proof => new Date(proof.date) >= monthStart);
      } else {
        filtered = proofs;
      }
  
      // Sort filtered proofs by date in descending order
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      setFilteredProofs(filtered);
    };
  
    filterProofs();
  }, [filter, proofs]);
  

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
      alert("An error occurred during logout. Please try again.");
    }
  };

  const approvePayment = async (id) => {
    if (!id) return;
  
    try {
      await axios.patch(`https://idonate1.onrender.com/routes/accounts/proofs/${id}/approve`);
  
      alert("Donation has been verified. Email sent to the donor.");
  
      // Filter out the approved donation from the visible list
      setProofs((prev) => prev.filter(proof => proof._id !== id));
      setFilteredProofs((prev) => prev.filter(proof => proof._id !== id));
  
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error verifying donation:", error);
      alert("Failed to verify donation. Please try again later.");
    }
  };
  
  
  

  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const title = 'MINOR BASILICA OF THE BLACK NAZARENE';
    const xPos = (doc.internal.pageSize.getWidth() - doc.getTextWidth(title)) / 2;
    doc.text(title, xPos, 22);

    const lineY = 28;
    const lineWidth = 1.2;
    doc.setLineWidth(lineWidth);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 30;
    doc.line(margin, lineY, pageWidth - margin, lineY);

    doc.setFontSize(14);
    const title2 = 'SAINT JOHN THE BAPTIST PARISH | QUIAPO CHURCH';
    const xPos2 = (doc.internal.pageSize.getWidth() - doc.getTextWidth(title2)) / 2;
    doc.text(title2, xPos2, 38);

    doc.setFontSize(16);
    doc.text('Cash Donations Report', 14, 56);

    doc.autoTable({
      startY: 65,
      head: [['Name of Donor', 'Amount of Donation', 'Date of Donation', 'Status']],
      body: filteredProofs.map(proof => [
        proof.name || 'Anonymous',
        `${parseFloat(proof.amount).toLocaleString()}`,
        new Date(proof.date).toLocaleDateString(),
        proof.approved ? 'Verified' : 'Pending'
      ]),
      theme: 'striped',
      headStyles: {
        fillColor: '#740000',
        textColor: 255,
      },
      styles: {
        fillColor: '#FFFFFF',
        textColor: 0,
      },
    });

    doc.save('iDonate_CashDonation-Report.pdf');
  };

  return (
    <div id="containerU">
      <div id="sidebarU">
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
        <h2 className='text-3xl font-bold mt-2 mb-4'>Cash Donations</h2>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
        <button type="button" className="px-10 py-1.5 text-white bg-red-700 hover:bg-red-800 duration-200 rounded-md mr-3 my-3" onClick={downloadReport}>Download PDF Report</button>
        <table className='table-auto w-full'>
        <thead className='bg-red-800 text-white'>
            <tr>
              <th className='font-normal py-1.5 px-2'>Name of Donor</th>
              <th className='font-normal py-1.5 px-2'>Amount of Donation</th>
              <th className='font-normal py-1.5 px-2'>Date of Donation</th>
              <th className='font-normal py-1.5 px-2'>Donation Verification</th>
            </tr>
          </thead>
          <tbody>
            {filteredProofs
              .filter((proof) => !hiddenProofs.includes(proof._id)) // Hide approved donations
              .map((proof) => (
                <tr key={proof._id} className='even:bg-gray-200'>
                  <td className='px-10 py-2'>{proof.name || 'Anonymous'}</td>
                  <td className='px-10 py-2'>₱{parseFloat(proof.amount).toLocaleString()}</td>
                  <td className='px-10 py-2'>{new Date(proof.date).toLocaleDateString()}</td>
                  <td className='px-10 py-2'>
                    {proof.imagePath ? (
                      <button 
                        onClick={() => {
                          setSelectedProof(proof);  
                          setSelectedImage(`https://idonate1.onrender.com/${proof.imagePath}`);
                          setIsModalOpen(true);
                        }}
                        className="bg-red-700 hover:bg-red-800 text-white px-4 text-sm py-2 duration-200 rounded-md"
                      >
                        Verify Image
                      </button>
                    ) : 'No Image'}
                  </td>
                </tr>
            ))}
          </tbody>

        </table>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
           <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative max-h-[80vh] overflow-y-auto">
              
              <button 
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                ✖
              </button>

             <center><p className="text-xl font-semibold mb-4">Donation Verification</p></center> 
              <div className="flex flex-wrap md:flex-nowrap gap-6">
                
                <div className="w-full md:w-1/2">
                  <p className="text-black-700 font-semibold mb-2">Gcash:</p>
                  <p className="text-black-600 mb-2"><strong>Mobile Number:</strong> 0966 863 9861</p>
                  <p className="text-black-600 mb-4"><strong>Name:</strong> Rufino Sescon, Jr.</p>

                  <p className="text-black-700 font-semibold mb-2">Paymaya:</p>
                  <p className="text-black-600 mb-2"><strong>Mobile Number:</strong> 0961 747 7003</p>
                  <p className="text-black-600 mb-4"><strong>Name:</strong> Rufino Sescon, Jr.</p>

                  <p className="text-black-700 font-semibold mb-2">BDO:</p>
                  <p className="text-black-600 mb-2"><strong>Account Name:</strong> RCAM-Minor Basilica of the Black Nazarene</p>
                  <p className="text-black-600 mb-2"><strong>Peso Savings:</strong> # 00454-0037-172</p>
                  <p className="text-black-600 mb-2"><strong>Dollars Savings:</strong> # 10454-0037-164</p>
                  <p className="text-black-600 mb-4"><strong>Swift Code - BIC:</strong> BNORPHMM</p>

                  <p className="text-black-700 font-semibold mb-2">BPI:</p>
                  <p className="text-black-600 mb-2"><strong>Account Name:</strong> RCAM-Minor Basilica of the Black Nazarene</p>
                  <p className="text-black-600 mb-2"><strong>Peso Savings:</strong> # 2273-0504-37</p>
                  <p className="text-black-600 mb-2"> <strong>Dollars Savings:</strong> # 2274-0026-22</p>
                  <p className="text-black-600 mb-4"><strong>Swift Code - BIC:</strong> BOPIPHMM</p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                  <img 
                    src={selectedImage} 
                    alt="Donation Verification image" 
                    className="w-full max-w-xs h-auto rounded-md border border-gray-300"
                  />
                </div>

              </div>

              <center><p className="text-black font-semibold mt-6">Action: To validate and notify the donor.</p></center>

              <div className="mt-4 flex justify-center gap-6">
              <button 
                type="button" 
                className="px-6 py-3 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md w-32 text-center"
                onClick={() => approvePayment(selectedProof?._id)} // Safe check with ?.
                disabled={!selectedProof}
              >
                Valid
              </button>

              <button 
                type="button" 
                className="px-6 py-3 text-white bg-red-800 hover:bg-red-600 duration-200 rounded-md w-32 text-center"
                onClick={() => handleInvalidPayment(selectedProof?._id)} // Safe check with ?.
                disabled={!selectedProof}
              >
                Invalid
              </button>


              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceiptS;