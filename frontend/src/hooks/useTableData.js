import { useState, useEffect } from 'react';
import { getTableData, updateTableRow, deleteTableRow, insertTableRow } from '../utils/api';

export const useTableData = (tableName) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    totalRows: 0
  });

  const fetchData = async (page = 1) => {
    if (!tableName) return;
    
    try {
      setLoading(true);
      const response = await getTableData(tableName, page, pagination.pageSize);
      setData(response.rows);
      // Store both column names and their types
      setColumns(response.columns.map(col => ({
        name: col.column_name,
        type: col.data_type
      })));
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch table data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset pagination when table changes
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName]);

  const updateRow = async (rowData) => {
    try {
      await updateTableRow(tableName, rowData);
      setData(prev => prev.map(row => 
        row.id === rowData.id ? rowData : row
      ));
    } catch (err) {
      setError(err.message || 'Failed to update row');
      throw err;
    }
  };

  const deleteRow = async (id) => {
    try {
      await deleteTableRow(tableName, id);
      // After successful deletion, refresh the data to ensure sync with backend
      await fetchData(pagination.currentPage);
    } catch (err) {
      setError(err.message || 'Failed to delete row');
      throw err;
    }
  };

  const insertRow = async (rowData) => {
    try {
      const result = await insertTableRow(tableName, rowData);
      // Refresh the data to ensure we have the latest state
      await fetchData(pagination.currentPage);
      return result.row;
    } catch (err) {
      console.error('Insert error:', err);
      setError(err.message || 'Failed to insert row');
      throw err;
    }
  };

  return {
    data,
    columns,
    loading,
    error,
    updateRow,
    deleteRow,
    insertRow
  };
};