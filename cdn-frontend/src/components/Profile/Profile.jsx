import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../ProtectedRoute/AuthProvider';

export const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [websites, setWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState('');
  const [isAddingWebsite, setIsAddingWebsite] = useState(false);

  // TODO: Replace with actual API calls
  const fetchWebsites = async () => {
    // Fetch websites from your backend
  };

  const addWebsite = async (domain) => {
    // Add website to your backend
    try {
      // API call to add website
      setWebsites([...websites, { domain, status: 'pending' }]);
      setNewWebsite('');
      setIsAddingWebsite(false);
    } catch (error) {
      console.error('Failed to add website:', error);
    }
  };

  const removeWebsite = async (domain) => {
    // Remove website from your backend
    try {
      // API call to remove website
      setWebsites(websites.filter(site => site.domain !== domain));
    } catch (error) {
      console.error('Failed to remove website:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white shadow rounded-lg">
        {/* Profile Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Profile Settings</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Authorized Websites Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Authorized Websites</h3>
            <button
              onClick={() => setIsAddingWebsite(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Add Website
            </button>
          </div>

          {/* Add Website Form */}
          {isAddingWebsite && (
            <div className="mb-4 p-4 bg-gray-50 rounded">
              <form onSubmit={(e) => {
                e.preventDefault();
                addWebsite(newWebsite);
              }}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newWebsite}
                    onChange={(e) => setNewWebsite(e.target.value)}
                    placeholder="Enter domain (e.g., example.com)"
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingWebsite(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Websites List */}
          <div className="space-y-4">
            {websites.map((website) => (
              <div
                key={website.domain}
                className="flex items-center justify-between p-4 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{website.domain}</p>
                  <p className="text-sm text-gray-500">
                    Status: <span className="capitalize">{website.status}</span>
                  </p>
                </div>
                <button
                  onClick={() => removeWebsite(website.domain)}
                  className="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 