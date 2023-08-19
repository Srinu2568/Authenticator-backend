const { verifyJWT } = require('../utils/jwt-utils');

exports.authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']
    ? req.headers['authorization'].replace('Bearer ', '')
    : false;
  if (!token) {
    return res
      .status(401)
      .json({ status: false, msg: 'Please Login First', isLoggedIn: false });
  }

  // Verify jwt token and redirect if fails.
  verifyJWT(token)
    .then((extractedData) => {
      req.authData = {
        isAuthenticated: true,
        ...extractedData,
      };
      next();
    })
    .catch((err) => {
      return res
        .status(401)
        .json({
          status: false,
          msg: 'JWT Token Expired!',
          err,
          isJWTExpired: true,
        });
    });
};
