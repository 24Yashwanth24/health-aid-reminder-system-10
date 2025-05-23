
import React from 'react';
import { Mail, Lock } from 'lucide-react';
import FormHeader from './FormHeader';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import RememberMeCheckbox from './RememberMeCheckbox';
import ForgotPasswordLink from './ForgotPasswordLink';
import { useStaffLoginForm } from '@/hooks/useStaffLoginForm';

const StaffLoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleSubmit
  } = useStaffLoginForm();

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <FormHeader 
        portalType="Staff Healthcare Portal" 
        tagline='"Your medicine, my responsibility"'
      />
      
      <div className="space-y-4">
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
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required={true}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={Lock}
        />
      </div>

      <div className="flex items-center justify-between">
        <RememberMeCheckbox />
        <ForgotPasswordLink />
      </div>

      <FormSubmitButton
        isLoading={isLoading}
        loadingText="Signing in..."
        buttonText="Sign in"
      />
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have a staff account?{" "}
          <a href="/staff/register" className="font-medium text-health-600 hover:text-health-500">
            Register here
          </a>
        </p>
      </div>
    </form>
  );
};

export default StaffLoginForm;
