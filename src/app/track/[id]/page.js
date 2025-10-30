'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ComplaintTracking from '@/components/complaint/ComplaintTracking';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

export default function TrackComplaintPage() {
  const params = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchComplaint(params.id);
    }
  }, [params.id]);

  const fetchComplaint = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/complaints/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        setComplaint(data.data);
      } else {
        setError('অভিযোগ খুঁজে পাওয়া যায়নি');
      }
    } catch (err) {
      console.error('Error fetching complaint:', err);
      setError('ডেটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-padding with-bottom-nav py-8">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <LoadingSpinner text="লোড হচ্ছে..." />
          ) : error ? (
            <div className="card p-12 text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => window.history.back()}
                className="text-primary hover:underline"
              >
                ← ফিরে যান
              </button>
            </div>
          ) : complaint ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <ComplaintTracking complaint={complaint} />
            </motion.div>
          ) : null}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}