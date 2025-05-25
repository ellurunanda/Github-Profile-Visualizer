import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Github, BarChart3, FolderGit2, Home as HomeIcon } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem('githubUsername');

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#161b22] border-b border-[#30363d] py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <Github size={28} className="text-[#3b82f6]" />
            <h1 className="text-xl font-bold">GitHub Profile Visualizer</h1>
          </div>
          {username && (
            <div className="text-sm text-neutral-400">
              Viewing: <span className="font-medium text-white">{username}</span>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      
      {username && location.pathname !== '/' && (
        <nav className="bg-[#161b22] border-t border-[#30363d] py-3 fixed bottom-0 w-full">
          <div className="container mx-auto flex justify-around">
            <button 
              onClick={() => navigate('/')}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                isActive('/') ? 'text-[#3b82f6]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <HomeIcon size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => navigate('/repositories')}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                isActive('/repositories') ? 'text-[#3b82f6]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FolderGit2 size={20} />
              <span className="text-xs mt-1">Repos</span>
            </button>
            <button 
              onClick={() => navigate('/analysis')}
              className={`flex flex-col items-center p-2 rounded-md transition-colors ${
                isActive('/analysis') ? 'text-[#3b82f6]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart3 size={20} />
              <span className="text-xs mt-1">Analysis</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};