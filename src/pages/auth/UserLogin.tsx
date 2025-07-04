
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import UserLoginForm from '@/components/auth/UserLoginForm';

const UserLogin = () => {
  return (
    <AuthLayout 
      title="User Login" 
      subtitle="Sign in to access your medication portal"
      type="user"
      quote="Your medicine, my responsibility"
    >
      <UserLoginForm />
    </AuthLayout>
  );
};

export default UserLogin;
