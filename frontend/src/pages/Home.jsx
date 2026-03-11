import React from 'react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <header className="text-center mb-20">
        <h1 className="text-6xl font-black text-gray-900 mb-6">Zero Waste. <span className="text-green-600">Zero Hunger.</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          EcoBite is a digital ecosystem where surplus food meets those who need it most. 
          We connect local restaurants directly with NGOs.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-8 border rounded-3xl bg-white hover:shadow-xl transition">
          <div className="text-3xl mb-4">🍽️</div>
          <h3 className="font-bold text-xl mb-2">For Restaurants</h3>
          <p className="text-gray-500 text-sm">List your surplus food in seconds and track your social impact metrics.</p>
        </div>
        <div className="p-8 border rounded-3xl bg-white hover:shadow-xl transition">
          <div className="text-3xl mb-4">🏢</div>
          <h3 className="font-bold text-xl mb-2">For NGOs</h3>
          <p className="text-gray-500 text-sm">Browse nearby food donations and schedule instant pickups for your community.</p>
        </div>
        <div className="p-8 border rounded-3xl bg-white hover:shadow-xl transition">
          <div className="text-3xl mb-4">🤝</div>
          <h3 className="font-bold text-xl mb-2">For Volunteers</h3>
          <p className="text-gray-500 text-sm">Help bridge the gap by managing the logistics of food delivery.</p>
        </div>
      </div>
    </div>
  );
}