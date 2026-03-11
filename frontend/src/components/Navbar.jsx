import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 5%', background: '#fff', borderBottom: '1px solid #eee' }}>
      <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-2xl">
        <Leaf /> EcoBite
      </Link>
      <div className="flex gap-6 font-medium text-gray-700">
        <Link to="/" className="hover:text-green-600">Home</Link>
        <Link to="/restaurants" className="hover:text-green-600">Restaurants</Link>
        <Link to="/register-ngo" className="bg-green-600 text-white px-4 py-2 rounded-lg">NGO Join</Link>
      </div>
    </nav>
  );
}