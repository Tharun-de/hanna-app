'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2 } from 'lucide-react'; // Added Edit3, Trash2 icons
import { motion } from 'framer-motion'; // Assuming framer-motion is installed
import { addPoem, getPoemsForAdmin, updatePoem, deletePoem } from './actions'; // Import the new server action

// Define a basic type for our Poem data for the form and list
interface Poem {
  id: string; // Assuming Prisma uses string IDs (e.g., CUID)
  title: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PoemFormData {
  title: string;
  content: string;
}

// Modal Component (copied from old AdminPage)
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[110] p-4">
      <motion.div 
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg relative text-white"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default function AdminPage() {
  // IMPORTANT: Replace with a more secure method in a real app, e.g., environment variable or proper auth
  const HARDCODED_PASSWORD = "tharun123"; 
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [formData, setFormData] = useState<PoemFormData>({ title: '', content: '' });
  const [showAddPoemModal, setShowAddPoemModal] = useState(false);
  const [editingPoem, setEditingPoem] = useState<Poem | null>(null); // For storing poem being edited
  const [adminPoems, setAdminPoems] = useState<Poem[]>([]); // State for poems list

  const [isPending, startTransition] = useTransition();
  const [isLoadingPoems, setIsLoadingPoems] = useState(true);

  // Function to fetch poems
  const fetchAdminPoems = async () => {
    setIsLoadingPoems(true);
    const result = await getPoemsForAdmin();
    if (result.success && result.poems) {
      // Ensure poems is not undefined before setting state
      setAdminPoems(result.poems as Poem[]); // Cast to Poem[] as Prisma types might be more complex
    } else {
      alert(`Error fetching poems: ${result.error || 'Unknown error'}`);
      setAdminPoems([]); // Set to empty array on error
    }
    setIsLoadingPoems(false);
  };

  // Fetch poems on mount if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminPoems();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddPoemModal = () => {
    setEditingPoem(null); // Clear any editing state
    setFormData({ title: '', content: '' });
    setShowAddPoemModal(true);
  };

  const handleLogin = () => {
    if (passwordInput === HARDCODED_PASSWORD) {
      setIsAuthenticated(true);
      // fetchAdminPoems() will be called by useEffect due to isAuthenticated change
    } else {
      alert('Incorrect password');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput(''); 
    setAdminPoems([]); // Clear poems on logout
  };

  // Moved placeholder functions inside the component
  const handleEditPoem = (poem: Poem) => {
    setEditingPoem(poem);
    setFormData({ title: poem.title || '', content: poem.content });
    setShowAddPoemModal(true); // Reuse the same modal for editing
    // The modal title and save button text will need to adapt based on `editingPoem`
    alert(`Editing: ${poem.title || 'Untitled Poem'}. Form populated. (Save logic TBD)`);
  };

  const handleDeletePoem = async (poemId: string) => {
    if (window.confirm("Are you sure you want to delete this poem?")) {
      startTransition(async () => {
        const result = await deletePoem(poemId);
        if (result.success) {
          alert(result.message || 'Poem deleted successfully!');
          fetchAdminPoems(); // Refresh the list
        } else {
          alert(`Error deleting poem: ${result.error || 'Unknown error'}`);
        }
      });
    }
  };

  const handleSavePoem = async () => {
    if (!formData.title && !formData.content) {
      alert("Title or Content is required.");
      return;
    }
    startTransition(async () => {
      let result;
      let actionType: 'add' | 'update';

      if (editingPoem) {
        actionType = 'update';
        result = await updatePoem({ 
          id: editingPoem.id, 
          title: formData.title || null,
          content: formData.content
        });
      } else {
        actionType = 'add';
        result = await addPoem({ 
          title: formData.title || null, 
          content: formData.content 
        });
      }

      if (result.success) {
        alert(result.message || `Poem ${actionType}ed successfully!`);
        setShowAddPoemModal(false);
        setFormData({ title: '', content: '' });
        setEditingPoem(null);
        fetchAdminPoems();
      } else {
        // result will have an error property based on our action definitions
        alert(`Error ${actionType}ing poem: ${result.error || 'Unknown error'}`);
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 mb-4 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md font-semibold transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel - Poem Management</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="mb-8">
        <button
          onClick={handleOpenAddPoemModal}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-semibold flex items-center transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          Add New Poem
        </button>
      </div>
      
      {/* Display Poems List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Poems</h2>
        {isLoadingPoems ? (
          <p className="text-gray-400">Loading poems...</p>
        ) : adminPoems.length === 0 ? (
          <p className="text-gray-400">No poems added yet.</p>
        ) : (
          <div className="space-y-4">
            {adminPoems.map((poem) => (
              <div key={poem.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400">{poem.title || 'Untitled'}</h3>
                  <p className="text-gray-400 text-sm truncate max-w-md">{poem.content}</p>
                  <p className="text-xs text-gray-500">Last updated: {new Date(poem.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditPoem(poem)} 
                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-md text-white transition-colors disabled:opacity-50"
                    title="Edit Poem"
                    disabled={isPending}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeletePoem(poem.id)} 
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition-colors disabled:opacity-50"
                    title="Delete Poem"
                    disabled={isPending}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={showAddPoemModal} 
        onClose={() => { 
          if (isPending) return;
          setShowAddPoemModal(false); 
          setEditingPoem(null); 
        }} 
        title={isPending ? (editingPoem ? "Updating Poem..." : "Adding Poem...") : (editingPoem ? "Edit Poem" : "Add New Poem")}
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSavePoem(); }}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Poem Title"
              disabled={isPending}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
            <textarea
              name="content"
              id="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              className="w-full p-3 bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Write your poem here..."
              disabled={isPending}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => { 
                if (!isPending) { 
                  setShowAddPoemModal(false); 
                  setEditingPoem(null); 
                }
              }}
              className="py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? (editingPoem ? 'Saving Changes...' : 'Saving Poem...') : (editingPoem ? 'Save Changes' : 'Save Poem')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
} 