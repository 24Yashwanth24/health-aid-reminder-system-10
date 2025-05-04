
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StarIcon, Heart } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  type: 'user' | 'staff';
  quote?: string;
}

const AuthLayout = ({ children, title, subtitle, type, quote }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-health-200 via-white to-health-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <Heart className="h-10 w-10 text-red-500 group-hover:text-red-700 transition-all duration-300 transform group-hover:scale-110 animate-pulse" />
            <span className="text-3xl font-bold bg-gradient-to-r from-health-600 to-health-800 bg-clip-text text-transparent">HealthKart Express</span>
          </Link>
        </div>
        
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-health-700 to-health-900 bg-clip-text text-transparent">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          {quote && (
            <div className="mt-4 italic text-health-600 font-medium border-l-4 border-health-400 pl-4 py-2 bg-health-50/50 rounded">
              "{quote}"
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-lg sm:px-10 transform transition-all duration-300 hover:shadow-health-200/50 border border-health-100/50 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-health-100 rounded-full opacity-50"></div>
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-health-100 rounded-full opacity-50"></div>
          
          {children}
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {type === 'user' ? 'Not a patient?' : 'Not a staff member?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full border-health-200 hover:bg-health-50 transition-all duration-300"
                asChild
              >
                <Link to={type === 'user' ? '/login' : '/user/login'}>
                  {type === 'user' ? 'Go to Staff Login' : 'Go to Patient Login'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
