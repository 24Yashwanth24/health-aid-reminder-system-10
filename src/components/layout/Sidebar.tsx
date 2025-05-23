import React from 'react';
import {
  Home,
  LayoutDashboard,
  User,
  Calendar,
  Bell,
  Truck,
  CreditCard,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import LogoutButton from '@/components/auth/LogoutButton';

const Sidebar = () => {
  return (
    <div className="hidden border-r bg-gray-100/40 dark:bg-secondary/80 md:block">
      <div className="flex min-h-screen flex-col space-y-2 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Pharmacy Admin
          </h2>
          <div className="space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 ${isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                  : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 ${isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                  : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Patients
            </NavLink>
            <NavLink
              to="/reminders"
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 ${isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                  : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <Bell className="mr-2 h-4 w-4" />
              Reminders
            </NavLink>
            <NavLink
              to="/deliveries"
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 ${isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                  : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <Truck className="mr-2 h-4 w-4" />
              Deliveries
            </NavLink>
            <NavLink
              to="/payments"
              className={({ isActive }) =>
                `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 ${isActive
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                  : 'text-gray-500 dark:text-gray-400'
                }`
              }
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Payments
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
