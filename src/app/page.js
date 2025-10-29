'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Carousel from '@/components/home/Carousel';
import StatsSection from '@/components/home/StatsSection';
import AboutSection from '@/components/home/AboutSection';
import ActivitiesSection from '@/components/home/ActivitiesSection';
import Button from '@/components/ui/Button';
import { FiLogIn, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  const fetchCarouselImages = async () => {
    try {
      const response = await fetch('/api/carousel');
      if (response.ok) {
        const data = await response.json();
        setCarouselImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching carousel images:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-padding with-bottom-nav">
        {/* Hero Section */}
        <section className="py-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              স্বাগতম <span className="text-primary">সমাধা</span>য়
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
              আপনার সমস্যা জানান, সমাধান পান। একসাথে গড়ি উন্নত ব্রাহ্মণবাড়িয়া।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!session ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => signIn('google')}
                  >
                    <FiLogIn className="w-5 h-5" />
                    Google দিয়ে সাইন ইন করুন
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push('/post-complaint')}
                  >
                    অভিযোগ পোস্ট করুন
                    <FiArrowRight className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/post-complaint')}
                >
                  অভিযোগ পোস্ট করুন
                  <FiArrowRight className="w-5 h-5" />
                </Button>
              )}
            </div>
          </motion.div>

          {/* Carousel */}
          <Carousel images={carouselImages} />
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <StatsSection />
        </section>

        {/* About Section */}
        <section className="py-12">
          <AboutSection />
        </section>

        {/* Activities Section */}
        <section className="py-12">
          <ActivitiesSection />
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200 dark:border-dark-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">স</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                সমাধা
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              ব্রাহ্মণবাড়িয়ার জনগণের জন্য ডিজিটাল অভিযোগ ব্যবস্থাপনা প্ল্যাটফর্ম
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} সমাধা। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </footer>
      </main>

      <BottomNav />
    </div>
  );
}