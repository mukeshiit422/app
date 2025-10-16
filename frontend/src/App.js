import './App.css';
import useConnectionState from './hooks/useConnectionState';
import ConnectionForm from './components/ConnectionForm/ConnectionForm';
import TableList from './components/TableList/TableList';
import DataTable from './components/DataTable/DataTable';
import { useState } from 'react';

function App() {
  const [curretTable, setCurrentTable] = useState(null);
  const{ isConnected } = useConnectionState();
  return (
    <div className="App">
      <div> 
        <ConnectionForm/>
      </div>
    
      {isConnected && <div>
        <div className='table-list-container'> 
         <TableList onSelectTable={setCurrentTable}/>
         </div> 
          <div className='data-table-container'> 
             { !!curretTable && <DataTable tableName={curretTable}/>}
         </div> 
      </div>}
     
    </div>
  );
}

export default App;
