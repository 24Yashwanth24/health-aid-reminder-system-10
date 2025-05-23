
import React from 'react';
import { Mail, Lock, User, Phone, Building } from 'lucide-react';
import FormHeader from './FormHeader';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import { useStaffRegisterForm } from '@/hooks/useStaffRegisterForm';

const StaffRegisterForm = () => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    department,
    setDepartment,
    phone,
    setPhone,
    isLoading,
    handleSubmit
  } = useStaffRegisterForm();

  return (
    <form className="space-y-6 w-full" onSubmit={handleSubmit}>
      <FormHeader 
        portalType="Staff Healthcare Portal" 
        tagline='"Your medicine, my responsibility"'
      />
      
      <div className="space-y-4">
        <FormInput
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required={true}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={User}
        />
        
        <FormInput
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required={true}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={Mail}
        />
        
        <FormInput
          id="department"
          name="department"
          type="text"
          placeholder="Department (optional)"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          icon={Building}
        />
        
        <FormInput
          id="phone"
          name="phone"
          type="tel"
          placeholder="Phone Number (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={Phone}
        />
        
        <FormInput
          id="password"
          name="password"
          type="password"
          required={true}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
        />
        
        <FormInput
          id="confirm-password"
          name="confirm-password"
          type="password"
          required={true}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={Lock}
        />
      </div>

      <FormSubmitButton
        isLoading={isLoading}
        loadingText="Creating account..."
        buttonText="Create Staff Account"
      />
    </form>
  );
};

export default StaffRegisterForm;
