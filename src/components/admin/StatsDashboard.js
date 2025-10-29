'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiCheckCircle, 
  FiClock, 
  FiTrendingUp,
  FiAlertCircle 
} from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner text="পরিসংখ্যান লোড হচ্ছে..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card p-8 text-center">
        <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">পরিসংখ্যান লোড করা যায়নি</p>
      </div>
    );
  }

  const mainStats = [
    {
      icon: FiFileText,
      label: 'মোট অভিযোগ',
      value: stats.total,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: FiCheckCircle,
      label: 'সমাধান হয়েছে',
      value: stats.solved,
      color: 'bg-green-500',
      lightColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: FiClock,
      label: 'প্রক্রিয়াধীন',
      value: stats.total - stats.solved,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: FiTrendingUp,
      label: 'সমাধানের হার',
      value: stats.total > 0 ? `${Math.round((stats.solved / stats.total) * 100)}%` : '0%',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className={`w-12 h-12 ${stat.lightColor} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {typeof stat.value === 'number' ? stat.value.toLocaleString('bn-BD') : stat.value}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Category-wise Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Category */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            ধরন অনুযায়ী অভিযোগ
          </h3>
          <div className="space-y-3">
            {stats.byCategory.slice(0, 5).map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {cat.category_name}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {parseInt(cat.count).toLocaleString('bn-BD')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* By Status */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            স্ট্যাটাস অনুযায়ী অভিযোগ
          </h3>
          <div className="space-y-3">
            {stats.byStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {status.status_name}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {parseInt(status.count).toLocaleString('bn-BD')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upazila-wise Stats */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          উপজেলা অনুযায়ী অভিযোগ
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.byUpazila.map((upazila, index) => (
            <div 
              key={index}
              className="bg-gray-50 dark:bg-dark-card rounded-lg p-4 text-center"
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {parseInt(upazila.count).toLocaleString('bn-BD')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {upazila.upazila}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}