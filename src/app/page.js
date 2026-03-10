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
          
          <main className="container-padding with-bottom-nav">
            {/* Hero Section with Warm Background */}
            <section className="py-8 md:py-12 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 space-y-6">
                {/* Carousel at top */}
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
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-4">
                    স্বাগতম{' '}
                    <span className="gradient-text">
                      সমাধা
                    </span>
                    য়
                  </h1>
                  <p className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 font-medium">
                    মাধ্যম নয়, সরাসরি পৌছান
                  </p>

                  {/* Show user greeting if logged in */}
                  {session?.user && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-8 p-5 bg-gradient-to-br from-primary/10 to-secondary/20 dark:from-primary/20 dark:to-secondary/10 rounded-xl inline-block border border-primary/20 dark:border-primary/30"
                    >
                      <p className="text-neutral-900 dark:text-white font-bold text-lg">
                        স্বাগতম, {session.user.name}!
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                        আপনার অভিযোগ জমা দিতে প্রস্তুত
                      </p>
                    </motion.div>
                  )}

                  {/* CTA Buttons - Side by side */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
                    {!session ? (
                      <>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => router.push('/post-complaint')}
                          className="w-full sm:flex-1"
                        >
                          <span className="text-sm md:text-base">অভিযোগ পোস্ট করুন</span>
                          <FiArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => signIn('google')}
                          className="w-full sm:flex-1"
                        >
                          <FiLogIn className="w-5 h-5" />
                          <span className="text-sm md:text-base">Google সাইন ইন</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => router.push('/post-complaint')}
                          className="w-full sm:flex-1"
                        >
                          <span className="text-sm md:text-base">অভিযোগ পোস্ট করুন</span>
                          <FiArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={() => router.push('/dashboard')}
                          className="w-full sm:flex-1"
                        >
                          <span className="text-sm md:text-base">ড্যাশবোর্ডে যান</span>
                          <FiArrowRight className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Trust Indicators */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>সম্পূর্ণ নিরাপদ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span>দ্রুত প্রতিক্রিয়া</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <span>স্বচ্ছ প্রক্রিয়া</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="section-spacing bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-secondary-200 dark:border-dark-border p-6 md:p-8">
              <StatsSection />
            </section>

            {/* About Section */}
            <section className="section-spacing">
              <AboutSection />
            </section>

            {/* Activities Section */}
            <section className="section-spacing bg-gradient-to-br from-secondary-50 to-white dark:from-dark-card dark:to-dark-bg rounded-2xl p-6 md:p-8">
              <ActivitiesSection />
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-secondary-200 dark:border-neutral-700">
              <div className="text-center">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">স</span>
                  </div>
                  <span className="text-3xl font-bold gradient-text">
                    সমাধা
                  </span>
                </div>

                {/* Description */}
                <p className="text-neutral-600 dark:text-neutral-400 mb-3 max-w-md mx-auto">
                  খুলনা–৫ এর জনগণের জন্য ডিজিটাল অভিযোগ ব্যবস্থাপনা প্ল্যাটফর্ম
                </p>
                
                {/* Tagline */}
                <p className="text-sm text-primary font-semibold mb-6">
                  আপনার সমস্যা, আমাদের অগ্রাধিকার
                </p>

                {/* Quick Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
                  <button
                    onClick={() => router.push('/stats')}
                    className="link"
                  >
                    পরিসংখ্যান
                  </button>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="link"
                  >
                    ড্যাশবোর্ড
                  </button>
                  <span className="text-neutral-300 dark:text-neutral-700">•</span>
                  <button
                    onClick={() => router.push('/post-complaint')}
                    className="link"
                  >
                    অভিযোগ পোস্ট
                  </button>
                </div>

                {/* Copyright */}
                <div className="divider my-6" />
                <p className="text-sm text-neutral-500 dark:text-neutral-500">
                  © {new Date().getFullYear()} সমাধা। সর্বস্বত্ব সংরক্ষিত।
                </p>
                <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-2">
                  Made for People of Khulna-5
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