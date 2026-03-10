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
      color: 'from-primary to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      name: 'সমস্যা পোস্ট করুন',
      href: '/post-complaint',
      icon: FiPlusCircle,
      color: 'from-primary to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      isPrimary: true,
    },
    {
      name: 'ড্যাশবোর্ড',
      href: '/dashboard',
      icon: FiGrid,
      color: 'from-primary to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="h-20 md:hidden" />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800" />
        
        {/* Content */}
        <div className="relative px-2 py-2">
          <div className="grid grid-cols-3 gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative group"
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex flex-col items-center justify-center gap-1.5 py-2 px-3 rounded-2xl
                      transition-all duration-300
                      ${isActive 
                        ? `${item.bgColor} shadow-sm` 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {/* Icon Container */}
                    <div className={`
                      relative flex items-center justify-center
                      ${item.isPrimary && isActive ? 'w-14 h-14 -mt-6' : 'w-10 h-10'}
                      transition-all duration-300
                    `}>
                      {/* Primary button special treatment */}
                      {item.isPrimary && isActive ? (
                        <>
                          {/* Glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-600 rounded-full blur-md opacity-60 animate-pulse" />
                          
                          {/* Main circle */}
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative w-full h-full bg-gradient-to-br from-primary to-orange-600 rounded-full shadow-lg flex items-center justify-center"
                          >
                            <Icon className="w-7 h-7 text-white" />
                          </motion.div>
                        </>
                      ) : (
                        <>
                          {/* Active indicator for non-primary */}
                          {isActive && !item.isPrimary && (
                            <motion.div
                              layoutId="activeIndicator"
                              className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-xl opacity-10`}
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                          
                          {/* Icon */}
                          <Icon 
                            className={`
                              w-6 h-6 relative z-10 transition-all duration-300
                              ${isActive 
                                ? `bg-gradient-to-br ${item.color} bg-clip-text text-transparent` 
                                : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                              }
                            `} 
                          />
                        </>
                      )}
                    </div>

                    {/* Label */}
                    {!item.isPrimary && (
                      <span 
                        className={`
                          text-[10px] font-medium transition-all duration-300 text-center leading-tight
                          ${isActive 
                            ? 'text-gray-900 dark:text-white font-semibold' 
                            : 'text-gray-600 dark:text-gray-400'
                          }
                        `}
                      >
                        {item.name}
                      </span>
                    )}
                    
                    {/* Primary button label (below the circle) */}
                    {item.isPrimary && (
                      <span 
                        className={`
                          text-[10px] font-medium transition-all duration-300 text-center leading-tight
                          ${isActive ? 'mt-1' : 'mt-0'}
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent font-semibold' 
                            : 'text-gray-600 dark:text-gray-400'
                          }
                        `}
                      >
                        {item.name}
                      </span>
                    )}

                    {/* Ripple effect on tap */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl`}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom safe area for iOS */}
        <div className="h-safe-area-inset-bottom bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg" />
      </nav>
    </>
  );
}