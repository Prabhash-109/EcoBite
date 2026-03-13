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
    <div className="min-h-screen relative overflow-hidden bg-[#050505] pt-32 pb-12 text-white">
      
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-900/20 rounded-full blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-black text-white mb-2">Partner Hub</h1>
          <p className="text-gray-400 font-medium">View restaurants registered for food donation.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_DATA.map((res, index) => (
            // Dark Frosted Glass Grid Cards
            <div 
              key={index} 
              className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] hover:-translate-y-1 hover:bg-white/10 hover:border-green-500/50 transition-all cursor-pointer shadow-2xl group"
            >
              <div className="w-14 h-14 bg-white/10 rounded-2xl mb-6 flex items-center justify-center font-black text-gray-500 italic border border-white/5 group-hover:scale-110 transition-transform shadow-inner">
                EB
              </div>
              
              <h3 className="font-black text-xl mb-1 text-white">{res.name}</h3>
              
              <div className="flex items-center gap-1.5 text-gray-400 font-medium text-sm mb-6">
                <MapPin size={16} className="text-green-400" /> {res.area}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${res.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/10 text-gray-400 border border-white/10'}`}>
                  {res.status}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Stock: <span className="text-gray-300">{res.stock}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}