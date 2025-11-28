'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FiHome, FiPlus, FiBarChart2, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

export default function StatsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [totalComplaints, setTotalComplaints] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching stats from /api/stats/categories...');
      
      const response = await fetch('/api/stats/categories');
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }

      if (data.success) {
        console.log('Setting stats:', data.data);
        setStats(data.data || []);
        setTotalComplaints(data.total || 0);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get color for category
  const getCategoryColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-orange-500 to-orange-600',
    ];
    return colors[index % colors.length];
  };

  const maxCount = Math.max(...stats.map(s => s.count), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-padding with-bottom-nav py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <FiBarChart2 className="w-8 h-8 text-primary" />
              পরিসংখ্যান
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ক্যাটাগরি অনুযায়ী অভিযোগের তথ্য
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={fetchStats}
              disabled={loading}
            >
              <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">রিফ্রেশ</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/')}
            >
              <FiHome className="w-5 h-5" />
              <span className="hidden md:inline">হোম</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/post-complaint')}
            >
              <FiPlus className="w-5 h-5" />
              <span className="hidden md:inline">অভিযোগ</span>
            </Button>
          </div>
        </div>

        {/* Total Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                মোট অভিযোগ
              </p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                {totalComplaints}
              </p>
            </div>
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <FiTrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="card p-6 mb-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 mb-2">
              ❌ ত্রুটি: {error}
            </p>
            <Button variant="secondary" onClick={fetchStats}>
              আবার চেষ্টা করুন
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="ডেটা লোড হচ্ছে..." />
          </div>
        ) : stats.length === 0 ? (
          <div className="card p-12 text-center">
            <FiBarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              কোনো ডেটা নেই
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              এখনো কোনো অভিযোগ পোস্ট করা হয়নি
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/post-complaint')}
            >
              <FiPlus className="w-5 h-5" />
              প্রথম অভিযোগ পোস্ট করুন
            </Button>
          </div>
        ) : (
          <>
            {/* Chart Section */}
            <div className="card p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                ক্যাটাগরি অনুযায়ী অভিযোগ
              </h2>

              <div className="space-y-4">
                {stats.map((stat, index) => {
                  const percentage = (stat.count / maxCount) * 100;
                  const isSelected = selectedCategory === stat.category_name;

                  return (
                    <motion.div
                      key={stat.category_name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(isSelected ? null : stat.category_name)}
                      className="cursor-pointer"
                    >
                      {/* Category Label */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                            {stat.category_name}
                          </span>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-xs bg-primary text-white px-2 py-1 rounded-full"
                            >
                              নির্বাচিত
                            </motion.span>
                          )}
                        </div>
                        <span className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
                          {stat.count} টি
                        </span>
                      </div>

                      {/* Animated Bar */}
                      <div className="relative h-12 md:h-14 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ 
                            duration: 1, 
                            delay: index * 0.1,
                            ease: "easeOut" 
                          }}
                          className={`h-full bg-gradient-to-r ${getCategoryColor(index)} relative`}
                        >
                          {/* Animated Shine Effect */}
                          <motion.div
                            animate={{
                              x: ['-100%', '200%']
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          />
                        </motion.div>

                        {/* Percentage Text */}
                        <div className="absolute inset-0 flex items-center px-4">
                          <span className="text-sm md:text-base font-semibold text-gray-900 dark:text-white mix-blend-difference">
                            {((stat.count / totalComplaints) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">মোট অভিযোগ</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {stat.count}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">শতাংশ</p>
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {((stat.count / totalComplaints) * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="card p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                যেকোনো ক্যাটাগরিতে ক্লিক করে বিস্তারিত দেখুন
              </p>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
