const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// User routes
router.post('/auth/signup', userController.signUp);
router.post('/auth/login', userController.login);
router.post('/auth/logout', userController.logout);

// New routes
router.get('/auth/coupons', userController.getCouponCode);
router.post('/auth/bookings', userController.bookShow);

module.exports = router;
