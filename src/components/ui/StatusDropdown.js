'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const STATUSES = [
  { id: 1, name: 'সমস্যা/অভিযোগ জমা হয়েছে', color: 'neutral' },
  { id: 2, name: 'সমস্যা/অভিযোগটি গ্রহণ করা হয়েছে', color: 'blue' },
  { id: 3, name: 'সমস্যাটি সমাধানের জন্য দেয়া হয়েছে', color: 'secondary' },
  { id: 4, name: 'সমাধান প্রক্রিয়াধীন', color: 'primary' },
  { id: 5, name: 'সমাধান করা হয়েছে', color: 'green' }
];

export default function StatusDropdown({ label, value, onChange, required, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedStatus = STATUSES.find(s => s.id === parseInt(value));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (statusId) => {
    onChange({ target: { value: statusId } });
    setIsOpen(false);
  };

  const getStatusColorClasses = (statusId) => {
    const colorMap = {
      1: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white',
      2: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100',
      3: 'bg-secondary-200 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100',
      4: 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100',
      5: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100',
    };
    return colorMap[statusId] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white';
  };

  const getStatusDotColor = (statusId) => {
    const colorMap = {
      1: 'bg-neutral-500',
      2: 'bg-blue-500',
      3: 'bg-secondary-600',
      4: 'bg-primary',
      5: 'bg-green-500',
    };
    return colorMap[statusId] || 'bg-neutral-500';
  };

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Custom Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-lg border ${
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-secondary-300 dark:border-neutral-600 focus:ring-primary'
        } bg-white dark:bg-dark-card text-left flex items-center justify-between transition-all ${
          isOpen ? 'ring-2 ring-primary' : ''
        } ${selectedStatus ? getStatusColorClasses(selectedStatus.id) : ''}`}
      >
        <div className="flex items-center gap-3 flex-1">
          {selectedStatus ? (
            <>
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusDotColor(selectedStatus.id)}`} />
              <span className="font-medium text-sm">{selectedStatus.name}</span>
            </>
          ) : (
            <span className="text-neutral-500 dark:text-neutral-400 text-sm">স্ট্যাটাস নির্বাচন করুন</span>
          )}
        </div>
        <FiChevronDown 
          className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white dark:bg-dark-card rounded-lg shadow-xl border border-secondary-200 dark:border-neutral-700 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto">
              {STATUSES.map((status) => {
                const isSelected = selectedStatus?.id === status.id;
                
                return (
                  <button
                    key={status.id}
                    type="button"
                    onClick={() => handleSelect(status.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 transition-all text-left ${
                      isSelected 
                        ? getStatusColorClasses(status.id) + ' font-semibold'
                        : 'hover:bg-secondary-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusDotColor(status.id)}`} />
                    <span className="flex-1 text-sm">{status.name}</span>
                    {isSelected && (
                      <FiCheck className="w-5 h-5 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}