import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Feather, Heart, Siren as Fire, Star, Sparkles, BookOpen, Menu, X, Settings, Twitter, Instagram, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import WritingSection from './components/WritingSection';
import AdminPage from './components/AdminPage';
// import { allWritings as importedWritings, WritingData } from './data/writings'; // Will fetch from API

// At the top with other constants or inside the App component if preferred
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'; 

// Define available accent colors
export type AccentColor = 'rose' | 'purple' | 'blue' | 'red' | 'amber' | 'emerald';

// Consistent type for Writing data, based on API/Prisma model
export interface WritingData {
  id: string;
  title?: string | null;
  content: string;
  sectionId?: string | null;
  mood?: string | null;
  date?: string | null; 
  likes?: number | null;
  createdAt: string; // ISO Date string from Prisma
  updatedAt: string; // ISO Date string from Prisma
  section?: SectionData | null; // Populated by Prisma include if specified
}

// Type for raw Section data from API/Prisma
export interface SectionData {
  id: string;
  title: string;
  iconName: string;
  accent: AccentColor;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Type for Section configuration used in frontend state (includes React icon component)
export type SectionConfig = Omit<SectionData, 'createdAt' | 'updatedAt'> & {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  navClass: string;
  bgClass: string;
};

// New type for sections combined with their writings
interface SectionWithWritings extends SectionConfig {
  writings: WritingData[];
}

// Helper to map icon names (strings) to actual components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Heart,
  Star,
  Sparkles,
  Fire,
  Feather,
  // Add any other icons you use
};

// Define a type for social links (matches SiteSettings model, adjusted for frontend naming)
export interface SocialLinks {
  twitter: string; // Corresponds to twitterUrl in SiteSettings
  instagram: string; // Corresponds to instagramUrl
  snapchat: string; // Corresponds to snapchatUrl
}

// Type for settings data from API/Prisma
interface SiteSettingsData {
  id: string;
  mainHeader?: string | null;
  twitterUrl?: string | null;
  instagramUrl?: string | null;
  snapchatUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Helper function to create UI-specific class names from accent color
const getAccentClasses = (accent: AccentColor) => {
  return {
    iconClass: `text-${accent}-400`,
    navClass: `hover:text-${accent}-400`,
    bgClass: `bg-${accent}-400`,
  };
};

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for data fetched from API
  const [writings, setWritings] = useState<WritingData[]>([]);
  const [sections, setSections] = useState<SectionConfig[]>([]); // Holds SectionConfig with mapped icons
  const [mainHeader, setMainHeader] = useState<string>('Fictitious Scribbles');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ twitter: '', instagram: '', snapchat: '' });

  const fetchData = useCallback(async (dataType: 'all' | 'writings' | 'sections' | 'settings' = 'all') => {
    if (dataType === 'all') {
      setIsLoading(true);
      setError(null);
    }
    
    try {
      // For 'all' or 'writings', update writings state
      if (dataType === 'all' || dataType === 'writings') {
        const writingsRes = await fetch(`${API_BASE_URL}/poems`);
        if (!writingsRes.ok) {
          throw new Error(`Failed to fetch writings: ${writingsRes.status} ${writingsRes.statusText}`);
        }
        const newWritings = await writingsRes.json() as WritingData[];
        setWritings(newWritings);
      }

      // For 'all' or 'sections', update sections state
      if (dataType === 'all' || dataType === 'sections') {
        const sectionsRes = await fetch(`${API_BASE_URL}/sections`); 
        if (!sectionsRes.ok) {
          throw new Error(`Failed to fetch sections: ${sectionsRes.status} ${sectionsRes.statusText}`);
        }
        const fetchedSectionsData = await sectionsRes.json() as SectionData[];
        const newSectionConfigs = fetchedSectionsData
          .sort((a, b) => a.order - b.order)
          .map(sec => ({
            ...sec,
            icon: iconMap[sec.iconName] || BookOpen, 
            ...getAccentClasses(sec.accent as AccentColor),
          }));
        setSections(newSectionConfigs);
      }
      
      // For 'all' or 'settings', update settings states
      if (dataType === 'all' || dataType === 'settings') {
        const settingsRes = await fetch(`${API_BASE_URL}/settings`); 
        if (!settingsRes.ok) {
          throw new Error(`Failed to fetch settings: ${settingsRes.status} ${settingsRes.statusText}`);
        }
        const settingsData = await settingsRes.json() as SiteSettingsData;
        setMainHeader(settingsData.mainHeader || 'Fictitious Scribbles');
        setSocialLinks({
          twitter: settingsData.twitterUrl || '',
          instagram: settingsData.instagramUrl || '',
          snapchat: settingsData.snapchatUrl || '',
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load content';
      setError(errorMessage);
      if (dataType === 'all') setMainHeader('Error loading content');
    } finally {
      if (dataType === 'all') setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep this with an empty dependency array for initial load logic, specific updates will be handled by AdminPage

  useEffect(() => {
    fetchData('all');
  }, [fetchData]); // Now fetchData is stable due to useCallback

  const sectionsWithWritings = useMemo((): SectionWithWritings[] => {
    const categorizedSections: SectionWithWritings[] = sections.map(section => ({
      ...section,
      writings: writings.filter(writing => writing.sectionId === section.id)
    }));

    const uncategorizedWritings = writings.filter(writing => !writing.sectionId);

    if (uncategorizedWritings.length > 0) {
      const uncategorizedSectionData: SectionConfig = {
        id: 'uncategorized',
        title: 'Uncategorized',
        iconName: 'BookOpen',
        accent: 'emerald',
        order: sections.length + 1, // Ensure order is distinct
        icon: iconMap['BookOpen'] || BookOpen,
        iconClass: getAccentClasses('emerald').iconClass,
        navClass: getAccentClasses('emerald').navClass,
        bgClass: getAccentClasses('emerald').bgClass,
      };
      const uncategorizedSection: SectionWithWritings = {
        ...uncategorizedSectionData,
        writings: uncategorizedWritings
      };
      return [...categorizedSections, uncategorizedSection].sort((a,b) => a.order - b.order);
    }

    return categorizedSections.sort((a,b) => a.order - b.order); // Also sort here if no uncategorized
  }, [writings, sections, iconMap]);

  // Helper function to handle smooth scrolling and highlight
  const handlePoemLinkClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string, poemId: string) => {
    event.preventDefault();
    const poemElement = document.getElementById(poemId);
    const sectionElement = document.getElementById(sectionId); 

    if (poemElement) {
      poemElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (sectionElement) {
        sectionElement.classList.add('highlight-scroll-target');
        setTimeout(() => {
          sectionElement.classList.remove('highlight-scroll-target');
        }, 1500); 
      }
    } else if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  // Function to handle clicks on links within the mobile menu
  const handleMobileLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); 
    const href = event.currentTarget.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    const targetPoemId = href.substring(1);
    
    let targetSectionId: string | null = null;
    for (const section of sectionsWithWritings) {
      if (section.writings.some(w => w.id === targetPoemId)) {
        targetSectionId = section.id;
        break;
      }
    }

    if (targetSectionId) {
      handlePoemLinkClick(event, targetSectionId, targetPoemId);
    } else {
      const targetElement = document.getElementById(targetPoemId); 
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setIsMobileMenuOpen(false);
    }
  };
  
  // Error state
  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
          </div>
          <h1 className="text-2xl font-serif mb-4">Unable to load content</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => fetchData('all')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading && writings.length === 0 && sections.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-2xl font-serif">Loading Content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition-colors z-50"
        title="Admin Panel"
      >
        <Settings size={24} />
      </button>

      {showAdmin && (
        <AdminPage
          writings={writings} 
          mainHeader={mainHeader}
          sections={sections} 
          iconMap={iconMap}
          socialLinks={socialLinks}
          
          refreshData={fetchData} 
        />
      )}

      {!showAdmin && (
        <>
          <header className="relative h-screen flex items-center justify-center overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center z-0 opacity-30"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1533134486753-c833f0ed4866?auto=format&fit=crop&q=80')"
              }}
            />
            <div className="relative z-10 text-center px-4">
              <motion.h1 
                className="text-5xl md:text-7xl font-serif mb-6 text-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {mainHeader}
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl max-w-2xl mx-auto text-gray-300 italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                A sanctuary for poetry, prose, and the depths of human emotion
              </motion.p>
            </div>
          </header>

          <nav className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="text-lg font-semibold">{mainHeader}</div>
              <div className="hidden md:flex items-center justify-center space-x-6 flex-wrap">
                {sectionsWithWritings.map((section) => (
                  <div key={section.id} className="relative group my-1">
                    <a 
                      href={`#${section.id}`} 
                      className={`relative flex items-center space-x-2 ${section.navClass} transition-colors pb-1`}
                    >
                      <section.icon className={section.iconClass} />
                      <span>{section.title}</span>
                      <motion.div
                        className={`absolute bottom-[-2px] left-0 right-0 h-[2px] ${section.bgClass}`}
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }} 
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ transformOrigin: 'left' }} 
                      />
                    </a>
                    {section.writings && section.writings.length > 0 && (
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max max-w-xs p-3 \
                                   bg-gray-800/90 backdrop-blur-sm rounded-md shadow-lg \
                                   opacity-0 invisible group-hover:opacity-100 group-hover:visible \
                                   transition-all duration-200 ease-out scale-95 group-hover:scale-100\
                                   transform-gpu origin-top z-50"
                      >
                        <div className="flex flex-col space-y-2">
                          {section.writings.map((writing) => (
                            <a 
                              key={writing.id}
                              href={`#${writing.id}`}
                              onClick={(e) => handlePoemLinkClick(e, section.id, writing.id!)}
                              className={`block text-sm text-gray-300 hover:text-white hover:${section.iconClass} transition-colors whitespace-nowrap`}
                              title={writing.title || 'Untitled'}
                            >
                              {writing.title || 'Untitled'}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="md:hidden"> 
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-label="Open main menu"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </nav>

          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 p-6 md:hidden overflow-y-auto"
            >
              <div className="flex justify-end mb-6">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-label="Close main menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                {sectionsWithWritings.map((section) => (
                  <div key={`${section.id}-mobile`}>
                    <a 
                      href={`#${section.id}`}
                      onClick={handleMobileLinkClick} 
                      className={`flex items-center space-x-3 p-2 rounded-md text-lg font-semibold ${section.navClass} transition-colors`}
                    >
                      <section.icon className={section.iconClass} />
                      <span>{section.title}</span>
                    </a>
                    {section.writings && section.writings.length > 0 && (
                      <div className="mt-2 pl-8 space-y-2 border-l border-gray-700 ml-4">
                        {section.writings.map((writing) => (
                          <a 
                            key={writing.id}
                            href={`#${writing.id}`}
                            onClick={handleMobileLinkClick}
                            className={`block text-base text-gray-400 hover:text-gray-100 hover:${section.iconClass} transition-colors py-1 pl-6`}
                            title={writing.title || 'Untitled'}
                          >
                            {writing.title || 'Untitled'}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </motion.div>
          )}

          <main className="max-w-4xl mx-auto px-4 py-12">
            {sectionsWithWritings.length > 0 ? (
              sectionsWithWritings.map((section) => (
                <WritingSection
                  key={section.id}
                  id={section.id}
                  title={section.title}
                  icon={<section.icon className={section.iconClass} />}
                  writings={section.writings}
                  accent={section.accent as AccentColor}
                />
              ))
            ) : (
              // This fallback might now only appear if there are truly no writings and no sections.
              // Or if writings exist but somehow sectionsWithWritings is still empty (shouldn't happen with uncategorized logic)
              !isLoading && <p className="text-center text-gray-500">No poems have been published yet.</p>
            )}
          </main>
        </>
      )}

      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400">
          <p className="font-serif italic mb-4">
            "In the depth of winter, I finally learned that within me there lay an invincible summer."
            <br />
            — Albert Camus
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter size={24} />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors" aria-label="Instagram">
                <Instagram size={24} />
              </a>
            )}
            {socialLinks.snapchat && (
              <a href={socialLinks.snapchat} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors" aria-label="Snapchat">
                <MessageSquare size={24} /> {/* Placeholder for Snapchat */}
              </a>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Penned by Yancey
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;