import React, { useState } from 'react';

export default function NGORegister() {
  const [name, setName] = useState("");

  const handleAlert = (e) => {
    e.preventDefault();
    alert(`Registration started for ${name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg p-10 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-3xl font-bold mb-2">NGO Onboarding</h2>
        <p className="text-gray-400 mb-8 font-medium">Register your organization to access surplus food.</p>
        
        <form onSubmit={handleAlert} className="space-y-6">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">NGO Name</label>
            <input 
              type="text" 
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Feeding India" 
              className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Registration ID</label>
            <input type="text" placeholder="8-digit Govt Code" className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Contact Email</label>
            <input type="email" placeholder="official@ngo.org" className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <button className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition">
            Apply 
          </button>
        </form>
      </div>
    </div>
  );
}