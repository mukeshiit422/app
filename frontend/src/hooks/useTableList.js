import { useState, useEffect } from 'react';
import { getTables } from '../utils/api';
import useConnectionState from './useConnectionState';

export const useTableList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isConnected } = useConnectionState();

  useEffect(() => {
    const fetchTables = async () => {
      if (!isConnected) {
        setTables([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getTables();
        setTables(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch tables');
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [isConnected]);

  return {
    tables,
    loading,
    error
  };
};