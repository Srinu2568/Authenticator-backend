const User = require('../../models/User');
const AuthToken = require('../../models/AuthToken');
const hashPassword = require('../../utils/hashPassword');
const sgMail = require('../../utils/sgMail');
const crypto = require('crypto');

const signUp = async (req, res, next) => {
  let signUpPayload = req.matchedData;
  let email = signUpPayload.email;

  // Check for user with the given mail in db
  let userData = await User.findOne({ email });
  if (userData && userData.isAccountConfirmed) {
    return res.status(409).json({
      status: false,
      msg: {
        errors: [
          {
            userAlreadyExists: 'User Already Exists with the given email!',
          },
        ],
      },
    });
  }

  let token_data = await AuthToken.findOne({ email });

  if (userData && !userData.isAccountConfirmed && token_data) {
    try {
      let current_date = new Date();
      if (!token_data) {
        return res.status(400).json({
          status: false,
          msg: 'Token Expired, Please request for another token to confirm the account!',
        });
      } else if (token_data && token_data.tokenExpiry > current_date) {
        return res.json({
          status: false,
          msg: 'Token is sent already, Please check your inbox!',
        });
      }
    } catch (err) {
      return res.json({ status: false, err: err });
    }
  }

  let password = await hashPassword(signUpPayload.password);
  let name = signUpPayload.name;

  // Create new User if passed all the checks and if new user
  if (!userData) {
    try {
      await User.create({
        name,
        email,
        password,
      });
    } catch (errMsg) {
      return res.status(500).json({
        status: false,
        error: errMsg,
        msg: 'Failed to create User!',
      });
    }
  }

  // Generate token
  const confirmToken = crypto.randomBytes(20).toString('hex');
  let currentDate = new Date();
  let expirationDate = new Date(currentDate.getTime() + 60 * 60 * 1000);

  try {
    if (token_data && token_data.tokenExpiry <= currentDate) {
      await AuthToken.updateOne(
        { email: token_data.email },
        { confirmToken, tokenExpiry: expirationDate }
      );
    } else {
      await AuthToken.create({
        email,
        confirmToken,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error, msg: 'Failed to create confirm token' });
  }

  let confirmAccountLink =
    // process.env.SERVER_URI + '/api/v1/auth' + `/${confirmToken}?m=${email}`;
    // `http://192.168.0.103:${process.env.PORT}/api/v1/auth/${confirmToken}?m=${email}`;
    `${process.env.CLIENT_URI}/confirmaccount/${confirmToken}?m=${email}`;

  const msg = {
    to: email,
    from: 'Authentication@menta-srinivas.social',
    subject: 'Email Verification - Verify Email',
    html: `Confirm your Account using this <a href="${confirmAccountLink}">confirm account link.</a>
          <br></br>
          Note: The link will expire in an hour.
          `,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    return res
      .status(404)
      .json({ status: false, error, msg: 'Failed to send Email' });
  }

  res.status(200).json({ status: true, msg: { userCreated: true } });
};

module.exports = signUp;
