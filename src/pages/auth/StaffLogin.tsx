
import React from 'react';
import { Link } from 'react-router-dom';
import StaffLoginForm from '@/components/auth/StaffLoginForm';
import AuthLayout from '@/components/auth/AuthLayout';

const StaffLogin = () => {
  return (
    <AuthLayout title="Staff Portal" subtitle="Enter your credentials to access the staff portal" type="staff">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Staff Portal</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the staff portal
          </p>
        </div>
        
        <StaffLoginForm />
        
        <div className="flex items-center justify-center mt-4">
          <p className="text-sm text-gray-600">
            Patient? {" "}
            <Link to="/user/login" className="font-semibold text-health-600 hover:text-health-500">
              Login to Patient Portal
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default StaffLogin;
