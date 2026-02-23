const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.message || 'Request failed');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData
    });
    return handleResponse(response);
  },
  
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(response);
  }
};

// Events API
export const eventsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  create: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    return handleResponse(response);
  },
  
  update: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData)
    });
    return handleResponse(response);
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  }
};

// Budget API
export const budgetAPI = {
  getAll: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/budget`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  create: async (eventId, budgetData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/budget`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(budgetData)
    });
    return handleResponse(response);
  },
  
  update: async (eventId, itemId, budgetData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/budget/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(budgetData)
    });
    return handleResponse(response);
  },
  
  delete: async (eventId, itemId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/budget/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete budget item');
    }
  }
};

// Tasks API
export const tasksAPI = {
  getAll: async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/tasks`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  create: async (eventId, taskData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(response);
  },
  
  update: async (eventId, taskId, taskData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData)
    });
    return handleResponse(response);
  },
  
  delete: async (eventId, taskId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }
};
