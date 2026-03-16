import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Clock, Trash2, Edit3, Tag } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { handleSuccess, handleError } from '../utils';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function FoodListings() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFoodListings();
  }, []);

  const fetchFoodListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}/api/food/my-donations`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setListings(res.data);
    } catch (error) {
      handleError('Failed to fetch food listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `${API_URL}/api/food/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        handleSuccess('Food listing deleted successfully');
        setListings(listings.filter(item => item.id !== id));
      } catch (error) {
        handleError('Failed to delete food listing');
      }
    }
  };

  const formatExpiryDate = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diff = expiry - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} left`;
    }
    
    return `${hours}h ${minutes}m left`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Available</span>;
      case 'claimed':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Claimed</span>;
      case 'expired':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Expired</span>;
      default:
        return <span className="bg-white/10 text-gray-400 border border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Unknown</span>;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-[#050505] pt-32 pb-12">
      
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header & Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
              <Package className="text-green-400" size={32} /> Your Food Inventory
            </h1>
            <p className="text-gray-400 text-lg">Manage your active, claimed, and past food listings.</p>
          </div>
          
          <Link 
            to="/add-food" 
            className="flex items-center gap-2 bg-white text-black px-6 py-3.5 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1"
          >
            <Plus size={22} /> Add New Item
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div 
              key={item.id} 
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col group hover:bg-white/10 hover:border-green-500/50 transition-all relative overflow-hidden"
            >
              {/* Subtle hover glow inside the card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              {/* Status Badge */}
              <div className="flex justify-between items-start mb-6">
                {getStatusBadge(item.status)}
                
                {/* Action Buttons (Edit / Delete) */}
                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Food Info */}
              <h3 className="text-2xl font-black text-white mb-4 line-clamp-1">{item.foodName}</h3>
              
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#050505] border border-white/5 flex items-center justify-center">
                    <Package size={14} className="text-green-400" />
                  </div>
                  <span className="text-white">{item.quantity}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#050505] border border-white/5 flex items-center justify-center">
                    <Tag size={14} className="text-blue-400" />
                  </div>
                  <span>{item.category}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-400 font-medium text-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#050505] border border-white/5 flex items-center justify-center">
                    <Clock size={14} className="text-orange-400" />
                  </div>
                  <span className={item.status === 'expired' ? 'text-red-400' : ''}>
                    {item.status === 'expired' ? 'Expired' : formatExpiryDate(item.expiryDate)}
                  </span>
                </div>
              </div>

            </div>
          ))}

          {/* Empty State / Add New Card Shortcut */}
          {listings.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3 text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 border-dashed rounded-[2rem]">
              <Package className="mx-auto text-gray-600 mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">No active listings</h3>
              <p className="text-gray-400 mb-6">You don't have any food listed right now.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}