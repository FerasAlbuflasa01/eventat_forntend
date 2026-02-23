import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getAll();
      setEvents(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Events</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/events/new')}
        >
          Create New Event
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {events.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No events yet. Create your first event to get started!
          </p>
        </div>
      ) : (
        <div className="grid">
          {events.map(event => (
            <div 
              key={event.id} 
              className="event-card"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <h3>{event.title}</h3>
              <p><strong>Date:</strong> {formatDate(event.date)}</p>
              <p><strong>Attendees:</strong> {event.expected_attendees}</p>
              <p><strong>Budget:</strong> ${event.budget.toFixed(2)}</p>
              {event.description && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...` 
                    : event.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
