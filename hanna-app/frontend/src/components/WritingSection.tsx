import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { WritingData, AccentColor } from '../App';

const accentColors = {
  rose: 'bg-rose-400/10 border-rose-400/20',
  purple: 'bg-purple-400/10 border-purple-400/20',
  blue: 'bg-blue-400/10 border-blue-400/20',
  red: 'bg-red-400/10 border-red-400/20',
  amber: 'bg-amber-400/10 border-amber-400/20',
  emerald: 'bg-emerald-400/10 border-emerald-400/20',
};

interface WritingSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  writings: WritingData[];
  accent: AccentColor;
}

const LikeButton = ({ poemId }: { poemId: string }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const storedLikes = localStorage.getItem(`poem-${poemId}-liked`);
    const storedCount = localStorage.getItem(`poem-${poemId}-count`);
    if (storedLikes === 'true') setIsLiked(true);
    if (storedCount) setLikeCount(parseInt(storedCount));
  }, [poemId]);

  const handleLike = () => {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    const newCount = newLikeState ? likeCount + 1 : likeCount - 1;
    setLikeCount(newCount);
    
    localStorage.setItem(`poem-${poemId}-liked`, String(newLikeState));
    localStorage.setItem(`poem-${poemId}-count`, String(newCount));
  };

  return (
    <motion.button
      onClick={handleLike}
      className="flex items-center space-x-2 text-sm text-gray-400 hover:text-rose-400 transition-colors"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{
          scale: isLiked ? [1, 1.2, 1] : 1,
          color: isLiked ? '#f43f5e' : '#9ca3af'
        }}
        transition={{ duration: 0.3 }}
      >
        <Heart size={18} fill={isLiked ? '#f43f5e' : 'none'} />
      </motion.div>
      <span>{likeCount > 0 ? likeCount : ''}</span>
    </motion.button>
  );
};

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <motion.div 
      className="flex justify-center items-center space-x-4 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </motion.div>
  );
};

function WritingSection({ id, title, icon, writings, accent }: WritingSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(writings.length / itemsPerPage);
  const paginatedWritings = writings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [writings]);

  const sectionTitleVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };
  
  const articleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15, 
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const articleContentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, ease: "easeIn" }
    },
  };

  return (
    <section id={id} className="scroll-mt-24">
      <motion.div 
        className="flex items-center space-x-4 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionTitleVariants}
      >
        {icon}
        <h2 className="text-3xl font-serif">{title}</h2>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${currentPage}-${writings.length}`}
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {paginatedWritings.length === 0 ? (
            <motion.div
              className="text-center text-gray-500 py-12 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              No poems found for the selected filters.
            </motion.div>
          ) : (
            paginatedWritings.map((writing, index) => {
              if (!writing) return null;
              return (
                <motion.article
                  key={writing.id}
                  id={writing.id}
                  className={`p-8 rounded-lg border ${accentColors[accent]} backdrop-blur-sm overflow-hidden scroll-mt-20 hover:shadow-lg hover:shadow-${accent}-400/10 transition-all duration-300`}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={articleVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <motion.h3 
                      className="text-2xl font-serif group"
                      initial="hidden"
                      animate="visible"
                      variants={articleContentVariants}
                      transition={{ delay: 0.1 }}
                    >
                      <span className="relative">
                        {writing.title || 'Untitled'}
                        <motion.span
                          className="absolute bottom-0 left-0 w-0 h-0.5 bg-current"
                          whileHover={{ width: '100%' }}                          
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                    </motion.h3>
                    <LikeButton poemId={writing.id} />
                  </div>
                  {writing.content && (
                    <motion.div 
                      className="prose prose-invert max-w-none whitespace-pre-line leading-relaxed"
                      initial="hidden"
                      animate="visible"
                      variants={articleContentVariants}
                      transition={{ delay: (writing.title || '') ? 0.2 : 0.1 }}
                    >
                      {writing.content}
                    </motion.div>
                  )}
                </motion.article>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>
      {paginatedWritings.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
}

export default WritingSection;