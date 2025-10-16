import { useState } from 'react';
import { connectToDb, disconnectFromDb } from '../utils/api';
import useConnectionState from './useConnectionState';

export const useDbConnection = () => {
  const { setIsConnected } = useConnectionState();
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('dbConfig');
    return saved ? JSON.parse(saved) : {
      host: '',
      port: '',
      database: '',
      user: '',
      password: ''
    };
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await connectToDb(formData);
      localStorage.setItem('dbConfig', JSON.stringify(formData));
      setIsConnected(true);
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect to database');
      setIsConnected(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromDb();
      localStorage.removeItem('dbConfig');
      setIsConnected(false);
      setFormData({
        host: '',
        port: '',
        database: '',
        user: '',
        password: ''
      });
    } catch (err) {
      console.error('Disconnect error:', err);
      setError(err.message || 'Failed to disconnect from database');
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    handleDisconnect,
    error
  };
};