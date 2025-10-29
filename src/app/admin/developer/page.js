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
import { FiBarChart2, FiFileText, FiUsers, FiSettings } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function DeveloperDashboardPage() {
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
    } else if (session?.user?.role !== 'developer') {
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

  if (!session || session.user.role !== 'developer') {
    return null;
  }

  return (
    <AdminLayout title="ডেভেলপার ড্যাশবোর্ড">
      {/* Welcome Message */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          স্বাগতম, Developer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          ডেভেলপার প্যানেলে আপনাকে স্বাগতম। আপনার সম্পূর্ণ সিস্টেম অ্যাক্সেস রয়েছে।
        </p>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              মোট অভিযোগ
            </h3>
            <FiFileText className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {complaints.length}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              মোট এজেন্ট
            </h3>
            <FiUsers className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {agents.length}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              সক্রিয় এজেন্ট
            </h3>
            <FiSettings className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {agents.filter(a => a.is_active).length}
          </p>
        </div>
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
            <button
              onClick={() => setActiveTab('system')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'system'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FiSettings className="w-5 h-5" />
              সিস্টেম
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

      {activeTab === 'system' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              সিস্টেম তথ্য
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-gray-600 dark:text-gray-400">অ্যাপ্লিকেশন নাম</span>
                <span className="font-semibold text-gray-900 dark:text-white">সমাধা</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-gray-600 dark:text-gray-400">ভার্সন</span>
                <span className="font-semibold text-gray-900 dark:text-white">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-dark-border">
                <span className="text-gray-600 dark:text-gray-400">ডাটাবেস</span>
                <span className="font-semibold text-gray-900 dark:text-white">Neon PostgreSQL</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 dark:text-gray-400">ডিপ্লয়মেন্ট</span>
                <span className="font-semibold text-gray-900 dark:text-white">Vercel</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              দ্রুত অ্যাকশন
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="secondary" fullWidth>
                ডাটাবেস ব্যাকআপ
              </Button>
              <Button variant="secondary" fullWidth>
                সিস্টেম লগ দেখুন
              </Button>
              <Button variant="secondary" fullWidth>
                ইউজার রিপোর্ট
              </Button>
              <Button variant="secondary" fullWidth>
                পারফরম্যান্স মনিটর
              </Button>
            </div>
          </div>

          <div className="card p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-300 mb-2">
              ⚠️ ডেভেলপার নোট
            </h3>
            <p className="text-yellow-800 dark:text-yellow-400 text-sm">
              এই প্যানেল শুধুমাত্র ডেভেলপারদের জন্য। সিস্টেম পরিবর্তন করার আগে সতর্ক থাকুন।
            </p>
          </div>
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