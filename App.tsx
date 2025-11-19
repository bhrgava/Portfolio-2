import React, { useState, useCallback } from 'react';
import { Visualizer } from './components/Visualizer';
import { StoryOverlay } from './components/StoryOverlay';
import { SLIDES } from './constants';

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const setSlide = useCallback((index: number) => {
     if(index >= 0 && index < SLIDES.length) {
        setCurrentSlideIndex(index);
     }
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* The Visual Background Layer */}
      <Visualizer currentSlideId={currentSlide.id} />

      {/* The UI Overlay Layer */}
      <StoryOverlay 
        currentSlide={currentSlide}
        currentSlideIndex={currentSlideIndex}
        totalSlides={SLIDES.length}
        onNext={nextSlide}
        onPrev={prevSlide}
        setSlide={setSlide}
      />
    </main>
  );
};

export default App;