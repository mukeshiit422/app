const express = require('express');
const router = express.Router();
const { 
    connect,
    disconnect, 
    getTables, 
    getRows,    
    updateRow,
    deleteRow,
    insertRow,
    createTable,
    deleteTable
} = require('../controllers/dbController.js');

router.post('/connectdb', connect);
router.post('/disconnect', disconnect);
router.get('/tables', getTables);
router.get('/table/:name', getRows);
router.put('/table/:tableName', updateRow);
router.delete('/table/:tableName', deleteRow);
router.post('/table/:tableName', insertRow);
router.post('/create-table', createTable);
router.delete('/table/:tableName/drop', deleteTable);

module.exports = router;