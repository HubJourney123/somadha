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
        'সুহিলপুর (দক্ষিণ)',
        'মজলিশপুর',
        'বুধল',
        'তালশহর',
      ]
    },
    {
      id: 2,
      name: 'কসবা',
      unions: [
        'বায়েক ইউনিয়ন',
        'কাইতলা ইউনিয়ন',
        'কুটি ইউনিয়ন',
        'কসবা(উঃ) ইউনিয়ন',
        'গোপীনাথপুর ইউনিয়ন',
        'বাদের ইউনিয়ন',
        'মেহারী ইউনিয়ন',
        'বিনাউটি ইউনিয়ন',
        'খাড়েরা ইউনিয়ন',
        'মূলগ্রাম ইউনিয়ন',
      ]
    },
    {
      id: 3,
      name: 'নাসিরনগর',
      unions: [
        'চাতলপাড়',
        'ভলাকুট',
        'গোয়ালনগর',
        'নাসিরনগর সদর',
        'কুন্ডা',
        'গোকর্ণ',
        'গুনিয়াউক',
        'বুড়িশ্বর',
        'ফান্দাউক',
        'পূর্বভাগ',
        'হরিপুর',
        'চাপরতলা',
        'বর্ধমান',
      ]
    },
    {
      id: 4,
      name: 'সরাইল',
      unions: [
        'অরুয়াইল',
        'পাকশিমূল',
        'চুন্টা',
        'কালীকচ্ছ',
        'পানিশ্বর',
        'নোয়াগাঁও',
        'শাহবাজপুর',
        'শাহজাদাপুর',
        'সরাইল সদর',
  ]
    },
    {
      id: 5,
      name: 'আখাউড়া',
      unions: [
        'মনিয়ন্দ',
        'মোগড়া',
        'ধরখার',
        'আখাউড়া (দক্ষিণ)',
        'আখাউড়া (উত্তর)',
      ]
    },
    {
      id: 6,
      name: 'নবীনগর',
      unions: [
        'বড়াইল',
        'বীরগাঁও',
        'কৃষ্ণনগর',
        'নাটঘর',
        'বিদ্যাকুট',
        'পূর্ব নবীনগর',
        'পশ্চিম নবীনগর',
        'বিটঘর',
        'শিবপুর',
        'শ্রীরামপুর',
        'জিনোদপুর',
        'লাউর ফতেপুর',
        'ইব্রাহিমপুর',
        'সাতমোড়া',
        'শ্যামগ্রাম',
        'রাসুল্লাবাদ',
        'বড়িকান্দি',
        'ছলিমগঞ্জ',
        'রতনপুর',
        'কাইতলা দক্ষিন',
        'কাইতলা উত্তর',
      ]
    },
    {
      id: 7,
      name: 'বাঞ্ছারামপুর',
      unions: [
        'তেজখালী',
        'পাহাড়িয়াকান্দি',
        'দরিয়াদৌলত',
        'সোনারামপুর',
        'দড়িকান্দি',
        'ছয়ফুল্লাকান্দি',
        'বাঞ্ছারামপুর',
        'আইয়ুবপুর',
        'ফরদাবাদ',
        'রূপসদী',
        'ছলিমাবাদ',
        'উজানচর',
        'মানিকপুর',
      ]
    },
    {
      id: 8,
      name: 'বিজয়নগর',
      unions: [
        'বুধন্তি',
        'চান্দুরা',
        'ইছাপুরা',
        'চম্পকনগর',
        'হরষপুর',
        'পত্তন',
        'সিংগারবিল',
        'বিষ্ণুপুর',
        'চর ইসলামপুর',
        'পাহাড়পুর',
      ]
    },
    {
      id: 9,
      name: 'আশুগঞ্জ',
      unions: [
        'আশুগঞ্জ সদর',
        'চরচারতলা',
        'দূর্গাপুর',
        'আড়াইসিধা',
        'তালশহর',
        'তারুয়া',
        'শরিফপুর',
        'লালপুর',
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
    color: 'bg-amber-500'
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