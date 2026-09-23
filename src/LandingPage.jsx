import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "./firebase";

export default function LoginPage({ onLogin, onBackToLanding, showPopup }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Confirm password is required";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = {
          name: userCredential.user.email.split("@")[0],
          email: userCredential.user.email,
        };
        showPopup("Welcome to Speakai! 🚀\nCheck the Guide to learn how to use the app.");
        onLogin(user); 
      } else {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        showPopup("Register successful! Please login 😊", "success");
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.log("Firebase Error Code:", error.code);
      console.log("showPopup:", showPopup);
      let message = "Something went wrong";
      switch (error.code) {
        case "auth/user-not-found":
          message = "User not found";
          break;
        case "auth/wrong-password":
          message = "Wrong password";
          break;
        case "auth/invalid-credential":
          message = "Email or password is incorrect";
          break;
        case "auth/email-already-in-use":
          message = "Email already registered";
          break;
        case "auth/invalid-email":
          message = "Invalid email";
          break;
        case "auth/weak-password":
          message = "Password too weak (min 6 characters)";
          break;
        default:
          message = "Login failed, please try again";
      }
      showPopup(message, "error");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-700 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-white hover:text-cyan-200 mb-6 transition-colors transform hover:-translate-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg shadow-purple-500/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 text-white"
              >
                <path d="M12 14a3 3 0 003-3V5a3 3 0 00-6 0v6a3 3 0 003 3z"/>
                <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 006 6.92V21h2v-3.08A7 7 0 0019 11z"/>
                <rect x="7" y="3" width="10" height="8" rx="2" ry="2" opacity="0.25"/>
                <circle cx="10" cy="7" r="1"/>
                <circle cx="14" cy="7" r="1"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Speakai</h1>
          <p className="text-cyan-200">Practice English Speaking with Your AI Partner</p>
        </div>
        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                isLogin
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700/50 text-white hover:bg-slate-700'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                !isLogin
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700/50 text-white hover:bg-cyan-700'
              }`}
            >
              Register
            </button>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition ${
                      errors.name ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition ${
                      errors.email ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-10 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition ${
                    errors.password ? 'border-red-500' : 'border-slate-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-cyan-400 hover:text-cyan-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-cyan-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full bg-slate-700/50 border rounded-lg pl-10 pr-10 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-cyan-400 hover:text-cyan-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/50 mt-6 transform hover:scale-105 active:scale-95"
            >
              {isLogin ? 'Go to Dashboard' : 'Create Account'}
            </button>
          </form>
            <p className="text-center text-slate-400 mt-6">
            {isLogin ? "Don’t have an account?" : ' Already have an account? '}
            <button
              onClick={toggleForm}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition"
            >
              {isLogin ? 'Register' : 'Log In'}
            </button>
          </p>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeInUp 0.5s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
