const pgp = require("pg-promise")();

//TODO: get this from the DATABASE_URL variable in .env, can't seem to figure out how to get it there now
console.log(process.env.DATABASE_URL);
const connection = pgp(process.env.DATABASE_URL);

module.exports = connection;
