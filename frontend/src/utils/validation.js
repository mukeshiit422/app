
export const validateColumnValue = (value, type) => {
  if (value === '' || value === null || value === undefined) {
    return { isValid: true, message: '' }; 
  }

  switch (type.toLowerCase()) {
    case 'integer':
    case 'bigint':
    case 'smallint':
      const intValue = parseInt(value);
      if (isNaN(intValue) || !Number.isInteger(Number(value))) {
        return { isValid: false, message: 'Please enter a valid integer' };
      }
      break;

    case 'numeric':
    case 'decimal':
    case 'real':
    case 'double precision':
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return { isValid: false, message: 'Please enter a valid number' };
      }
      break;

    case 'boolean':
      const boolStr = String(value).toLowerCase();
      if (!['true', 'false', '0', '1', 't', 'f', 'yes', 'no'].includes(boolStr)) {
        return { isValid: false, message: 'Please enter true or false' };
      }
      break;

    case 'date':
      const dateValue = new Date(value);
      if (isNaN(dateValue.getTime())) {
        return { isValid: false, message: 'Please enter a valid date (YYYY-MM-DD)' };
      }
      break;

    case 'timestamp':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
      const timestampValue = new Date(value);
      if (isNaN(timestampValue.getTime())) {
        return { isValid: false, message: 'Please enter a valid timestamp' };
      }
      break;

    case 'time':
    case 'time with time zone':
    case 'time without time zone':
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(value)) {
        return { isValid: false, message: 'Please enter a valid time (HH:MM:SS)' };
      }
      break;

    default:
      return { isValid: true, message: '' };
  }

  return { isValid: true, message: '' };
};

export const getInputType = (columnType) => {
  switch (columnType.toLowerCase()) {
    case 'integer':
    case 'bigint':
    case 'smallint':
    case 'numeric':
    case 'decimal':
    case 'real':
    case 'double precision':
      return 'number';
    case 'date':
      return 'date';
    case 'time':
    case 'time with time zone':
    case 'time without time zone':
      return 'time';
    case 'timestamp':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
      return 'datetime-local';
    case 'boolean':
      return 'checkbox';
    default:
      return 'text';
  }
};

export const formatValueForDisplay = (value, type) => {
  if (value === null || value === undefined) return '';
  
  switch (type.toLowerCase()) {
    case 'timestamp':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
      return value ? new Date(value).toISOString().slice(0, 16) : ''; // Format for datetime-local input
    case 'date':
      return value ? new Date(value).toISOString().slice(0, 10) : '';
    case 'boolean':
      return value === true || value === 'true' || value === 't' || value === '1';
    default:
      return value.toString();
  }
};

export const parseValueForSubmission = (value, type) => {
  if (value === '' || value === null || value === undefined) return null;
  
  switch (type.toLowerCase()) {
    case 'integer':
    case 'bigint':
    case 'smallint':
      return parseInt(value);
    case 'numeric':
    case 'decimal':
    case 'real':
    case 'double precision':
      return parseFloat(value);
    case 'boolean':
      if (typeof value === 'string') {
        return ['true', 't', '1', 'yes'].includes(value.toLowerCase());
      }
      return Boolean(value);
    default:
      return value;
  }
};