import React, { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';

const BudgetTracker = ({ eventId, totalBudget }) => {
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadBudgetItems();
  }, [eventId]);

  const loadBudgetItems = async () => {
    try {
      setLoading(true);
      const data = await budgetAPI.getAll(eventId);
      setBudgetItems(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const totalSpent = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return {
      totalSpent,
      remaining,
      percentageUsed,
      isOverBudget: remaining < 0
    };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be positive';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const budgetData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description
      };
      
      await budgetAPI.create(eventId, budgetData);
      await loadBudgetItems();
      
      // Reset form
      setFormData({ category: '', amount: '', description: '' });
      setShowForm(false);
      setFormErrors({});
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this budget item?')) {
      return;
    }

    try {
      await budgetAPI.delete(eventId, itemId);
      await loadBudgetItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return <div className="loading">Loading budget...</div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Budget Tracker</h3>
        <button 
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Budget Item'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Venue, Catering, Decorations"
            />
            {formErrors.category && <div className="error">{formErrors.category}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              min="0"
            />
            {formErrors.amount && <div className="error">{formErrors.amount}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Item
          </button>
        </form>
      )}

      {budgetItems.length === 0 ? (
        <p style={{ color: '#7f8c8d', textAlign: 'center' }}>No budget items yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgetItems.map(item => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>${item.amount.toFixed(2)}</td>
                <td>{item.description || '-'}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.id)}
                    style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="budget-summary">
        <h3>Budget Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <strong>Total Budget:</strong>
            <div style={{ fontSize: '1.2rem', color: '#2c3e50' }}>${totalBudget.toFixed(2)}</div>
          </div>
          <div>
            <strong>Total Spent:</strong>
            <div style={{ fontSize: '1.2rem', color: '#3498db' }}>${totals.totalSpent.toFixed(2)}</div>
          </div>
          <div>
            <strong>{totals.isOverBudget ? 'Over Budget:' : 'Remaining:'}</strong>
            <div style={{ fontSize: '1.2rem', color: totals.isOverBudget ? '#e74c3c' : '#27ae60' }}>
              ${Math.abs(totals.remaining).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem' }}>
          <strong>Budget Used: {totals.percentageUsed.toFixed(1)}%</strong>
          <div className="budget-bar">
            <div 
              className={`budget-bar-fill ${totals.isOverBudget ? 'over-budget' : ''}`}
              style={{ width: `${Math.min(totals.percentageUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
