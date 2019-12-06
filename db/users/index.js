const db = require("../../routes/db/connection");

const FIND_BY_USERNAME_SQL = "SELECT * FROM users WHERE username=$1";
const findByUserName = username => db.one(FIND_BY_USERNAME_SQL, [username]);

module.exports = {
  findByUserName
};
