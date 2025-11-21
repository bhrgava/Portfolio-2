
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Database, Zap, AlertTriangle, Search, CheckCircle, ExternalLink, Sparkles, LayoutGrid, Activity, GitCommit, ListOrdered } from 'lucide-react';
import { SlideData, SlideId, CaseStudy } from '../types';

interface StoryOverlayProps {
  currentSlide: SlideData;
  currentSlideIndex: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  setSlide: (index: number) => void;
  caseStudies: CaseStudy[];
  activeCaseStudyIndex: number;
  onSelectCaseStudy: (index: number) => void;
}

const getIcon = (id: SlideId) => {
  switch (id) {
    case SlideId.TITLE: return <LayoutGrid className="w-10 h-10 text-white" />;
    case SlideId.OBSERVABILITY: return <Activity className="w-10 h-10 text-cyan-400" />;
    case SlideId.PREMISE: return <Database className="w-10 h-10 text-emerald-400" />;
    case SlideId.HOTSPOT: return <Zap className="w-10 h-10 text-red-500" />;
    case SlideId.METHODOLOGY: return <ListOrdered className="w-10 h-10 text-indigo-400" />;
    case SlideId.ACTION: return <Search className="w-10 h-10 text-blue-400" />;
    case SlideId.IMPACT: return <AlertTriangle className="w-10 h-10 text-amber-400" />;
    case SlideId.IMPLEMENTATION: return <GitCommit className="w-10 h-10 text-emerald-400" />;
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
  setSlide,
  caseStudies,
  activeCaseStudyIndex,
  onSelectCaseStudy
}) => {
  const isTitle = currentSlide.id === SlideId.TITLE;
  const isTimeline = currentSlide.id === SlideId.METHODOLOGY || currentSlide.id === SlideId.IMPLEMENTATION;
  const activeCaseStudy = caseStudies[activeCaseStudyIndex];

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      
      {/* Fixed Header / Navigation - Aligned to Top */}
      <div className="absolute top-0 left-0 w-full flex flex-col md:flex-row justify-between items-start md:items-center pointer-events-auto p-6 md:px-12 md:py-6 z-30">
        {/* Logo / Title */}
        <div className="flex flex-col order-2 md:order-1 mt-4 md:mt-0">
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-white opacity-90">
            UX <span className="font-light text-slate-400">RESEARCH</span>
          </h1>
        </div>

        {/* Global Case Study Nav - Discreet Tabs */}
        <div className="flex items-center gap-6 md:gap-8 order-1 md:order-2 w-full md:w-auto border-b md:border-none border-white/10 pb-4 md:pb-0">
          {caseStudies.map((study, idx) => (
            <button
              key={study.id}
              onClick={() => onSelectCaseStudy(idx)}
              className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all relative group pb-1 md:pb-0 ${
                idx === activeCaseStudyIndex 
                  ? 'text-white opacity-100' 
                  : 'text-slate-400 opacity-40 hover:opacity-80'
              }`}
            >
              {study.title}
              {/* Active Indicator dot */}
              {idx === activeCaseStudyIndex && (
                <span className="absolute -bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_white]" />
              )}
            </button>
          ))}
        </div>

        {/* Case Study Year */}
        <div className="text-right hidden md:block order-3">
            <p className="text-xs uppercase tracking-widest text-slate-500">Case Study</p>
            <p className="text-sm font-mono text-slate-400">{activeCaseStudy.year}</p>
        </div>
      </div>
      
      {/* Main Layout Container */}
      <div className="flex flex-col justify-between w-full h-full px-6 pb-24 md:px-12 md:pb-12 pt-32 md:pt-24">
        
        {/* Progress Dots */}
        <div className="flex gap-2 pointer-events-auto">
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

        {/* Main Content Card */}
        <div className="flex-1 flex items-end md:items-center md:mb-12 pb-8 md:pb-0">
          {!isTimeline && (
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
          )}
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

    </div>
  );
};
