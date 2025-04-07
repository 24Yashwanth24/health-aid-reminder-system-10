
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, Users, Pill, Truck, CreditCard, Home, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Patients', icon: Users, path: '/patients' },
  { name: 'Medications', icon: Pill, path: '/medications' },
  { name: 'Reminders', icon: Calendar, path: '/reminders' },
  { name: 'Deliveries', icon: Truck, path: '/deliveries' },
  { name: 'Payments', icon: CreditCard, path: '/payments' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Remove authentication state
    localStorage.removeItem("isAuthenticated");
    
    // Show toast notification
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="w-64 h-full bg-health-100 border-r border-gray-200 flex flex-col">
      <div className="py-6 px-4 flex-grow">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-health-500 text-white"
                    : "text-gray-700 hover:bg-health-200 hover:text-health-700"
                )}
              >
                <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-white" : "text-health-500")} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Logout button at the bottom */}
      <div className="mt-auto py-4 px-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm rounded-md text-gray-700 hover:bg-health-200 hover:text-health-700 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3 text-health-500" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
