'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function StatsSection() {
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats/public');
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

  const statItems = [
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
      value: stats.pending,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6 hover:shadow-lg transition-shadow"
        >
          <div className={`w-14 h-14 ${item.lightColor} rounded-xl flex items-center justify-center mb-4`}>
            <item.icon className={`w-7 h-7 ${item.textColor}`} />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {item.value.toLocaleString('bn-BD')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {item.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}