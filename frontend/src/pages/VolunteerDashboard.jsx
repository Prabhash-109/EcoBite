import React, { useEffect, useState } from 'react';
import { MapPin, Box, CheckCircle2, Package, Phone, Mail, Clock, ArrowDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { handleError, handleSuccess } from '../utils';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();

    const interval = setInterval(() => {
      fetchAssignments();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/requests/volunteer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAssignments(res.data);
    } catch (error) {
      handleError(error.response?.data?.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };



  const handleMarkDelivered = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/api/requests/${requestId}/delivered`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleSuccess('Delivery completed!');
      fetchAssignments();
    } catch (error) {
      handleError(error.response?.data?.message || 'Failed to update status');
    }
  };

  const activeAssignments = assignments.filter((a) => a.status === 'assigned');
  const deliveredAssignments = assignments.filter((a) => a.status === 'delivered' || a.status === 'picked_up');
  const currentTasks = [...activeAssignments];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'assigned':
        return (
          <span className="bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/30 flex items-center gap-1.5">
            <Package size={12} /> Pending Pickup
          </span>
        );

      case 'delivered':
        return (
          <span className="bg-green-500/20 text-green-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-green-500/30 flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Delivered
          </span>
        );
      default:
        return null;
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const renderTaskCard = (task) => {
    const restaurant = task.restaurant;
    const ngo = task.ngo;
    const food = task.food;

    return (
      <div key={task.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          {getStatusBadge(task.status)}
          <div className="flex items-center gap-3">
            {food?.pickupTime && (
              <span className="text-gray-400 text-sm font-bold flex items-center gap-1.5">
                <Clock size={14} /> Pickup: {food.pickupTime}
              </span>
            )}
            <span className="text-gray-500 text-xs">
              Assigned {getTimeAgo(task.assignedAt)}
            </span>
          </div>
        </div>

        {/* Food Item Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">📦 Food to Deliver</p>
          <h3 className="font-black text-2xl text-white mb-1">{food?.foodName || 'Food Item'}</h3>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="text-sm text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              Qty: {food?.quantity || '-'}
            </span>
            <span className="text-sm text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
              {food?.category || 'General'}
            </span>
            {food?.description && (
              <span className="text-sm text-gray-400 italic">{food.description}</span>
            )}
          </div>
        </div>

        {/* Route visualization */}
        <div className="flex gap-6 mb-10">
          <div className="w-6 flex flex-col items-center mt-1">
            <div className="w-4 h-4 bg-green-400 rounded-full border-4 border-[#050505] shadow-[0_0_10px_rgba(74,222,128,0.4)]" />
            <div className="w-0.5 flex-1 bg-gradient-to-b from-green-400/50 via-white/20 to-red-400/50 my-1 min-h-[80px]" />
            <MapPin size={22} className="text-red-400" />
          </div>
          <div className="flex-1 space-y-6">
            {/* Pickup section */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
              <p className="text-xs text-green-400 font-bold uppercase tracking-widest mb-2">
                🟢 Pickup From
              </p>
              <p className="font-black text-2xl mb-1 text-white">
                {restaurant?.name || 'Restaurant'}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {restaurant?.phoneNumber && (
                  <a href={`tel:${restaurant.phoneNumber}`} className="flex items-center gap-1.5 text-sm text-green-300 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl hover:bg-green-500/20 transition-colors">
                    <Phone size={14} /> {restaurant.phoneNumber}
                  </a>
                )}
                {restaurant?.email && (
                  <a href={`mailto:${restaurant.email}`} className="flex items-center gap-1.5 text-sm text-green-300 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-xl hover:bg-green-500/20 transition-colors">
                    <Mail size={14} /> {restaurant.email}
                  </a>
                )}
              </div>
            </div>

            {/* Distance indicator */}
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-1.5">
                <ArrowDown size={12} className="animate-bounce" /> Route
              </span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* Deliver section */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
              <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-2">
                🔴 Deliver To
              </p>
              <p className="font-black text-2xl text-white mb-1">
                {ngo?.name || 'NGO'}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {ngo?.phoneNumber && (
                  <a href={`tel:${ngo.phoneNumber}`} className="flex items-center gap-1.5 text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500/20 transition-colors">
                    <Phone size={14} /> {ngo.phoneNumber}
                  </a>
                )}
                {ngo?.email && (
                  <a href={`mailto:${ngo.email}`} className="flex items-center gap-1.5 text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-xl hover:bg-red-500/20 transition-colors">
                    <Mail size={14} /> {ngo.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4">
          {task.status === 'assigned' && (
            <button
              onClick={() => handleMarkDelivered(task.id)}
              className="flex items-center justify-center gap-2 bg-green-500 text-black py-4 rounded-2xl font-bold hover:bg-green-400 hover:-translate-y-1 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <CheckCircle2 size={18} /> Mark Picked Up
            </button>
          )}
          {task.status === 'delivered' && (
            <div className="flex items-center justify-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 py-4 rounded-2xl font-bold">
              <CheckCircle2 size={18} /> Delivery Completed
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-[#050505] pt-32 pb-12">
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white">Volunteer Hub</h1>
          <p className="text-gray-400 text-lg">Your active deliveries and impact stats.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Box className="text-green-400" size={20} /> Current Assignments
            </h2>

            {loading ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
                <p className="text-gray-400">Loading your assignments...</p>
              </div>
            ) : currentTasks.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
                <div className="text-center text-gray-400 py-10">
                  <Package size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="font-bold text-lg mb-2">No active assignments</p>
                  <p className="text-sm">
                    Once an NGO assigns you a delivery task, it will appear here with full pickup and delivery details.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {currentTasks.map((task) => renderTaskCard(task))}
              </div>
            )}

            {/* Completed Deliveries */}
            {deliveredAssignments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-4">
                  <CheckCircle2 className="text-green-400" size={20} /> Completed Deliveries
                </h2>
                <div className="space-y-4">
                  {deliveredAssignments.map((task) => (
                    <div key={task.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                          <CheckCircle2 size={20} className="text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white">{task.food?.foodName || 'Food Item'}</h4>
                          <p className="text-sm text-gray-400">
                            {task.restaurant?.name || 'Restaurant'} → {task.ngo?.name || 'NGO'}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(task.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Glass Sidebar */}
          <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 h-fit shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-white">Your Impact</h2>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 rounded-2xl flex justify-between items-center border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-gray-400 font-medium">Active Assignments</span>
                <span className="font-black text-2xl text-white">{activeAssignments.length}</span>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl flex justify-between items-center border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-gray-400 font-medium">Completed Pickups</span>
                <span className="font-black text-2xl text-green-400">{deliveredAssignments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}