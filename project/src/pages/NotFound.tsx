import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4" data-testid="notFound">
      <div className="w-full max-w-md">
        <img 
          src="https://github.githubassets.com/images/modules/notifications/inbox-zero.svg" 
          alt="not found" 
          className="max-w-xs mx-auto mb-8"
        />
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-neutral-400 mb-8">
          Oops! The page you're looking for can't be found.
        </p>
        
        <button 
          onClick={() => navigate('/')}
          className="btn btn-primary flex items-center gap-2 mx-auto"
        >
          <Home size={18} />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
};