import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 
import './eventsA.css';
import logo2 from './logo2.png';

function EventsA() {
  const [newEvent, setNewEvent] = useState({
    eventName: '',
    eventDate: '',
    volunteers: '',
    materialsNeeded: [],
    numberOfPax: ''
  });
  const [isDropdownOpenA, setIsDropdownOpenA] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectAll, setSelectAll] = useState(false); 
  const [eventHistory, setEventHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const toggleDropdownA = () => {
    setIsDropdownOpenA(!isDropdownOpenA);
  };
  const [showCustomModal, setShowCustomModal] = useState(false);
const [customMaterials, setCustomMaterials] = useState([]);
const [customMaterialInput, setCustomMaterialInput] = useState("");
const [volunteers, setVolunteers] = useState("Anyone");
const [showVolunteersModal, setShowVolunteersModal] = useState(false);
const [customVolunteers, setCustomVolunteers] = useState([]);
const [volunteerInput, setVolunteerInput] = useState("");
const closeModals = () => {
  setShowCustomModal(false);
  setShowVolunteersModal(false);
  setShowModal(false);
};

const handleOpenCustomModal = () => {
  closeModals();
  setShowCustomModal(true);
};

const handleOpenVolunteersModal = () => {
  closeModals();
  setShowVolunteersModal(true);
};

const handleVolunteerChange = (e) => {
  const value = e.target.value;
  if (value === "Others") {
    setShowVolunteersModal(true);
  } else {
    setNewEvent((prev) => ({ ...prev, volunteers: value }));
  }
};

const addVolunteer = () => {
  if (volunteerInput.trim() !== "" && !customVolunteers.includes(volunteerInput.trim())) {
    setCustomVolunteers((prev) => [...prev, volunteerInput.trim()]);
    setVolunteerInput("");
  }
};


const removeVolunteer = (volunteer) => {
  setCustomVolunteers((prev) => prev.filter((v) => v !== volunteer));
};

const submitVolunteers = () => {
  setNewEvent((prev) => ({ ...prev, volunteers: customVolunteers.join(", ") }));
  setShowVolunteersModal(false);
};

  const materialsOptions = [
    'Plates',
    'Plastic Cups',
    'Projector',
    'Lighting Equipment',
    'Microphones',
    'Decoration Items',
    'Refreshments',
    'Banners',
    'Tables',
    'Chairs',
    'Tablecloths',
    'Napkins',
    'Cups',
    'Forks',
    'Knives',
    'Spoons',
    'Table decorations',
    'Banners',
    'Balloons',
    'Streamers',
    'Signs',
    'Lights',
    'Speakers',
    'Microphones',
    'Sound system',
    'Projectors',
    'Screens',
    'Extension cords',
    'Power strips',
    'Stage or platform',
    'Podium',
    'Backdrops',
    'Curtains',
    'Tents',
    'Canopies',
    'Heaters',
    'Fans',
    'Generators',
    'Trash cans',
    'Recycling bins',
    'Hand sanitizer',
    'First aid kit',
    'Walkie-talkies',
    'Name tags',
    'Lanyards',
    'Registration forms',
    'Sign-in sheets',
    'Badges',
    'Wristbands',
    'Ribbons',
    'Brochures',
    'Flyers',
    'Tickets',
    'Invitations',
    'Seating charts',
    'Place cards',
    'Table numbers',
    'Stage decorations',
    'Cameras',
    'Ice buckets',
    'Coolers',
    'Drink dispensers',
    'Catering supplies (for serving food)',
    'Food trays',
    'Serving utensils',
    "None",  
    "Others",  
  ];
  
  useEffect(() => {
    axios.get(`/routes/accounts/events`)
      .then(response => {
        const now = new Date();
        const sortedEvents = response.data
          .filter(event => new Date(event.eventDate) >= now)
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
  
        setEvents(sortedEvents);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);
  

  useEffect(() => {
    let filteredEvents = [];
    if (filter === 'thisWeek') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      filteredEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      });
    } else if (filter === 'thisMonth') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1);

      filteredEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= startOfMonth && eventDate < endOfMonth;
      });
    } else {
      filteredEvents = events;
    }

    setSelectedEvents(filteredEvents);
    setSelectAll(false); 
  }, [filter, events]);


  

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let formattedMaterials = [...newEvent.materialsNeeded];
    if (formattedMaterials.includes("None")) {
      formattedMaterials = ["None"];
    }
  
    let formattedVolunteers = newEvent.volunteers;
    if (formattedVolunteers === "Others") {
      formattedVolunteers = customVolunteers.join(", ");
    }
  
    const eventToSubmit = {
      eventName: newEvent.eventName,
      eventDate: newEvent.eventDate,
      volunteers: formattedVolunteers,
      materialsNeeded: formattedMaterials,
      numberOfPax: newEvent.numberOfPax,
    };
  
    try {
      if (editingEventId) {
        const response = await axios.put(`/routes/accounts/events/${editingEventId}`, eventToSubmit);
        setEvents(events.map(event => (event._id === editingEventId ? response.data : event)));
        alert("Event updated successfully!");
      } else {
        const response = await axios.post(`/routes/accounts/events/add`, eventToSubmit);
        setEvents([...events, response.data]);
        alert("Event added successfully!");
      }
  
      // Reset form
      setNewEvent({
        eventName: '',
        eventDate: '',
        volunteers: 'Anyone',
        materialsNeeded: [],
        numberOfPax: '',
      });
  
      setEditingEventId(null);
      setCustomMaterials([]);
      setCustomVolunteers([]);
    } catch (error) {
      console.error("Error submitting event:", error);
      alert("Failed to submit event. Please try again.");
    }
  };
  
  

  const handleEdit = (event) => {
    setNewEvent(event);
    setEditingEventId(event._id);
  };

  const handleDelete = (id) => {
    axios.delete(`/routes/accounts/events/${id}`)
      .then(response => {
        setEvents(events.filter(event => event._id !== id));
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
  };

  const handleCancelEdit = () => {
    setNewEvent({ eventName: '', eventDate: '', volunteers: '', materialsNeeded: [], numberOfPax: '' });
    setEditingEventId(null);
  };

  const handleCheckboxChange1 = (e) => {
    const { value, checked } = e.target;
  
    setNewEvent((prevState) => {
      let updatedMaterials = checked
        ? [...prevState.materialsNeeded, value]
        : prevState.materialsNeeded.filter((material) => material !== value);
  
      // If "None" is selected, remove all other selections
      if (value === "None" && checked) {
        updatedMaterials = ["None"];
      } else if (updatedMaterials.includes("None")) {
        updatedMaterials = updatedMaterials.filter((m) => m !== "None");
      }
  
      return { ...prevState, materialsNeeded: updatedMaterials };
    });
  
    if (value === "Others" && checked) {
      setShowCustomModal(true);
    }
  };
  
  
  

  const handleCheckboxChange = (event, isChecked) => {
    setSelectedEvents((prevSelectedEvents) => {
      if (isChecked) {
        return [...prevSelectedEvents, event];
      } else {
        return prevSelectedEvents.filter((e) => e._id !== event._id);
      }
    });
  };
  


  const downloadSelectedEvents = () => {
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
    const title3 = 'Upcoming Events';
    const textWidth3 = doc.getTextWidth(title3);
    const xPos3 = (doc.internal.pageSize.getWidth() - textWidth3) / 2;
    const title3Y = 56;
    doc.text(title3, xPos3, title3Y);
    
    const tableStartY = 65;
    
    const tableColumn = ["Event Name", "Event Date", "Volunteers", "Materials Needed", "Number of Pax"];
    const tableRows = selectedEvents.map(event => [
      event.eventName,
      new Date(event.eventDate).toLocaleDateString(),
      event.volunteers,
      event.materialsNeeded.join(', '),
      event.numberOfPax,
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
      },
    });
    
    doc.save('Quiapo Church Upcoming Events.pdf');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

   const today = new Date().toISOString().split('T')[0];

   const showModalHistory = () => {
    axios.get(`/routes/accounts/events/history`)
      .then(response => {
        setEventHistory(response.data); 
        setShowModal(true); 
      })
      .catch(error => {
        console.error('Error fetching event history:', error);
      });
  };


  return (
    <div id="container">
      <div id="sidebar">
      <ul>
               <li><img className="logoU" src={logo2} alt="Logo" /></li>
               <br />
                <li><Link to="/analyticsSA">Dashboard</Link></li>
               <li className="dropdown-toggle" onClick={toggleDropdownA}>
                 Accounts Management<span className="arrow">&#9660;</span>
               </li>
               {isDropdownOpenA && (
                 <ul className="dropdown-menuU">
               <li><Link to="/admin">Donors </Link></li>
               <li><Link to="/adminSA">Administrators </Link></li>
               <li><Link to="/staffSA">Staff </Link></li>
                 </ul>
               )}
               <li><Link to="/eventsSA">Events</Link></li>
               <li><Link to="/inventorySA">Inventory</Link></li>
               <li><Link to="/activity">Activity Logs</Link></li>
               <br />
               <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
             </ul>
      </div>

      <div id="contentEvent">
        <h1 className='text-3xl font-bold mt-2 mb-4'>Events Management</h1>
        <div id="eventsList">
         <table className='table-auto w-full'>
       <thead className='bg-red-800 text-white'>
              <tr>
                <th className='font-normal py-2 px-3'>
                  <select className= 'text-black'onChange={(e) => setFilter(e.target.value)} value={filter}>
                    <option value="">All Events</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                  </select>
                </th>
                <th className='font-normal py-1.5 px-2'>Event Name</th>
                <th className='font-normal py-1.5 px-2'>Event Date</th>
                <th className='font-normal py-1.5 px-2'>Volunteers</th>
                <th className='font-normal py-1.5 px-2'>Materials Needed</th>
                <th className='font-normal py-1.5 px-2'>Number of Pax</th>
                <th className='font-normal py-1.5 px-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
  {events
    .filter(event => new Date(event.eventDate) >= new Date()) 
    .map(event => {
      const eventDate = new Date(event.eventDate);
      return (
        <tr key={event._id} className="even:bg-gray-200">
          <td className="px-10 py-2">
            <input
              type="checkbox"
              checked={selectedEvents.some(e => e._id === event._id)}
              onChange={e => handleCheckboxChange(event, e.target.checked)}
            />
          </td>
          <td className="px-10 py-2">{event.eventName}</td>
          <td className="px-10 py-2">{eventDate.toLocaleDateString()}</td>
          <td className="px-10 py-2">{event.volunteers}</td>
          <td className="px-10 py-2">{event.materialsNeeded.join(", ")}</td>
          <td className="px-10 py-2">{event.numberOfPax}</td>
          <td className="px-10 py-2">
            <button
              type="button"
              className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 duration-200 rounded-md mr-2"
              onClick={() => handleEdit(event)}
            >
              Edit
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 duration-200 rounded-md"
              onClick={() => handleDelete(event._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })}
</tbody>

          </table>
          {selectedEvents.length > 0 && (
            <button className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md mr-3 my-3" onClick={downloadSelectedEvents}>Download Selected Events</button>
            
          )}
          <button  className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md" onClick={showModalHistory}>View Events History</button>
        </div>
      </div>

    {/* Custom Materials Modal */}
{showCustomModal && (
  <div className="modal-overlay">
    <div className="modalevents p-5 w-[400px]">
      <span className="close-button" onClick={() => setShowCustomModal(false)}>&times;</span>
      <h2 className="text-2xl mb-5 font-bold">Add Materials</h2>
      <div className="w-full">
        <input
          type="text"
          value={customMaterialInput}
          onChange={(e) => setCustomMaterialInput(e.target.value)}
          placeholder="Enter Material"
          className="w-full border border-gray-300 p-2 rounded-md mb-2"
        />
       <button
  className="w-full px-4 py-2 bg-green-600 text-white rounded-md mb-7"
  onClick={() => {
    if (customMaterialInput.trim() !== "" && !customMaterials.includes(customMaterialInput.trim())) {
      setCustomMaterials((prev) => [...prev, customMaterialInput.trim()]);
      setCustomMaterialInput("");
    }
  }}
>
  Add Item
</button>

      </div>

      {customMaterials.length > 0 && (
        <>
         <table className='table-auto w-full'>
         <thead className='bg-red-800 text-white'>
              <tr>
                <th className='font-normal py-1.5 px-2'>Custom Materials</th>
              </tr>
            </thead>
            <tbody>
              {customMaterials.map((material, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className='font-normal py-1.5 px-2'>{material}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-full flex justify-end mt-3">
          <button
  className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md" 
  onClick={() => {
    setNewEvent((prevState) => ({
      ...prevState,
      materialsNeeded: Array.from(new Set([...prevState.materialsNeeded, ...customMaterials])), 
    }));
    setShowCustomModal(false);
  }}
>
  Submit
</button>

          </div>
        </>
      )}
    </div>
  </div>
)}

{showVolunteersModal && (
  <div className="modal-overlay">
    <div className="modalevents p-5 w-[400px]">
      <span className="close-button" onClick={() => setShowVolunteersModal(false)}>&times;</span>
      <h2 className="text-2xl mb-5 font-bold">Add Volunteers</h2>
      <div className="w-full">
        <input
          type="text"
          value={volunteerInput}
          onChange={(e) => setVolunteerInput(e.target.value)}
          placeholder="Enter Volunteer Name"
          className="w-full border border-gray-300 p-2 rounded-md mb-2"
        />
        <button
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md mb-7"
          onClick={addVolunteer}
        >
          Add Volunteer
        </button>
      </div>

      {customVolunteers.length > 0 && (
        <>
         <table className='table-auto w-full'>
         <thead className='bg-red-800 text-white'>
              <tr>
                <th className='font-normal py-1.5 px-2'>Custom Volunteers</th>
              </tr>
            </thead>
            <tbody>
              {customVolunteers.map((volunteer, index) => (
                <tr key={index} className="even:bg-gray-100">
                  <td className='font-normal py-1.5 px-2'>{volunteer}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-full flex justify-end mt-7">
            <button
              className="px-10 py-1.5 text-white bg-red-900 hover:bg-red-950 duration-200 rounded-md" 
              onClick={submitVolunteers}
            >
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}


{showModal && (
  <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="modalevents bg-white p-5 rounded-md shadow-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
      {/* Close Button */}
      <span 
        className="close-button absolute top-3 right-4 text-2xl cursor-pointer" 
        onClick={() => setShowModal(false)}
      >
        &times;
      </span>

      {/* Title */}
      <h2 className="text-2xl mb-5 font-bold">Events History</h2>

      {/* Scrollable Table Container */}
      <div className="overflow-y-auto max-h-[500px] border border-gray-300 rounded-md">
        <table className="table-auto w-full">
          <thead className="bg-red-800 text-white sticky top-0">
            <tr>
              <th className="font-normal py-2 px-4">Event Name</th>
              <th className="font-normal py-2 px-4">Event Date</th>
              <th className="font-normal py-2 px-4">Volunteers</th>
              <th className="font-normal py-2 px-4">Materials Needed</th>
              <th className="font-normal py-2 px-4">Number of Pax</th>
            </tr>
          </thead>
          <tbody>
            {eventHistory.map(event => (
              <tr key={event._id} className="even:bg-gray-100">
                <td className="py-2 px-4">{event.eventName}</td>
                <td className="py-2 px-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                <td className="py-2 px-4">{event.volunteers}</td>
                <td className="py-2 px-4">{event.materialsNeeded.join(', ')}</td>
                <td className="py-2 px-4">{event.numberOfPax}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default EventsA;
