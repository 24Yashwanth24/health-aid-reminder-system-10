
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FormHeader from './FormHeader';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';
import RememberMeCheckbox from './RememberMeCheckbox';
import ForgotPasswordLink from './ForgotPasswordLink';

const StaffLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if the staff exists in the staff table with matching email and password
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .eq('Pwd', password)
        .single();

      if (staffError || !staffData) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
      
      // Store staff info in local storage
      localStorage.setItem('authType', 'staff');
      localStorage.setItem('authEmail', email);
      localStorage.setItem('staffName', staffData.name);
      localStorage.setItem('staffId', staffData.id);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${staffData.name}!`,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
