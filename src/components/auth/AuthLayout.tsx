
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  type: 'user' | 'staff';
}

const AuthLayout = ({ children, title, subtitle, type }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-health-600">HealthKart Express</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          
          {type === 'user' && (
            <div className="mt-2 flex justify-center">
              <Link to="/login" className="text-sm text-health-600 hover:text-health-500 mr-4">
                Staff Login
              </Link>
              <Link to="/user/login" className="text-sm text-health-600 hover:text-health-500">
                User Login
              </Link>
            </div>
          )}
          
          {type === 'staff' && (
            <Link to="/user/login" className="mt-2 inline-block text-sm text-health-600 hover:text-health-500">
              Switch to User Portal
            </Link>
          )}
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
