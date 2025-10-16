import { useTableList } from '../../hooks/useTableList';
import './TableList.css';

const TableList = ({ onSelectTable }) => {
  const { tables, loading, error } = useTableList();

  if (loading) return <div>Loading tables...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="table-list-container">
      <div className="table-list-header">
        <h3>Available Tables</h3>
      </div>
      <div className="table-list">
        {tables.length === 0 && <div>No tables found.</div>}
        {tables.map((table) => (
          <div key={table.table_name} className="table-item-container">
            <button
              className="table-item"
              onClick={() => onSelectTable(table.table_name)}
            >
              {table.table_name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableList;