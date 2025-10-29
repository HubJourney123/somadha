'use client';

import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

export default function AgentManager({ agents = [], onRefresh }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    phone: '',
    email: ''
  });

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      phone: '',
      email: ''
    });
    setShowPassword(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create agent');
      }

      alert('এজেন্ট সফলভাবে তৈরি হয়েছে!');
      setShowCreateModal(false);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Error creating agent:', error);
      alert(error.message || 'এজেন্ট তৈরি করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        agentId: selectedAgent.id,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch('/api/admin/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update agent');
      }

      alert('এজেন্ট সফলভাবে আপডেট হয়েছে!');
      setShowEditModal(false);
      setSelectedAgent(null);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Error updating agent:', error);
      alert(error.message || 'এজেন্ট আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (agentId) => {
    if (!confirm('আপনি কি নিশ্চিত এই এজেন্টকে মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/agents?id=${agentId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete agent');
      }

      alert('এজেন্ট সফলভাবে মুছে ফেলা হয়েছে!');
      onRefresh();
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert(error.message || 'এজেন্ট মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const handleToggleStatus = async (agent) => {
    try {
      const response = await fetch('/api/admin/agents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          isActive: !agent.is_active
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update agent status');
      }

      onRefresh();
    } catch (error) {
      console.error('Error toggling agent status:', error);
      alert('স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে');
    }
  };

  const openEditModal = (agent) => {
    setSelectedAgent(agent);
    setFormData({
      username: agent.username,
      password: '',
      fullName: agent.full_name,
      phone: agent.phone || '',
      email: agent.email || ''
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          এজেন্ট ব্যবস্থাপনা
        </h2>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
        >
          <FiPlus className="w-5 h-5" />
          নতুন এজেন্ট যোগ করুন
        </Button>
      </div>

      {/* Agents List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  ব্যবহারকারীর নাম
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  পুরো নাম
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  ফোন
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  ইমেইল
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  স্ট্যাটাস
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
              {agents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    কোনো এজেন্ট পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr 
                    key={agent.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {agent.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {agent.full_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {agent.phone || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {agent.email || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(agent)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          agent.is_active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {agent.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(agent)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="সম্পাদনা করুন"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Agent Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="নতুন এজেন্ট যোগ করুন"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="ব্যবহারকারীর নাম"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="username"
          />

          <div className="relative">
            <Input
              label="পাসওয়ার্ড"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          <Input
            label="পুরো নাম"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="এজেন্টের পুরো নাম"
          />

          <Input
            label="ফোন নম্বর"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="01XXXXXXXXX"
          />

          <Input
            label="ইমেইল"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="agent@example.com"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              তৈরি করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Agent Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAgent(null);
          resetForm();
        }}
        title="এজেন্ট সম্পাদনা করুন"
      >
        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            label="ব্যবহারকারীর নাম"
            value={formData.username}
            disabled
          />

          <div className="relative">
            <Input
              label="নতুন পাসওয়ার্ড (ঐচ্ছিক)"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="পরিবর্তন করতে চাইলে লিখুন"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          <Input
            label="পুরো নাম"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />

          <Input
            label="ফোন নম্বর"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="ইমেইল"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowEditModal(false);
                setSelectedAgent(null);
                resetForm();
              }}
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              আপডেট করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}