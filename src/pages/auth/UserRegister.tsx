
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import UserRegisterForm from '@/components/auth/UserRegisterForm';

const UserRegister = () => {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Register to start managing your medications"
      type="user"
    >
      <UserRegisterForm />
    </AuthLayout>
  );
};

export default UserRegister;
