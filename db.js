const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.USER || "root",
    password: process.env.DB_PASSWORD || "1611",
    database: process.env.DB || "skpschat"
})

db.connect((err) => {
    if(err) throw err;
    console.info("Connected to database.")
});

module.exports = db;
