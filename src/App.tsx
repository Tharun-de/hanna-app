import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Feather, Heart, Siren as Fire, Star, Sparkles, BookOpen, Menu, X, Settings, Twitter, Instagram, MessageSquare, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WritingSection from './components/WritingSection';
import AdminPage from './components/AdminPage';
// import { allWritings as importedWritings, WritingData } from './data/writings'; // Will fetch from API <<<< KEEP COMMENTED

// Define available accent colors
export type AccentColor = 'rose' | 'purple' | 'blue' | 'red' | 'amber' | 'emerald';

// Consistent type for Writing data
export interface WritingData {
  id: string;
  title?: string | null;
  content: string;
  sectionId?: string | null;
  mood?: string | null;
  date?: string | null; 
  likes?: number | null;
  createdAt: string; 
  updatedAt: string; 
  section?: SectionData | null;
}

// Type for raw Section data
export interface SectionData {
  id: string;
  title: string;
  iconName: string;
  accent: AccentColor;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Type for Section configuration
export type SectionConfig = Omit<SectionData, 'createdAt' | 'updatedAt'> & {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  navClass: string;
  bgClass: string;
};

// Helper to map icon names
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Heart,
  Star,
  Sparkles,
  Fire,
  Feather,
};

export interface SocialLinks {
  twitter: string;
  instagram: string;
  snapchat: string;
}

// Type for settings data from API/Prisma - NO LONGER USED
// interface SiteSettingsData { ... }

// Helper function to create UI-specific class names
const getAccentClasses = (accent: AccentColor) => {
  return {
    iconClass: `text-${accent}-400`,
    navClass: `hover:text-${accent}-400`,
    bgClass: `bg-${accent}-400`,
  };
};

// Example Static Data
const exampleSections: SectionConfig[] = [
  { 
    id: 'section1', 
    title: 'Welcome', 
    iconName: 'BookOpen', 
    accent: 'blue', 
    order: 1,
    icon: iconMap['BookOpen'] || BookOpen,
    ...getAccentClasses('blue')
  },
];

const exampleWritings: WritingData[] = [
  { 
    id: 'writing1', 
    title: 'Static Welcome Note', 
    content: 'This is a statically loaded piece of content. The backend connections have been removed.', 
    sectionId: 'section1', 
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
    mood: 'Neutral',
    date: new Date().toLocaleDateString(),
    likes: 0
  },
];


function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false); // Default to false
  const [error, setError] = useState<string | null>(null); // Default to null

  const [writings, setWritings] = useState<WritingData[]>(exampleWritings);
  const [sections, setSections] = useState<SectionConfig[]>(exampleSections); 
  const [mainHeader, setMainHeader] = useState<string>('Hanna (Static Mode)');
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ twitter: '#', instagram: '#', snapchat: '#' });

  const sectionsWithWritings = useMemo(() => {
    return sections.map(section => ({
      ...section,
      writings: writings.filter(writing => writing.sectionId === section.id)
    }));
  }, [writings, sections]);

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
  
  if (error) { 
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
          <h1 className="text-2xl font-serif mb-4">An error occurred</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          {/* Button to retry can be removed or disabled if no fetchData exists */}
        </div>
      </div>
    );
  }
  
  if (isLoading) { 
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 p-3 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg transition-colors z-50" // Ensure z-index is high enough
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
          refreshData={async () => { 
            console.log("Admin operation attempted in static mode. Data changes will not persist."); 
            // alert("Admin Page is in read-only mode. Changes will not be saved."); // Optional user alert
          }}
          // onClose={() => setShowAdmin(false)} // Keep as per original AdminPage design
        />
      )}

      {!showAdmin && ( // This condition might need to be adjusted based on how AdminPage is displayed
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
                      onClick={(e) => {
                        handleMobileLinkClick(e); // Use the existing handler
                        // Direct scroll and close for main section links
                        const targetElement = document.getElementById(section.id);
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                        }
                        setIsMobileMenuOpen(false);
                      }}
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
                            onClick={handleMobileLinkClick} // This handles poems within sections
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
                 { (socialLinks.twitter || socialLinks.instagram || socialLinks.snapchat) && (
                  <div className="mt-8 pt-6 border-t border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Follow</h3>
                    <div className="flex space-x-4">
                      {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Twitter size={22}/></a>}
                      {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500"><Instagram size={22}/></a>}
                      {socialLinks.snapchat && <a href={socialLinks.snapchat} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400"><MessageSquare size={22}/></a>}
                    </div>
                  </div>
                )}
              </nav>
            </motion.div>
          )}

          <main className="max-w-4xl mx-auto px-4 py-12">
            {sectionsWithWritings.map((section) => (
              <WritingSection
                key={section.id}
                id={section.id}
                title={section.title}
                icon={<section.icon className={section.iconClass} />} // Passing the component instance
                writings={section.writings}
                accent={section.accent as AccentColor}
              />
            ))}
            {sectionsWithWritings.length === 0 && !isLoading && (
                <div className="text-center text-gray-500 py-20">
                    <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-serif">No content has been published yet.</p>
                    <p className="mt-2 text-sm">The digital inkwell is awaiting stories.</p>
                </div>
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