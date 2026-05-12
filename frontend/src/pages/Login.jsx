import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { handleSuccess, handleError } from "../utils";
import { signInWithGoogle } from "../firebase/firebaseAuth";

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function Login() {
  const { login, loginWithFirebase } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    account_type: "volunteer"
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      handleSuccess(res.data.message);

      // Create user object with role and name
      const userData = {
        id: res.data.id,
        name: res.data.name,
        email: formData.email,
        account_type: res.data.role,
        phoneNumber: res.data.phoneNumber
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
      handleError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      console.log('Login: Starting Google sign-in process...');
      const { user, idToken } = await signInWithGoogle();
      console.log('Login: Firebase sign-in successful, sending to backend...');
      
      // Send Firebase token to backend for verification and user creation/retrieval
      const res = await axios.post(
        `${API_URL}/api/auth/firebase-signin`,
        { 
          idToken,
          provider: 'google',
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          account_type: formData.account_type
        }
      );
      console.log('Login: Backend verification successful');

      handleSuccess('Successfully signed in with Google!');

      // Create user object with backend data
      const userData = {
        id: res.data.id,
        name: res.data.name,
        email: user.email,
        account_type: res.data.account_type,
        phoneNumber: res.data.phoneNumber,
        photoURL: user.photoURL
      };

      // Use Firebase login method
      loginWithFirebase(userData, idToken);

      // Redirect based on role
      switch (res.data.account_type) {
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
      console.error('Login: Google sign-in failed:', error);
      console.error('Login: Error response:', error.response?.data);
      console.error('Login: Error message:', error.message);
      const errorMessage = error.response?.data?.message || "Google sign-in failed";
      handleError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden pt-32">
      
      {/* Background Glows */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Frosted Dark Glass Form Card */}
      <div className="bg-white/5 backdrop-blur-xl w-full max-w-lg p-10 sm:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 relative z-10">

        <h2 className="text-3xl font-black mb-2 text-white">Welcome Back</h2>
        <p className="text-gray-400 mb-8 font-medium">
          Log in to continue fighting food waste.
        </p>

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-400 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full p-4 pl-12 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder:text-gray-600 text-white transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-400 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full p-4 pl-12 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 placeholder:text-gray-600 text-white transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Account Type */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-sm text-gray-400 ml-1">
              Account Type
            </label>
            <div className="relative">
              <select
                name="account_type"
                value={formData.account_type}
                onChange={handleChange}
                className="w-full p-4 pl-4 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                <option value="volunteer" className="bg-black">Volunteer</option>
                <option value="restaurant" className="bg-black">Restaurant</option>
                <option value="ngo" className="bg-black">NGO</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black py-5 rounded-2xl font-black text-lg hover:bg-gray-200 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-400 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Social Sign-in Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>

        <p className="text-center mt-8 text-gray-500 font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-400 font-bold hover:text-green-300 hover:underline"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}