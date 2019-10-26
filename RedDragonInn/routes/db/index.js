const pgp = require("pg-promise")();

//TODO: get this from the DATABASE_URL variable in .env, can't seem to figure out how to get it there now
const connection = pgp("postgres://Graves:12@localhost:5432/RedDragonInn");

module.exports = connection;
