import React from 'react';
import { MapPin } from 'lucide-react';

const DUMMY_DATA = [
  { name: "Royal Tandoor", area: "South Campus", status: "Active", stock: "High" },
  { name: "Fresh Bakes", area: "Model Town", status: "Active", stock: "Medium" },
  { name: "Urban Grill", area: "Civic Center", status: "Away", stock: "None" },
  { name: "Pasta House", area: "West Mall", status: "Active", stock: "Low" },
];

export default function RestaurantDirectory() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900">Partner Hub</h1>
        <p className="text-gray-500">View restaurants registered for food donation.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {DUMMY_DATA.map((res, index) => (
          <div key={index} className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-green-300 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center font-bold text-gray-400 italic">EB</div>
            <h3 className="font-bold text-lg mb-1">{res.name}</h3>
            <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
              <MapPin size={14} /> {res.area}
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${res.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {res.status}
              </span>
              <span className="text-xs font-medium text-gray-500">Stock: {res.stock}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}