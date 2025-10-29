import { useState, useEffect } from 'react';

export function useComplaints(filters = {}) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComplaints();
  }, [JSON.stringify(filters)]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.statusId) params.append('statusId', filters.statusId);
      if (filters.upazila) params.append('upazila', filters.upazila);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);

      const response = await fetch(`/api/complaints?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch complaints');
      }

      const data = await response.json();
      setComplaints(data.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchComplaints();
  };

  return { complaints, loading, error, refetch };
}