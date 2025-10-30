'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiAlertCircle, FiTool, FiCheck } from 'react-icons/fi';
import { format } from 'date-fns';

const statusConfig = {
  1: {
    icon: FiCheckCircle,
    label: 'জমা দেওয়া হয়েছে',
    color: 'gray',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-700 dark:text-gray-300',
    iconColor: 'text-gray-500',
    lineColor: 'bg-gray-300 dark:bg-gray-600'
  },
  2: {
    icon: FiClock,
    label: 'পর্যালোচনা করা হচ্ছে',
    color: 'blue',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-500',
    lineColor: 'bg-blue-300 dark:bg-blue-600'
  },
  3: {
    icon: FiTool,
    label: 'কাজ চলছে',
    color: 'yellow',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    iconColor: 'text-yellow-500',
    lineColor: 'bg-yellow-300 dark:bg-yellow-600'
  },
  4: {
    icon: FiAlertCircle,
    label: 'প্রায় সম্পন্ন',
    color: 'orange',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-700 dark:text-orange-300',
    iconColor: 'text-orange-500',
    lineColor: 'bg-orange-300 dark:bg-orange-600'
  },
  5: {
    icon: FiCheck,
    label: 'সমাধান হয়েছে',
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-500',
    lineColor: 'bg-green-300 dark:bg-green-600'
  }
};

export default function ComplaintTracking({ complaint }) {
  const [expandedStatus, setExpandedStatus] = useState(null);

  // Get all status history sorted by date
  const statusHistory = complaint.status_history || [];
  const sortedHistory = [...statusHistory].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );

  const currentStatus = complaint.status_id;

  const toggleExpand = (statusId) => {
    setExpandedStatus(expandedStatus === statusId ? null : statusId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          অভিযোগ ট্র্যাকিং
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ID: {complaint.unique_id}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {sortedHistory.map((status, index) => {
          const config = statusConfig[status.status_id];
          const Icon = config.icon;
          const isLast = index === sortedHistory.length - 1;
          const isExpanded = expandedStatus === status.id;
          const isCurrent = status.status_id === currentStatus;

          return (
            <motion.div
              key={status.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`absolute left-6 top-14 w-0.5 h-full ${config.lineColor}`}
                  style={{ marginLeft: '-1px' }}
                />
              )}

              {/* Status Item */}
              <div className="flex items-start gap-4 pb-8">
                {/* Icon Circle */}
                <motion.div
                  className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-6 h-6 ${config.iconColor}`} />
                  
                  {/* Pulse animation for current status */}
                  {isCurrent && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${config.bgColor} opacity-50`}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <motion.div
                  className={`flex-1 ${config.bgColor} rounded-xl p-4 cursor-pointer`}
                  onClick={() => status.notes && toggleExpand(status.id)}
                  whileHover={{ scale: status.notes ? 1.02 : 1 }}
                  whileTap={{ scale: status.notes ? 0.98 : 1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-bold ${config.textColor} text-lg`}>
                        {config.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded-full">
                            বর্তমান
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {format(new Date(status.created_at), 'dd MMMM yyyy, HH:mm')}
                      </p>
                    </div>
                  </div>

                  {/* Notes - Expandable */}
                  {status.notes && (
                    <motion.div
                      initial={false}
                      animate={{
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {status.notes}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Expand indicator */}
                  {status.notes && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      {isExpanded ? '▲ কম দেখুন' : '▼ বিস্তারিত দেখুন'}
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {sortedHistory.length === 0 && (
        <div className="text-center py-12">
          <FiClock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            এখনো কোনো স্ট্যাটাস আপডেট নেই
          </p>
        </div>
      )}
    </div>
  );
}