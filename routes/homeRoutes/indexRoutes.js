const express = require('express');
const home  = require('../../controllers/homeControllers/home');

const router = express.Router();

router.route('/').get(home);

module.exports = router;
