import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RePieChart,
} from 'recharts';
import './staffDashboard.css';
import logo2 from './logo2.png';
import axios from 'axios';

function staffDashboard() {
  const [totalItemDonations, setTotalItemDonations] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); 
  const [totalApprovedDonations, setTotalApprovedDonations] = useState(0);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false); 
  const [todayDonations, setTodayDonations] = useState(0);
  const [weeklyDonations, setWeeklyDonations] = useState(0);
  const [monthlyDonations, setMonthlyDonations] = useState(0);
  const [topDonors, setTopDonors] = useState([]);
  const [totalUniqueDonors, setTotalUniqueDonors] = useState(0);
  const [isDonorsModalOpen, setIsDonorsModalOpen] = useState(false);
  const [donorsDetails, setDonorsDetails] = useState([]);
  const [monthlyApprovedDonations, setMonthlyApprovedDonations] = useState([]);
  const [monthlyItemDonations, setMonthlyItemDonations] = useState([]); // New state for item donations
  const [donatedToStats, setDonatedToStats] = useState({
    Events: 0,
    'Financial Assistance': 0,
    'Medical Assistance': 0,
    'Legal Assistance': 0,
    'Food Subsidy': 0,
    'Disaster Relief': 0,
    Others: 0
  });
  const [consumedCount, setConsumedCount] = useState(0);
  const [unconsumedCount, setUnconsumedCount] = useState(0);
  const [mostDonatedItem, setMostDonatedItem] = useState({ name: '', quantity: 0 });
  const [lineData, setLineData] = useState([]);
  const navigate = useNavigate();
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false); // Modal for located items
  const [locatedItems, setLocatedItems] = useState([]);

  const closeDonorsModal = () => {
    setIsDonorsModalOpen(false);
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

  const fetchMostDonatedItem = async () => {
    try {
      const response = await axios.get('/routes/accounts/donations/located', { withCredentials: true }); // Ensure endpoint consistency
      const inventoryData = response.data; 

      const validItems = inventoryData.filter(donation => 
        donation.item && typeof donation.item === 'string' &&
        donation.quantity && !isNaN(parseInt(donation.quantity, 10))
      );

      if (validItems.length === 0) {
        setMostDonatedItem({ name: 'None', quantity: 0 });
        return;
      }

      const topItem = validItems.reduce((prev, current) => {
        return (parseInt(current.quantity, 10) > parseInt(prev.quantity, 10)) ? current : prev;
      }, validItems[0]);

      setMostDonatedItem({
        name: topItem.item.trim(),
        quantity: parseInt(topItem.quantity, 10)
      });

    } catch (error) {
      console.error('Error fetching inventory data:', error);
      setMostDonatedItem({ name: 'Error fetching data', quantity: 0 });
    }
  };
  

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get('/routes/accounts/users', { withCredentials: true });
        const data = response.data;
        const usersPerMonth = {
          Jan: 0,
          Feb: 0,
          Mar: 0,
          Apr: 0,
          May: 0,
          Jun: 0,
          Jul: 0,
          Aug: 0,
          Sep: 0,
          Oct: 0,
          Nov: 0,
          Dec: 0,
        };
        
        data.forEach(user => {
          if (user.createdAt) {
            const date = new Date(user.createdAt);
            const month = date.toLocaleString('default', { month: 'short' }); // e.g., "Jan"
            if (usersPerMonth.hasOwnProperty(month)) {
              usersPerMonth[month] += 1;
            }
          }
        });
        
        const usersPerMonthArray = Object.keys(usersPerMonth).map(month => ({
          month,
          users: usersPerMonth[month],
        }));
        
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        usersPerMonthArray.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
        const currentMonthIndex = new Date().getMonth(); // 0-based index (0 for Jan, 11 for Dec)
        const isFirstHalf = currentMonthIndex < 6; // Jan-Jun: true, Jul-Dec: false
        let filteredUsersPerMonthArray = [];
        if (isFirstHalf) {
          filteredUsersPerMonthArray = usersPerMonthArray.slice(0, 6); // Jan to Jun
        } else {
          filteredUsersPerMonthArray = usersPerMonthArray.slice(6, currentMonthIndex + 1); // Jul to Current Month
        }
        
        setLineData(filteredUsersPerMonthArray);
        setTotalUsers(data.length);
      } catch (error) {
        console.error('Error fetching total users:', error);
      }
    };

    const fetchTotalApprovedDonations = async () => {
      try {
        const response = await axios.get('/routes/accounts/proofs?approved=true', { withCredentials: true });
        const totalAmount = response.data.reduce((sum, proof) => sum + parseFloat(proof.amount), 0);
        setTotalApprovedDonations(totalAmount);
      } catch (error) {
        console.error('Error fetching total approved donations:', error);
      }
    };

    const fetchUniqueDonors = async () => {
      try {
        const response = await axios.get('/routes/accounts/donations', { withCredentials: true });
        const uniqueDonors = new Set();
        response.data.forEach(donation => {
          if (donation.user && donation.user.username) {
            uniqueDonors.add(donation.user.username);
          }
        });
        setTotalUniqueDonors(uniqueDonors.size); // Set the number of unique donors
      } catch (error) {
        console.error('Error fetching unique donors:', error);
      }
    };

    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get('/routes/accounts/donations/located', { withCredentials: true });
        const donations = response.data;
        const stats = {
          Events: 0,
          'Financial Assistance': 0,
          'Medical Assistance': 0,
          'Legal Assistance': 0,
          'Food Subsidy': 0,
          'Disaster Relief': 0,
          Others: 0
        };
        let consumed = 0;
        let unconsumed = 0;

        donations.forEach(donation => {
          const { donatedTo, quantity } = donation;
          if (Array.isArray(donatedTo) && donatedTo.length > 0) {
            consumed += 1;
            const splitFactor = 1 / donatedTo.length; // Distribute equally among categories

            donatedTo.forEach(location => {
              const [category, detail] = location.split(':').map(part => part.trim());
              if (stats.hasOwnProperty(category)) {
                stats[category] += splitFactor;
              } else {
                stats['Others'] += splitFactor;
              }
            });
          } else {
            unconsumed += 1;
          }
        });

        setDonatedToStats(stats);
        setConsumedCount(consumed);
        setUnconsumedCount(unconsumed);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    const fetchMonthlyApprovedDonations = async () => {
      try {
        const response = await axios.get('/routes/accounts/proofs?approved=true', { withCredentials: true });
        const donations = response.data;
        const monthlyTotalsMap = new Map();

        donations.forEach(proof => {
          const proofDate = new Date(proof.date);
          const month = proofDate.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Jan 2024"
          const amount = parseFloat(proof.amount);

          if (monthlyTotalsMap.has(month)) {
            monthlyTotalsMap.set(month, monthlyTotalsMap.get(month) + amount);
          } else {
            monthlyTotalsMap.set(month, amount);
          }
        });

        const monthlyTotalsArray = Array.from(monthlyTotalsMap, ([month, total]) => ({
          month,
          total,
        }));

        monthlyTotalsArray.sort((a, b) => new Date(a.month) - new Date(b.month));

        setMonthlyApprovedDonations(monthlyTotalsArray);
      } catch (error) {
        console.error('Error fetching monthly approved donations:', error);
      }
    };

    const fetchMonthlyItemDonations = async () => { // New data fetching function
      try {
        const response = await axios.get('/routes/accounts/donations/located', { withCredentials: true });
        const items = response.data; // Assuming each item has 'date' and 'quantity' fields

        const monthlyTotalsMap = new Map();

        items.forEach(item => {
          const itemDate = new Date(item.date);
          const month = itemDate.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g., "Jan 2024"
          const quantity = parseInt(item.quantity, 10);

          if (monthlyTotalsMap.has(month)) {
            monthlyTotalsMap.set(month, monthlyTotalsMap.get(month) + quantity);
          } else {
            monthlyTotalsMap.set(month, quantity);
          }
        });

        const monthlyTotalsArray = Array.from(monthlyTotalsMap, ([month, total]) => ({
          month,
          total,
        }));

        monthlyTotalsArray.sort((a, b) => new Date(a.month) - new Date(b.month));

        setMonthlyItemDonations(monthlyTotalsArray);
      } catch (error) {
        console.error('Error fetching monthly item donations:', error);
      }
    };
    const fetchTotalItemDonations = async () => {
      try {
        const response = await axios.get('/routes/accounts/donations/located', { withCredentials: true });
        const items = response.data;
    
        // Set the locatedItems for modal display
        setLocatedItems(items);  // Assuming 'items' contains the necessary fields
    
        // Calculate total item donations
        const totalAmount = items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
        setTotalItemDonations(totalAmount);
      } catch (error) {
        console.error('Error fetching total item donations:', error);
      }
    };
    
fetchTotalItemDonations();
    fetchTotalUsers();
    fetchTotalApprovedDonations();
    fetchUniqueDonors();
    fetchAnalyticsData();
    fetchMonthlyApprovedDonations();
    fetchMonthlyItemDonations();
    fetchMostDonatedItem();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await axios.get('/routes/accounts/proofs?approved=true', { withCredentials: true });
      const today = new Date();
      const startOfToday = new Date(today.setHours(0, 0, 0, 0));
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      let todayTotal = 0;
      let weeklyTotal = 0;
      let monthlyTotal = 0;
      const sortedDonors = [...response.data]
        .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
        .slice(0, 3);

      response.data.forEach(proof => {
        const proofDate = new Date(proof.date);

        if (proofDate >= startOfToday) {
          todayTotal += parseFloat(proof.amount);
        }
        if (proofDate >= startOfWeek) {
          weeklyTotal += parseFloat(proof.amount);
        }
        if (proofDate >= startOfMonth) {
          monthlyTotal += parseFloat(proof.amount);
        }
      });

      setTodayDonations(todayTotal);
      setWeeklyDonations(weeklyTotal);
      setMonthlyDonations(monthlyTotal);

      setTopDonors(sortedDonors);
    } catch (error) {
      console.error('Error fetching donation totals:', error);
    }
  };
  
  const openItemModal = () => {
    fetchDonations();
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
  };
  const openItemModal1 = () => {
    fetchMostDonatedItem();
    setIsItemsModalOpen(true);
  };

  const closeItemModal1 = () => {
    setIsItemsModalOpen(false);
  };

  return (
    <div id="container">
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
      <div id="content">
        <h1 className='text-4xl font-bold mt-2 mb-4'>Staff Dashboard</h1>
        <div className="status-boxes">
          <div className="status-box" onClick={openItemModal}>
            <p className='text-2xl'><strong>Total Cash Donations</strong></p>
            <p>&#8369;{totalApprovedDonations.toFixed(2)}</p>
          </div>
            <div className="status-box" onClick={openItemModal1}>
            <h2 className='text-2xl'><strong>Total Item Donations:</strong></h2>
            <p>{totalItemDonations}</p>
          </div>
        </div>
        <h2 className='text-3xl font-bold mt-2 mb-4'><center>Monthly Donations</center></h2>
        <div className="bar-charts-container">
          {/* Total Cash Donations per Month BarChart */}
          <div className="bar-chart">
            <h3 className='font-bold text-2xl' >Total Cash Donations per Month</h3>
            <BarChart width={500} height={300} data={monthlyApprovedDonations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₱${value.toFixed(2)}`} />
              <Bar dataKey="total" fill="#b513ec" name="Total Cash Donations" />
            </BarChart>
          </div>
          {/* Total Item Donations per Month BarChart */}
          <div className="bar-chart">
            <h3 className='font-bold text-2xl'>Total Item Donations per Month</h3>
            <BarChart width={500} height={300} data={monthlyItemDonations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value} Items`} />
              <Bar dataKey="total" fill="#82ca9d" name="Total Item Donations" />
            </BarChart>
          </div>
        </div>

        {/* Cash Donations Modal */}
        {isItemModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2 className='text-2xl'><strong>Cash Donations</strong></h2>
                <span className="close-button" onClick={closeItemModal}>&times;</span>
              </div>
              <div className="donation-details">
                <p ><strong>Today:</strong> &#8369;{todayDonations.toFixed(2)}</p>
                <p className='mt-1'><strong>This Week:</strong> &#8369;{weeklyDonations.toFixed(2)}</p>
                <p className='mt-1'><strong>This Month:</strong> &#8369;{monthlyDonations.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

         {/* Items Modal to show located items in a table */}
         {isItemsModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2 className='text-2xl'><strong>Located Items</strong></h2>
                <span className="close-button" onClick={closeItemModal1}>&times;</span>
              </div>
              <div className="modal-content">
                {locatedItems.length > 0 ? (
                    <table className='table-auto w-full'>
                   <thead className='bg-red-800 text-white'>
                      <tr>
                        <th className='font-normal py-1.5 px-2'>Item Name</th>
                        <th className='font-normal py-1.5 px-2'>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locatedItems.map((item, index) => (
                        <tr key={index} className='even:bg-gray-100'>
                          <td className='px-10 py-2'>{item.item}</td>
                          <td className='px-10 py-2'>{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No located items available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default staffDashboard;
