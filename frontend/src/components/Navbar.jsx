import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderNavLinks = () => {
    if (!isAuthenticated) {
      // Not logged in - show Home and Login
      return (
        <>
          <Link to="/" className="hover:text-green-600 transition">Home</Link>
          <Link to="/register" className="bg-green-600 text-white px-6 py-3 rounded-2xl hover:bg-green-700 transition shadow-sm shadow-green-100">
            Join Us
          </Link>
        </>
      );
    }

    // Logged in - show based on user role
    const commonLinks = <Link to="/" className="hover:text-green-600 transition">Home</Link>;

    switch (user?.account_type) {
      case 'restaurant':
        return (
          <>
            {commonLinks}
            <Link to="/restaurant-dashboard" className="hover:text-green-600 transition">Restaurant Portal</Link>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-gray-600">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        );
      
      case 'ngo':
        return (
          <>
            {commonLinks}
            <Link to="/restaurants" className="hover:text-green-600 transition">Partners</Link>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-gray-600">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        );
      
      case 'volunteer':
        return (
          <>
            {commonLinks}
            <Link to="/volunteer-dashboard" className="hover:text-green-600 transition">Volunteer Hub</Link>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-gray-600">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        );
      
      default:
        return (
          <>
            {commonLinks}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-gray-600">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-green-600 font-black text-2xl tracking-tight">
        <Leaf strokeWidth={3} /> EcoBite
      </Link>
      
      <div className="flex items-center gap-8 font-bold text-gray-400 text-sm">
        {renderNavLinks()}
      </div>
    </nav>
  );
}