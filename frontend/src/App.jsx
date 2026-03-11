import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NGORegister from './pages/NGOregister.jsx';
import RestaurantDirectory from './pages/RestaurantDirectory.jsx';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-ngo" element={<NGORegister />} />
        <Route path="/restaurants" element={<RestaurantDirectory />} />
      </Routes>
    </Router>
  );
}

export default App;