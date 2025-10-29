'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import ComplaintTable from '@/components/admin/ComplaintTable';
import ComplaintDetailModal from '@/components/admin/ComplaintDetailModal';
import ActivityForm from '@/components/admin/ActivityForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FiFileText, FiActivity } from 'react-icons/fi';

export default function AgentDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('complaints');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (session?.user?.role !== 'agent') {
      router.push('/admin/login');
    } else {
      fetchComplaints();
    }
  }, [session, status, router]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/complaints');
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

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const handleComplaintUpdate = () => {
    fetchComplaints();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="লোড হচ্ছে..." />
      </div>
    );
  }

  if (!session || session.user.role !== 'agent') {
    return null;
  }

  return (
    <AdminLayout title="এজেন্ট ড্যাশবোর্ড">
      {/* Welcome Message */}
      <div className="card p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          স্বাগতম, {session.user.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          এজেন্ট প্যানেলে আপনাকে স্বাগতম। এখান থেকে আপনি অভিযোগ ব্যবস্থাপনা এবং কার্যক্রম যোগ করতে পারবেন।
        </p>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="border-b border-gray-200 dark:border-dark-border">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'complaints'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiFileText className="w-5 h-5" />
              অভিযোগ ব্যবস্থাপনা
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'activities'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiActivity className="w-5 h-5" />
              কার্যক্রম যোগ করুন
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'complaints' && (
        <ComplaintTable
          complaints={complaints}
          onViewDetails={handleViewDetails}
          loading={loading}
        />
      )}

      {activeTab === 'activities' && (
        <div className="max-w-3xl">
          <ActivityForm onSuccess={() => alert('কার্যক্রম সফলভাবে যোগ করা হয়েছে!')} />
        </div>
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedComplaint(null);
          }}
          onUpdate={handleComplaintUpdate}
        />
      )}
    </AdminLayout>
  );
}