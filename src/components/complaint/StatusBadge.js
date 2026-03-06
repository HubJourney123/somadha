//src/components/complaint/StatusBadge.js
'use client';
import { getStatusBadgeClasses } from '@/constants/statuses';

export default function StatusBadge({ statusId, statusName }) {
  const badgeClasses = getStatusBadgeClasses(statusId);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses}`}>
      {statusName}
    </span>
  );
}
/*import { STATUSES } from '@/constants/statuses';

export default function StatusBadge({ statusId, statusName }) {
  const status = STATUSES.find(s => s.id === statusId);
  const colorClass = status?.color || 'bg-gray-500';
  const statusText = statusName || status?.name || 'অজানা';

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${colorClass}`}>
      {statusText}
    </span>
  );
}*/