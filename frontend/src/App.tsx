// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
// We'll create Dashboard soon
import Dashboard from './pages/Dashboard';
import Home from './pages/Home'; 
import About from './pages/About';
import Contact from './pages/Contact';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthContext not found');

  const { token, isLoading } = context;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Public Home Page */}
        <Route path="/" element={<Home />} />

        {/* Public About Page */}
        <Route path="/about" element={<About />} />

        {/* Public Contact Page */}
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Placeholder for future pages */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;