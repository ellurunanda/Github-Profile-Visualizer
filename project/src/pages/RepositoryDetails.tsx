import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  GitFork, Star, Calendar, Eye, 
  AlertCircle, ArrowLeft, ExternalLink,
  Tag, GitBranch
} from 'lucide-react';
import { getRepositoryDetails, RepositoryDetails as RepoDetails } from '../services/api';
import { Loader } from '../components/Loader';
import { ErrorView } from '../components/ErrorView';

export const RepositoryDetails: React.FC = () => {
  const { repoName } = useParams<{ repoName: string }>();
  const [repository, setRepository] = useState<RepoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const username = localStorage.getItem('githubUsername');
    if (!username || !repoName) {
      navigate('/repositories');
      return;
    }
    
    fetchRepositoryDetails(username, repoName);
  }, [navigate, repoName]);
  
  const fetchRepositoryDetails = async (username: string, repo: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getRepositoryDetails(username, repo);
      setRepository(data);
    } catch (err) {
      console.error('Error fetching repository details:', err);
      setError('Failed to fetch repository details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      <button 
        onClick={() => navigate('/repositories')}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6"
      >
        <ArrowLeft size={18} />
        <span>Back to Repositories</span>
      </button>
      
      {loading ? (
        <Loader message="Fetching repository details..." />
      ) : error ? (
        <ErrorView 
          message={error} 
          onRetry={() => {
            const username = localStorage.getItem('githubUsername');
            if (username && repoName) fetchRepositoryDetails(username, repoName);
          }} 
        />
      ) : repository ? (
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden" data-testid="repositoryDetails">
          <div className="p-6 border-b border-[#30363d]">
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="text-neutral-500" size={20} />
              <h1 className="text-2xl font-bold">{repository.name}</h1>
            </div>
            
            {repository.description && (
              <p className="text-neutral-400 mt-2 mb-4">{repository.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {repository.topics && repository.topics.map(topic => (
                <span 
                  key={topic}
                  className="bg-[#1f6feb33] text-[#58a6ff] text-xs rounded-full px-3 py-1"
                >
                  {topic}
                </span>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              {repository.language && (
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: getLanguageColor(repository.language) }}
                  ></span>
                  <span className="text-neutral-300">{repository.language}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-neutral-400">
                <Star size={16} />
                <span>{repository.stargazers_count} stars</span>
              </div>
              
              <div className="flex items-center gap-1 text-neutral-400">
                <GitFork size={16} />
                <span>{repository.forks_count} forks</span>
              </div>
              
              <div className="flex items-center gap-1 text-neutral-400">
                <Eye size={16} />
                <span>{repository.watchers_count} watchers</span>
              </div>
              
              <div className="flex items-center gap-1 text-neutral-400">
                <AlertCircle size={16} />
                <span>{repository.open_issues_count} issues</span>
              </div>
              
              {repository.license && (
                <div className="flex items-center gap-1 text-neutral-400">
                  <Tag size={16} />
                  <span>{repository.license.name}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-[#0d1117]/50 p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <div className="text-sm text-neutral-400">
                  Updated on {formatDate(repository.updated_at)}
                </div>
              </div>
              
              <a 
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex"
              >
                <span>View on GitHub</span>
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};