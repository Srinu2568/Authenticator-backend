const AuthToken = require('../../models/AuthToken');
const User = require('../../models/User');

const confirmAccount = async (req, res, next) => {
  const confirmToken = req.params.confirmToken;
  const email = req.query.m;

  const userTokenData = await AuthToken.findOne({ confirmToken, email });
  const userData = await User.findOne({ email });

  // Check's if the user exists upfront
  if (!userData) {
    return res.json({ status: false, msg: 'No user found!' });
  }

  // Check if the user's mail Already validated
  if (userData.isAccountConfirmed) {
    return res.json({ status: true, msg: 'User already verified' });
  }

  // If no token found
  if (!userTokenData) {
    return res.json({
      status: false,
      msg: 'No token found for the user! Please request for a new one',
    });
  }

  let current_date = new Date();

  // If the token expires
  if (userTokenData.tokenExpiry < current_date || userData.isAccountConfirmed) {
    await AuthToken.deleteOne({ _id: userTokenData._id });
    return res.json({ status: false, msg: 'Token Expired!' });
  }

  // If the token is valid
  if (userTokenData.tokenExpiry > current_date) {
    await AuthToken.deleteOne({ _id: userTokenData._id });
    await User.updateOne({ email }, { isAccountConfirmed: true });
  }

  res.status(200).json({ status: true, msg: 'User verified successfully' });
};

module.exports = confirmAccount;
