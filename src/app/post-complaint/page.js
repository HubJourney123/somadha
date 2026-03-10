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
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-100 dark:from-dark-bg dark:via-dark-bg dark:to-dark-card">
      <Header />
      
      <main className="with-bottom-nav py-8">
        {/* Decorative Background Elements */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="relative z-10 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Page Header with Icon */}
            <div className="text-center mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary-600 rounded-2xl shadow-lg mb-6"
              >
                <FiAlertCircle className="w-10 h-10 text-white" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4"
              >
                সমস্যা/অভিযোগ পোস্ট করুন
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              >
                আপনার সমস্যার বিস্তারিত তথ্য দিন। আমরা দ্রুত সমাধানের চেষ্টা করব।
              </motion.p>
            </div>



            {/* Complaint Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-secondary-200 dark:border-dark-border overflow-hidden"
            >
              <ComplaintForm />
            </motion.div>

            {/* How to Submit - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <div className="bg-gradient-to-br from-primary/5 to-secondary/10 dark:from-primary/10 dark:to-secondary/5 rounded-2xl p-6 md:p-8 border border-primary/20 dark:border-primary/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/20 dark:bg-primary/30 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                    কিভাবে অভিযোগ জমা দেবেন?
                  </h3>
                </div>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-white/50 dark:bg-dark-card/50 rounded-xl border border-secondary-200/50 dark:border-dark-border/50 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-white to-secondary-100 dark:from-dark-card dark:to-dark-bg rounded-xl flex items-center justify-center border border-secondary-200 dark:border-dark-border group-hover:scale-110 transition-transform">
                            <Icon className={`w-6 h-6 ${step.color}`} />
                          </div>
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-bold text-primary">
                              {index + 1}
                            </span>
                            <div className="h-px flex-1 bg-gradient-to-r from-secondary-300 to-transparent dark:from-neutral-700" />
                          </div>
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {step.text}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Extra Tips */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                >
                 
                </motion.div>
              </div>
            </motion.div>

            
          </motion.div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}