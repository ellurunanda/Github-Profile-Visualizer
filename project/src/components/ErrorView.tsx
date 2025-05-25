import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ 
  message = 'Something went wrong', 
  onRetry 
}) => {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 text-center"
      data-testid="errorView"
    >
      <AlertCircle className="text-error-500 mb-4" size={40} />
      <h3 className="text-xl font-semibold mb-2">Error</h3>
      <p className="text-neutral-400 mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn btn-primary"
          data-testid="retryButton"
        >
          Try Again
        </button>
      )}
    </div>
  );
};