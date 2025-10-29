'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { CATEGORIES } from '@/constants/categories';
import { LOCATIONS } from '@/constants/locations';
import { FiUpload, FiX, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function ComplaintForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    categoryId: '',
    upazila: '',
    unionName: '',
    details: '',
    imageUrl: '',
    isAnonymous: false,
  });

  const [errors, setErrors] = useState({});

  const selectedUpazila = LOCATIONS.upazilas.find(u => u.name === formData.upazila);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Reset union when upazila changes
    if (field === 'upazila') {
      setFormData(prev => ({ ...prev, unionName: '' }));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবির আকার ৫ MB এর কম হতে হবে');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('ছবি আপলোড করতে সমস্যা হয়েছে');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'সমস্যার ধরন নির্বাচন করুন';
    }
    if (!formData.upazila) {
      newErrors.upazila = 'উপজেলা নির্বাচন করুন';
    }
    if (!formData.unionName) {
      newErrors.unionName = 'ইউনিয়ন নির্বাচন করুন';
    }
    if (!formData.details || formData.details.trim().length < 20) {
      newErrors.details = 'সমস্যার বিস্তারিত বর্ণনা লিখুন (কমপক্ষে ২০ অক্ষর)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Upload image if exists
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl && imageFile) {
          // Image upload failed
          setLoading(false);
          return;
        }
      }

      // Get category name
      const category = CATEGORIES.find(c => c.id === parseInt(formData.categoryId));

      // Submit complaint
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: parseInt(formData.categoryId),
          categoryName: category.name,
          upazila: formData.upazila,
          unionName: formData.unionName,
          details: formData.details.trim(),
          imageUrl: imageUrl || null,
          isAnonymous: formData.isAnonymous,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const data = await response.json();
      setComplaintId(data.data.unique_id);
      setSuccess(true);

      // Reset form
      setFormData({
        categoryId: '',
        upazila: '',
        unionName: '',
        details: '',
        imageUrl: '',
        isAnonymous: false,
      });
      setImageFile(null);
      setImagePreview('');

    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('অভিযোগ জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          সফলভাবে জমা হয়েছে!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          আপনার অভিযোগ সফলভাবে জমা হয়েছে।
        </p>
        <div className="bg-primary-light dark:bg-primary/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            আপনার অভিযোগ নম্বর:
          </p>
          <p className="text-2xl font-bold text-primary">{complaintId}</p>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          এই নম্বর দিয়ে আপনি আপনার অভিযোগের অবস্থা ট্র্যাক করতে পারবেন।
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push('/dashboard')}
          >
            ড্যাশবোর্ডে যান
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => setSuccess(false)}
          >
            নতুন অভিযোগ
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card p-6 max-w-2xl mx-auto space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          সমস্যা/অভিযোগ পোস্ট করুন
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          আপনার সমস্যা বা অভিযোগের বিস্তারিত তথ্য দিন
        </p>
      </div>

      {/* Category */}
      <Select
        label="সমস্যার ধরন"
        required
        placeholder="সমস্যার ধরন নির্বাচন করুন"
        value={formData.categoryId}
        onChange={(e) => handleInputChange('categoryId', e.target.value)}
        options={CATEGORIES.map(cat => ({
          value: cat.id,
          label: cat.name
        }))}
        error={errors.categoryId}
      />

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="জেলা"
          value={LOCATIONS.district}
          disabled
          options={[LOCATIONS.district]}
        />
        <Select
          label="উপজেলা"
          required
          placeholder="উপজেলা নির্বাচন করুন"
          value={formData.upazila}
          onChange={(e) => handleInputChange('upazila', e.target.value)}
          options={LOCATIONS.upazilas.map(u => u.name)}
          error={errors.upazila}
        />
      </div>

      {/* Union */}
      {formData.upazila && (
        <Select
          label="ইউনিয়ন"
          required
          placeholder="ইউনিয়ন নির্বাচন করুন"
          value={formData.unionName}
          onChange={(e) => handleInputChange('unionName', e.target.value)}
          options={selectedUpazila?.unions || []}
          error={errors.unionName}
        />
      )}

      {/* Details */}
      <div>
        <label className="label">
          সমস্যার বিস্তারিত
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={formData.details}
          onChange={(e) => handleInputChange('details', e.target.value)}
          placeholder="আপনার সমস্যা বা অভিযোগের বিস্তারিত লিখুন..."
          rows={6}
          className={`textarea-field ${errors.details ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.details && (
            <p className="text-red-500 text-sm">{errors.details}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {formData.details.length} অক্ষর
          </p>
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className="label">ছবি যুক্ত করুন (ঐচ্ছিক)</label>
        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ছবি আপলোড করতে ক্লিক করুন
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                PNG, JPG (সর্বোচ্চ 5MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </label>
        ) : (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Anonymous option */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="anonymous"
          checked={formData.isAnonymous}
          onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
          className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label htmlFor="anonymous" className="text-gray-700 dark:text-gray-300 cursor-pointer">
          গোপনে পোস্ট করুন (আপনার নাম প্রকাশ করা হবে না)
        </label>
      </div>

      {/* Submit button */}
      <div className="pt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading || uploadingImage}
          disabled={loading || uploadingImage}
        >
          {loading ? 'জমা দেওয়া হচ্ছে...' : uploadingImage ? 'ছবি আপলোড হচ্ছে...' : 'অভিযোগ জমা দিন'}
        </Button>
      </div>

      {!session && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 সাইন ইন করলে আপনি সহজেই আপনার সব অভিযোগ ট্র্যাক করতে পারবেন
        </p>
      )}
    </motion.form>
  );
}