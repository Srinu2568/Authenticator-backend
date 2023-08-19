const bcrypt = require('bcryptjs');

const hashPassword = async (pass) => {
  return bcrypt.hashSync(pass, 10);
}

module.exports = hashPassword;
