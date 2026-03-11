import React from 'react';
import { Plus, Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RestaurantDashboard() {
  const stats = [
    { label: "Active Listings", value: "3", icon: <Package className="text-blue-500" /> },
    { label: "Pending Pickups", value: "1", icon: <Clock className="text-orange-500" /> },
    { label: "Total Donations", value: "128", icon: <CheckCircle className="text-green-500" /> },
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
        {stats.map((stat, i) => (
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
            <tr>
              <td className="p-4 font-medium">Mixed Vegetable Curry</td>
              <td className="p-4 text-gray-500">5kg</td>
              <td className="p-4"><span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide">WAITING</span></td>
              <td className="p-4 text-gray-500">2h 30m left</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Fresh Bread Rolls</td>
              <td className="p-4 text-gray-500">20 pieces</td>
              <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide">PICKED UP</span></td>
              <td className="p-4 text-gray-500">Completed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}