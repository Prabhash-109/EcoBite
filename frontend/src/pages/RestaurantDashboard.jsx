import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { handleSuccess, handleError } from '../utils';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [foods, setFoods] = useState([]);
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    total: 0
  });

  useEffect(() => {
    fetchRestaurantFoods();
  }, []);

  const fetchRestaurantFoods = async () => {
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

      setFoods(res.data);
      
      // Calculate stats
      const active = res.data.filter(food => food.status === 'available').length;
      const pending = res.data.filter(food => food.status === 'claimed').length;
      const total = res.data.length;

      setStats({ active, pending, total });
    } catch (error) {
      handleError('Failed to fetch food donations');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">AVAILABLE</span>;
      case 'claimed':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">CLAIMED</span>;
      case 'picked_up':
        return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">PICKED UP</span>;
      case 'expired':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wide">EXPIRED</span>;
      default:
        return <span className="bg-white/10 text-gray-400 border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide">UNKNOWN</span>;
    }
  };

  const formatTimeLeft = (expiryDate) => {
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

  const statsData = [
    { label: "Active Listings", value: stats.active.toString(), icon: <Package className="text-blue-400" /> },
    { label: "Pending Pickups", value: stats.pending.toString(), icon: <Clock className="text-orange-400" /> },
    { label: "Total Donations", value: stats.total.toString(), icon: <CheckCircle className="text-green-400" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-[#050505] pt-32 pb-12">
      
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-white">Restaurant Portal</h1>
            <p className="text-gray-400 text-lg">Manage your surplus and track your impact.</p>
          </div>
          <Link to="/add-food" className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1">
            <Plus size={20} /> List New Food
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {statsData.map((stat, i) => (
            <div key={i} className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-all hover:-translate-y-1 hover:bg-white/10">
              <div className="mb-4">{stat.icon}</div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white">Recent Activity</h2>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 font-bold text-gray-400">Food Item</th>
                <th className="p-4 font-bold text-gray-400">Quantity</th>
                <th className="p-4 font-bold text-gray-400">Status</th>
                <th className="p-4 font-bold text-gray-400">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {foods.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                    No food donations yet. Click "List New Food" to get started!
                  </td>
                </tr>
              ) : (
                foods.slice(0, 10).map((food) => (
                  <tr key={food.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{food.foodName}</td>
                    <td className="p-4 text-gray-400 font-medium">{food.quantity}</td>
                    <td className="p-4">{getStatusBadge(food.status)}</td>
                    <td className="p-4 text-gray-400 font-medium">
                      {food.status === 'picked_up' || food.status === 'expired' 
                        ? 'Completed' 
                        : formatTimeLeft(food.expiryDate)
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}