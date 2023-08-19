const express = require('express');
const login = require('../../controllers/auth-controllers/login');
const signUp = require('../../controllers/auth-controllers/signUp');
const confirmAccount = require('../../controllers/auth-controllers/confirmAccount');

const {
  signUpUserValidationRules,
  validateSignUp,
  loginValidationRules,
  validateLogin,
} = require('../../validations/authValidations');

const router = express.Router();

// POST /login
router
  .route('/login')
  .post(loginValidationRules(), validateLogin, login);

// POST /signup
router
  .route('/signup')
  .post(signUpUserValidationRules(), validateSignUp, signUp);

// POST /:confirmToken
router.route('/:confirmToken').get(confirmAccount);

module.exports = router;
