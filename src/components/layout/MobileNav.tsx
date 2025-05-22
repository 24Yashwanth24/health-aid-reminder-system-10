
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const MobileNav = ({ isMobileMenuOpen, setIsMobileMenuOpen }: MobileNavProps) => {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 md:hidden">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="mr-2"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        <span className="text-lg font-semibold text-health-600">HealthKart Express</span>
      </div>
    </div>
  );
};
