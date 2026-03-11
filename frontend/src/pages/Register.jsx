import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Briefcase } from 'lucide-react';

export default function Register() {
  const handleRegister = (e) => {
    e.preventDefault();
    alert("Registration triggered! (Backend connection pending)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-12">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-3xl font-black mb-2 text-gray-900">Join EcoBite</h2>
        <p className="text-gray-400 mb-8 font-medium">Create an account to start making an impact.</p>
        
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Account Type</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500 appearance-none font-medium text-gray-700">
                <option value="volunteer">Volunteer (Individual)</option>
                <option value="restaurant">Restaurant / Donor</option>
                <option value="ngo">NGO / Distributor</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Full Name / Organization Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                required
                placeholder="John Doe or Fresh Bakes" 
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                required
                placeholder="you@example.com" 
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                required
                placeholder="••••••••" 
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-lg shadow-green-100 mt-4">
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-green-600 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}