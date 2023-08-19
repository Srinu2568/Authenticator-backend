const bcrypt = require('bcryptjs');

const validatePassword = async (userPasswordHash, passwordToValidate) => {
  return bcrypt.compareSync(userPasswordHash, passwordToValidate); // Returns a boolean
};

module.exports = validatePassword;
