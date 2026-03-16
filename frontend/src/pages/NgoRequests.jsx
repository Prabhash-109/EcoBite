import React, { useState } from 'react';
import { Send, Building2, Clock, CheckCircle, Package, MessageSquare } from 'lucide-react';

export default function NgoRequests() {
  // Dummy Data for UI demonstration
  const [requests, setRequests] = useState([
    {
      id: 1,
      ngoName: "Feeding India (South Campus)",
      foodItem: "Fresh Bread Rolls (20 pieces)",
      requestTime: "10 mins ago",
      status: "pending",
      messages: [
        { sender: "ngo", text: "Hi, we can pick up the bread rolls in about 30 minutes. Is that okay?", time: "10:05 PM" }
      ]
    },
    {
      id: 2,
      ngoName: "City Mission Shelter",
      foodItem: "Mixed Vegetable Curry (5kg)",
      requestTime: "1 hour ago",
      status: "accepted",
      messages: [
        { sender: "ngo", text: "Hello! We would love to claim the curry for tonight's dinner service.", time: "9:00 PM" },
        { sender: "restaurant", text: "Perfect, it is packed and ready for you.", time: "9:15 PM" },
        { sender: "ngo", text: "Our volunteer Rahul is on the way now!", time: "9:45 PM" }
      ]
    }
  ]);

  const [activeRequest, setActiveRequest] = useState(requests[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add message to the active chat
    const updatedRequest = {
      ...activeRequest,
      messages: [...activeRequest.messages, { sender: "restaurant", text: " " + newMessage, time: "Just now" }]
    };

    setActiveRequest(updatedRequest);
    
    // Update the main requests array
    setRequests(requests.map(req => req.id === activeRequest.id ? updatedRequest : req));
    setNewMessage("");
  };

  const handleAcceptRequest = () => {
    const updatedRequest = { ...activeRequest, status: "accepted" };
    setActiveRequest(updatedRequest);
    setRequests(requests.map(req => req.id === activeRequest.id ? updatedRequest : req));
    alert("Request accepted! The NGO will be notified to begin pickup.");
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white bg-[#050505] pt-32 pb-12">
      
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
            <MessageSquare className="text-green-400" size={32} /> NGO Requests
          </h1>
          <p className="text-gray-400 text-lg">Coordinate pickups and chat directly with verified NGOs.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[700px]">
          
          {/* LEFT PANE: Request List */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h2 className="font-bold text-lg">Active Inquiries</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {requests.map((req) => (
                <div 
                  key={req.id}
                  onClick={() => setActiveRequest(req)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    activeRequest.id === req.id 
                      ? 'bg-white/10 border-green-500/50 shadow-lg' 
                      : 'bg-[#050505]/50 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                      req.status === 'pending' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                      <Clock size={12} /> {req.requestTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-white mb-1 truncate">{req.ngoName}</h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1.5 truncate">
                    <Package size={14} className="text-gray-500" /> {req.foodItem}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANE: Chat & Actions */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative">
            
            {/* Chat Header */}
            <div className="p-6 border-b border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/5">
                  <Building2 className="text-green-400" size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">{activeRequest.ngoName}</h2>
                  <p className="text-sm text-gray-400">Requesting: <span className="text-gray-300 font-medium">{activeRequest.foodItem}</span></p>
                </div>
              </div>

              {/* Action Button */}
              {activeRequest.status === 'pending' ? (
                <button 
                  onClick={handleAcceptRequest}
                  className="flex items-center gap-2 bg-green-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-green-400 transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                >
                  <CheckCircle size={18} /> Accept Request
                </button>
              ) : (
                <span className="flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-2.5 rounded-xl font-bold">
                  <CheckCircle size={18} /> Accepted
                </span>
              )}
            </div>

            {/* Chat History Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-white/[0.02]">
              {activeRequest.messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'restaurant' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] md:max-w-[60%] p-4 rounded-2xl ${
                    msg.sender === 'restaurant' 
                      ? 'bg-green-600 text-white rounded-tr-sm' 
                      : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 font-medium px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white/5 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to coordinate pickup..." 
                  className="flex-1 bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-white text-black w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-all disabled:opacity-50 disabled:hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                >
                  <Send size={20} className={newMessage.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}