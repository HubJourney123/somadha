'use client';

import { useState } from 'react';
import { FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import StatusBadge from '@/components/complaint/StatusBadge';
import { format } from 'date-fns';
import { CATEGORIES } from '@/constants/categories';
import { STATUSES } from '@/constants/statuses';
import { LOCATIONS } from '@/constants/locations';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

export default function ComplaintTable({ complaints = [], onViewDetails, loading }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [upazilaFilter, setUpazilaFilter] = useState('');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.unique_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || complaint.category_id === parseInt(categoryFilter);
    const matchesStatus = !statusFilter || complaint.status_id === parseInt(statusFilter);
    const matchesUpazila = !upazilaFilter || complaint.upazila === upazilaFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesUpazila;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="অনুসন্ধান করুন (ID বা বিবরণ)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <Select
            placeholder="সকল ধরন"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={CATEGORIES.map(cat => ({
              value: cat.id,
              label: cat.name
            }))}
          />

          <Select
            placeholder="সকল স্ট্যাটাস"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={STATUSES.map(status => ({
              value: status.id,
              label: status.name
            }))}
          />

          <Select
            placeholder="সকল উপজেলা"
            value={upazilaFilter}
            onChange={(e) => setUpazilaFilter(e.target.value)}
            options={LOCATIONS.upazilas.map(u => u.name)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  অভিযোগ ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  ধরন
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  স্থান
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  স্ট্যাটাস
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  তারিখ
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  অ্যাকশন
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <div className="spinner mx-auto" />
                  </td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    কোনো অভিযোগ পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr 
                    key={complaint.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {complaint.unique_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {complaint.category_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {complaint.upazila}, {complaint.union_name}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge 
                        statusId={complaint.status_id} 
                        statusName={complaint.status_name}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {format(new Date(complaint.created_at), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onViewDetails(complaint)}
                        className="p-2 text-primary hover:bg-primary-light dark:hover:bg-primary/20 rounded-lg transition-colors"
                      >
                        <FiEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Result count */}
      {!loading && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          মোট {filteredComplaints.length} টি অভিযোগ পাওয়া গেছে
        </p>
      )}
    </div>
  );
}