'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import StatusBadge from '@/components/complaint/StatusBadge';
import ComplaintTracking from '@/components/complaint/ComplaintTracking';
import { STATUSES } from '@/constants/statuses';
import { format } from 'date-fns';
import Image from 'next/image';
import { FiMapPin, FiCalendar, FiUser, FiUpload, FiX, FiPhone } from 'react-icons/fi';

export default function ComplaintDetailModal({ complaint, isOpen, onClose, onUpdate }) {
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [solutionImage, setSolutionImage] = useState(null);
  const [solutionImagePreview, setSolutionImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'tracking'

  useEffect(() => {
    if (complaint) {
      setNewStatus(complaint.status_id.toString());
      fetchComplaintDetails();
    }
  }, [complaint]);

  const fetchComplaintDetails = async () => {
    if (!complaint) return;

    try {
      const response = await fetch(`/api/complaints/${complaint.unique_id}`);
      if (response.ok) {
        const data = await response.json();
        setComplaintData(data.data);
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবির আকার ৫ MB এর কম হতে হবে');
        return;
      }

      setSolutionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSolutionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!solutionImage) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', solutionImage);

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

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === complaint.status_id.toString()) {
      alert('নতুন স্ট্যাটাস নির্বাচন করুন');
      return;
    }

    setUpdating(true);

    try {
      let solutionImageUrl = '';
      if (solutionImage) {
        solutionImageUrl = await uploadImage();
        if (!solutionImageUrl) {
          setUpdating(false);
          return;
        }
      }

      const selectedStatus = STATUSES.find(s => s.id === parseInt(newStatus));

      const response = await fetch(`/api/complaints/${complaint.unique_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusId: parseInt(newStatus),
          statusName: selectedStatus.name,
          solutionImageUrl: solutionImageUrl || null,
          notes: notes.trim() || null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      alert('স্ট্যাটাস সফলভাবে আপডেট হয়েছে!');
      
      // Reset form
      setNotes('');
      setSolutionImage(null);
      setSolutionImagePreview('');
      
      // Refresh data
      await fetchComplaintDetails();
      if (onUpdate) onUpdate();

    } catch (error) {
      console.error('Error updating status:', error);
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setUpdating(false);
    }
  };

  if (!complaint) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="অভিযোগের বিস্তারিত" size="lg">
      <div className="space-y-6">
        {/* Header with Tabs */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'details'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            বিস্তারিত
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'tracking'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ট্র্যাকিং
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Complaint Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {complaint.category_name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {complaint.unique_id}
                  </p>
                </div>
                <StatusBadge statusId={complaint.status_id} statusName={complaint.status_name} />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiMapPin className="w-4 h-4 text-gray-500" />
                  <span>{complaint.upazila}, {complaint.union_name}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FiCalendar className="w-4 h-4 text-gray-500" />
                  <span>{format(new Date(complaint.created_at), 'dd MMMM yyyy, hh:mm a')}</span>
                </div>

                {!complaint.is_anonymous && complaint.user_name && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiUser className="w-4 h-4 text-gray-500" />
                    <span>{complaint.user_name}</span>
                  </div>
                )}

                {complaint.phone && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiPhone className="w-4 h-4 text-gray-500" />
                    <span>{complaint.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Complaint Image */}
            {complaint.image_url && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={complaint.image_url}
                  alt="Complaint"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Details */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                বিস্তারিত বর্ণনা
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {complaint.details}
              </p>
            </div>

            {/* Update Status Section */}
            <div className="border-t border-gray-200 dark:border-dark-border pt-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                স্ট্যাটাস আপডেট করুন
              </h4>

              <div className="space-y-4">
                <Select
                  label="নতুন স্ট্যাটাস"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={STATUSES.map(status => ({
                    value: status.id,
                    label: status.name
                  }))}
                />

                <div>
                  <label className="label">নোট (ঐচ্ছিক)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="আপডেট সম্পর্কে কোনো মন্তব্য..."
                    rows={3}
                    className="textarea-field"
                  />
                </div>

                {/* Solution Image */}
                <div>
                  <label className="label">সমাধানের ছবি (ঐচ্ছিক)</label>
                  {!solutionImagePreview ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">ছবি আপলোড করুন</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                    </label>
                  ) : (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <Image
                        src={solutionImagePreview}
                        alt="Solution Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSolutionImage(null);
                          setSolutionImagePreview('');
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleUpdateStatus}
                  loading={updating || uploadingImage}
                  disabled={updating || uploadingImage}
                >
                  {updating ? 'আপডেট হচ্ছে...' : uploadingImage ? 'ছবি আপলোড হচ্ছে...' : 'স্ট্যাটাস আপডেট করুন'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <div>
            {complaintData ? (
              <ComplaintTracking complaint={complaintData} />
            ) : (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">লোড হচ্ছে...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}