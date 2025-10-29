'use client';

import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiEye } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import { format } from 'date-fns';
import Image from 'next/image';

export default function ComplaintCard({ complaint, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
            {complaint.category_name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ID: {complaint.unique_id}
          </p>
        </div>
        <StatusBadge statusId={complaint.status_id} statusName={complaint.status_name} />
      </div>

      {complaint.image_url && (
        <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden">
          <Image
            src={complaint.image_url}
            alt="Complaint"
            fill
            className="object-cover"
          />
        </div>
      )}

      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
        {complaint.details}
      </p>

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1">
          <FiMapPin className="w-4 h-4" />
          <span>{complaint.upazila}</span>
        </div>
        <div className="flex items-center gap-1">
          <FiCalendar className="w-4 h-4" />
          <span>{format(new Date(complaint.created_at), 'dd/MM/yyyy')}</span>
        </div>
      </div>

      <button className="mt-3 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium">
        <FiEye className="w-4 h-4" />
        বিস্তারিত দেখুন
      </button>
    </motion.div>
  );
}