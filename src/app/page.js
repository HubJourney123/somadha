'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Carousel from '@/components/home/Carousel';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SplashScreen from '@/components/ui/SplashScreen';
import { FiLogIn, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [pageReady, setPageReady] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setPageReady(true);
  };

  // Show loading while checking authentication status
  if (status === 'loading' && !pageReady) {
    return (
      <>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        {!showSplash && (
          <div className="min-h-screen bg-secondary-50 dark:bg-dark-bg flex items-center justify-center">
            <LoadingSpinner text="লোড হচ্ছে..." />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      {!showSplash && (
        <div className="min-h-screen bg-secondary-50 dark:bg-dark-bg">
          <Header />
          
          <main className="with-bottom-nav">
            {/* Hero Section - Awesome Light Orange Design */}
            <section className="py-6 px-4 md:px-6">
              {/* Light Orange Container */}
              <div className="bg-gradient-to-br from-primary/12 via-primary/6 to-transparent rounded-3xl p-6 md:p-8 shadow-sm border border-primary/10 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/8 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  {/* Carousel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Carousel />
                  </motion.div>

                  {/* Hero Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-center max-w-4xl mx-auto"
                  >
                    <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-3">
                      স্বাগতম <span className="text-primary">সমাধা</span>য়
                    </h1>
                    <p className="text-base md:text-xl text-neutral-600 dark:text-neutral-400 mb-6">
                      মাধ্যম নয়, সরাসরি পৌছান
                    </p>

                    {/* Show user greeting if logged in */}
                    {session?.user && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-white/60 dark:bg-dark-card/60 backdrop-blur-sm rounded-xl inline-block border border-primary/20 shadow-sm"
                      >
                        <p className="text-neutral-900 dark:text-white font-semibold">
                          স্বাগতম, {session.user.name}!
                        </p>
                      </motion.div>
                    )}

                    {/* CTA Buttons - Side by side on mobile */}
                    <div className="flex flex-row gap-3 justify-center items-center">
                      {!session ? (
                        <>
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() => signIn('google')}
                            className="flex-1 max-w-xs bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm hover:bg-white dark:hover:bg-dark-card"
                          >
                            <FiLogIn className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-sm md:text-base">Google সাইন ইন</span>
                          </Button>
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={() => router.push('/post-complaint')}
                            className="flex-1 max-w-xs shadow-md"
                          >
                            <span className="text-sm md:text-base">অভিযোগ পোস্ট</span>
                            <FiArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="md"
                            onClick={() => router.push('/post-complaint')}
                            className="flex-1 max-w-xs bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm hover:bg-white dark:hover:bg-dark-card"
                          >
                            <span className="text-sm md:text-base">অভিযোগ পোস্ট</span>
                            <FiArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="md"
                            onClick={() => router.push('/dashboard')}
                            className="flex-1 max-w-xs shadow-md"
                          >
                            <span className="text-sm md:text-base">ড্যাশবোর্ডে যান</span>
                            <FiArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Stats Section - With Margin */}
            <section className="py-8 px-4 md:px-6">
              <StatsSection />
            </section>

            {/* About Section - With Margin */}
            <section className="py-8 px-4 md:px-6">
              <AboutSection />
            </section>

            {/* Activities Section - With Margin */}
            <section className="py-8 px-4 md:px-6">
              <ActivitiesSection />
            </section>

            {/* Footer - With Margin */}
            <footer className="py-12 px-4 md:px-6 border-t border-secondary-200 dark:border-neutral-700">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">স</span>
                  </div>
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">
                    সমাধা
                  </span>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                  খুলনা–৫ এর জনগণের জন্য ডিজিটাল অভিযোগ ব্যবস্থাপনা প্ল্যাটফর্ম
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  © {new Date().getFullYear()} সমাধা। সর্বস্বত্ব সংরক্ষিত।
                </p>
              </div>
            </footer>
          </main>

          <BottomNav />
        </div>
      )}
    </>
  );
}