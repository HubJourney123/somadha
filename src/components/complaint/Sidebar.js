'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiFileText, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

export default function Sidebar({ role }) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: 'ড্যাশবোর্ড',
      icon: FiHome,
      href: role === 'developer' ? '/admin/developer' : '/admin/agent',
      roles: ['developer', 'politician', 'agent']
    },
    {
      label: 'অভিযোগ ব্যবস্থাপনা',
      icon: FiFileText,
      href: role === 'developer' ? '/admin/developer' : '/admin/agent',
      roles: ['developer', 'politician', 'agent']
    },
    {
      label: 'এজেন্ট ব্যবস্থাপনা',
      icon: FiUsers,
      href: '/admin/developer',
      roles: ['developer', 'politician']
    }
  ];

  const filteredItems = menuItems.filter(item => 
    item.roles.includes(role)
  );

  return (
    <div className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-primary">সমাধা</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {role}
        </p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">লগআউট</span>
        </button>
      </div>
    </div>
  );
}