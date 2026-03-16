import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const renderNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link to="/" className="text-white/70 hover:text-white font-medium transition-colors">Home</Link>
          <Link to="/register" className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transform duration-200 text-center">
            Join Us
          </Link>
        </>
      );
    }

    const commonLinks = <Link to="/" className="text-white/70 hover:text-white font-medium transition-colors">Home</Link>;

    switch (user?.account_type) {
      case 'restaurant':
        return (
          <>
            {commonLinks}
            <Link to="/ngo-requests" className="text-white/70 hover:text-white font-medium transition-colors">Requests</Link>
            <Link to="/food-listings" className="text-white/70 hover:text-white font-medium transition-colors">Food Listings</Link>
            <Link to="/restaurant-dashboard" className="text-white/70 hover:text-white font-medium transition-colors">Dashboard</Link>
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-white/90 font-medium text-sm">{user.name}</span>
              <div className="hidden md:block w-px h-4 bg-white/20"></div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors font-medium text-sm">
                <LogOut className="w-4 h-4" />
                <span className="md:hidden">Logout</span>
              </button>
            </div>
          </>
        );
      
      case 'ngo':
        return (
          <>
            {commonLinks}
            <Link to="/restaurants" className="text-white/70 hover:text-white font-medium transition-colors">Food Near You</Link>
            <Link to="/manage-deliveries" className="text-white/70 hover:text-white font-medium transition-colors">Manage Deliveries</Link>
            <Link to="/ngo-dashboard" className="text-white/70 hover:text-white font-medium transition-colors">Dashboard</Link>
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-white/90 font-medium text-sm">{user.name}</span>
              <div className="hidden md:block w-px h-4 bg-white/20"></div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors font-medium text-sm">
                <LogOut className="w-4 h-4" />
                <span className="md:hidden">Logout</span>
              </button>
            </div>
          </>
        );
      
      case 'volunteer':
        return (
          <>
            {commonLinks}
            <Link to="/volunteer-dashboard" className="text-white/70 hover:text-white font-medium transition-colors">Volunteer Hub</Link>
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-white/90 font-medium text-sm">{user.name}</span>
              <div className="hidden md:block w-px h-4 bg-white/20"></div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors font-medium text-sm">
                <LogOut className="w-4 h-4" />
                <span className="md:hidden">Logout</span>
              </button>
            </div>
          </>
        );
      
      default:
        return (
          <>
            {commonLinks}
            <div className="flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
              <User className="w-4 h-4 text-green-400" />
              <span className="text-white/90 font-medium text-sm">{user.name}</span>
              <div className="hidden md:block w-px h-4 bg-white/20"></div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors font-medium text-sm">
                <LogOut className="w-4 h-4" />
                <span className="md:hidden">Logout</span>
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50">
      {/* Added 'relative' to nav so the dropdown anchors to it properly */}
      <nav className="relative flex justify-between items-center px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        
        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-white font-black text-xl tracking-tight z-50">
          <Leaf className="text-green-500" strokeWidth={3} size={24} /> EcoBite
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          {renderNavLinks()}
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="md:hidden text-white/80 hover:text-white transition-colors z-50"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* RIGHT-ALIGNED Mobile Dropdown Menu */}
        {isMenuOpen && (
          // Changed 'left-0 w-full' to 'right-0 min-w-[200px]' 
          <div className="absolute top-[110%] right-0 md:hidden mt-2 min-w-[220px]">
            {/* Changed 'items-center' to 'items-end' to push text to the right */}
            <div 
              className="flex flex-col items-end gap-5 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-in slide-in-from-top-2 fade-in duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              {renderNavLinks()}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}