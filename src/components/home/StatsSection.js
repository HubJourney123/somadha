'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function StatsSection() {
  const router = useRouter();
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
      color: 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-800',
      iconColor: 'text-primary dark:text-primary-400',
      clickable: true
    },
    {
      title: 'সমাধান হয়েছে',
      value: stats.resolved,
      icon: FiCheckCircle,
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      clickable: true
    },
    {
      title: 'প্রক্রিয়াধীন',
      value: stats.inProgress,
      icon: FiClock,
      color: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
      iconColor: 'text-primary-600 dark:text-primary-400',
      clickable: true
    },
    {
      title: 'অপেক্ষমাণ',
      value: stats.pending,
      icon: FiAlertCircle,
      color: 'bg-neutral-100 dark:bg-neutral-900/20 border-neutral-300 dark:border-neutral-800',
      iconColor: 'text-neutral-600 dark:text-neutral-400',
      clickable: true
    }
  ];

  return (
    <div>
      <h2 className="heading-2 text-center mb-8">পরিসংখ্যান</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => card.clickable && router.push('/stats')}
              className={`${card.color} border rounded-xl p-4 md:p-6 transition-all hover:shadow-lg cursor-pointer relative overflow-hidden group`}
            >
              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform bg-white/50 dark:bg-white/5`}>
                  <Icon className={`w-6 h-6 md:w-7 md:h-7 ${card.iconColor}`} />
                </div>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-1">
                  {card.value}
                </p>
                <p className="text-xs md:text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  {card.title}
                </p>
                
                {/* Click Indicator */}
                {card.clickable && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="text-xs text-primary mt-2 font-semibold"
                  >
                    বিস্তারিত দেখুন →
                  </motion.p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Helper Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6"
      >
        যেকোনো কার্ডে ক্লিক করে বিস্তারিত পরিসংখ্যান দেখুন
      </motion.p>
    </div>
  );
}