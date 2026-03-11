import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NGORegister from './pages/NGORegister';
import RestaurantDirectory from './pages/RestaurantDirectory';

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
        <Route path="/register-ngo" element={<NGORegister />} />
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