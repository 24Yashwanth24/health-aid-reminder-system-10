
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const { toast } = useToast();
  
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 pending medication reminders to send",
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-health-600">Healthkart</span>
          <span className="ml-2 text-sm bg-health-200 text-health-700 px-2 py-1 rounded-md">Express</span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleNotificationClick}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">3</span>
        </Button>
        <span className="text-sm text-gray-600">Staff Portal</span>
      </div>
    </nav>
  );
};

export default Navbar;
