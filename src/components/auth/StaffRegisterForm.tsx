
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import FormHeader from './FormHeader';
import FormInput from './FormInput';
import FormSubmitButton from './FormSubmitButton';

const StaffRegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const checkExistingStaff = async () => {
    const { data: existingStaff, error: staffCheckError } = await supabase
      .from('staff')
      .select('*')
      .eq('email', email)
      .single();
    
    return { existingStaff, staffCheckError };
  };

  const handleLogin = (staffData: any) => {
    localStorage.setItem('authType', 'staff');
    localStorage.setItem('authEmail', email);
    localStorage.setItem('staffName', staffData.name);
    localStorage.setItem('staffId', staffData.id);
    
    toast({
      title: "Login successful",
      description: `Welcome back, ${staffData.name}!`,
    });
    
    navigate('/dashboard');
  };

  const createNewStaff = async () => {
    const { data: newStaffData, error: insertError } = await supabase
      .from('staff')
      .insert({
        name,
        email,
        department,
        phone,
        Pwd: password,
        user_id: crypto.randomUUID()
      })
      .select();
      
    if (insertError) {
      throw new Error(`Staff registration error: ${insertError.message}`);
    }
    
    return newStaffData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Check if this staff already exists
      const { existingStaff, staffCheckError } = await checkExistingStaff();

      if (existingStaff) {
        // Staff exists, check password
        if (existingStaff.Pwd === password) {
          // Password matches, log them in
          handleLogin(existingStaff);
          return;
        } else {
          throw new Error('A staff with this email already exists. Please use a different email or try to log in.');
        }
      }

      // Insert new staff
      const newStaffData = await createNewStaff();
      
      // Store staff info in local storage and navigate to dashboard
      handleLogin(newStaffData[0]);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
