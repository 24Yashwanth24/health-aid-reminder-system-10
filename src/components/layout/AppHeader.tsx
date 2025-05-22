
import React from 'react';
import LogoutButton from '@/components/auth/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
}

const AppHeader = ({ title, subtitle, showLogout = true }: AppHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {showLogout && <LogoutButton />}
    </div>
  );
};

export default AppHeader;
