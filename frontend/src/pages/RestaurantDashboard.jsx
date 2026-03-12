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
        return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">AVAILABLE</span>;
      case 'claimed':
        return <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">CLAIMED</span>;
      case 'picked_up':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">PICKED UP</span>;
      case 'expired':
        return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">EXPIRED</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">UNKNOWN</span>;
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
    { label: "Active Listings", value: stats.active.toString(), icon: <Package className="text-blue-500" /> },
    { label: "Pending Pickups", value: stats.pending.toString(), icon: <Clock className="text-orange-500" /> },
    { label: "Total Donations", value: stats.total.toString(), icon: <CheckCircle className="text-green-500" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Restaurant Portal</h1>
          <p className="text-gray-500 text-lg">Manage your surplus and track your impact.</p>
        </div>
        <Link to="/add-food" className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700 transition">
          <Plus size={20} /> List New Food
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {statsData.map((stat, i) => (
          <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
            <div className="mb-4">{stat.icon}</div>
            <div className="text-3xl font-black text-gray-900">{stat.value}</div>
            <div className="text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-bold text-gray-600">Food Item</th>
              <th className="p-4 font-bold text-gray-600">Quantity</th>
              <th className="p-4 font-bold text-gray-600">Status</th>
              <th className="p-4 font-bold text-gray-600">Expiry</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {foods.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No food donations yet. Click "List New Food" to get started!
                </td>
              </tr>
            ) : (
              foods.slice(0, 10).map((food) => (
                <tr key={food.id}>
                  <td className="p-4 font-medium">{food.foodName}</td>
                  <td className="p-4 text-gray-500">{food.quantity}</td>
                  <td className="p-4">{getStatusBadge(food.status)}</td>
                  <td className="p-4 text-gray-500">
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
  );
}