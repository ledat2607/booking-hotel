const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/LoginController');
const RegisterController = require('../controllers/RegisterController');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', RegisterController);

// @route   POST api/auth/login
// @desc    login user
// @access  Public

router.post('/login', LoginController);

module.exports = router;
