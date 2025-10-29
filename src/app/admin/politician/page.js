'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import StatsDashboard from '@/components/admin/StatsDashboard';
import ComplaintTable from '@/components/admin/ComplaintTable';
import ComplaintDetailModal from '@/components/admin/ComplaintDetailModal';
import AgentManager from '@/components/admin/AgentManager';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FiBarChart2, FiFileText, FiUsers } from 'react-icons/fi';

export default function PoliticianDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('stats');
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (session?.user?.role !== 'politician') {
      router.push('/admin/login');
    } else {
      fetchData();
    }
  }, [session, status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchComplaints(),
        fetchAgents()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/admin/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.data);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const handleComplaintUpdate = () => {
    fetchComplaints();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="লোড হচ্ছে..." />
      </div>
    );
  }

  if (!session || session.user.role !== 'politician') {
    return null;
  }

  return (
    <AdminLayout title="রাজনীতিবিদ ড্যাশবোর্ড">
      {/* Welcome Message */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          স্বাগতম, {session.user.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          রাজনীতিবিদ প্যানেলে আপনাকে স্বাগতম। এখান থেকে আপনি সম্পূর্ণ সিস্টেম পরিচালনা করতে পারবেন।
        </p>
      </div>

      {/* Tabs */}
      <div className="card mb-6">
        <div className="border-b border-gray-200 dark:border-dark-border">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiBarChart2 className="w-5 h-5" />
              পরিসংখ্যান
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'complaints'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiFileText className="w-5 h-5" />
              অভিযোগসমূহ
            </button>
            <button
              onClick={() => setActiveTab('agents')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'agents'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiUsers className="w-5 h-5" />
              এজেন্ট ব্যবস্থাপনা
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && <StatsDashboard />}

      {activeTab === 'complaints' && (
        <ComplaintTable
          complaints={complaints}
          onViewDetails={handleViewDetails}
          loading={false}
        />
      )}

      {activeTab === 'agents' && (
        <AgentManager
          agents={agents}
          onRefresh={fetchAgents}
        />
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