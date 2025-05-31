import React, { useState, useEffect, ComponentType } from 'react';
import { Edit3, Trash2, PlusCircle, Search, Filter, Settings, BookOpen as DefaultSectionIcon, BarChart2, ArrowUpCircle, ArrowDownCircle, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { WritingData, SectionConfig, AccentColor, SocialLinks } from '../App';

// UPDATED API_BASE_URL
const API_BASE_URL = 'http://localhost:3000/api'; // Points to our new Next.js API

// Modal Component
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

const accentColorOptions: { label: string; value: AccentColor }[] = [
  { label: 'Rose', value: 'rose' },
  { label: 'Purple', value: 'purple' },
  { label: 'Blue', value: 'blue' },
  { label: 'Red', value: 'red' },
  { label: 'Amber', value: 'amber' },
  { label: 'Emerald', value: 'emerald' },
];

interface AdminPageProps {
  writings: WritingData[];
  mainHeader: string;
  sections: SectionConfig[];
  iconMap: Record<string, ComponentType<{ className?: string }>>;
  socialLinks: SocialLinks;
  refreshData: (dataType?: 'all' | 'writings' | 'sections' | 'settings') => Promise<void>;
}

interface WritingFormData extends Omit<WritingData, 'id' | 'createdAt' | 'updatedAt' | 'section'> {
  id?: string; 
  title: string; 
  content: string;
  // Other fields like sectionId, mood, date, likes will be ignored by the new API for poems
}


const AdminPage: React.FC<AdminPageProps> = ({
  writings,
  mainHeader,
  sections,
  iconMap,
  socialLinks,
  refreshData,
}) => {
  const HARDCODED_PASSWORD = "tharun123"; 
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'analytics' | 'settings'>('content');
  
  const [currentWritings, setCurrentWritings] = useState<WritingData[]>(writings); // Renaming this to currentPoems might be a next step
  const [editingWriting, setEditingWriting] = useState<WritingData | null>(null); // Renaming this to editingPoem might be a next step
  const [formData, setFormData] = useState<Partial<WritingFormData>>({ title: '', content: '' });
  const [showAddEditModal, setShowAddEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSection, setFilterSection] = useState('all');

  const [currentMainHeader, setCurrentMainHeader] = useState(mainHeader);
  const [currentSections, setCurrentSections] = useState<SectionConfig[]>(sections);
  const [editingSection, setEditingSection] = useState<SectionConfig | null>(null);
  const [sectionFormData, setSectionFormData] = useState<Partial<Omit<SectionConfig, 'icon' | 'iconClass' | 'navClass' | 'bgClass'>>>({ title: '', accent: 'emerald', iconName: 'BookOpen'});
  const [showSectionModal, setShowSectionModal] = useState(false);

  const [currentSocialLinks, setCurrentSocialLinks] = useState<SocialLinks>(socialLinks);

  const availableIcons = Object.keys(iconMap).map(name => ({ name, IconComponent: iconMap[name] }));

  useEffect(() => {
    setCurrentWritings(writings);
  }, [writings]);

  useEffect(() => {
    setCurrentMainHeader(mainHeader);
  }, [mainHeader]);

  useEffect(() => {
    setCurrentSections(sections);
  }, [sections]);

  useEffect(() => {
    setCurrentSocialLinks(socialLinks);
  }, [socialLinks]);

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

  const handleOpenAddModal = () => {
    setEditingWriting(null); 
    // Keep other fields for now, they will be ignored by API if not part of Poem model
    setFormData({ title: '', content: '', sectionId: sections[0]?.id || undefined, likes: 0, mood: '', date: '' });
    setShowAddEditModal(true);
  };

  const handleOpenEditModal = (writing: WritingData) => {
    setEditingWriting(writing);
    // Keep other fields for now
    const { id, title, content, sectionId, mood, date, likes } = writing;
    setFormData({
      id,
      title: title || '',
      content: content || '',
      sectionId: sectionId || undefined,
      mood: mood || '',
      date: date || '',
      likes: likes || 0,
    });
    setShowAddEditModal(true);
  };
  
  const handleDeleteWriting = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) { // Changed message slightly
      try {
        // UPDATED fetch URL
        const response = await fetch(`${API_BASE_URL}/poems/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to delete item and could not parse error.' }));
          throw new Error(errorData.message || 'Failed to delete item.');
        }
        alert('Item deleted successfully.');
        await refreshData('writings'); // Ensure refresh completes
      } catch (error) {
        console.error('Error deleting item:', error);
        alert(`Error deleting item: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  
  const handleSaveWriting = async () => {
    if (!formData.content && !formData.title) { 
        alert("Title or Content is required.");
        return;
    }
    // Payload to match the Poem API (title, content, sectionId)
    const payload: { 
      id?: string; 
      title: string | null; 
      content: string;
      sectionId?: string | null;
      date?: string | null; // Add date to payload type
      mood?: string | null; // Add mood to payload type
      likes?: number | null; // Add likes to payload type
    } = {
      title: formData.title || null, 
      content: formData.content!, 
    };

    if (formData.sectionId && formData.sectionId !== '__ADD_NEW_SECTION__' && formData.sectionId !== '') {
      payload.sectionId = formData.sectionId;
    } else {
      payload.sectionId = null; // Explicitly set to null if not provided or is an invalid placeholder
    }

    // Add date, mood, and likes to payload if they exist in formData
    if (formData.date) payload.date = formData.date;
    if (formData.mood) payload.mood = formData.mood;
    // Ensure likes is a number, default to 0 if not, or handle as per your preference
    payload.likes = (typeof formData.likes === 'number' && !isNaN(formData.likes)) ? formData.likes : 0;

    if (editingWriting?.id) {
        payload.id = editingWriting.id;
    }

    try {
      let response;
      if (editingWriting && editingWriting.id) {
        // UPDATED fetch URL for PUT
        response = await fetch(`${API_BASE_URL}/poems/${editingWriting.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), // Send simplified payload
        });
      } else {
        // UPDATED fetch URL for POST
        response = await fetch(`${API_BASE_URL}/poems`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), // Send simplified payload
        });
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Operation failed and could not parse error.' }));
        throw new Error(errorData.message || 'Failed to save item.');
      }
      await response.json(); 
      alert(`Item ${editingWriting ? 'updated' : 'saved'} successfully!`);
      await refreshData('writings'); // Ensure refresh completes
      setShowAddEditModal(false);
      setEditingWriting(null); 
      setFormData({ title: '', content: '', sectionId: undefined, mood: '', date: '', likes: 0 });
    } catch (error) {
      console.error('Error saving item:', error);
      alert(`Error saving item: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSectionChangeForWriting = (sectionId: string) => {
    if (sectionId === '__ADD_NEW_SECTION__') {
      setShowAddEditModal(false); // Close current modal
      handleOpenAddSectionModal(); // Open section creation modal
    } else {
      setFormData(prev => ({ ...prev, sectionId }));
    }
  };


  // Handlers for Sections (CRUD)
  const handleOpenAddSectionModal = () => {
    setEditingSection(null);
    setSectionFormData({ title: '', accent: 'emerald', iconName: 'BookOpen' }); // Default new section values
    setShowSectionModal(true);
  };

  const handleOpenEditSectionModal = (section: SectionConfig) => {
    setEditingSection(section);
    const { icon: _icon, iconClass: _iconClass, navClass: _navClass, bgClass: _bgClass, ...formDataFromSection } = section;
    setSectionFormData(formDataFromSection); 
    setShowSectionModal(true);
  };

  const handleDeleteSection = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this section? This will also unassign poems from this section.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/sections/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to delete section and could not parse error.' }));
          throw new Error(errorData.message || 'Failed to delete section.');
        }
        alert('Section deleted successfully.');
        await refreshData('all'); // Ensure refresh completes (sections and writings)
      } catch (error) {
        console.error('Error deleting section:', error);
        alert(`Error deleting section: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleSaveSection = async () => {
    if (!sectionFormData.title || !sectionFormData.accent || !sectionFormData.iconName) {
        alert("Section title, accent, and icon are required.");
        return;
    }
    const payload: Partial<Omit<SectionConfig, 'icon' | 'iconClass' | 'navClass' | 'bgClass'>> = {
        title: sectionFormData.title,
        accent: sectionFormData.accent,
        iconName: sectionFormData.iconName,
        order: sectionFormData.order 
    };
    try {
      let response;
      if (editingSection && editingSection.id) {
        response = await fetch(`${API_BASE_URL}/sections/${editingSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Operation failed and could not parse error.' }));
        throw new Error(errorData.message || 'Failed to save section.');
      }
      await response.json(); // Result not used
      alert(`Section ${editingSection ? 'updated' : 'saved'} successfully!`);
      await refreshData('sections'); // Ensure refresh completes
      setShowSectionModal(false);
      setEditingSection(null);
      setSectionFormData({ title: '', accent: 'emerald', iconName: 'BookOpen' });
    } catch (error) {
      console.error('Error saving section:', error);
      alert(`Error saving section: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleSectionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSectionFormData(prev => ({ ...prev, [name]: value as AccentColor | string }));
  };

  const handleSectionOrderChange = async (index: number, direction: 'up' | 'down') => {
    const orderedSections = [...currentSections]; // Create a mutable copy
    const sectionToMove = orderedSections[index];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= orderedSections.length) return; // Boundary check

    // Swap orders
    const tempOrder = sectionToMove.order;
    sectionToMove.order = orderedSections[targetIndex].order;
    orderedSections[targetIndex].order = tempOrder;
    
    // Update UI optimistically first by re-sorting based on new order
    orderedSections.sort((a, b) => a.order - b.order);
    setCurrentSections(orderedSections);

    try {
      // Create an array of promises for all updates
      const updatePromises = orderedSections.map(section =>
        fetch(`${API_BASE_URL}/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: section.title, iconName: section.iconName, accent: section.accent, order: section.order }),
        })
      );
      
      const responses = await Promise.all(updatePromises);
      
      responses.forEach(response => {
        if (!response.ok) {
          // Consider more sophisticated error handling here, e.g., collecting all errors
          console.error('Failed to update one or more section orders', response.statusText);
        }
      });

      await refreshData('sections'); // Refresh from server to ensure consistency
    } catch (error) {
      console.error('Error updating section orders:', error);
      alert('Failed to update section orders. Please refresh.');
      await refreshData('sections'); // Revert to server state on error
    }
  };


  // Filtered and Searched Writings for Display
  const filteredWritings = currentWritings
    .filter(writing => 
      filterSection === 'all' || writing.sectionId === filterSection || (filterSection === 'uncategorized' && !writing.sectionId)
    )
    .filter(writing => 
      (writing.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      writing.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Analytics Data
  const totalWritings = writings.length; // Use prop for analytics consistency
  const totalLikes = writings.reduce((sum, w) => sum + (w.likes || 0), 0);
  const averageLikes = totalWritings > 0 ? (totalLikes / totalWritings).toFixed(1) : 0;
  const mostLikedWriting = writings.length > 0 ? writings.reduce((prev, current) => ((prev.likes || 0) > (current.likes || 0)) ? prev : current) : null;

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setCurrentSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSaveSocialLinks = async () => {
    try {
    const payload = {
        // Field names here should match what the API expects (e.g., twitterUrl)
        twitterUrl: currentSocialLinks.twitter,
        instagramUrl: currentSocialLinks.instagram,
        snapchatUrl: currentSocialLinks.snapchat,
    };
      const response = await fetch(`${API_BASE_URL}/settings`, { // Updated endpoint
        method: 'POST', // Changed to POST, as our API route uses POST for upsert
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to save social links');
      alert('Social links updated successfully!');
      await refreshData('settings'); // Added await
    } catch (error) {
      console.error('Error saving social links:', error);
      alert('Error saving social links');
    }
  };

  const handleSaveMainHeader = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, { // Updated endpoint
        method: 'POST', // Changed to POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mainHeader: currentMainHeader }),
      });
      if (!response.ok) throw new Error('Failed to save main header');
      alert('Main header updated successfully!');
      await refreshData('settings'); // Added await
    } catch (error) {
      console.error('Error saving main header:', error);
      alert('Error saving main header');
    }
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-[100]">
        <motion.div 
          className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-sm text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
          <input 
            type="password"
            value={passwordInput} 
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password"
            className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  // Main Admin Panel
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 text-white p-2 sm:p-4 md:p-8 z-[100] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center mb-3 sm:mb-0"><Settings className="mr-2 sm:mr-3 h-6 w-6 sm:h-7 sm:w-7" />Admin Panel</h1>
          <button 
            onClick={handleLogout} 
            className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors self-start sm:self-center"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 border-b border-gray-700">
          <nav className="-mb-px flex flex-wrap sm:flex-nowrap space-x-1" aria-label="Tabs">
            {[
              { name: 'Content', tab: 'content', icon: DefaultSectionIcon },
              { name: 'Analytics', tab: 'analytics', icon: BarChart2 },
              { name: 'Settings', tab: 'settings', icon: Settings }
            ].map((item) => {
              const CurrentIcon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.tab as 'content' | 'analytics' | 'settings')}
                  className={`flex items-center py-2.5 px-2 sm:px-3 md:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors grow sm:grow-0
                    ${activeTab === item.tab
                      ? 'border-blue-500 text-blue-500'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    }`}
                >
                  <CurrentIcon className={`mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 ${activeTab === item.tab ? 'text-blue-500' : 'text-gray-500 group-hover:text-gray-400'}`} />
                  <span className="hidden sm:inline">{item.name === 'Content' ? 'Content Management' : item.name === 'Analytics' ? 'Analytics Dashboard' : 'Site Settings'}</span>
                  <span className="sm:hidden">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'content' && (
            <motion.div
              key="content-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Site Header Editing */}
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-200 flex items-center"><Edit3 className="mr-2"/>Main Site Header</h3>
                <input 
                  type="text"
                  value={currentMainHeader}
                  onChange={(e) => setCurrentMainHeader(e.target.value)}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                  placeholder="Enter main site header"
                />
                <button 
                  onClick={handleSaveMainHeader}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                  Save Header
                </button>
              </div>

              {/* Sections Management */}
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-200">Manage Sections</h3>
                    <button onClick={handleOpenAddSectionModal} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-md flex items-center justify-center text-sm sm:text-base transition-colors">
                        <PlusCircle size={18} className="mr-2" /> Add New Section
                    </button>
                </div>
                {currentSections.length === 0 ? (
                    <p className="text-gray-500 italic">No sections created yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {currentSections.map((section, index) => {
                            const SectionIcon = section.icon || DefaultSectionIcon;
                            return (
                                <li key={section.id} className="bg-gray-700/50 p-3 sm:p-4 rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0">
                                    <div className="flex items-center w-full sm:w-auto">
                                        <SectionIcon className={`mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 ${section.iconClass || 'text-gray-400'}`} />
                                        <span className="font-medium text-sm sm:text-basetruncate" title={section.title}>{section.title}</span>
                                        <span className="ml-2 px-1.5 sm:px-2 py-0.5 text-xs rounded-full whitespace-nowrap" style={{ backgroundColor: section.accent, color: 'white' }}>{section.accent}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 sm:space-x-2 self-end sm:self-center">
                                        <button onClick={() => handleSectionOrderChange(index, 'up')} disabled={index === 0} className="p-1 sm:p-1.5 text-gray-400 hover:text-white disabled:opacity-50"><ArrowUpCircle size={18} /></button>
                                        <button onClick={() => handleSectionOrderChange(index, 'down')} disabled={index === currentSections.length - 1} className="p-1 sm:p-1.5 text-gray-400 hover:text-white disabled:opacity-50"><ArrowDownCircle size={18} /></button>
                                        <button onClick={() => handleOpenEditSectionModal(section)} className="p-1 sm:p-1.5 text-blue-400 hover:text-blue-300"><Edit3 size={18}/></button>
                                        <button onClick={() => handleDeleteSection(section.id)} className="p-1 sm:p-1.5 text-red-400 hover:text-red-300"><Trash2 size={18}/></button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
              </div>

              {/* Writings Management */}
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-200">Manage Writings</h3>
                    <button onClick={handleOpenAddModal} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-md flex items-center justify-center text-sm sm:text-base transition-colors">
                        <PlusCircle size={18} className="mr-2" /> Add New Writing
                    </button>
                </div>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder="Search by title or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 bg-gray-700 border border-gray-600 rounded-md text-sm sm:text-base focus:ring-blue-500"
                        />
                        <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-auto sm:w-auto" size={16}/>
                    </div>
                    <div className="relative min-w-[150px] sm:min-w-[200px]">
                        <select 
                            value={filterSection} 
                            onChange={(e) => setFilterSection(e.target.value)}
                            className="w-full p-2.5 sm:p-3 pl-9 sm:pl-10 bg-gray-700 border border-gray-600 rounded-md appearance-none text-sm sm:text-base focus:ring-blue-500"
                        >
                            <option value="all">All Sections</option>
                            <option value="uncategorized">Uncategorized</option>
                            {currentSections.map(sec => (
                                <option key={sec.id} value={sec.id}>{sec.title}</option>
                            ))}
                        </select>
                        <Filter className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-auto sm:w-auto" size={16}/>
                    </div>
                </div>

                {/* Writings Table */}
                {filteredWritings.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">No writings found matching your criteria.</p>
                ) : (
                    <div className="overflow-x-auto shadow border-b border-gray-700 rounded-md">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">Section</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden lg:table-cell">Date</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">Likes</th>
                                    <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {filteredWritings.map(writing => {
                                    const sectionTitle = currentSections.find(s => s.id === writing.sectionId)?.title || 'Uncategorized';
                                    return (
                                        <tr key={writing.id}>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-100 max-w-[100px] sm:max-w-xs truncate" title={writing.title || 'Untitled'}>{writing.title || 'Untitled'}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 hidden md:table-cell">{sectionTitle}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 hidden lg:table-cell">{writing.date ? new Date(writing.date).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-400 hidden sm:table-cell">{writing.likes || 0}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium space-x-1 sm:space-x-2">
                                                <button onClick={() => handleOpenEditModal(writing)} className="text-blue-400 hover:text-blue-300 p-1"><Edit3 size={16}/></button>
                                                <button onClick={() => handleDeleteWriting(writing.id!)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            >
                {/* Analytics Cards */}
                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Total Writings</h4>
                    <p className="text-2xl sm:text-3xl font-semibold">{totalWritings}</p>
                </div>
                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Total Likes</h4>
                    <p className="text-2xl sm:text-3xl font-semibold">{totalLikes}</p>
                </div>
                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Avg. Likes</h4>
                    <p className="text-2xl sm:text-3xl font-semibold">{averageLikes}</p>
                </div>
                <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-400 mb-1">Most Liked</h4>
                    {mostLikedWriting && (
                        <div className="bg-gray-700 p-3 sm:p-4 rounded-md">
                            <h4 className="font-semibold text-sm sm:text-base mb-1 text-blue-400">Most Popular Writing</h4>
                            <p className="text-xs sm:text-sm">{mostLikedWriting.title || 'Untitled'} - {mostLikedWriting.likes || 0} likes</p>
                        </div>
                    )}
                </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 md:space-y-8"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 border-b pb-2 sm:pb-3 border-gray-700 flex items-center"><Settings className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6"/>Site Settings</h2>
              
              {/* Main Header Editing */}
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-200 flex items-center"><Edit3 className="mr-2 h-5 w-5"/>Main Site Header</h3>
                <input 
                  type="text"
                  value={currentMainHeader}
                  onChange={(e) => setCurrentMainHeader(e.target.value)}
                  className="w-full p-2.5 sm:p-3 bg-gray-700 border border-gray-600 rounded-md text-sm sm:text-base focus:ring-blue-500"
                  placeholder="Enter main site header"
                />
                <button 
                  onClick={handleSaveMainHeader}
                  className="mt-4 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base transition-colors"
                >
                  Save Header
                </button>
              </div>

              {/* Social Media Links */}
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-200 flex items-center"><LinkIcon className="mr-2 h-5 w-5" />Social Media Links</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label htmlFor="twitterLink" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">X (Twitter) URL</label>
                    <input 
                      id="twitterLink"
                      type="url"
                      value={currentSocialLinks.twitter}
                      onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                      className="w-full p-2.5 sm:p-3 bg-gray-700 border border-gray-600 rounded-md text-sm sm:text-base focus:ring-blue-500"
                      placeholder="https://x.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label htmlFor="instagramLink" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Instagram URL</label>
                    <input 
                      id="instagramLink"
                      type="url"
                      value={currentSocialLinks.instagram}
                      onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                      className="w-full p-2.5 sm:p-3 bg-gray-700 border border-gray-600 rounded-md text-sm sm:text-base focus:ring-blue-500"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  <div>
                    <label htmlFor="snapchatLink" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1">Snapchat URL</label>
                    <input 
                      id="snapchatLink"
                      type="url"
                      value={currentSocialLinks.snapchat}
                      onChange={(e) => handleSocialLinkChange('snapchat', e.target.value)}
                      className="w-full p-2.5 sm:p-3 bg-gray-700 border border-gray-600 rounded-md text-sm sm:text-base focus:ring-blue-500"
                      placeholder="https://snapchat.com/add/yourusername"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleSaveSocialLinks}
                  className="mt-5 sm:mt-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base transition-colors"
                >
                  Save Social Links
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Writing Modal */}
        <Modal isOpen={showAddEditModal} onClose={() => {setShowAddEditModal(false); setEditingWriting(null); setFormData({ title: '', content: '' });}} title={editingWriting ? 'Edit Writing' : 'Add New Writing'}>
            <div className="space-y-3 sm:space-y-4">
                <div>
                    <label htmlFor="title" className="block text-xs sm:text-sm font-medium">Title</label>
                    <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleInputChange} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md" />
                </div>
                <div>
                    <label htmlFor="sectionId" className="block text-xs sm:text-sm font-medium">Section</label>
                    <select name="sectionId" id="sectionId" value={formData.sectionId || ''} onChange={(e) => handleSectionChangeForWriting(e.target.value)} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md">
                        <option value="">Uncategorized</option>
                        {currentSections.map(sec => (
                            <option key={sec.id} value={sec.id}>{sec.title}</option>
                        ))}
                        <option value="__ADD_NEW_SECTION__">+ Add new section...</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="content" className="block text-xs sm:text-sm font-medium">Content</label>
                    <textarea name="content" id="content" value={formData.content || ''} onChange={handleInputChange} rows={8} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md scrollbar-thin sm:text-base text-xs"></textarea>
                </div>
                <div>
                    <label htmlFor="mood" className="block text-xs sm:text-sm font-medium">Mood (Optional)</label>
                    <input type="text" name="mood" id="mood" value={formData.mood || ''} onChange={handleInputChange} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-xs sm:text-sm font-medium">Date (Optional)</label>
                    <input type="date" name="date" id="date" value={formData.date || ''} onChange={handleInputChange} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md" />
                </div>
                 <div>
                    <label htmlFor="likes" className="block text-xs sm:text-sm font-medium">Likes (Optional)</label>
                    <input type="number" name="likes" id="likes" value={formData.likes || 0} onChange={(e) => setFormData(prev => ({...prev, likes: parseInt(e.target.value) || 0}))} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md" />
                </div>
                <button onClick={handleSaveWriting} className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-2 sm:py-2.5 rounded-md">{editingWriting ? 'Save Changes' : 'Add Writing'}</button>
            </div>
        </Modal>

        {/* Add/Edit Section Modal */}
        <Modal isOpen={showSectionModal} onClose={() => {setShowSectionModal(false); setEditingSection(null);}} title={editingSection ? 'Edit Section' : 'Add New Section'}>
            <div className="space-y-3 sm:space-y-4">
                <div>
                    <label htmlFor="sectionTitle" className="block text-xs sm:text-sm font-medium">Title</label>
                    <input type="text" name="title" id="sectionTitle" value={sectionFormData.title || ''} onChange={handleSectionFormChange} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md" />
                </div>
                <div>
                    <label htmlFor="sectionAccent" className="block text-xs sm:text-sm font-medium">Accent</label>
                    <select name="accent" id="sectionAccent" value={sectionFormData.accent || 'emerald'} onChange={handleSectionFormChange} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md">
                        {accentColorOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="sectionIcon" className="block text-xs sm:text-sm font-medium">Icon</label>
                    <select name="iconName" id="sectionIcon" value={sectionFormData.iconName || 'BookOpen'} onChange={handleSectionFormChange} className="mt-1 w-full p-2 sm:p-2.5 bg-gray-700 border-gray-600 rounded-md">
                        {availableIcons.map(icon => (
                            <option key={icon.name} value={icon.name}>{icon.name}</option>
                        ))}
                    </select>
                </div>
                 <button onClick={handleSaveSection} className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-2 sm:py-2.5 rounded-md">{editingSection ? 'Save Section' : 'Add Section'}</button>
            </div>
        </Modal>

      </div>
    </div>
  );
};

export default AdminPage; 