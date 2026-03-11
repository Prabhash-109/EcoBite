import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-green-600 font-black text-2xl tracking-tight">
        <Leaf strokeWidth={3} /> EcoBite
      </Link>
      
      <div className="flex items-center gap-8 font-bold text-gray-400 text-sm">
        <Link to="/" className="hover:text-green-600 transition">Home</Link>
        <Link to="/restaurants" className="hover:text-green-600 transition">Partners</Link>
        
        {/* Development Links: Easy access to our new dashboards */}
        <div className="w-px h-4 bg-gray-200"></div> {/* Visual Divider */}
        
        <Link to="/restaurant-dashboard" className="hover:text-gray-900 transition">Restaurant Portal</Link>
        <Link to="/volunteer-dashboard" className="hover:text-gray-900 transition">Volunteer Hub</Link>
        
        <Link to="/register" className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition shadow-sm shadow-green-100">
          Join Us
        </Link>
      </div>
    </nav>
  );
}