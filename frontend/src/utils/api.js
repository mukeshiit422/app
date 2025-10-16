const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const connectToDb = async (connectionData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/connectdb`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(connectionData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw new Error(error.message || 'Failed to connect to database');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to the backend server. Please ensure the server is running.');
    }
    throw error;
  }
};

export const disconnectFromDb = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/disconnect`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to disconnect from database');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error disconnecting:', error);
    throw error;
  }
};

export const getTables = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tables`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch tables');
    }

    const data = await response.json();
    return data.tables || [];
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw error;
  }
};

export const getTableData = async (tableName, page = 1, pageSize = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/table/${tableName}?page=${page}&pageSize=${pageSize}`,
    { credentials: 'include' }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch table data');
  }

  return response.json();
};

export const insertTableRow = async (tableName, rowData) => {
  const response = await fetch(`${API_BASE_URL}/table/${tableName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      row: rowData
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to insert row');
  }

  return response.json();
};

export const updateTableRow = async (tableName, rowData) => {
  const response = await fetch(`${API_BASE_URL}/table/${tableName}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      row: rowData,
      primaryKey: {
        column: 'id',
        value: rowData.id
      }
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update row');
  }

  return response.json();
};

export const deleteTableRow = async (tableName, id) => {
  const response = await fetch(`${API_BASE_URL}/table/${tableName}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      primaryKey: {
        column: 'id',
        value: id
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete row');
  }

  return response.json();
};

export const createTable = async (tableName, columns) => {
  const response = await fetch(`${API_BASE_URL}/create-table`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      tableName,
      columns
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create table');
  }

  return response.json();
};

export const deleteTable = async (tableName) => {
  const response = await fetch(`${API_BASE_URL}/table/${tableName}/drop`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete table');
  }

  return response.json();
};