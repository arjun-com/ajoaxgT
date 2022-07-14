const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
})

db.connect((err) => {
    if(err) throw err;
    console.info("Connected to database.")
});

module.exports = db;
