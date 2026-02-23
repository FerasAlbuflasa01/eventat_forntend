import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import BudgetTracker from './BudgetTracker';
import TaskManager from './TaskManager';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getById(id);
      setEvent(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This will also delete all budget items and tasks.')) {
      return;
    }

    try {
      await eventsAPI.delete(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading event...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container">
        <div className="alert alert-error">Event not found</div>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2>{event.title}</h2>
            <p style={{ color: '#7f8c8d', marginTop: '0.5rem' }}>
              <strong>Date:</strong> {formatDate(event.date)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => navigate(`/events/${id}/edit`)}
            >
              Edit Event
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Event
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div>
            <strong>Expected Attendees:</strong>
            <div style={{ fontSize: '1.2rem', color: '#2c3e50', marginTop: '0.25rem' }}>
              {event.expected_attendees}
            </div>
          </div>
          <div>
            <strong>Total Budget:</strong>
            <div style={{ fontSize: '1.2rem', color: '#2c3e50', marginTop: '0.25rem' }}>
              ${event.budget.toFixed(2)}
            </div>
          </div>
        </div>

        {event.description && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>Description:</strong>
            <p style={{ marginTop: '0.5rem', color: '#555' }}>{event.description}</p>
          </div>
        )}
      </div>

      <BudgetTracker eventId={id} totalBudget={event.budget} />
      
      <TaskManager eventId={id} />

      <button 
        className="btn"
        onClick={() => navigate('/')}
        style={{ backgroundColor: '#95a5a6', color: 'white', marginTop: '1rem' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default EventDetail;
