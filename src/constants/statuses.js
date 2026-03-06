//src/constants/statuses.js
// Complaint status constants
// Complaint status constants
export const STATUSES = [
  { 
    id: 1, 
    name: 'সমস্যা/অভিযোগ জমা হয়েছে', 
    nameEn: 'Complaint Submitted',
    color: 'gray',
    bgColor: 'bg-gray-500',
    textColor: 'text-white'
  },
  { 
    id: 2, 
    name: 'সমস্যা/অভিযোগটি গ্রহণ করা হয়েছে', 
    nameEn: 'Received',
    color: 'blue',
    bgColor: 'bg-blue-500',
    textColor: 'text-white'
  },
  { 
    id: 3, 
    name: 'সমস্যাটি সমাধানের জন্য দেয়া হয়েছে', 
    nameEn: 'Assigned',
    color: 'amber',
    bgColor: 'bg-amber-500',
    textColor: 'text-white'
  },
  { 
    id: 4, 
    name: 'সমাধান প্রক্রিয়াধীন', 
    nameEn: 'In Progress',
    color: 'orange',
    bgColor: 'bg-orange-500',
    textColor: 'text-white'
  },
  { 
    id: 5, 
    name: 'সমাধান করা হয়েছে', 
    nameEn: 'Resolved',
    color: 'green',
    bgColor: 'bg-green-500',
    textColor: 'text-white'
  },
];

// Helper function to get status color
export const getStatusColor = (statusId) => {
  const status = STATUSES.find(s => s.id === statusId);
  return status ? status.color : 'gray';
};

// Helper function to get status badge classes
export const getStatusBadgeClasses = (statusId) => {
  const colorMap = {
    1: 'bg-gray-500 text-white',
    2: 'bg-blue-500 text-white',
    3: 'bg-amber-500 text-white',
    4: 'bg-orange-500 text-white',
    5: 'bg-green-500 text-white',
  };
  return colorMap[statusId] || 'bg-gray-500 text-white';
};