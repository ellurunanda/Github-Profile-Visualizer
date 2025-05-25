import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, MapPin, Building, Link, Twitter, Users, Calendar } from 'lucide-react';
import { getProfileDetails, ProfileDetails } from '../services/api';
import { Loader } from '../components/Loader';
import { ErrorView } from '../components/ErrorView';

export const Home: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [profileData, setProfileData] = useState<ProfileDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Check if we have a username in localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('githubUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      fetchProfileData(savedUsername);
    }
  }, []);

  const fetchProfileData = async (usernameToFetch: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getProfileDetails(usernameToFetch);
      setProfileData(data);
      localStorage.setItem('githubUsername', usernameToFetch);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch GitHub profile. Please check the username and try again.');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    fetchProfileData(username);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">GitHub Profile Visualizer</h2>
        
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-testid="usernameInput"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary flex items-center gap-2"
            data-testid="searchButton"
            disabled={loading || !username.trim()}
          >
            <Search size={18} />
            <span>Search</span>
          </button>
        </form>
      </div>

      {loading ? (
        <Loader message="Fetching GitHub profile..." />
      ) : error ? (
        <ErrorView 
          message={error} 
          onRetry={() => fetchProfileData(username)} 
        />
      ) : profileData ? (
        <div className="bg-[#161b22] rounded-lg overflow-hidden shadow-lg animate-fadeIn" data-testid="profileData">
          <div className="p-6 border-b border-[#30363d]">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img 
                src={profileData.avatar_url} 
                alt={`${profileData.name || username}'s avatar`} 
                className="w-24 h-24 rounded-full border-4 border-[#0d1117]"
              />
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold">{profileData.name || username}</h1>
                {profileData.bio && <p className="text-neutral-400 mt-2">{profileData.bio}</p>}
                
                <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                  {profileData.company && (
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Building size={16} className="text-neutral-500" />
                      <span>{profileData.company}</span>
                    </div>
                  )}
                  
                  {profileData.location && (
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <MapPin size={16} className="text-neutral-500" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                  
                  {profileData.blog && (
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Link size={16} className="text-neutral-500" />
                      <a href={profileData.blog.startsWith('http') ? profileData.blog : `https://${profileData.blog}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  
                  {profileData.twitter_username && (
                    <div className="flex items-center gap-2 text-sm text-neutral-300">
                      <Twitter size={16} className="text-neutral-500" />
                      <a href={`https://twitter.com/${profileData.twitter_username}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        @{profileData.twitter_username}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-neutral-300">
                    <Calendar size={16} className="text-neutral-500" />
                    <span>Joined {formatDate(profileData.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 divide-x divide-[#30363d] bg-[#0d1117]/50">
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{profileData.followers.toLocaleString()}</div>
              <div className="text-sm text-neutral-400">Followers</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{profileData.following.toLocaleString()}</div>
              <div className="text-sm text-neutral-400">Following</div>
            </div>
            <div className="py-4 text-center">
              <div className="text-2xl font-bold">{profileData.public_repos.toLocaleString()}</div>
              <div className="text-sm text-neutral-400">Repositories</div>
            </div>
          </div>
          
          <div className="p-6 flex justify-center gap-4">
            <button 
              onClick={() => navigate('/repositories')} 
              className="btn btn-primary"
              data-testid="viewReposButton"
            >
              View Repositories
            </button>
            <button 
              onClick={() => navigate('/analysis')} 
              className="btn btn-secondary"
              data-testid="viewAnalysisButton"
            >
              View Analysis
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#161b22] rounded-lg p-8 text-center" data-testid="emptyState">
          <Users size={64} className="mx-auto text-neutral-700 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Profile Selected</h3>
          <p className="text-neutral-400 mb-6">
            Enter a GitHub username to visualize their profile, repositories, and contribution data.
          </p>
        </div>
      )}
    </div>
  );
};