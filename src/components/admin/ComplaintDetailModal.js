'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import ComplaintTracking from '@/components/complaint/ComplaintTracking';
import StatusBadge from '@/components/complaint/StatusBadge';
import StatusSelect from '@/components/ui/StatusSelect';
import { STATUSES } from '@/constants/statuses';
import { format } from 'date-fns';
import { FiUpload, FiX, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';

export default function ComplaintDetailModal({ complaint, isOpen, onClose, onUpdate }) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [complaintData, setComplaintData] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  
  const [statusForm, setStatusForm] = useState({
    statusId: '',
    notes: '',
    solutionImage: null,
  });
  
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch full complaint details when modal opens
  useEffect(() => {
    if (isOpen && complaint?.unique_id) {
      fetchComplaintDetails();
    }
  }, [isOpen, complaint]);

  const fetchComplaintDetails = async () => {
    setFetchingDetails(true);
    try {
      console.log('Fetching details for:', complaint.unique_id);
      const response = await fetch(`/api/complaints/${complaint.unique_id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched complaint data:', data);
        setComplaintData(data.data);
        setStatusForm(prev => ({
          ...prev,
          statusId: data.data.status_id
        }));
      } else {
        console.error('Failed to fetch complaint details');
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ছবির আকার ৫ MB এর কম হতে হবে');
        return;
      }

      setStatusForm(prev => ({ ...prev, solutionImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setStatusForm(prev => ({ ...prev, solutionImage: null }));
    setImagePreview('');
  };

  const uploadImage = async () => {
    if (!statusForm.solutionImage) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', statusForm.solutionImage);

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

  const handleStatusUpdate = async (e) => {
    e.preventDefault();

    if (!statusForm.statusId) {
      alert('স্ট্যাটাস নির্বাচন করুন');
      return;
    }

    setLoading(true);

    try {
      console.log('Starting status update...');
      
      // Upload solution image if exists
      let solutionImageUrl = null;
      if (statusForm.solutionImage) {
        console.log('Uploading solution image...');
        solutionImageUrl = await uploadImage();
        if (!solutionImageUrl) {
          console.log('Image upload failed');
          setLoading(false);
          return;
        }
        console.log('Image uploaded:', solutionImageUrl);
      }

      const selectedStatus = STATUSES.find(s => s.id === parseInt(statusForm.statusId));
      console.log('Selected status:', selectedStatus);

      const updateData = {
        statusId: parseInt(statusForm.statusId),
        statusName: selectedStatus.name,
        notes: statusForm.notes.trim() || null,
        solutionImageUrl,
        updatedBy: {
          type: session?.user?.role || 'agent',
          name: session?.user?.name || 'Agent'
        }
      };

      console.log('Sending update request:', updateData);
      console.log('To URL:', `/api/complaints/${complaint.unique_id}`);

      const response = await fetch(`/api/complaints/${complaint.unique_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update status');
      }

      alert('স্ট্যাটাস সফলভাবে আপডেট হয়েছে!');

      // Reset form
      setStatusForm({
        statusId: '',
        notes: '',
        solutionImage: null,
      });
      setImagePreview('');

      // Refresh complaint details
      await fetchComplaintDetails();

      // Notify parent to refresh
      if (onUpdate) {
        onUpdate();
      }

    } catch (error) {
      console.error('Error updating status:', error);
      alert('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const displayComplaint = complaintData || complaint;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="অভিযোগের বিস্তারিত"
      size="xl"
    >
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            বিস্তারিত
          </button>
          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'tracking'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            ট্র্যাকিং
          </button>
        </div>
      </div>

      {fetchingDetails ? (
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">লোড হচ্ছে...</p>
        </div>
      ) : (
        <>
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Complaint Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    ক্যাটাগরি
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {displayComplaint.category_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    অভিযোগ নম্বর
                  </p>
                  <p className="font-mono font-semibold text-gray-900 dark:text-white">
                    {displayComplaint.unique_id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    স্থান
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {displayComplaint.union_name}, {displayComplaint.upazila}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    তারিখ
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {format(new Date(displayComplaint.created_at), 'dd MMM yyyy')}
                  </p>
                </div>
                {!displayComplaint.is_anonymous && displayComplaint.user_name && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        অভিযোগকারী
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {displayComplaint.user_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                        ইমেইল
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {displayComplaint.user_email}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Complaint Image */}
              {displayComplaint.image_url && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    অভিযোগের ছবি
                  </p>
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={displayComplaint.image_url}
                      alt="Complaint"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  বিস্তারিত
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {displayComplaint.details}
                </p>
              </div>

              {/* Status Update Form */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  স্ট্যাটাস আপডেট করুন
                </h3>

                <form onSubmit={handleStatusUpdate} className="space-y-4">
                  <Select
                    label="নতুন স্ট্যাটাস"
                    required
                    value={statusForm.statusId}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, statusId: e.target.value }))}
                    options={STATUSES.map(status => ({
                      value: status.id,
                      label: status.name
                    }))}
                  />

                  <div>
                    <label className="label">নোট (ঐচ্ছিক)</label>
                    <textarea
                      value={statusForm.notes}
                      onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="আপডেট সম্পর্কে কোনো মন্তব্য..."
                      rows={3}
                      className="textarea-field"
                    />
                  </div>

                  {/* Solution Image */}
                  <div>
                    <label className="label">সমাধানের ছবি (ঐচ্ছিক)</label>
                    {!imagePreview ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ছবি আপলোড করুন
                        </p>
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
                          src={imagePreview}
                          alt="Solution"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <FiX className="w-4 h-4" />
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
                    {loading ? 'আপডেট হচ্ছে...' : uploadingImage ? 'ছবি আপলোড হচ্ছে...' : 'আপডেট করুন'}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Tracking Tab */}
          {activeTab === 'tracking' && complaintData && (
            <ComplaintTracking complaint={complaintData} />
          )}
        </>
      )}
    </Modal>
  );
}