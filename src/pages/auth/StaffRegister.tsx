
import React from 'react';
import { Link } from 'react-router-dom';
import StaffRegisterForm from '@/components/auth/StaffRegisterForm';
import AuthLayout from '@/components/auth/AuthLayout';

const StaffRegister = () => {
  return (
    <AuthLayout 
      title="Staff Registration" 
      subtitle="Create an account to access the staff portal" 
      type="staff"
    >
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Staff Registration</h1>
          <p className="text-sm text-muted-foreground">
            Create your staff account to access the portal
          </p>
        </div>
        
        <StaffRegisterForm />
        
        <div className="flex items-center justify-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account? {" "}
            <Link to="/login" className="font-semibold text-health-600 hover:text-health-500">
              Sign in to Staff Portal
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default StaffRegister;
