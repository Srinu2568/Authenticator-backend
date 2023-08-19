const User = require('../../models/User');
const validatePassword = require('../../utils/validatePassword');
const { createJWT, verifyJWT } = require('../../utils/jwt-utils');

const login = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  let userData = await User.findOne({
    email: email,
  });

  if (!userData) {
    return res.status(404).json({ status: false, msg: 'No user found' });
  } else if (!userData.isAccountConfirmed) {
    return res.status(401).json({ status: false, msg: 'User not verified' });
  }

  let isValidUser = await validatePassword(password, userData.password);
  if (!isValidUser) {
    return res.status(404).json({ status: false, msg: 'Invalid Credentials' });
  }

  const token = await createJWT(
    { userId: userData._id, email },
    (expiresIn = '1d')
  );

  res.json({
    status: true,
    msg: 'In login',
    email,
    userId: userData._id,
    token: token,
  });
};

module.exports = login;
