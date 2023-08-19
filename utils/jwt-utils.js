const jwt = require('jsonwebtoken');

exports.createJWT = async (payload, expiresIn) => {
  const jwtToken = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn,
  });
  return jwtToken;
};

exports.verifyJWT = async (jwtToken) => {
  const data = await jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
  return data;
};
