<<<<<<< HEAD
=======
var mysql = require('mysql')

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: '/var/run/mysqld/mysqld.sock'
})

connection.connect()

module.exports = connection;
>>>>>>> 63bfffb0b60b8d4a35da41af4285830dd1e41668
