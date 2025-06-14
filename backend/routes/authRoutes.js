const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

router.post('/signup', [
  check('name').isLength({ min: 20, max: 60 }),
  check('email').isEmail(),
  check('password').custom(authController.validatePassword),
  check('address').optional().isLength({ max: 400 })
], authController.signup);

router.post('/login', [
  check('email').isEmail(),
  check('password').exists()
], authController.login);

module.exports = router;