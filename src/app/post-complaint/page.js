'use client';

import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ComplaintForm from '@/components/complaint/ComplaintForm';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiMapPin, FiFileText, FiCamera, FiCheckCircle } from 'react-icons/fi';

export default function PostComplaintPage() {
  const steps = [
    {
      icon: FiAlertCircle,
      text: 'আপনার সমস্যার ধরন নির্বাচন করুন',
      color: 'text-primary'
    },
    {
      icon: FiMapPin,
      text: 'সমস্যার স্থান (উপজেলা ও ইউনিয়ন) নির্বাচন করুন',
      color: 'text-blue-600'
    },
    {
      icon: FiFileText,
      text: 'সমস্যার বিস্তারিত বর্ণনা লিখুন',
      color: 'text-purple-600'
    },
    {
      icon: FiCamera,
      text: 'সম্ভব হলে সমস্যার ছবি যুক্ত করুন',
      color: 'text-green-600'
    },
    {
      icon: FiCheckCircle,
      text: 'অভিযোগ জমা দিন এবং আপনার ইউনিক আইডি সংরক্ষণ করুন',
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-dark-bg">
      <Header />
      
      <main className="with-bottom-nav py-8 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-3">
              সমস্যা/অভিযোগ পোস্ট করুন
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              আপনার সমস্যার বিস্তারিত তথ্য দিন। আমরা দ্রুত সমাধানের চেষ্টা করব।
            </p>
          </div>

          {/* Complaint Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ComplaintForm />
          </motion.div>

          {/* How to Submit - Simple Version */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 card p-6"
          >
            <h3 className="font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
              <span>📋</span>
              কিভাবে অভিযোগ জমা দেবেন?
            </h3>
            
            <div className="space-y-3">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${step.color} flex-shrink-0`} />
                    <div className="flex items-start gap-2 flex-1">
                      <span className="font-bold text-primary">{index + 1}.</span>
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                        {step.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}