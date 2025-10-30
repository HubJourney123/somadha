'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    
    if (splashShown) {
      // Skip splash if already shown in this session
      setIsVisible(false);
      onComplete();
      return;
    }

    // Minimum display time (in case video loads very fast)
    const minDisplayTime = setTimeout(() => {
      if (videoEnded) {
        hideSplash();
      }
    }, 2000); // Minimum 2 seconds

    return () => clearTimeout(minDisplayTime);
  }, [videoEnded, onComplete]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    // Wait a bit after video ends, then hide
    setTimeout(() => {
      hideSplash();
    }, 500);
  };

  const hideSplash = () => {
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-primary"
        style={{ backgroundColor: '#FF6B35' }}
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

        {/* Loading indicator (optional) */}
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
      </motion.div>
    </AnimatePresence>
  );
}