'use client';

import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ComplaintForm from '@/components/complaint/ComplaintForm';
import { motion } from 'framer-motion';

export default function PostComplaintPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-padding with-bottom-nav py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              সমস্যা/অভিযোগ পোস্ট করুন
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              আপনার সমস্যার বিস্তারিত তথ্য দিন। আমরা দ্রুত সমাধানের চেষ্টা করব।
            </p>
          </div>

          {/* Complaint Form */}
          <ComplaintForm />

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="card p-6 mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-3">
              📋 কিভাবে অভিযোগ জমা দেবেন?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">১.</span>
                <span>আপনার সমস্যার ধরন নির্বাচন করুন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">২.</span>
                <span>সমস্যার স্থান (উপজেলা ও ইউনিয়ন) নির্বাচন করুন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">৩.</span>
                <span>সমস্যার বিস্তারিত বর্ণনা লিখুন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">৪.</span>
                <span>সম্ভব হলে সমস্যার ছবি যুক্ত করুন</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">৫.</span>
                <span>অভিযোগ জমা দিন এবং আপনার ইউনিক আইডি সংরক্ষণ করুন</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}