import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

import RestaurantDirectory from './pages/RestaurantDirectory';
import Register from './pages/Register';
import Login from './pages/Login';  

// Import the new pages
import RestaurantDashboard from './pages/RestaurantDashboard';
import AddFood from './pages/AddFood';
import VolunteerDashboard from './pages/VolunteerDashboard';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/restaurants" element={<RestaurantDirectory />} />
        
        {/* New Routes */}
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;