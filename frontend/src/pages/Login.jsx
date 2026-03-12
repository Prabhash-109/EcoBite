import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );

      alert(res.data.message);

      // Create user object with role and name
      const userData = {
        id: res.data.id, // You might need to add this to your backend response
        name: res.data.name,
        email: formData.email,
        account_type: res.data.role
      };

      // Use auth context login method
      login(userData, res.data.token);

      // Redirect based on role
      switch (res.data.role) {
        case 'restaurant':
          navigate('/restaurant-dashboard');
          break;
        case 'ngo':
          navigate('/restaurants');
          break;
        case 'volunteer':
          navigate('/volunteer-dashboard');
          break;
        default:
          navigate('/');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      alert(errorMessage);
      
      // Redirect to register page after unsuccessful login
      setTimeout(() => {
        navigate('/register');
      }, 1500); // Wait 1.5 seconds to show the message before redirecting
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-sm border border-gray-100">

        <h2 className="text-3xl font-black mb-2 text-gray-900">Welcome Back</h2>
        <p className="text-gray-400 mb-8 font-medium">
          Log in to continue fighting food waste.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Password */}

          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-700 ml-1">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition shadow-lg shadow-green-100 mt-4"
          >
            Sign In
          </button>

        </form>

        <p className="text-center mt-8 text-gray-500 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-bold hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}