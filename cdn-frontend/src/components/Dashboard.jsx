import React, { useState } from 'react';
import { 
  Files, 
  Settings, 
  Link, 
  Share2, 
  Shield, 
  BarChart 
} from 'lucide-react';

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
  const navItems = [
    { icon: Files, label: 'Files', path: '/files' },
    { icon: BarChart, label: 'Analytics', path: '/analytics' },
    { icon: Shield, label: 'Security', path: '/security' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="w-64 bg-white border-r">
      <div className="p-4">
        <h1 className="text-xl font-bold">Obscura</h1>
      </div>
      <div className="space-y-1">
        {navItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </a>
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
                <Link className="w-4 h-4" />
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

export { DashboardLayout, FileManager, SecuritySettings, AnalyticsDashboard };