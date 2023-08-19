const { body, validationResult, matchedData } = require('express-validator');

const signUpUserValidationRules = () => {
  return [
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('confirmPassword').custom((value, { req }) => {
      //Custom Validator to compare password and confirmPassword
      if (value !== req.body.password) {
        throw new Error('Passwords do not match'); //throwing error will set the error msg in the object
      } else {
        return true; // Should return true if valid
      }
    }),
  ];
};

const validateSignUp = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.matchedData = matchedData(req);
    return next();
  } else {
    const transformedErrors = [];
    errors.array().map((err) => {
      return transformedErrors.push({ [err.path]: err.msg });
    });
    res
      .status(400)
      .json({ status: false, msg: { errors: transformedErrors } });
  }
};

const loginValidationRules = () => {
  return [
    body('email')
      .isEmail()
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Invalid Email Adress!');
        } else {
          return true;
        }
      }),
    body('password').isLength({ min: 5 }),
  ];
};

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    req.matchedData = matchedData(req);
    return next();
  } else {
    const transformedErrors = [];
    errors.array().map((err) => {
      return transformedErrors.push({ [err.path]: err.msg });
    });
    res
      .status(400)
      .json({ status: false, msg: { errors: transformedErrors } });
  }
};

module.exports = {
  signUpUserValidationRules,
  validateSignUp,
  loginValidationRules,
  validateLogin,
};
