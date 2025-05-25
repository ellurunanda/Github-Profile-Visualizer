import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2, PieChart, LineChart, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart as RechartsLineChart, Line, 
  PieChart as RechartsPieChart, Pie, Cell, Sector 
} from 'recharts';
import { getContributionStats, ContributionStats } from '../services/api';
import { Loader } from '../components/Loader';
import { ErrorView } from '../components/ErrorView';

export const Analysis: React.FC = () => {
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const navigate = useNavigate();
  
  useEffect(() => {
    const username = localStorage.getItem('githubUsername');
    if (!username) {
      navigate('/');
      return;
    }
    
    fetchAnalysisData(username);
  }, [navigate]);
  
  const fetchAnalysisData = async (username: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getContributionStats(username);
      setStats(data);
    } catch (err) {
      console.error('Error fetching contribution stats:', err);
      setError('Failed to fetch contribution statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'
  ];
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { 
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value 
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.language}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff">{`${payload.language}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`${(percent * 100).toFixed(2)}%`}
        </text>
      </g>
    );
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contribution Analysis</h2>
      
      {loading ? (
        <Loader message="Analyzing GitHub contributions..." />
      ) : error ? (
        <ErrorView 
          message={error} 
          onRetry={() => {
            const username = localStorage.getItem('githubUsername');
            if (username) fetchAnalysisData(username);
          }} 
        />
      ) : stats ? (
        <div className="space-y-8" data-testid="analysisData">
          {/* Stats Overview */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Contribution Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
              <div className="p-4 bg-[#0d1117] rounded-md">
                <div className="text-2xl font-bold text-primary-400">{stats.totalContributions}</div>
                <div className="text-sm text-neutral-400 mt-1">Contributions</div>
              </div>
              <div className="p-4 bg-[#0d1117] rounded-md">
                <div className="text-2xl font-bold text-primary-400">{stats.totalCommits}</div>
                <div className="text-sm text-neutral-400 mt-1">Commits</div>
              </div>
              <div className="p-4 bg-[#0d1117] rounded-md">
                <div className="text-2xl font-bold text-primary-400">{stats.totalPRs}</div>
                <div className="text-sm text-neutral-400 mt-1">Pull Requests</div>
              </div>
              <div className="p-4 bg-[#0d1117] rounded-md">
                <div className="text-2xl font-bold text-primary-400">{stats.totalIssues}</div>
                <div className="text-sm text-neutral-400 mt-1">Issues</div>
              </div>
              <div className="p-4 bg-[#0d1117] rounded-md">
                <div className="text-2xl font-bold text-primary-400">{stats.totalStars}</div>
                <div className="text-sm text-neutral-400 mt-1">Stars Received</div>
              </div>
            </div>
          </div>
          
          {/* Contribution Trend */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Contribution Trend</h3>
              <LineChart className="text-primary-400" size={24} />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                  data={stats.contributionsByMonth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="month" stroke="#8b949e" />
                  <YAxis stroke="#8b949e" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#161b22', 
                      borderColor: '#30363d' 
                    }}
                    labelStyle={{ color: '#c9d1d9' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="contributions" 
                    stroke="#3b82f6" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Popular Repositories */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Popular Repositories</h3>
              <BarChart2 className="text-secondary-400" size={24} />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.popularRepositories}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="name" stroke="#8b949e" />
                  <YAxis stroke="#8b949e" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#161b22', 
                      borderColor: '#30363d' 
                    }}
                    labelStyle={{ color: '#c9d1d9' }}
                  />
                  <Legend />
                  <Bar dataKey="stars" fill="#2dc4a8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Language Distribution */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Language Distribution</h3>
              <PieChart className="text-accent-400" size={24} />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={stats.languageDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                    onMouseEnter={onPieEnter}
                  >
                    {stats.languageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#161b22', 
                      borderColor: '#30363d' 
                    }}
                    labelStyle={{ color: '#c9d1d9' }}
                    formatter={(value: number, name: string, props: any) => {
                      return [`${value.toFixed(2)}%`, props.payload.language];
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* View More */}
          <a 
            href="#" 
            className="block bg-[#161b22] border border-[#30363d] rounded-lg p-6 hover:bg-[#161b22]/80 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">View More Analytics</h3>
                <p className="text-neutral-400 mt-1">
                  Explore commit history for the last 6 months
                </p>
              </div>
              <ChevronRight size={24} className="text-primary-400" />
            </div>
          </a>
        </div>
      ) : null}
    </div>
  );
};