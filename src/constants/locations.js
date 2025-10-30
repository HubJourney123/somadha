// Location constants
export const LOCATIONS = {
  district: 'ব্রাহ্মণবাড়িয়া',
  upazilas: [
    {
      id: 1,
      name: 'ব্রাহ্মণবাড়িয়া সদর',
      unions: [
        'বাসুদেব',
        'মাছিহাতা',
        'সুলতানপুর',
        'রামরাইল',
        'সাদেকপুর',
        'নাটাই (উত্তর)',
        'নাটাই (দক্ষিণ)',
        'সুহিলপুর',
        'মজলিশপুর',
        'বুধল',
        'তালশহর (পূর্ব)',
      ]
    },
    {
      id: 2,
      name: 'কসবা',
      unions: [
        'কসবা',
        'বিলাশপুর',
        'চান্দুরা',
        'চান্দলা',
        'দেবপুর',
        'দুধঘর',
        'মীরপুর',
        'মাধবপুর',
        'মাধবপুর (পূর্ব)',
        'মাধবপুর (পশ্চিম)',
        'নোয়াগাঁও',
      ]
    },
    {
      id: 3,
      name: 'নাসিরনগর',
      unions: [
        'নাসিরনগর',
        'দুলারামপুর',
        'বড়াইল',
        'পলাশপুর',
        'পানিশ্বর',
        'রামপুর',
      ]
    },
    {
      id: 4,
      name: 'সরাইল',
      unions: [
        'সরাইল',
        'বেজপাড়া',
        'দাউদপুর',
        'হরিপুর',
        'বেজরা',
        'সতেরখন্দল',
      ]
    },
    {
      id: 5,
      name: 'আখাউড়া',
      unions: [
        'আখাউড়া',
        'বড়বাড়িয়া',
        'বড়তাকিয়া',
        'দরুইন',
        'মুরাদপুর',
        'নোয়াগাঁও',
      ]
    },
    {
      id: 6,
      name: 'নবীনগর',
      unions: [
        'নবীনগর',
        'বড়াইল',
        'বড়ঘর',
        'বড়মুড়া',
      ]
    },
    {
      id: 7,
      name: 'বাঞ্ছারামপুর',
      unions: [
        'বাঞ্ছারামপুর',
        'বড়াইল',
        'বড়ঘর',
        'বড়মুড়া',
      ]
    },
    {
      id: 8,
      name: 'বিজয়নগর',
      unions: [
        'বিজয়নগর',
        'বিজয়নগর (পূর্ব)',
        'বিজয়নগর (পশ্চিম)',
      ]
    },
    {
      id: 9,
      name: 'আশুগঞ্জ',
      unions: [
        'আশুগঞ্জ',
        'বড়ঘর',
        'বড়মুড়া',
        'বড়াইল',
      ]
    },
  ]
};

// Helper to get just upazila names
export const UPAZILAS = LOCATIONS.upazilas.map(u => u.name);

// Helper to get unions by upazila name
export const getUnionsByUpazila = (upazilaName) => {
  const upazila = LOCATIONS.upazilas.find(u => u.name === upazilaName);
  return upazila ? upazila.unions : [];
};

// Complaint categories
export const CATEGORIES = [
  { id: 1, name: 'অবকাঠামো', nameEn: 'Infrastructure' },
  { id: 2, name: 'পানি ও পয়ঃনিষ্কাশন', nameEn: 'Water & Sanitation' },
  { id: 3, name: 'বিদ্যুৎ ও গ্যাস', nameEn: 'Utilities' },
  { id: 4, name: 'পরিবহন ও যানজট', nameEn: 'Transportation' },
  { id: 5, name: 'পরিবেশ ও স্বাস্থ্য', nameEn: 'Environment & Health' },
  { id: 6, name: 'আইন-শৃঙ্খলা', nameEn: 'Law & Order' },
  { id: 7, name: 'শিক্ষা', nameEn: 'Education' },
  { id: 8, name: 'স্বাস্থ্যসেবা', nameEn: 'Healthcare' },
  { id: 9, name: 'দুর্নীতি ও প্রশাসনিক অনিয়ম', nameEn: 'Governance & Corruption' },
  { id: 10, name: 'সামাজিক সমস্যা', nameEn: 'Social Issues' },
  { id: 11, name: 'ধর্মীয় ও সংস্কৃতি', nameEn: 'Religion & Culture' },
  { id: 12, name: 'কৃষি ও গ্রামীণ উন্নয়ন', nameEn: 'Agriculture & Rural Development' },
  { id: 13, name: 'নাগরিক সেবা', nameEn: 'Citizen Services' },
  { id: 14, name: 'ইন্টারনেট ও টেলিযোগাযোগ', nameEn: 'ICT & Communication' },
  { id: 15, name: 'আবাসন ও ভূমি', nameEn: 'Housing & Land' },
];

// Complaint statuses
// Complaint status constants
export const STATUSES = [
  { 
    id: 1, 
    name: 'সমস্যা/অভিযোগ জমা হয়েছে', 
    nameEn: 'Complaint Submitted',
    color: 'bg-gray-500'
  },
  { 
    id: 2, 
    name: 'সমস্যা/অভিযোগটি গ্রহণ করা হয়েছে', 
    nameEn: 'Received',
    color: 'bg-blue-500'
  },
  { 
    id: 3, 
    name: 'সমস্যাটি সমাধানের জন্য দেয়া হয়েছে', 
    nameEn: 'Assigned',
    color: 'bg-yellow-500'
  },
  { 
    id: 4, 
    name: 'সমাধান প্রক্রিয়াধীন', 
    nameEn: 'In Progress',
    color: 'bg-orange-500'
  },
  { 
    id: 5, 
    name: 'সমাধান করা হয়েছে', 
    nameEn: 'Resolved',
    color: 'bg-green-500'
  },
];