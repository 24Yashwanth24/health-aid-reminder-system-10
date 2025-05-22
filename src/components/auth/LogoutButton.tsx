
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const LogoutButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      
      // Clear local storage
      localStorage.removeItem('authType');
      localStorage.removeItem('authEmail');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
