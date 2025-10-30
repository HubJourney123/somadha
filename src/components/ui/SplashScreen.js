'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      // Skip splash if already shown in this session
      setIsVisible(false);
      onComplete();
      return;
    }

    // Minimum display time - 2 seconds
    const minTimer = setTimeout(() => {
      console.log('Minimum time elapsed');
      setMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(minTimer);
  }, [onComplete]);

  // Check if we should hide splash when both conditions are met
  useEffect(() => {
    if (videoEnded && minTimeElapsed) {
      console.log('Video ended AND min time elapsed - hiding splash');
      setTimeout(() => {
        hideSplash();
      }, 500); // Small delay for smooth transition
    }
  }, [videoEnded, minTimeElapsed]);

  const handleVideoEnd = () => {
    console.log('Video ended');
    setVideoEnded(true);
  };

  const hideSplash = () => {
    console.log('Hiding splash screen');
    setIsVisible(false);
    sessionStorage.setItem('splashShown', 'true');
    setTimeout(() => {
      onComplete();
    }, 500); // Wait for fade out animation
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: '#CC785C' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center p-8"
        >
          <video
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            className="max-w-full max-h-full object-contain"
            style={{ maxWidth: '600px', maxHeight: '600px' }}
          >
            <source src="/splash.webm" type="video/webm" />
            {/* Fallback for browsers that don't support WebM */}
            <div className="text-white text-center">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-primary font-bold text-4xl">স</span>
              </div>
              <h1 className="text-4xl font-bold">সমাধা</h1>
            </div>
          </video>
        </motion.div>

        {/* Loading indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0 }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </div>
        </div>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-4 left-4 text-white text-xs bg-black/30 p-2 rounded">
            <div>Video Ended: {videoEnded ? '✓' : '✗'}</div>
            <div>Min Time: {minTimeElapsed ? '✓' : '✗'}</div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}