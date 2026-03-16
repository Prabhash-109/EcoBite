import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';


import Register from './pages/Register';
import Login from './pages/Login';  


import RestaurantDashboard from './pages/RestaurantDashboard';
import NgoRequests from './pages/NgoRequests';
import AddFood from './pages/AddFood';
import VolunteerDashboard from './pages/VolunteerDashboard';
import FoodListings from './pages/FoodListings';
import RestaurantDirectory from './pages/RestaurantDirectory';


function App() {
  return (
    <AuthProvider>
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
          <Route path="/ngo-requests" element={<NgoRequests />} />
          <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
          <Route path="/food-listings" element={<FoodListings />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;