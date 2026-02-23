import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EventForm from './components/EventForm';
import EventDetail from './components/EventDetail';
import './App.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <h1>EventAt</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span>Welcome, {user?.username}!</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events/new" 
              element={
                <ProtectedRoute>
                  <EventForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events/:id/edit" 
              element={
                <ProtectedRoute>
                  <EventForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events/:id" 
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
