'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState('agent');
  const [loading, setLoading] = useState(false);
  
  // Agent login
  const [agentData, setAgentData] = useState({
    username: '',
    password: ''
  });

  // Admin login
  const [adminData, setAdminData] = useState({
    email: '',
    password: '',
    role: 'developer'
  });

  const handleAgentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('agent-login', {
        username: agentData.username,
        password: agentData.password,
        redirect: false
      });

      if (result?.error) {
        alert('লগইন ব্যর্থ হয়েছে। ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল।');
      } else {
        router.push('/admin/agent');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('লগইন করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('admin-login', {
        email: adminData.email,
        password: adminData.password,
        role: adminData.role,
        redirect: false
      });

      if (result?.error) {
        alert('লগইন ব্যর্থ হয়েছে। ইমেইল বা পাসওয়ার্ড ভুল।');
      } else {
        router.push(`/admin/${adminData.role}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('লগইন করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">স</span>
            </div>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              সমাধা
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            অ্যাডমিন লগইন
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {/* Login Type Selector */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setLoginType('agent')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                loginType === 'agent'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              এজেন্ট
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                loginType === 'admin'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              অ্যাডমিন
            </button>
          </div>

          {/* Agent Login Form */}
          {loginType === 'agent' && (
            <form onSubmit={handleAgentLogin} className="space-y-4">
              <div className="relative">
                <FiUser className="absolute left-3 top-[42px] text-gray-400" />
                <Input
                  label="ব্যবহারকারীর নাম"
                  required
                  value={agentData.username}
                  onChange={(e) => setAgentData({ ...agentData, username: e.target.value })}
                  placeholder="username"
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-[42px] text-gray-400" />
                <Input
                  label="পাসওয়ার্ড"
                  type="password"
                  required
                  value={agentData.password}
                  onChange={(e) => setAgentData({ ...agentData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                লগইন করুন
              </Button>
            </form>
          )}

          {/* Admin Login Form */}
          {loginType === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Select
                label="অ্যাডমিন ধরন"
                required
                value={adminData.role}
                onChange={(e) => setAdminData({ ...adminData, role: e.target.value })}
                options={[
                  { value: 'developer', label: 'Developer' },
                  { value: 'politician', label: 'Politician' }
                ]}
              />

              <div className="relative">
                <FiMail className="absolute left-3 top-[42px] text-gray-400" />
                <Input
                  label="ইমেইল"
                  type="email"
                  required
                  value={adminData.email}
                  onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="pl-10"
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-[42px] text-gray-400" />
                <Input
                  label="পাসওয়ার্ড"
                  type="password"
                  required
                  value={adminData.password}
                  onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                লগইন করুন
              </Button>
            </form>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
          >
            ← হোমপেজে ফিরে যান
          </button>
        </div>
      </motion.div>
    </div>
  );
}