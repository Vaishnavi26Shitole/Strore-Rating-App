const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.route('/')
  .post(ratingController.createRating);

router.route('/store/:storeId')
  .get(ratingController.getStoreRatings);

router.route('/my-ratings')
  .get(ratingController.getMyRatings);

router.route('/:id')
  .patch(ratingController.updateRating);

module.exports = router;