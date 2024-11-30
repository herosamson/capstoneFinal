import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 
import './events.css';
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
    'Serving utensils'
  ];
  
  useEffect(() => {
    axios.get(`/routes/accounts/events`)
      .then(response => {
        // Sorting events: Upcoming events at the top, past events at the bottom
        const sortedEvents = response.data.sort((a, b) => {
          const eventDateA = new Date(a.eventDate);
          const eventDateB = new Date(b.eventDate);
          const now = new Date();
          if (eventDateA >= now && eventDateB < now) {
            return -1; // Upcoming event first
          }
          if (eventDateA < now && eventDateB >= now) {
            return 1; // Past event last
          }
          return eventDateA - eventDateB; // Sort by date for both past and upcoming events
        });

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

    // Uncheck all checkboxes when sorting
    setSelectedEvents([]);
    setSelectAll(false); // Reset "Select All" state

    setSelectedEvents(filteredEvents);
  }, [filter, events]);

  useEffect(() => {
    axios.get(`/routes/accounts/events`)
      .then(response => {
        // Filter out past events for the "Upcoming Events" table
        const upcomingEvents = response.data.filter(event => new Date(event.eventDate) >= new Date());
        // Sort upcoming events by date
        const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
        setEvents(sortedEvents);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventToSubmit = {
      ...newEvent,
      materialsNeeded: Array.isArray(newEvent.materialsNeeded) ? newEvent.materialsNeeded : newEvent.materialsNeeded.split(', ')
    };

    if (editingEventId) {
      axios.put(`/routes/accounts/events/${editingEventId}`, eventToSubmit)
        .then(response => {
          setEvents(events.map(event => event._id === editingEventId ? response.data : event));
          setNewEvent({ eventName: '', eventDate: '', volunteers: '', materialsNeeded: [], numberOfPax: '' });
          setEditingEventId(null);
        })
        .catch(error => {
          console.error('Error updating event:', error);
        });
    } else {
      axios.post(`/routes/accounts/events/add`, eventToSubmit)
        .then(response => {
          setEvents([...events, response.data]);
          setNewEvent({ eventName: '', eventDate: '', volunteers: '', materialsNeeded: [], numberOfPax: '' });
        })
        .catch(error => {
          console.error('Error adding event:', error);
        });
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
    setNewEvent(prevState => {
      const updatedMaterials = checked
        ? [...prevState.materialsNeeded, value]
        : prevState.materialsNeeded.filter(material => material !== value);

      return { ...prevState, materialsNeeded: updatedMaterials };
    });
  };

  const handleCheckboxChange = (event, isChecked) => {
    if (isChecked) {
      setSelectedEvents(prevSelectedEvents => [...prevSelectedEvents, event]);
    } else {
      setSelectedEvents(prevSelectedEvents => prevSelectedEvents.filter(e => e._id !== event._id));
    }
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
   // Get the current date in YYYY-MM-DD format
   const today = new Date().toISOString().split('T')[0];

   const showModalHistory = () => {
    // Fetch event history data here
    axios.get(`/routes/accounts/events/history`)
      .then(response => {
        setEventHistory(response.data); // Store the event history data in state
        setShowModal(true); // Show the modal
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

      <div id="contentEvent">
        <h1 className='text-3xl font-bold mt-2 mb-4'>Events Management</h1>
        
        <form id="eventForm" onSubmit={handleSubmit}>
          <div class="form-row">
            <input
              type="text"
              name="eventName"
              value={newEvent.eventName}
              onChange={handleChange}
              placeholder="Event Name"
               maxLength='50'
              required
            />
            <input
              type="date"
              name="eventDate"
              value={newEvent.eventDate}
              onChange={handleChange}
              placeholder="Event Date"
              min={today}
              required
            />
            <input
              type="text"
              name="volunteers"
              value={newEvent.volunteers}
              onChange={handleChange}
              placeholder="Volunteers"
               maxLength='50'
              required
            />
            <input
              type="number"
              name="numberOfPax"
              value={newEvent.numberOfPax}
              onChange={handleChange}
              placeholder="Number of Pax"
           maxLength='4'
            />
          </div>
          <div className="materials-list">
            <span>Materials Needed:</span>
            {materialsOptions.map(option => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={newEvent.materialsNeeded.includes(option)}
                  onChange={handleCheckboxChange1}
                />
                {option}
              </label>
            ))}
          </div>
          <button className="eventsupdate duration-200 rounded-md" type="submit">{editingEventId ? 'Update Event' : 'Add Event'}</button>

          {editingEventId && <button className="deleteevents" type="button" onClick={handleCancelEdit}>Cancel</button>}
        </form>
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
    .filter(event => new Date(event.eventDate) >= new Date()) // Only include events on or after today
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

     {showModal && (
        <div className="modal-overlay">
          <div className="modalevents">
          <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
            <h2 className='text-2xl mb-5'> <strong>Events History</strong></h2>
            <table className='table-auto w-full overflow-x-auto overflow-y-auto max-h-[500px]'>
            <thead className='bg-red-800 text-white'>
                <tr>
                  <th className='font-normal py-1.5 px-2' >Event Name</th>
                  <th className='font-normal py-1.5 px-2'>Event Date</th>
                  <th className='font-normal py-1.5 px-2' >Volunteers</th>
                  <th className='font-normal py-1.5 px-2'>Materials Needed</th>
                  <th className='font-normal py-1.5 px-2'>Number of Pax</th>
                </tr>
              </thead>
              <tbody>
                {eventHistory.map(event => (
                  <tr key={event._id}  className='even:bg-gray-100'>
                    <td className='font-normal py-1.5 px-2'>{event.eventName}</td>
                    <td className='font-normal py-1.5 px-2'>{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td className='font-normal py-1.5 px-2'>{event.volunteers}</td>
                    <td className='font-normal py-1.5 px-2'>{event.materialsNeeded.join(', ')}</td>
                    <td className='font-normal py-1.5 px-2'>{event.numberOfPax}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventsA;
