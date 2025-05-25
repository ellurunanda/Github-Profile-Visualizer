import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

const graphqlInstance = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  }
});

export interface ProfileDetails {
  avatar_url: string;
  name: string;
  bio: string;
  company: string;
  location: string;
  twitter_username: string;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
  blog: string;
  created_at: string;
}

export interface Repository {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

export interface RepositoryDetails {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
  topics: string[];
  open_issues_count: number;
  watchers_count: number;
  license: {
    name: string;
  } | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface ContributionStats {
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  popularRepositories: {
    name: string;
    stars: number;
  }[];
  contributionsByMonth: {
    month: string;
    contributions: number;
  }[];
  languageDistribution: {
    language: string;
    percentage: number;
  }[];
}

export const getProfileDetails = async (username: string): Promise<ProfileDetails> => {
  const response = await instance.get(`/users/${username}`);
  return response.data;
};

export const getRepositories = async (username: string): Promise<Repository[]> => {
  const response = await instance.get(`/users/${username}/repos`);
  return response.data;
};

export const getRepositoryDetails = async (username: string, repoName: string): Promise<RepositoryDetails> => {
  const response = await instance.get(`/repos/${username}/${repoName}`);
  return response.data;
};

export const getContributionStats = async (username: string): Promise<ContributionStats> => {
  // Fetch basic user data and repositories
  const [userResponse, reposResponse] = await Promise.all([
    instance.get(`/users/${username}`),
    instance.get(`/users/${username}/repos`)
  ]);

  const repos = reposResponse.data;
  
  // Calculate language distribution
  const languageCount: { [key: string]: number } = {};
  let totalSize = 0;
  
  repos.forEach((repo: any) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + (repo.size || 0);
      totalSize += repo.size || 0;
    }
  });

  const languageDistribution = Object.entries(languageCount)
    .map(([language, size]) => ({
      language,
      percentage: (size / totalSize) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Get contribution data for the last 6 months
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const months = [];
  for (let d = sixMonthsAgo; d <= today; d.setMonth(d.getMonth() + 1)) {
    months.push(new Date(d).toLocaleString('default', { month: 'short', year: 'numeric' }));
  }

  // Simulate contribution data (in a real app, this would come from GitHub's GraphQL API)
  const contributionsByMonth = months.map(month => ({
    month,
    contributions: Math.floor(Math.random() * 100) + 20 // Placeholder data
  }));

  // Calculate total stats
  const totalStars = repos.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
  const popularRepositories = repos
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map((repo: any) => ({
      name: repo.name,
      stars: repo.stargazers_count
    }));

  // Fetch PR and Issue counts
  const [prsResponse, issuesResponse] = await Promise.all([
    instance.get(`/search/issues?q=author:${username}+type:pr`),
    instance.get(`/search/issues?q=author:${username}+type:issue`)
  ]);

  return {
    totalContributions: contributionsByMonth.reduce((acc, month) => acc + month.contributions, 0),
    totalCommits: repos.reduce((acc: number, repo: any) => acc + repo.size, 0), // Using size as a proxy
    totalPRs: prsResponse.data.total_count,
    totalIssues: issuesResponse.data.total_count,
    totalStars,
    popularRepositories,
    contributionsByMonth,
    languageDistribution
  };
};