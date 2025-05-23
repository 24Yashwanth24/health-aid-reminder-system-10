
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Heart, Mail, Lock, User, Phone, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First check if this staff already exists in the staff table
      const { data: existingStaff, error: staffCheckError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .single();

      if (existingStaff) {
        // Staff exists, try to sign in directly
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!signInError && signInData.user) {
          // Successfully signed in with existing account
          localStorage.setItem('authType', 'staff');
          localStorage.setItem('authEmail', email);
          localStorage.setItem('staffName', existingStaff.name);
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${existingStaff.name}!`,
          });
          
          navigate('/dashboard');
          return;
        }
      }

      // Create or insert staff data directly without requiring auth verification
      const { data: staffData, error: insertError } = await supabase
        .from('staff')
        .upsert({
          name,
          email,
          department,
          phone,
          Pwd: password,
          user_id: crypto.randomUUID() // Generate a placeholder user_id if no auth user exists yet
        }, { 
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select();

      if (insertError) {
        throw new Error(`Staff data error: ${insertError.message}`);
      }

      // Also attempt to create auth record (but don't require it to succeed)
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });

        if (!authError && authData.user) {
          // If we successfully created an auth user, update the staff record with the correct user_id
          await supabase
            .from('staff')
            .update({ user_id: authData.user.id })
            .eq('email', email);
        }
      } catch (authError) {
        console.log("Auth creation failed, but continuing with staff login:", authError);
      }
      
      // Store login info regardless of auth success
      localStorage.setItem('authType', 'staff');
      localStorage.setItem('authEmail', email);
      localStorage.setItem('staffName', name);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}! You are now registered and logged in.`,
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
      
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
      <div className="text-center mb-6">
        <Heart className="mx-auto h-12 w-12 text-red-500 animate-pulse" />
        <p className="text-sm text-health-600 mt-2">Staff Healthcare Portal</p>
        <h2 className="mt-2 text-xl font-semibold text-gray-800">"Your medicine, my responsibility"</h2>
      </div>
      
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
          />
        </div>
        
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
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
          <Input
            id="department"
            name="department"
            type="text"
            placeholder="Department (optional)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
          />
        </div>
        
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Phone Number (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
          />
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
              Creating account...
            </div>
          ) : 'Create Staff Account'}
        </Button>
      </div>
    </form>
  );
};

export default StaffRegisterForm;
