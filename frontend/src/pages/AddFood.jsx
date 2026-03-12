import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { handleSuccess, handleError } from '../utils';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function AddFood() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    category: 'prepared',
    expiryDate: '',
    pickupTime: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_URL}/api/food/donate`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      handleSuccess(res.data.message);
      navigate('/restaurant-dashboard');
    } catch (error) {
      handleError(error.response?.data?.message || 'Failed to create food listing');
    }
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
              <input 
                type="text" 
                name="foodName"
                value={formData.foodName}
                onChange={handleChange}
                required 
                placeholder="e.g. Pasta, Bread Rolls" 
                className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-gray-700 ml-1">Quantity (Approx)</label>
              <input 
                type="text" 
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required 
                placeholder="e.g. 10 Meals or 5kg" 
                className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-gray-700 ml-1">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="prepared">Prepared Food</option>
                <option value="bakery">Bakery Items</option>
                <option value="produce">Fresh Produce</option>
                <option value="dairy">Dairy Products</option>
                <option value="packaged">Packaged Food</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-bold text-sm text-gray-700 ml-1">Expiry Date & Time</label>
              <input 
                type="datetime-local" 
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required 
                className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Preferred Pickup Time</label>
            <input 
              type="text" 
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required 
              placeholder="e.g. 2:00 PM - 6:00 PM" 
              className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Special Instructions (Optional)</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Contains dairy, needs refrigeration" 
              className="p-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500 h-32 resize-none" 
            />
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-lg shadow-green-100">
            Post Donation
          </button>
        </form>
      </div>
    </div>
  );
}