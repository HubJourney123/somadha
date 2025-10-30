'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function StatsSection() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    {
      title: 'মোট অভিযোগ',
      value: stats.total,
      icon: FiFileText,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'সমাধান হয়েছে',
      value: stats.resolved,
      icon: FiCheckCircle,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'প্রক্রিয়াধীন',
      value: stats.inProgress,
      icon: FiClock,
      color: 'orange',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    {
      title: 'অপেক্ষমাণ',
      value: stats.pending,
      icon: FiAlertCircle,
      color: 'gray',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      iconColor: 'text-gray-600 dark:text-gray-400',
      borderColor: 'border-gray-200 dark:border-gray-800'
    }
  ];

  return (
    <div>
      <h2 className="section-title text-center mb-6">পরিসংখ্যান</h2>
      
      {/* Grid - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 md:p-6`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${stat.bgColor} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}