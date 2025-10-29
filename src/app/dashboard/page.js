'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import ComplaintCard from '@/components/complaint/ComplaintCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/complaint/StatusBadge';
import { motion } from 'framer-motion';
import { FiSearch, FiLogIn, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import Image from 'next/image';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (session) {
      fetchUserComplaints();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchUserComplaints = async () => {
    try {
      const response = await fetch('/api/complaints/user');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchById = async (e) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      alert('অনুগ্রহ করে অভিযোগ আইডি লিখুন');
      return;
    }

    setSearchLoading(true);
    setSearchResult(null);

    try {
      const response = await fetch(`/api/complaints/${searchId.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data.data);
      } else {
        alert('এই আইডি দিয়ে কোনো অভিযোগ পাওয়া যায়নি');
      }
    } catch (error) {
      console.error('Error searching complaint:', error);
      alert('অনুসন্ধানে সমস্যা হয়েছে');
    } finally {
      setSearchLoading(false);
    }
  };

  const viewComplaintDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  // Not logged in view
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <LoadingSpinner text="লোড হচ্ছে..." />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Header />
        
        <main className="container-padding with-bottom-nav py-8">
          <div className="max-w-2xl mx-auto">
            {/* Search by ID */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                অভিযোগ খুঁজুন
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                আপনার অভিযোগ আইডি দিয়ে অভিযোগের অবস্থা দেখুন
              </p>
              <form onSubmit={handleSearchById} className="flex gap-3">
                <Input
                  placeholder="SMD-XXXXX-XXXX"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="primary"
                  loading={searchLoading}
                >
                  <FiSearch className="w-5 h-5" />
                  খুঁজুন
                </Button>
              </form>

              {/* Search Result */}
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gray-50 dark:bg-dark-card rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {searchResult.category_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {searchResult.unique_id}
                      </p>
                    </div>
                    <StatusBadge 
                      statusId={searchResult.status_id} 
                      statusName={searchResult.status_name}
                    />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    {searchResult.details}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => viewComplaintDetails(searchResult)}
                  >
                    বিস্তারিত দেখুন
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Login prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-light dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLogIn className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                সাইন ইন করুন
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                আপনার সব অভিযোগ এক জায়গায় দেখতে এবং সহজে ট্র্যাক করতে সাইন ইন করুন
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => signIn('google')}
              >
                <FiLogIn className="w-5 h-5" />
                Google দিয়ে সাইন ইন করুন
              </Button>
            </motion.div>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // Logged in view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-padding with-bottom-nav py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="page-title">আমার ড্যাশবোর্ড</h1>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner text="অভিযোগ লোড হচ্ছে..." />
            </div>
          ) : complaints.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                কোনো অভিযোগ নেই
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                আপনি এখনো কোনো অভিযোগ পোস্ট করেননি
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/post-complaint')}
              >
                প্রথম অভিযোগ পোস্ট করুন
              </Button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                মোট {complaints.length} টি অভিযোগ পাওয়া গেছে
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {complaints.map((complaint) => (
                  <ComplaintCard
                    key={complaint.id}
                    complaint={complaint}
                    onClick={() => viewComplaintDetails(complaint)}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </main>

      <BottomNav />

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedComplaint(null);
          }}
          title="অভিযোগের বিস্তারিত"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedComplaint.category_name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ID: {selectedComplaint.unique_id}
                </p>
              </div>
              <StatusBadge 
                statusId={selectedComplaint.status_id} 
                statusName={selectedComplaint.status_name}
              />
            </div>

            {selectedComplaint.image_url && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={selectedComplaint.image_url}
                  alt="Complaint"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                বিস্তারিত
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedComplaint.details}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">স্থান</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {selectedComplaint.upazila}, {selectedComplaint.union_name}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 mb-1">তারিখ</p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {format(new Date(selectedComplaint.created_at), 'dd MMMM yyyy')}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}