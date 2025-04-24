
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const UserRegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
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
    
    // For demo purposes - in a real app, this would be a secure registration flow
    setTimeout(() => {
      // Store the name in localStorage for demo purposes
      localStorage.setItem('userName', name);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      navigate('/user/login');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
      <div className="rounded-md shadow-sm space-y-3">
        <div>
          <label htmlFor="name" className="sr-only">Full Name</label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <Input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="sr-only">Phone Number</label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
          <Input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/user/login" className="font-medium text-health-600 hover:text-health-500">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default UserRegisterForm;
