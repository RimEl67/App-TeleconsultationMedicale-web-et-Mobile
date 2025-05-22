import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
          MediConnect
        </h1>
        <p className="mt-2 text-gray-600">
          Create your account to get started
        </p>
      </div>
      
      <RegisterForm />
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>© 2025 MediConnect. All rights reserved.</p>
      </div>
    </div>
  );
};

export default RegisterPage;