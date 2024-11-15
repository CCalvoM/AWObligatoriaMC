const session = require("express-session");
const mysqlSession = require("express-mysql-session");

const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore( {
    host: "localhost",
    user: "root",
    password: "",
    database: "AW_24"
});

const middlewareSesion = session( {
    saveUninitialized : false,
    secret: "sessionUCM_1",
    resave: false,
    store: sessionStore
});

module.exports = middlewareSesion