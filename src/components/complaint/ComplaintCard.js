'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/complaint/StatusBadge';
import ComplaintTracking from '@/components/complaint/ComplaintTracking';
import Modal from '@/components/ui/Modal';
import { format } from 'date-fns';
import { 
  FiMapPin, 
  FiCalendar, 
  FiEye, 
  FiTrendingUp,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import Image from 'next/image';

export default function ComplaintCard({ complaint }) {
  const [showTracking, setShowTracking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleShowTracking = async () => {
    setShowTracking(true);
    await fetchComplaintDetails();
  };

  const handleShowDetails = async () => {
    setShowDetails(true);
    await fetchComplaintDetails();
  };

  const fetchComplaintDetails = async () => {
    if (complaintData) return; // Already loaded

    setLoading(true);
    try {
      console.log('Fetching complaint details for:', complaint.unique_id);
      const response = await fetch(`/api/complaints/${complaint.unique_id}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Complaint data:', data);
        setComplaintData(data.data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching complaint:', errorData);
        alert('অভিযোগ লোড করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      alert('অভিযোগ লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // Get status progress percentage
  const getStatusProgress = (statusId) => {
    const progress = {
      1: 20,  // জমা দেওয়া হয়েছে
      2: 40,  // গ্রহণ করা হয়েছে
      3: 60,  // সমাধানের জন্য দেয়া হয়েছে
      4: 80,  // প্রক্রিয়াধীন
      5: 100  // সমাধান হয়েছে
    };
    return progress[statusId] || 0;
  };

  const progress = getStatusProgress(complaint.status_id);
  const updateCount = complaint.status_update_count || complaint.status_history?.length || 1;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        className="card overflow-hidden group relative"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-primary to-primary-light"
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {complaint.category_name}
                </h3>
                {complaint.status_id === 5 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {complaint.unique_id}
              </p>
            </div>
            <StatusBadge 
              statusId={complaint.status_id} 
              statusName={complaint.status_name} 
            />
          </div>

          {/* Image */}
          {complaint.image_url && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800">
              <Image
                src={complaint.image_url}
                alt="Complaint"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            {complaint.details}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FiMapPin className="w-4 h-4 text-primary" />
              </div>
              <span className="line-clamp-1">{complaint.union_name}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FiCalendar className="w-4 h-4 text-primary" />
              </div>
              <span className="line-clamp-1">
                {format(new Date(complaint.created_at), 'dd MMM yyyy')}
              </span>
            </div>
          </div>

          {/* Status Stats */}
          <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {updateCount} আপডেট
              </span>
            </div>
            {complaint.status_id !== 1 && (
              <div className="flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-semibold">
                  {progress}% সম্পন্ন
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowTracking}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <FiTrendingUp className="w-4 h-4" />
              <span>ট্র্যাকিং দেখুন</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowDetails}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
            >
              <FiEye className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        </div>
      </motion.div>

      {/* Tracking Modal */}
      <Modal
        isOpen={showTracking}
        onClose={() => setShowTracking(false)}
        title="অভিযোগ ট্র্যাকিং"
        size="lg"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">লোড হচ্ছে...</p>
          </div>
        ) : complaintData ? (
          <ComplaintTracking complaint={complaintData} />
        ) : (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">
              ডেটা লোড করতে সমস্যা হয়েছে
            </p>
            <button
              onClick={() => setShowTracking(false)}
              className="text-primary hover:underline"
            >
              বন্ধ করুন
            </button>
          </div>
        )}
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="অভিযোগের বিস্তারিত"
        size="lg"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">লোড হচ্ছে...</p>
          </div>
        ) : complaintData ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {complaintData.category_name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                  {complaintData.unique_id}
                </p>
              </div>
              <StatusBadge 
                statusId={complaintData.status_id} 
                statusName={complaintData.status_name} 
              />
            </div>

            {/* Image */}
            {complaintData.image_url && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={complaintData.image_url}
                  alt="Complaint"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                বর্ণনা
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {complaintData.details}
              </p>
            </div>

            {/* Location Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">উপজেলা</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {complaintData.upazila}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">ইউনিয়ন</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {complaintData.union_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">তারিখ</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {format(new Date(complaintData.created_at), 'dd MMMM yyyy, hh:mm a')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">স্ট্যাটাস</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {complaintData.status_name}
                </p>
              </div>
            </div>

            {/* User Info (if not anonymous) */}
            {!complaintData.is_anonymous && complaintData.user_name && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">অভিযোগকারী</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {complaintData.user_name}
                </p>
                {complaintData.user_email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {complaintData.user_email}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">
              ডেটা লোড করতে সমস্যা হয়েছে
            </p>
            <button
              onClick={() => setShowDetails(false)}
              className="text-primary hover:underline"
            >
              বন্ধ করুন
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}