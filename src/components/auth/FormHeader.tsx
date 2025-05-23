
import React from 'react';
import { Heart } from 'lucide-react';

interface FormHeaderProps {
  portalType: string;
  tagline: string;
}

const FormHeader = ({ portalType, tagline }: FormHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <Heart className="mx-auto h-12 w-12 text-red-500 animate-pulse" />
      <p className="text-sm text-health-600 mt-2">Staff Healthcare Portal</p>
      <h2 className="mt-2 text-xl font-semibold text-gray-800">{tagline}</h2>
    </div>
  );
};

export default FormHeader;
