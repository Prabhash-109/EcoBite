import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Utensils, Building2, HandHeart, Leaf, MapPin, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background decorative blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-200/30 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-8">
            <Leaf size={16} /> <span>Join the movement against food waste</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tight">
            Zero Waste. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">
              Zero Hunger.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            EcoBite is a digital ecosystem where surplus food meets those who need it most. We connect local restaurants directly with NGOs and volunteers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition flex items-center justify-center gap-2 shadow-xl shadow-gray-200">
              Get Started <ArrowRight size={20} />
            </Link>
            <Link to="/restaurants" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:bg-gray-50 border border-gray-200 transition flex items-center justify-center gap-2">
              View Partners
            </Link>
          </div>
        </div>
      </section>

      {/* 2. IMPACT STATS */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">10k+</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Meals Saved</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">250</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Partners</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">5.2t</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">CO2 Reduced</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-2">500+</div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Volunteers</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO IS IT FOR (ROLES) */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">One Platform. Three Pillars.</h2>
          <p className="text-xl text-gray-500">Everyone has a role to play in ending food waste.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Restaurant Card */}
          <div className="p-10 border-2 border-transparent bg-white rounded-[2.5rem] hover:border-green-100 hover:shadow-2xl hover:shadow-green-50 transition-all group">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-600 transition-colors">
              <Utensils className="text-green-600 group-hover:text-white" size={32} />
            </div>
            <h3 className="font-black text-2xl mb-4 text-gray-900">For Restaurants</h3>
            <p className="text-gray-500 leading-relaxed mb-8">List your surplus food in seconds. Track your social impact metrics and get tax deduction reports for your donations.</p>
            <Link to="/register" className="font-bold text-green-600 flex items-center gap-1 hover:gap-2 transition-all">Join as Donor <ArrowRight size={16} /></Link>
          </div>

          {/* NGO Card */}
          <div className="p-10 border-2 border-transparent bg-white rounded-[2.5rem] hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors">
              <Building2 className="text-blue-600 group-hover:text-white" size={32} />
            </div>
            <h3 className="font-black text-2xl mb-4 text-gray-900">For NGOs</h3>
            <p className="text-gray-500 leading-relaxed mb-8">Browse real-time nearby food donations. Schedule instant pickups to ensure your community gets fresh meals.</p>
            <Link to="/register" className="font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">Join as NGO <ArrowRight size={16} /></Link>
          </div>

          {/* Volunteer Card */}
          <div className="p-10 border-2 border-transparent bg-white rounded-[2.5rem] hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-50 transition-all group">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-500 transition-colors">
              <HandHeart className="text-orange-500 group-hover:text-white" size={32} />
            </div>
            <h3 className="font-black text-2xl mb-4 text-gray-900">For Volunteers</h3>
            <p className="text-gray-500 leading-relaxed mb-8">Help bridge the gap. Manage the logistics of food delivery from restaurants to NGOs using our smart routing system.</p>
            <Link to="/register" className="font-bold text-orange-500 flex items-center gap-1 hover:gap-2 transition-all">Start Delivering <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-gray-900 text-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">How EcoBite Works</h2>
            <p className="text-xl text-gray-400">A seamless process from surplus to served.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-gray-800"></div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-gray-900">
                <Utensils className="text-green-500" size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">1. List Surplus</h4>
              <p className="text-gray-400 text-sm">Restaurants post available edible food on the platform.</p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-gray-900">
                <MapPin className="text-blue-500" size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">2. Match & Assign</h4>
              <p className="text-gray-400 text-sm">Nearby NGOs claim the food and a volunteer is assigned.</p>
            </div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10 border-4 border-gray-900">
                <Clock className="text-orange-500" size={24} />
              </div>
              <h4 className="text-xl font-bold mb-2">3. Pickup & Deliver</h4>
              <p className="text-gray-400 text-sm">Food is safely transported and distributed to the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-green-600 font-black text-2xl tracking-tight mb-4">
              <Leaf strokeWidth={3} /> EcoBite
            </Link>
            <p className="text-gray-500 mb-6 max-w-sm">
              Building a sustainable future by ensuring perfectly good food feeds people, not landfills.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><Link to="/restaurants" className="hover:text-green-600">Our Partners</Link></li>
              <li><Link to="/register" className="hover:text-green-600">Register NGO</Link></li>
              <li><Link to="/register" className="hover:text-green-600">Volunteer</Link></li>
              <li><Link to="/login" className="hover:text-green-600">Log In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-gray-500 text-sm">
              <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-green-600">Food Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-green-600">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} EcoBite. All rights reserved.</p>
          <div className="flex gap-4 text-gray-400">
            {/* Social icon placeholders */}
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-green-50 hover:text-green-600 cursor-pointer transition">𝕏</div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-green-50 hover:text-green-600 cursor-pointer transition">in</div>
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-green-50 hover:text-green-600 cursor-pointer transition">IG</div>
          </div>
        </div>
      </footer>

    </div>
  );
}