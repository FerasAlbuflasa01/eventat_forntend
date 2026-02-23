import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';

const TaskManager = ({ eventId }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('priority');
  const [filterProgress, setFilterProgress] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    progress: 'not_started',
    assigned_to: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadTasks();
  }, [eventId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, sortBy, filterProgress]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getAll(eventId);
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...tasks];

    // Apply filter
    if (filterProgress !== 'all') {
      result = result.filter(task => task.progress === filterProgress);
    }

    // Apply sort
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'due_date') {
        return new Date(a.due_date) - new Date(b.due_date);
      }
      return 0;
    });

    setFilteredTasks(result);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const taskData = {
        ...formData,
        assigned_to: formData.assigned_to || null
      };
      
      await tasksAPI.create(eventId, taskData);
      await loadTasks();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        progress: 'not_started',
        assigned_to: ''
      });
      setShowForm(false);
      setFormErrors({});
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProgress = async (taskId, newProgress) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      await tasksAPI.update(eventId, taskId, { ...task, progress: newProgress });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.delete(eventId, taskId);
      await loadTasks();
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: '#e74c3c',
      medium: '#f39c12',
      low: '#3498db'
    };
    return colors[priority] || '#95a5a6';
  };

  const getProgressLabel = (progress) => {
    const labels = {
      not_started: 'Not Started',
      in_progress: 'In Progress',
      completed: 'Completed'
    };
    return labels[progress] || progress;
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3>Task Manager</h3>
        <button 
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
            {formErrors.title && <div className="error">{formErrors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="due_date">Due Date *</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
              />
              {formErrors.due_date && <div className="error">{formErrors.due_date}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="assigned_to">Assigned To</label>
            <input
              type="text"
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              placeholder="Enter assignee name (optional)"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Task
          </button>
        </form>
      )}

      <div className="filters">
        <div>
          <label htmlFor="sortBy" style={{ marginRight: '0.5rem' }}>Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="priority">Priority</option>
            <option value="due_date">Due Date</option>
          </select>
        </div>

        <div>
          <label htmlFor="filterProgress" style={{ marginRight: '0.5rem' }}>Filter:</label>
          <select
            id="filterProgress"
            value={filterProgress}
            onChange={(e) => setFilterProgress(e.target.value)}
            style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="all">All Tasks</option>
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p style={{ color: '#7f8c8d', textAlign: 'center', marginTop: '1rem' }}>
          {filterProgress === 'all' ? 'No tasks yet.' : `No ${getProgressLabel(filterProgress).toLowerCase()} tasks.`}
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>
                  <strong>{task.title}</strong>
                  {task.description && (
                    <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
                      {task.description}
                    </div>
                  )}
                </td>
                <td>{formatDate(task.due_date)}</td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px', 
                    backgroundColor: getPriorityColor(task.priority),
                    color: 'white',
                    fontSize: '0.85rem',
                    textTransform: 'capitalize'
                  }}>
                    {task.priority}
                  </span>
                </td>
                <td>{task.assigned_to || '-'}</td>
                <td>
                  <select
                    value={task.progress}
                    onChange={(e) => handleUpdateProgress(task.id, e.target.value)}
                    style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDelete(task.id)}
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
    </div>
  );
};

export default TaskManager;
