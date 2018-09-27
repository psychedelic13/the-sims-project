var mysql = require('mysql')
var Promise = require('bluebird')

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: '/var/run/mysqld/mysqld.sock'
})

var queryAsync = Promise.promisify(connection.query.bind(connection))

connection.connect()

module.exports = connection;
