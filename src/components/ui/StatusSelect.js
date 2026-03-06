'use client';

import { STATUSES } from '@/constants/statuses';

export default function StatusSelect({ label, value, onChange, required, error }) {
  const getStatusColorClasses = (statusId) => {
    const colorMap = {
      1: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300',
      2: 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-blue-300',
      3: 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 border-amber-300',
      4: 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 border-orange-300',
      5: 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 border-green-300',
    };
    return colorMap[statusId] || 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300';
  };

  const selectedStatus = STATUSES.find(s => s.id === parseInt(value));

  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`select-field ${error ? 'border-red-500 focus:ring-red-500' : ''} ${
          value ? getStatusColorClasses(parseInt(value)) : ''
        }`}
      >
        <option value="">স্ট্যাটাস নির্বাচন করুন</option>
        {STATUSES.map((status) => (
          <option 
            key={status.id} 
            value={status.id}
            className="py-2"
          >
            {status.name}
          </option>
        ))}
      </select>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Visual indicator below select */}
      {selectedStatus && (
        <div className="mt-2 flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${selectedStatus.bgColor}`}></span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedStatus.name}
          </span>
        </div>
      )}
    </div>
  );
}