import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Clock, Trash2, Edit3, Tag } from 'lucide-react';

export default function FoodListings() {
  // Dummy data for demonstration
  const [listings, setListings] = useState([
    {
      id: 1,
      foodName: "Mixed Vegetable Curry",
      quantity: "5kg",
      category: "Prepared Food",
      expiryDate: "Today, 10:00 PM",
      status: "available"
    },
    {
      id: 2,
      foodName: "Fresh Bread Rolls",
      quantity: "20 pieces",
      category: "Bakery",
      expiryDate: "Today, 11:30 PM",
      status: "claimed"
    },
    {
      id: 3,
      foodName: "Steamed Rice",
      quantity: "3kg",
      category: "Prepared Food",
      expiryDate: "Tomorrow, 2:00 PM",
      status: "available"
    },
    {
      id: 4,
      foodName: "Assorted Pastries",
      quantity: "12 pieces",
      category: "Bakery",
      expiryDate: "Yesterday, 8:00 PM",
      status: "expired"
    }
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings(listings.filter(item => item.id !== id));
    }
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
                    {item.status === 'expired' ? `Expired ${item.expiryDate}` : `Expires: ${item.expiryDate}`}
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
              <Link 
                to="/add-food" 
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all"
              >
                <Plus size={18} /> Add Your First Item
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}