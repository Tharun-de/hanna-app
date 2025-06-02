import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Edit3, Database, Settings, RefreshCw } from 'lucide-react';

interface SanityAdminPageProps {
  onClose: () => void;
  onRefresh: () => void;
}

const SanityAdminPage: React.FC<SanityAdminPageProps> = ({ onClose, onRefresh }) => {
  const HARDCODED_PASSWORD = "tharun123";
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (passwordInput === HARDCODED_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
        <motion.div 
          className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md text-white"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif">Admin Access</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter admin password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors"
            >
              Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4">
      <motion.div 
        className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif">Content Management</h2>
          <div className="flex space-x-2">
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-white px-3 py-1 rounded"
            >
              Logout
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Sanity Studio Access */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Edit3 className="text-purple-400 mr-3" size={24} />
              <h3 className="text-xl font-semibold">Sanity Studio</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Manage your poems, add new content, and edit existing poetry using the powerful Sanity Studio interface.
            </p>
            <a
              href="http://localhost:3333"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <span>Open Sanity Studio</span>
              <ExternalLink size={16} />
            </a>
          </div>

          {/* Refresh Content */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <RefreshCw className="text-blue-400 mr-3" size={24} />
              <h3 className="text-xl font-semibold">Refresh Content</h3>
            </div>
            <p className="text-gray-300 mb-4">
              After making changes in Sanity Studio, refresh the frontend to see your updates.
            </p>
            <button
              onClick={() => {
                onRefresh();
                onClose();
              }}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <RefreshCw size={16} />
              <span>Refresh Content</span>
            </button>
          </div>

          {/* Database Info */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Database className="text-green-400 mr-3" size={24} />
              <h3 className="text-xl font-semibold">Content Management</h3>
            </div>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Backend:</span>
                <span className="text-green-400">Sanity CMS</span>
              </div>
              <div className="flex justify-between">
                <span>Content Type:</span>
                <span>Poems</span>
              </div>
              <div className="flex justify-between">
                <span>Studio URL:</span>
                <span className="text-blue-400">localhost:3333</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Settings className="text-amber-400 mr-3" size={24} />
              <h3 className="text-xl font-semibold">How to Add Poems</h3>
            </div>
            <ol className="text-gray-300 space-y-2 list-decimal list-inside">
              <li>Click "Open Sanity Studio" above</li>
              <li>Navigate to "Poems" in the sidebar</li>
              <li>Click "Create" to add a new poem</li>
              <li>Fill in the title, content, author, and tags</li>
              <li>Set "Public" to true to make it visible</li>
              <li>Click "Publish" to save</li>
              <li>Return here and click "Refresh Content"</li>
            </ol>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SanityAdminPage; 