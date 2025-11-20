
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Database, Zap, AlertTriangle, Search, CheckCircle, ExternalLink, Sparkles, LayoutGrid, Activity } from 'lucide-react';
import { SlideData, SlideId } from '../types';

interface StoryOverlayProps {
  currentSlide: SlideData;
  currentSlideIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  setSlide: (index: number) => void;
}

const getIcon = (id: SlideId) => {
  switch (id) {
    case SlideId.TITLE: return <LayoutGrid className="w-10 h-10 text-white" />;
    case SlideId.OBSERVABILITY: return <Activity className="w-10 h-10 text-cyan-400" />;
    case SlideId.PREMISE: return <Database className="w-10 h-10 text-emerald-400" />;
    case SlideId.HOTSPOT: return <Zap className="w-10 h-10 text-red-500" />;
    case SlideId.CATALYST: return <AlertTriangle className="w-10 h-10 text-amber-500" />;
    case SlideId.ACTION: return <Search className="w-10 h-10 text-blue-400" />;
    case SlideId.IMPACT: return <AlertTriangle className="w-10 h-10 text-amber-400" />;
    case SlideId.SOLUTION: return <Sparkles className="w-10 h-10 text-purple-400" />;
    default: return <Database />;
  }
};

export const StoryOverlay: React.FC<StoryOverlayProps> = ({ 
  currentSlide, 
  currentSlideIndex, 
  totalSlides, 
  onNext, 
  onPrev,
  setSlide
}) => {
  const isTitle = currentSlide.id === SlideId.TITLE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between px-6 pt-6 pb-24 md:p-12 z-20">
      
      {/* Header / Progress */}
      <div className="w-full flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tighter text-white opacity-90">
            SPANNER <span className="font-light text-slate-400">RESEARCH</span>
          </h1>
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setSlide(idx)}
                className={`h-1 transition-all duration-300 rounded-full ${
                  idx === currentSlideIndex ? 'w-8 bg-white' : 'w-4 bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-xs uppercase tracking-widest text-slate-500">Case Study</p>
            <p className="text-sm font-mono text-slate-400">2022</p>
        </div>
      </div>

      {/* Main Content Card */}
      {/* Changed alignment from items-center to items-end to push content to bottom on mobile */}
      <div className="flex-1 flex items-end md:items-end md:mb-12 pb-8 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0, 
              x: 20,
              transition: { duration: 0.3, delay: 0 } // Exit immediately
            }}
            transition={{ 
              duration: 0.8, 
              delay: currentSlide.textDelay ?? 0.5, // Delay entrance based on slide
              ease: "easeOut" 
            }}
            // Conditionally make the card much wider for the Title slide
            className={`bg-slate-950/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl ${isTitle ? 'max-w-4xl' : 'max-w-xl'} w-full shadow-2xl pointer-events-auto`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700">
                {getIcon(currentSlide.id)}
              </div>
              <div>
                <h4 className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                  {currentSlide.title}
                </h4>
                <h2 className={`font-bold text-white leading-tight ${isTitle ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                  {currentSlide.subtitle}
                </h2>
              </div>
            </div>
            
            <p className={`text-slate-300 leading-relaxed mb-6 ${isTitle ? 'text-xl md:text-2xl' : 'text-lg'}`}>
              {currentSlide.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {currentSlide.details.map((detail, i) => (
                <div key={i} className="bg-slate-900/50 px-3 py-2 rounded border border-slate-800 text-xs text-slate-400 font-mono text-center">
                  {detail}
                </div>
              ))}
            </div>

            {currentSlide.link && (
              <a 
                href={currentSlide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors text-sm uppercase tracking-wide group"
              >
                Read Documentation
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="w-full flex justify-between items-center pointer-events-auto">
         <button 
          onClick={onPrev}
          disabled={currentSlideIndex === 0}
          className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
        >
          <div className="p-2 rounded-full border border-slate-700 group-hover:border-white transition-colors">
            <ChevronLeft size={24} />
          </div>
          <span className="hidden sm:inline font-medium text-sm tracking-widest uppercase">Prev</span>
        </button>

        <button 
          onClick={onNext}
          disabled={currentSlideIndex === totalSlides - 1}
          className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
        >
          <span className="hidden sm:inline font-medium text-sm tracking-widest uppercase">Next</span>
           <div className="p-2 rounded-full border border-slate-700 group-hover:border-white transition-colors">
            <ChevronRight size={24} />
          </div>
        </button>
      </div>

    </div>
  );
};
