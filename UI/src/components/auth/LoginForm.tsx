import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
        <p className="text-gray-600">Please sign in to your account</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={toggleShowPassword}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot password?
          </Link>
        </div>
        
        <button
          type="submit"
          className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isLoading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <LogIn size={18} className="mr-2" />
          )}
          Sign In
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </Link>
        </p>
      </div>
      
      {/* Quick Login Buttons for Demo */}
      <div className="mt-8 border-t pt-6">
        <p className="text-sm text-gray-500 mb-4 text-center">Demo Accounts</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              setEmail('patient@example.com');
              setPassword('password');
            }}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs py-2 px-3 rounded transition-colors"
          >
            Patient
          </button>
          <button
            onClick={() => {
              setEmail('doctor@example.com');
              setPassword('password');
            }}
            className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs py-2 px-3 rounded transition-colors"
          >
            Doctor
          </button>
          <button
            onClick={() => {
              setEmail('admin@example.com');
              setPassword('password');
            }}
            className="bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs py-2 px-3 rounded transition-colors"
          >
            Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;