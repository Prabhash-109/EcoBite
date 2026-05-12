import React, { useState, useEffect } from 'react';
import { Plus, Package, Clock, CheckCircle, MessageSquare, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { handleError } from '../utils';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    delivered: 0,
    total: 0
  });

  const [orderRequests, setOrderRequests] = useState([]);

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    fetchNgoRequests();
  };

  const fetchNgoRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/requests/restaurant`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const allRequests = res.data || [];
      const transformed = allRequests.map((r) => ({
        id: r.id,
        foodName: r.food ? `${r.food.foodName} (${r.food.quantity})` : 'Food',
        ngoName: r.ngo?.name || 'NGO',
        volunteerName: r.volunteer?.name || '-',
        status: r.status,
        date: new Date(r.createdAt).toLocaleString()
      }));

      setOrderRequests(transformed);

      const total = allRequests.length;
      const deliveredCount = allRequests.filter(r => r.status === 'delivered' || r.status === 'picked_up').length;
      const pendingCount = allRequests.filter(r => r.status === 'pending').length;
      const activeCount = total - deliveredCount;

      setStats({ active: activeCount, pending: pendingCount, delivered: deliveredCount, total });
    } catch (error) {
      // Keep dashboard usable even if requests fail
    }
  };

  const getRequestStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>;
      case 'accepted':
        return <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Accepted</span>;
      case 'rejected':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Rejected</span>;
      case 'assigned':
        return <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Assigned</span>;
      case 'delivered':
      case 'picked_up':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Delivered</span>;
      default:
        return <span className="bg-white/10 text-gray-400 border border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{status}</span>;
    }
  };

  const statsData = [
    { label: "Active Listings", value: stats.active, icon: <Package className="text-blue-400" /> },
    { label: "Pending Pickups", value: stats.pending, icon: <Clock className="text-orange-400" /> },
    { label: "Completed Deliveries", value: stats.delivered, icon: <CheckCircle className="text-green-400" /> },
    { label: "Total Donations", value: stats.total, icon: <Truck className="text-purple-400" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-[#050505] pt-32 pb-12">
      
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* 1. WELCOME */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Welcome back, {user?.name || "Partner"}</h1>
          <p className="text-gray-400 text-lg">Here is your daily surplus snapshot.</p>
        </div>

        {/* 2. QUICK ACTION TRIGGERS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Link to="/add-food" className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:-translate-y-1">
            <Plus size={22} /> List New Surplus
          </Link>
          <Link to="/ngo-requests" className="flex-1 flex items-center justify-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 text-white py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all shadow-sm hover:-translate-y-1">
            <MessageSquare size={22} /> View NGO Requests 
          </Link>
        </div>

        {/* 3. STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat, i) => (
            <div key={i} className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-all hover:-translate-y-1 hover:bg-white/10 group">
              <div className="mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 4. ALL-TIME REQUESTED ORDERS TABLE */}
        <h2 className="text-2xl font-bold mb-6 text-white">All-Time Requested Orders</h2>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Food Item</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Requested By (NGO)</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Volunteer</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Date</th>
                  <th className="p-5 font-bold text-gray-400 uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {orderRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                      No requests have been made yet.
                    </td>
                  </tr>
                ) : (
                  orderRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-5 font-bold text-white">{request.foodName}</td>
                      <td className="p-5 text-gray-400 font-medium">{request.ngoName}</td>
                      <td className="p-5 text-gray-400 font-medium">{request.volunteerName}</td>
                      <td className="p-5 text-gray-400 font-medium text-sm">{request.date}</td>
                      <td className="p-5">{getRequestStatusBadge(request.status)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}