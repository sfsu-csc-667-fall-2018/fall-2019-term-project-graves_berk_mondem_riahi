const db = require("../../routes/db/connection");

const FIND_BY_ID_SQL = "SELECT * FROM users WHERE id=$1";
const findById = id => db.one(FIND_BY_ID_SQL, [id]);

module.exports = {
  findById
};
