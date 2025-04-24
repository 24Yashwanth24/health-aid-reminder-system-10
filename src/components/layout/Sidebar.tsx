
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, Users, Truck, CreditCard, Home } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Patients', icon: Users, path: '/patients' },
  { name: 'Reminders', icon: Calendar, path: '/reminders' },
  { name: 'Deliveries', icon: Truck, path: '/deliveries' },
  { name: 'Payments', icon: CreditCard, path: '/payments' },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-health-100 border-r border-gray-200">
      <div className="py-6 px-4">
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
    </div>
  );
};

export default Sidebar;
