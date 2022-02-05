const mysql = require("mysql");
const config = require("../config/db");

const pool = mysql.createPool(config);

pool.on('acquire', function (connection) {
    console.log(`Connection ${connection.threadId} acquired`);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    console.log(`Connection ${connection.threadId} released`);
});

const getConn = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
}

module.exports = getConn;