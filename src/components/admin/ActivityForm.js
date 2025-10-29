'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FiUpload, FiX } from 'react-icons/fi';
import Image from 'next/image';

export default function ActivityForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    summary: ''
  });

  const [errors, setErrors] = useState({});

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

    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'শিরোনাম কমপক্ষে ৫ অক্ষর হতে হবে';
    }

    if (!formData.summary || formData.summary.trim().length < 20) {
      newErrors.summary = 'সংক্ষিপ্ত বিবরণ কমপক্ষে ২০ অক্ষর হতে হবে';
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
          setLoading(false);
          return;
        }
      }

      // Submit activity
      const response = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          summary: formData.summary.trim(),
          imageUrl: imageUrl || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create activity');
      }

      alert('কার্যক্রম সফলভাবে যোগ করা হয়েছে!');

      // Reset form
      setFormData({ title: '', summary: '' });
      setImageFile(null);
      setImagePreview('');
      setErrors({});

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error creating activity:', error);
      alert('কার্যক্রম যোগ করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          নতুন কার্যক্রম যোগ করুন
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          দলীয় কার্যক্রমের তথ্য দিন যা হোমপেজে প্রদর্শিত হবে
        </p>
      </div>

      <Input
        label="শিরোনাম"
        required
        value={formData.title}
        onChange={(e) => {
          setFormData({ ...formData, title: e.target.value });
          if (errors.title) setErrors({ ...errors, title: '' });
        }}
        placeholder="কার্যক্রমের শিরোনাম লিখুন"
        error={errors.title}
      />

      <div>
        <label className="label">
          সংক্ষিপ্ত বিবরণ
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          value={formData.summary}
          onChange={(e) => {
            setFormData({ ...formData, summary: e.target.value });
            if (errors.summary) setErrors({ ...errors, summary: '' });
          }}
          placeholder="কার্যক্রমের বিস্তারিত লিখুন..."
          rows={5}
          className={`textarea-field ${errors.summary ? 'border-red-500 focus:ring-red-500' : ''}`}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.summary && (
            <p className="text-red-500 text-sm">{errors.summary}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
            {formData.summary.length} অক্ষর
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

      <Button
        type="submit"
        variant="primary"
        fullWidth
        loading={loading || uploadingImage}
        disabled={loading || uploadingImage}
      >
        {loading ? 'যোগ করা হচ্ছে...' : uploadingImage ? 'ছবি আপলোড হচ্ছে...' : 'কার্যক্রম যোগ করুন'}
      </Button>
    </form>
  );
}