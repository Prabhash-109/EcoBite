import React from 'react';

export default function AddFood() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Food listing created! (Backend connection pending)");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mt-10">
        <h2 className="text-3xl font-black mb-2">List Surplus Food</h2>
        <p className="text-gray-400 mb-8 font-medium">Ensure the food is edible and packed properly.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-gray-700 ml-1">Food Item Name</label>
              <input type="text" required placeholder="e.g. Pasta, Bread Rolls" className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-gray-700 ml-1">Quantity (Approx)</label>
              <input type="text" required placeholder="e.g. 10 Meals or 5kg" className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Expiry Timeline</label>
            <select className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500">
              <option>Consume within 2 hours</option>
              <option>Consume within 6 hours</option>
              <option>Consume within 24 hours</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Special Instructions (Optional)</label>
            <textarea placeholder="e.g. Contains dairy, needs refrigeration" className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none" />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-lg shadow-green-100">
            Post Donation
          </button>
        </form>
      </div>
    </div>
  );
}