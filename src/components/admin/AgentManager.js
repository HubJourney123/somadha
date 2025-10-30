'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUserPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { UPAZILAS } from '@/constants/locations';

export default function AgentManager({ agents, onRefresh }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
    upazila: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('এজেন্ট সফলভাবে তৈরি হয়েছে!');
        setShowCreateModal(false);
        setFormData({
          username: '',
          password: '',
          name: '',
          email: '',
          phone: '',
          upazila: ''
        });
        onRefresh();
      } else {
        alert(data.error || 'এজেন্ট তৈরি করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('এজেন্ট তৈরি করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = async (id, currentStatus) => {
    if (!confirm(`এজেন্ট ${currentStatus ? 'নিষ্ক্রিয়' : 'সক্রিয়'} করতে চান?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          is_active: !currentStatus
        }),
      });

      if (response.ok) {
        alert('এজেন্ট স্ট্যাটাস আপডেট হয়েছে!');
        onRefresh();
      } else {
        alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const deleteAgent = async (id) => {
    if (!confirm('এই এজেন্ট মুছে ফেলতে চান? এটি পুনরুদ্ধার করা যাবে না।')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/agents?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('এজেন্ট মুছে ফেলা হয়েছে!');
        onRefresh();
      } else {
        alert('এজেন্ট মুছতে সমস্যা হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('এজেন্ট মুছতে সমস্যা হয়েছে');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          এজেন্ট ব্যবস্থাপনা
        </h2>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <FiUserPlus className="w-5 h-5" />
          নতুন এজেন্ট তৈরি করুন
        </Button>
      </div>

      {agents.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            কোনো এজেন্ট পাওয়া যায়নি
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-card border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    নাম
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ইউজারনেম
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    উপজেলা
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ফোন
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-bg divide-y divide-gray-200 dark:divide-gray-700">
                {agents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {agent.name}
                      </div>
                      {agent.email && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {agent.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {agent.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {agent.upazila || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {agent.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          agent.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {agent.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => toggleAgentStatus(agent.id, agent.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          agent.is_active
                            ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                        title={agent.is_active ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                      >
                        {agent.is_active ? <FiX className="w-5 h-5" /> : <FiCheck className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => deleteAgent(agent.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Agent Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="নতুন এজেন্ট তৈরি করুন"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="ইউজারনেম *"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="agent123"
          />

          <Input
            label="পাসওয়ার্ড *"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="••••••••"
          />

          <Input
            label="নাম *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="এজেন্টের পূর্ণ নাম"
          />

          <Input
            label="ইমেইল"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="agent@example.com"
          />

          <Input
            label="ফোন"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="01712345678"
          />

          <Select
            label="উপজেলা"
            value={formData.upazila}
            onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
            options={[
              { value: '', label: 'উপজেলা নির্বাচন করুন' },
              ...UPAZILAS.map(u => ({ value: u, label: u }))
            ]}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => setShowCreateModal(false)}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              এজেন্ট তৈরি করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}