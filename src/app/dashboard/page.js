'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ComplaintCard from '@/components/complaint/ComplaintCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { FiPlus, FiRefreshCw, FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Separate component that uses useSearchParams
function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchComplaints();
    }
  }, [status, router]);

  // Check for refresh param (from complaint posting)
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh');
    if (shouldRefresh === 'true') {
      fetchComplaints();
      // Remove the query param
      router.replace('/dashboard');
    }
  }, [searchParams, router]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.data || []);
        setFilteredComplaints(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  // Filter complaints based on search and status
  useEffect(() => {
    let filtered = [...complaints];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(complaint => 
        complaint.unique_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        complaint.category_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(complaint => 
        complaint.status_id === parseInt(filterStatus)
      );
    }

    setFilteredComplaints(filtered);
  }, [searchQuery, filterStatus, complaints]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner text="লোড হচ্ছে..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-padding with-bottom-nav py-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              আমার ড্যাশবোর্ড
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              মোট {complaints.length} টি অভিযোগ
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">রিফ্রেশ</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => router.push('/post-complaint')}
            >
              <FiPlus className="w-5 h-5" />
              নতুন অভিযোগ
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="আইডি, বিবরণ বা ক্যাটাগরি দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="md:w-64">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                >
                  <option value="all">সকল স্ট্যাটাস</option>
                  <option value="1">জমা দেওয়া হয়েছে</option>
                  <option value="2">গ্রহণ করা হয়েছে</option>
                  <option value="3">সমাধানের জন্য দেয়া হয়েছে</option>
                  <option value="4">প্রক্রিয়াধীন</option>
                  <option value="5">সমাধান হয়েছে</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          {(searchQuery || filterStatus !== 'all') && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {filteredComplaints.length} টি ফলাফল পাওয়া গেছে
            </div>
          )}
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner text="অভিযোগ লোড হচ্ছে..." />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-12 text-center"
          >
            {searchQuery || filterStatus !== 'all' ? (
              <>
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  কোনো ফলাফল পাওয়া যায়নি
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  আপনার সার্চ বা ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterStatus('all');
                  }}
                >
                  ফিল্টার রিসেট করুন
                </Button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPlus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  এখনো কোনো অভিযোগ নেই
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  আপনার প্রথম অভিযোগ পোস্ট করুন এবং ট্র্যাক করুন
                </p>
                <Button
                  variant="primary"
                  onClick={() => router.push('/post-complaint')}
                >
                  <FiPlus className="w-5 h-5" />
                  অভিযোগ পোস্ট করুন
                </Button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ComplaintCard complaint={complaint} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

// Main component with Suspense wrapper
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner text="লোড হচ্ছে..." />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}