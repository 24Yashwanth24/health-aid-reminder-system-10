import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Heart, Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
      // First check if the staff exists in the staff table
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .eq('Pwd', password)
        .single();

      if (staffError || !staffData) {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
      
      // Staff exists in the table, try to authenticate with Supabase Auth
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        // If there's an auth error but we found the staff in our table, 
        // create an auth account for them
        if (signInError) {
          // Create auth user for existing staff
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: staffData.name,
              }
            }
          });
          
          // Update the staff record with the auth user ID if created successfully
          if (!signUpError && signUpData.user) {
            await supabase
              .from('staff')
              .update({ user_id: signUpData.user.id })
              .eq('id', staffData.id);
          }
        }
      } catch (authError) {
        console.log("Auth operation failed, but continuing with staff login:", authError);
      }
      
      // Store auth state in local storage
      localStorage.setItem('authType', 'staff');
      localStorage.setItem('authEmail', email);
      localStorage.setItem('staffName', staffData.name);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${staffData.name}!`,
      });
      
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

  const handleSuccessfulLogin = async (data: any) => {
    try {
      // Check if the user exists in the staff table
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (staffError) {
        // Try to find staff by email instead
        const { data: emailStaffData, error: emailStaffError } = await supabase
          .from('staff')
          .select('*')
          .eq('email', email)
          .single();
        
        if (emailStaffError || !emailStaffData) {
          // Create new staff record if not found
          const { error: createError } = await supabase
            .from('staff')
            .insert({
              user_id: data.user.id,
              email: email,
              name: email.split('@')[0], // Use email as default name
              Pwd: password // Store password in staff table
            });
          
          if (createError) {
            throw createError;
          }
          
          // Store auth state in local storage
          localStorage.setItem('authType', 'staff');
          localStorage.setItem('authEmail', email);
          localStorage.setItem('staffName', email.split('@')[0]);
          
          toast({
            title: "Login successful",
            description: `Welcome, ${email.split('@')[0]}!`,
          });
        } else {
          // Update the existing staff record with user_id if found by email
          const { error: updateError } = await supabase
            .from('staff')
            .update({ user_id: data.user.id })
            .eq('id', emailStaffData.id);
          
          if (updateError) {
            throw updateError;
          }
          
          // Store auth state in local storage
          localStorage.setItem('authType', 'staff');
          localStorage.setItem('authEmail', email);
          localStorage.setItem('staffName', emailStaffData.name);
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${emailStaffData.name}!`,
          });
        }
      } else {
        // Store auth state in local storage
        localStorage.setItem('authType', 'staff');
        localStorage.setItem('authEmail', email);
        localStorage.setItem('staffName', staffData.name);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${staffData.name}!`,
        });
      }
      
      navigate('/dashboard'); // Direct navigation to dashboard
    } catch (error: any) {
      console.error('Authorization error:', error);
      toast({
        title: "Authorization failed",
        description: error.message || "You are not authorized as staff.",
        variant: "destructive",
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <Heart className="mx-auto h-12 w-12 text-red-500 animate-pulse" />
        <p className="text-sm text-health-600 mt-2">Staff Healthcare Portal</p>
        <h2 className="mt-2 text-xl font-semibold text-gray-800">"Your medicine, my responsibility"</h2>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-health-600 focus:ring-health-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-health-600 hover:text-health-500">
            Forgot your password?
          </a>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full bg-health-600 hover:bg-health-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </div>
          ) : 'Sign in'}
        </Button>
      </div>
      
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
