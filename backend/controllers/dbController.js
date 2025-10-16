const DBModel = require('../models/dbModel');
const disconnect = async(req, res) => {
    try {
        if (req.session) {
            // Clear the session
            req.session.destroy((err) => {
                if (err) {
                    console.error('Session destruction error:', err);
                    return res.status(500).json({ message: 'Failed to disconnect properly' });
                }
                res.json({ message: 'Disconnected from database successfully' });
            });
        } else {
            res.json({ message: 'Already disconnected' });
        }
    } catch (error) {
        console.error('Disconnect error:', error);
        res.status(500).json({ message: 'Failed to disconnect from database' });
    }
};

const connect = async(req,res) => {
    try {
        console.log("connecting to database...");
        // Store connection details in session
        req.session.dbConfig = req.body;
        const connection = await DBModel.connectdb(req.body);

        // Immediately fetch tables after connection
        const result = await connection.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
            []
        );
        
        res.json({
            message: 'Connected to database successfully',
            tables: result.rows
        });
    } catch (error) {
        console.error('Connection error:', error);
        res.status(500).json({message: 'Database connection failed, May be due to input database not available'});
    }
}

const getTables = async (req, res) => {
    try {
        if (!req.session.dbConfig) {
            return res.status(400).json({ message: 'No database connection. Please connect first.' });
        }
        const connection = await DBModel.connectdb(req.session.dbConfig);
        const result = await connection.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
            []
        );
        console.log(result);
        res.json({ tables: result.rows });
    } catch (error) {
        console.error('Error getting tables:', error);
        res.status(500).json({ message: 'Failed to retrieve tables' });
    }
}

const getRows = async (req, res) => {
    try {
        if (!req.session.dbConfig) {
            return res.status(400).json({ message: 'No database connection. Please connect first.' });
        }
        const connection = await DBModel.connectdb(req.session.dbConfig);
        const tableName = req.params.name;
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const offset = (page - 1) * pageSize;

        if (!tableName) {
            return res.status(400).json({ message: 'Table name is required' });
        }

        // First get column information
        const columnQuery = `
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = $1
            ORDER BY ordinal_position`;
        const columnResult = await connection.query(columnQuery, [tableName]);
        
        // Get total count
        const countQuery = `SELECT COUNT(*) FROM "${tableName}"`;
        const countResult = await connection.query(countQuery);
        const totalRows = parseInt(countResult.rows[0].count);
        
        // Then get the paginated data
        const dataQuery = `SELECT * FROM "${tableName}" ORDER BY id LIMIT $1 OFFSET $2`;
        const dataResult = await connection.query(dataQuery, [pageSize, offset]);

        res.json({
            columns: columnResult.rows,
            rows: dataResult.rows,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalRows: totalRows,
                totalPages: Math.ceil(totalRows / pageSize)
            }
        });
    } catch (error) {
        console.error('Error getting rows:', error);
        res.status(500).json({ message: 'Failed to retrieve table data, Please add tables.' });
    }
}

const updateRow = async (req, res) => {
    try {
        if (!req.session.dbConfig) {
            return res.status(400).json({ message: 'No database connection. Please connect first.' });
        }
        const connection = await DBModel.connectdb(req.session.dbConfig);
        const { tableName } = req.params;
        const { row, primaryKey } = req.body;
        
        if (!tableName || !row || !primaryKey) {
            return res.status(400).json({ message: 'Table name, row data, and primary key are required' });
        }

        // Build the SET part of the query
        const setColumns = Object.keys(row)
            .filter(key => key !== primaryKey.column)
            .map((key, idx) => `"${key}" = $${idx + 2}`);
        
        // Build the WHERE condition using the primary key
        const whereCondition = `"${primaryKey.column}" = $1`;
        
        const query = `
            UPDATE "${tableName}"
            SET ${setColumns.join(', ')}
            WHERE ${whereCondition}
            RETURNING *
        `;

        // Create values array with primary key value first, followed by other values
        const values = [
            primaryKey.value,  // Use the primary key value directly
            ...Object.keys(row)
                .filter(key => key !== primaryKey.column)
                .map(key => row[key])
        ];
        
        console.log('Update Query:', query, 'Values:', values);

        const result = await connection.query(query, values);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Row not found' });
        }

        res.json({
            message: 'Row updated successfully',
            row: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating row:', error);
        res.status(500).json({ message: 'Failed to update row' });
    }
};

const deleteRow = async (req, res) => {
    try {
        if (!req.session.dbConfig) {
            return res.status(400).json({ message: 'No database connection. Please connect first.' });
        }
        const connection = await DBModel.connectdb(req.session.dbConfig);
        const { tableName } = req.params;
        const { primaryKey } = req.body;
        
        if (!tableName || !primaryKey) {
            return res.status(400).json({ message: 'Table name and primary key are required' });
        }

        const query = `
            DELETE FROM "${tableName}"
            WHERE "${primaryKey.column}" = $1
            RETURNING *
        `;

        const result = await connection.query(query, [primaryKey.value]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Row not found' });
        }

        res.json({
            message: 'Row deleted successfully',
            row: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting row:', error);
        res.status(500).json({ message: 'Failed to delete row' });
    }
};

const insertRow = async (req, res) => {
    try {
        if (!req.session.dbConfig) {
            return res.status(400).json({ message: 'No database connection. Please connect first.' });
        }
        const connection = await DBModel.connectdb(req.session.dbConfig);
        const { tableName } = req.params;
        const { row } = req.body;
        
        if (!tableName || !row) {
            return res.status(400).json({ message: 'Table name and row data are required' });
        }

        // Get column names and values
        const columns = Object.keys(row).filter(key => key !== 'id');
        const values = columns.map(col => row[col]);
        
        // Build the INSERT query
        const query = `
            INSERT INTO "${tableName}" (${columns.map(col => `"${col}"`).join(', ')})
            VALUES (${columns.map((_, idx) => `$${idx + 1}`).join(', ')})
            RETURNING *
        `;
        
        const result = await connection.query(query, values);
        
        res.json({
            message: 'Row inserted successfully',
            row: result.rows[0]
        });
    } catch (error) {
        console.error('Error inserting row:', error);
        res.status(500).json({ message: 'Failed to insert row' });
    }
};

const createTable = async (req, res) => {
    try {
        if (!req.session.dbConfig) {
            return res.status(400).json({ message: 'No database connection. Please connect first.' });
        }
        const connection = await DBModel.connectdb(req.session.dbConfig);
        const { tableName, columns } = req.body;
        
        if (!tableName || !columns || !columns.length) {
            return res.status(400).json({ message: 'Table name and column definitions are required' });
        }

        // Build the CREATE TABLE query
        const columnDefinitions = columns
            .map(col => `"${col.name}" ${col.type}${col.constraints ? ' ' + col.constraints : ''}`)
            .join(', ');
        
        const query = `CREATE TABLE "${tableName}" (id SERIAL PRIMARY KEY, ${columnDefinitions})`;
        
        await connection.query(query);
        
        res.json({
            message: 'Table created successfully',
            tableName: tableName
        });
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).json({ message: 'Failed to create table: ' + error.message });
    }
};

const deleteTable = async (req, res) => {
    try {
        if (!req.session.dbConfig) {
            return res.status(400).json({ message: 'No database connection. Please connect first.' });
        }
        const connection = await DBModel.connectdb(req.session.dbConfig);
        const { tableName } = req.params;
        
        if (!tableName) {
            return res.status(400).json({ message: 'Table name is required' });
        }

        const query = `DROP TABLE "${tableName}"`;
        await connection.query(query);
        
        res.json({
            message: 'Table deleted successfully',
            tableName: tableName
        });
    } catch (error) {
        console.error('Error deleting table:', error);
        res.status(500).json({ message: 'Failed to delete table: ' + error.message });
    }
};

module.exports = {
    connect, 
    getTables, 
    getRows,
    insertRow,
    updateRow,
    deleteRow,
    disconnect,
    createTable,
    deleteTable
};