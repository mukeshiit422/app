import React, { useState } from 'react';
import { validateColumnValue, getInputType, formatValueForDisplay, parseValueForSubmission } from '../../utils/validation';
import './DataTable.css';
import { useTableData } from '../../hooks/useTableData';

const DataTable = ({ tableName }) => {
  const { 
    data, 
    columns, 
    loading, 
    error,
    insertRow,
    updateRow, 
    deleteRow, 
    pagination,
    fetchData
  } = useTableData(tableName);
  
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});

  if (loading) return <div>Loading table data...</div>;
  // if (error) return <div className="error-message">{error}</div>;

  const handleEdit = (row) => {
    setEditingRow(row);
    setEditedData({ ...row });
  };

  const handleSave = async () => {
    await updateRow(editedData);
    setEditingRow(null);
    setEditedData({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleChange = (column, value) => {
    // Find the column type
    const columnDef = columns.find(col => col.name === column);
    if (!columnDef) return;

    // Validate the input
    const validation = validateColumnValue(value, columnDef.type);
    
    setValidationErrors(prev => ({
      ...prev,
      [column]: validation.message
    }));

    // Update the value if it's valid or empty
    const parsedValue = value === '' ? null : parseValueForSubmission(value, columnDef.type);
    setEditedData((prev) => ({
      ...prev,
      [column]: parsedValue
    }));
  };

  const handleInsert = async () => {
    // Validate all fields before submitting
    const errors = {};
    for (const column of columns) {
      if (column.name === 'id') continue;
      const value = newRowData[column.name];
      const validation = validateColumnValue(value, column.type);
      if (!validation.isValid) {
        errors[column.name] = validation.message;
      }
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await insertRow(newRowData);
      setIsAddingNew(false);
      setNewRowData({});
      setValidationErrors({});
    } catch (err) {
      console.error('Insert error:', err);
    }
  };

  const handleCancelInsert = () => {
    setIsAddingNew(false);
    setNewRowData({});
  };

  const handleNewRowChange = (column, value) => {
    // Find the column type
    const columnDef = columns.find(col => col.name === column);
    if (!columnDef) return;

    // Validate the input
    const validation = validateColumnValue(value, columnDef.type);
    
    setValidationErrors(prev => ({
      ...prev,
      [column]: validation.message
    }));

    // Update the value if it's valid or empty
    const parsedValue = value === '' ? null : parseValueForSubmission(value, columnDef.type);
    setNewRowData(prev => ({
      ...prev,
      [column]: parsedValue
    }));
  };

  return (
    <div className="data-table-container">
      <div className="table-header">
        <h3>{tableName}</h3>
        <button 
          className="add-new-button"
          onClick={() => setIsAddingNew(true)}
          disabled={isAddingNew}
        >
          Add New Row
        </button>
      </div>

      {isAddingNew && (
        <div className="new-row-form">
          <h4>Add New Row</h4>
          <div className="form-fields">
            {columns.filter(col => col.name !== 'id').map(column => (
              <div key={column.name} className="form-field">
                <label>{column.name.replace(/_/g, ' ').toUpperCase()}</label>
                <div className="input-container">
                  <input
                    type={getInputType(column.type)}
                    value={formatValueForDisplay(newRowData[column.name], column.type) || ''}
                    onChange={(e) => handleNewRowChange(column.name, e.target.value)}
                    className={validationErrors[column.name] ? 'invalid' : ''}
                  />
                  {validationErrors[column.name] && (
                    <div className="validation-error">{validationErrors[column.name]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button onClick={handleInsert}>Save</button>
            <button onClick={handleCancelInsert}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="data-table">
          <thead className='thead'>
            <tr className='tr'>
              {columns.filter(col => col.name !== 'id').map((column) => (
                <th key={column.name}>{column.name.replace(/_/g, ' ').toUpperCase()}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                {columns.filter(col => col.name !== 'id').map((column) => (
                  <td key={column.name}>
                    {editingRow?.id === row.id ? (
                      <div className="input-container">
                        <input
                          type={getInputType(column.type)}
                          value={formatValueForDisplay(editedData[column.name], column.type) || ''}
                          onChange={(e) => handleChange(column.name, e.target.value)}
                          className={validationErrors[column.name] ? 'invalid' : ''}
                        />
                        {validationErrors[column.name] && (
                          <div className="validation-error">{validationErrors[column.name]}</div>
                        )}
                      </div>
                    ) : (
                      formatValueForDisplay(row[column.name], column.type)
                    )}
                  </td>
                ))}
                <td className="action-buttons">
                  {editingRow?.id === row.id ? (
                    <>
                      <button 
                        onClick={handleSave}
                        disabled={Object.keys(validationErrors).some(k => validationErrors[k])}
                      >
                        Save
                      </button>
                      <button onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(row)}>Edit</button>
                      <button onClick={() => deleteRow(row.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="pagination">
          <button
            onClick={() => fetchData(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages} 
            ({pagination.totalRows} total rows)
          </span>
          <button
            onClick={() => fetchData(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;