'use client';

import { useSession, signOut } from 'next-auth/react';
import { FiLogOut, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminLayout({ children, title }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Top Header */}
      <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & User Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">স</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    সমাধা অ্যাডমিন
                  </h1>
                  {session?.user && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {session.user.role === 'developer' && 'ডেভেলপার'}
                      {session.user.role === 'politician' && 'রাজনীতিবিদ'}
                      {session.user.role === 'agent' && 'এজেন্ট'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - User & Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <FiMoon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              )}

              {/* User Profile */}
              {session?.user && (
                <div className="hidden md:flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        {session.user.name?.charAt(0) || 'A'}
                      </span>
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {session.user.name}
                    </p>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="লগআউট"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 lg:p-8">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {title}
          </h2>
        )}
        {children}
      </main>
    </div>
  );
}