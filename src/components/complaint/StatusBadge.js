'use client';

import { STATUSES } from '@/constants/statuses';

export default function StatusBadge({ statusId, statusName }) {
  const status = STATUSES.find(s => s.id === statusId);
  const colorClass = status?.color || 'bg-gray-500';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${colorClass}`}>
      {statusName || status?.name || 'অজানা'}
    </span>
  );
}