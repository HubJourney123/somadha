'use client';

import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function AboutSection() {
  const features = [
    {
      icon: FiTarget,
      title: 'আমাদের লক্ষ্য',
      description: 'ব্রাহ্মণবাড়িয়ার জনগণের সমস্যা দ্রুত সমাধানের মাধ্যমে একটি উন্নত ও সমৃদ্ধ জেলা গড়ে তোলা।'
    },
    {
      icon: FiUsers,
      title: 'স্বচ্ছতা ও জবাবদিহিতা',
      description: 'প্রতিটি অভিযোগের স্বচ্ছ ট্র্যাকিং ও সময়মত সমাধান নিশ্চিত করা।'
    },
    {
      icon: FiTrendingUp,
      title: 'ডিজিটাল উন্নয়ন',
      description: 'আধুনিক প্রযুক্তির মাধ্যমে জনসেবা প্রদান ও সুশাসন প্রতিষ্ঠা করা।'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="section-title text-center">সমাধা সম্পর্কে</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
          সমাধা হলো ব্রাহ্মণবাড়িয়ার জনগণের জন্য একটি ডিজিটাল প্ল্যাটফর্ম যেখানে তারা তাদের 
          যেকোনো সমস্যা বা অভিযোগ সরাসরি জানাতে পারবেন এবং সমাধানের অগ্রগতি ট্র্যাক করতে পারবেন।
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 text-center hover:shadow-lg transition-shadow"
          >
            <div className="w-16 h-16 bg-primary-light dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}