import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, GitFork, Star, Calendar, Code } from 'lucide-react';
import { getRepositories, Repository } from '../services/api';
import { Loader } from '../components/Loader';
import { ErrorView } from '../components/ErrorView';

export const Repositories: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const username = localStorage.getItem('githubUsername');
    if (!username) {
      navigate('/');
      return;
    }
    
    fetchRepositories(username);
  }, [navigate]);
  
  const fetchRepositories = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRepositories(username);
      setRepositories(data);
      setFilteredRepos(data);
    } catch (err) {
      console.error('Error fetching repositories:', err);
      setError('Failed to fetch repositories. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRepos(repositories);
      return;
    }
    
    const filtered = repositories.filter(repo => 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredRepos(filtered);
  }, [searchTerm, repositories]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: '#f1e05a',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      Go: '#00ADD8',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Swift: '#F05138',
    };
    
    return colors[language] || '#8b949e';
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Repositories</h2>
        
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search repositories..."
            className="w-full md:w-64 bg-[#0d1117] border border-[#30363d] rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            data-testid="searchRepoInput"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
        </div>
      </div>
      
      {loading ? (
        <Loader message="Fetching repositories..." />
      ) : error ? (
        <ErrorView 
          message={error} 
          onRetry={() => {
            const username = localStorage.getItem('githubUsername');
            if (username) fetchRepositories(username);
          }} 
        />
      ) : filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="repositoriesList">
          {filteredRepos.map(repo => (
            <div
              key={repo.id}
              className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 cursor-pointer hover:border-[#6e7681] transition-colors"
              onClick={() => navigate(`/repositories/${repo.name}`)}
              data-testid={`repo-${repo.name}`}
            >
              <h3 className="text-lg font-semibold text-primary-400 mb-2">{repo.name}</h3>
              
              {repo.description && (
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{repo.description}</p>
              )}
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {repo.language && (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                    <span className="text-neutral-300">{repo.language}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-neutral-400">
                  <Star size={16} />
                  <span>{repo.stargazers_count}</span>
                </div>
                
                <div className="flex items-center gap-1 text-neutral-400">
                  <GitFork size={16} />
                  <span>{repo.forks_count}</span>
                </div>
                
                <div className="flex items-center gap-1 text-neutral-400">
                  <Calendar size={16} />
                  <span>Updated on {formatDate(repo.updated_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#161b22] rounded-lg p-8 text-center" data-testid="emptyRepositories">
          <Code size={64} className="mx-auto text-neutral-700 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Repositories Found</h3>
          <p className="text-neutral-400">
            {searchTerm ? 
              `No repositories match "${searchTerm}"` : 
              "This user doesn't have any public repositories yet."}
          </p>
        </div>
      )}
    </div>
  );
};