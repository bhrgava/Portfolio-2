
import React, { useState, useCallback, useEffect } from 'react';
import { Visualizer } from './components/Visualizer';
import { StoryOverlay } from './components/StoryOverlay';
import { CASE_STUDIES } from './constants';

const App: React.FC = () => {
  const [activeCaseStudyIndex, setActiveCaseStudyIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showMobileLayout, setShowMobileLayout] = useState(false);

  const activeCaseStudy = CASE_STUDIES[activeCaseStudyIndex];
  const slides = activeCaseStudy.slides;
  const currentSlide = slides[currentSlideIndex];

  const handleCaseStudyChange = useCallback((index: number) => {
    setActiveCaseStudyIndex(index);
    setCurrentSlideIndex(0); // Reset to start of new story
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const setSlide = useCallback((index: number) => {
     if(index >= 0 && index < slides.length) {
        setCurrentSlideIndex(index);
     }
  }, [slides.length]);

  // Handle layout transition timer based on current slide's delay
  useEffect(() => {
    // Reset to full screen immediately when slide changes
    setShowMobileLayout(false);

    // Wait for the text delay (animation time) before shrinking the graphic
    const delayTime = (currentSlide.textDelay || 0.5) * 1000;
    
    const timer = setTimeout(() => {
      setShowMobileLayout(true);
    }, delayTime);

    return () => clearTimeout(timer);
  }, [currentSlideIndex, activeCaseStudyIndex, currentSlide.textDelay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <main className="relative w-screen h-[100dvh] overflow-hidden bg-black text-white">
      {/* The Visual Background Layer */}
      <Visualizer 
        currentSlideId={currentSlide.id} 
        shrinkOnMobile={showMobileLayout}
      />

      {/* The UI Overlay Layer */}
      <StoryOverlay 
        currentSlide={currentSlide}
        currentSlideIndex={currentSlideIndex}
        totalSlides={slides.length}
        onNext={nextSlide}
        onPrev={prevSlide}
        setSlide={setSlide}
        caseStudies={CASE_STUDIES}
        activeCaseStudyIndex={activeCaseStudyIndex}
        onSelectCaseStudy={handleCaseStudyChange}
      />
    </main>
  );
};

export default App;
