'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiGrid, FiPlusCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      name: 'হোম',
      href: '/',
      icon: FiHome,
    },
    {
      name: 'সমস্যা পোস্ট করুন',
      href: '/post-complaint',
      icon: FiPlusCircle,
      isPrimary: true,
    },
    {
      name: 'ড্যাশবোর্ড',
      href: '/dashboard',
      icon: FiGrid,
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-24 md:hidden" />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50" />
        
        {/* Content */}
        <div className="relative px-6 py-3">
          <div className="flex items-end justify-around gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group flex-1 max-w-[100px]"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center justify-center gap-1.5"
                  >
                    {/* Floating Icon Circle */}
                    <div className={`
                      relative flex items-center justify-center
                      ${item.isPrimary ? 'w-16 h-16 -mt-8' : 'w-14 h-14 -mt-6'}
                      transition-all duration-300
                    `}>
                      {/* Glow effect - Always present when active */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.6, scale: 1 }}
                          className={`
                            absolute inset-0 rounded-full blur-lg animate-pulse
                            bg-gradient-to-r from-primary to-orange-600
                          `}
                        />
                      )}
                      
                      {/* Main Circle */}
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isActive ? 1 : 0.85,
                          y: isActive ? 0 : 2,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`
                          relative w-full h-full rounded-full flex items-center justify-center
                          transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-br from-primary to-orange-600 shadow-xl shadow-orange-500/30' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 shadow-md'
                          }
                        `}
                      >
                        {/* Inner glow ring */}
                        {isActive && (
                          <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                        )}
                        
                        {/* Icon */}
                        <Icon 
                          className={`
                            ${item.isPrimary ? 'w-8 h-8' : 'w-7 h-7'}
                            relative z-10 transition-all duration-300
                            ${isActive 
                              ? 'text-white' 
                              : 'text-gray-600 dark:text-gray-400'
                            }
                          `} 
                        />

                        {/* Rotating border effect when active */}
                        {isActive && (
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'conic-gradient(from 0deg, transparent 0%, rgba(255, 146, 72, 0.3) 50%, transparent 100%)',
                            }}
                          />
                        )}
                      </motion.div>

                      {/* Ripple effect on active */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.4, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full border-2 border-primary"
                        />
                      )}
                    </div>

                    {/* Label */}
                    <motion.span 
                      initial={false}
                      animate={{
                        scale: isActive ? 1 : 0.9,
                        y: isActive ? 0 : 2,
                      }}
                      className={`
                        text-[11px] font-medium transition-all duration-300 text-center leading-tight
                        max-w-[80px] line-clamp-2
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent font-bold' 
                          : 'text-gray-600 dark:text-gray-400'
                        }
                      `}
                    >
                      {item.name}
                    </motion.span>

                    {/* Dot indicator below text */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="w-1 h-1 rounded-full bg-gradient-to-r from-primary to-orange-600"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom safe area for iOS */}
        <div className="h-safe-area-inset-bottom bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl" />
      </nav>
    </>
  );
}