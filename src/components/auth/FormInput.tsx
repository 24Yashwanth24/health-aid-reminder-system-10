
import React from 'react';
import { Input } from '@/components/ui/input';
import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  required?: boolean;
  autoComplete?: string;
}

const FormInput = ({ 
  id, 
  name, 
  type, 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  required = false,
  autoComplete 
}: FormInputProps) => {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-health-500 h-4 w-4" />
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 border-health-200 focus:border-health-500 focus:ring-health-500"
      />
    </div>
  );
};

export default FormInput;
