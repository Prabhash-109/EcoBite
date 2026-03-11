import React from 'react';
import { MapPin, Box, CheckCircle2, Navigation } from 'lucide-react';

export default function VolunteerDashboard() {
  const task = { 
    id: 1, 
    restaurant: "Royal Tandoor", 
    destination: "Feeding India NGO (South Campus)", 
    status: "Pending Pickup", 
    time: "Pick up by 2:00 PM" 
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900">Volunteer Hub</h1>
        <p className="text-gray-500 text-lg">Your active deliveries and impact stats.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Box className="text-green-600" size={20} /> Current Assignment
          </h2>
          
          <div className="bg-white border-2 border-green-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                {task.status}
              </span>
              <span className="text-gray-400 text-sm font-medium">{task.time}</span>
            </div>
            
            <div className="flex gap-4 mb-8">
              <div className="w-6 flex flex-col items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="w-0.5 h-12 bg-gray-100" />
                <MapPin size={18} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Pickup From</p>
                <p className="font-bold text-lg mb-2">{task.restaurant}</p>
                
                <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mt-2">Deliver To</p>
                <p className="font-bold text-lg">{task.destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition">
                <Navigation size={18} /> Directions
              </button>
              <button className="flex items-center justify-center gap-2 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition">
                <CheckCircle2 size={18} /> Picked Up
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 h-fit">
          <h2 className="text-xl font-bold mb-6">Your Impact</h2>
          <div className="space-y-4">
             <div className="p-5 bg-white rounded-2xl flex justify-between items-center shadow-sm">
                <span className="text-gray-500 font-medium">Meals Delivered</span>
                <span className="font-black text-2xl">42</span>
             </div>
             <div className="p-5 bg-white rounded-2xl flex justify-between items-center shadow-sm">
                <span className="text-gray-500 font-medium">CO2 Saved</span>
                <span className="font-black text-2xl text-green-600">12kg</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}