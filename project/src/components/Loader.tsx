import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 30, message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8" data-testid="loader">
      <Loader2 className="animate-spin text-primary-400" size={size} />
      <p className="mt-4 text-neutral-400">{message}</p>
    </div>
  );
};