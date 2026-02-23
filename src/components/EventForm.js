import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventsAPI } from '../services/api';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    budget: '',
    description: '',
    expected_attendees: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const event = await eventsAPI.getById(id);
      setFormData({
        title: event.title,
        date: event.date,
        budget: event.budget,
        description: event.description || '',
        expected_attendees: event.expected_attendees
      });
    } catch (err) {
      setApiError(err.message);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }
    
    // Date validation
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }
    
    // Budget validation
    if (!formData.budget) {
      newErrors.budget = 'Budget is required';
    } else if (parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }
    
    // Description validation
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must not exceed 2000 characters';
    }
    
    // Attendees validation
    if (!formData.expected_attendees) {
      newErrors.expected_attendees = 'Expected attendees is required';
    } else if (!Number.isInteger(Number(formData.expected_attendees)) || Number(formData.expected_attendees) <= 0) {
      newErrors.expected_attendees = 'Expected attendees must be a positive integer';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const eventData = {
        ...formData,
        budget: parseFloat(formData.budget),
        expected_attendees: parseInt(formData.expected_attendees)
      };

      if (isEdit) {
        await eventsAPI.update(id, eventData);
      } else {
        await eventsAPI.create(eventData);
      }
      
      navigate('/');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>
        
        {apiError && (
          <div className="alert alert-error">{apiError}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              maxLength="200"
            />
            <small style={{ color: '#7f8c8d' }}>
              {formData.title.length}/200 characters
            </small>
            {errors.title && <div className="error">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Event Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <div className="error">{errors.date}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="budget">Budget ($) *</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Enter budget amount"
              step="0.01"
              min="0"
            />
            {errors.budget && <div className="error">{errors.budget}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="expected_attendees">Expected Attendees *</label>
            <input
              type="number"
              id="expected_attendees"
              name="expected_attendees"
              value={formData.expected_attendees}
              onChange={handleChange}
              placeholder="Enter number of attendees"
              min="1"
            />
            {errors.expected_attendees && <div className="error">{errors.expected_attendees}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description (optional)"
              maxLength="2000"
            />
            <small style={{ color: '#7f8c8d' }}>
              {formData.description.length}/2000 characters
            </small>
            {errors.description && <div className="error">{errors.description}</div>}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
            </button>
            <button 
              type="button" 
              className="btn"
              onClick={() => navigate('/')}
              style={{ backgroundColor: '#95a5a6', color: 'white' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
