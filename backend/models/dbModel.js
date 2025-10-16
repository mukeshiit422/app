const { Pool} = require("pg");

class DBModel {
    static connectdb(creds) {
        const pool = new Pool({
            user: creds.user,
            host: creds.host,
            database: creds.database,
            password: creds.password,
            port: creds.port,
        });
        return pool;
    }                       
}

module.exports = DBModel;