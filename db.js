var mysql = require('mysql')

var connection = mysql.createConnection({
    /*host: 'localhost',//process.env.DB_HOST,
    user: 'root',//process.env.DB_USER,
    password: 'SabrieL08',//process.env.DB_PASSWORD,
    database: 'sims'//process.env.DB_NAME*/
    socketPath: '/var/run/mysqld/mysqld.sock',
    host: 'localhost',
    user: 'root',
    password: 'SabrieL08..',
    database: 'sims'
})

connection.connect()

module.exports = connection;
