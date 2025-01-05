import React, { useState } from 'react';
import { 
  Files, 
  Settings, 
  Link as LinkIcon,
  Share2, 
  Shield, 
  BarChart, 
  User,
  Home
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Dashboard Layout
const DashboardLayout = ({ children }) => (
  <div className="flex min-h-screen">
    <Sidebar />
    <main className="flex-1 bg-gray-50 p-6">
      {children}
    </main>
  </div>
);

// Sidebar Navigation
const Sidebar = () => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: 'Overview', path: '/overview' },
    { icon: Files, label: 'Files', path: '/files' },
    { icon: BarChart, label: 'Analytics', path: '/analytics' },
    { icon: Shield, label: 'Security', path: '/security' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="w-64 bg-white border-r">
      <div className="flex items-center justify-center">
        <img
          src="../../assets/images/logo.png"
          alt="Company Logo"
          className="mx-auto w-auto object-contain"
          style={{ maxWidth: '100%', height: '5rem' }}
        />
      </div>
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              location.pathname === item.path ? 'bg-gray-100 text-indigo-600' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// File Manager Component
const FileManager = () => {
  const [files, setFiles] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Files</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload New
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
          <span>Name</span>
          <span>Size</span>
          <span>Type</span>
          <span>Uploaded</span>
          <span>Actions</span>
        </div>
        
        {files.map((file) => (
          <div key={file.id} className="grid grid-cols-5 gap-4 p-4 border-b">
            <span>{file.name}</span>
            <span>{file.size}</span>
            <span>{file.type}</span>
            <span>{file.uploadDate}</span>
            <div className="flex space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <LinkIcon className="w-4 h-4" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    rateLimiting: true,
    originVerification: true,
    watermarking: false
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Security Settings</h2>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Rate Limiting</h3>
            <p className="text-sm text-gray-500">Prevent excessive downloads</p>
          </div>
          <input 
            type="checkbox"
            checked={settings.rateLimiting}
            onChange={(e) => setSettings({...settings, rateLimiting: e.target.checked})}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Origin Verification</h3>
            <p className="text-sm text-gray-500">Validate content requests</p>
          </div>
          <input 
            type="checkbox"
            checked={settings.originVerification}
            onChange={(e) => setSettings({...settings, originVerification: e.target.checked})}
            className="rounded"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Watermarking</h3>
            <p className="text-sm text-gray-500">Add digital watermarks to content</p>
          </div>
          <input 
            type="checkbox"
            checked={settings.watermarking}
            onChange={(e) => setSettings({...settings, watermarking: e.target.checked})}
            className="rounded"
          />
        </div>
      </div>
    </div>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [metrics, setMetrics] = useState({
    totalRequests: 0,
    bandwidth: 0,
    uniqueVisitors: 0
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border rounded p-2"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 mb-2">Total Requests</h3>
          <p className="text-3xl font-bold">{metrics.totalRequests}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 mb-2">Bandwidth Used</h3>
          <p className="text-3xl font-bold">{metrics.bandwidth} GB</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 mb-2">Unique Visitors</h3>
          <p className="text-3xl font-bold">{metrics.uniqueVisitors}</p>
        </div>
      </div>
    </div>
  );
};

// Overview Component
const Overview = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalStorage: 0,
    activeWebsites: 0,
    securityAlerts: 0
  });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Total Files</p>
              <p className="text-xl font-semibold">{stats.totalFiles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Storage Used</p>
              <p className="text-xl font-semibold">{stats.totalStorage} GB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Active Websites</p>
              <p className="text-xl font-semibold">{stats.activeWebsites}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Security Alerts</p>
              <p className="text-xl font-semibold">{stats.securityAlerts}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export { Overview,DashboardLayout, FileManager, SecuritySettings, AnalyticsDashboard };