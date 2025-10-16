import './ConnectionForm.css';
import { useDbConnection } from '../../hooks/useDbConnection';
import useConnectionState from '../../hooks/useConnectionState';

const ConnectionForm = () => {
  const { formData, handleChange, handleSubmit, handleDisconnect, error } = useDbConnection();
  const { isConnected } = useConnectionState();

  return (
    <div className="connection-form-container">
      <div className="connection-header">
        <h2>Database Connection</h2>
        {isConnected && (
          <button onClick={handleDisconnect} className="disconnect-btn">
            Disconnect
          </button>
        )}
      </div>
      { !isConnected && <form onSubmit={handleSubmit} className="connection-form">
        <div className="form-group">
          <label htmlFor="host">Hostname:</label>
          <input
            type="text"
            id="host"
            name="host"
            value={formData.host}
            onChange={handleChange}
            placeholder="localhost"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="port">Port:</label>
          <input
            type="text"
            id="port"
            name="port"
            value={formData.port}
            onChange={handleChange}
             placeholder="5432"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="database">Database:</label>
          <input
            type="text"
            id="database"
            name="database"
            value={formData.database}
            onChange={handleChange}
            placeholder="DB Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="user">Username:</label>
          <input
            type="text"
            id="user"
            name="user"
            value={formData.username}
            onChange={handleChange}
             placeholder="User Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
          <button type="submit" className="submit-btn">Connect</button>
      </form>}
      {error && <div className="error-message">{error}</div>}
      <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
        <div className="status-indicator"></div>
        {isConnected ? (
          <span>Connected to database <strong>{formData.database}</strong></span>
        ) : (
          <span>Not connected to database. Please enter your credentials and connect.</span>
        )}
      </div>
    </div>
  );
};

export default ConnectionForm;