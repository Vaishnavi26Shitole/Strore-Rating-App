const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const authController = require('../controllers/authController');

router.route('/')
  .get(storeController.getAllStores)
  .post(authController.protect, authController.restrictTo('admin', 'store_owner'), storeController.createStore);

router.route('/:id')
  .get(storeController.getStore)
  .patch(authController.protect, authController.restrictTo('admin', 'store_owner'), storeController.updateStore)
  .delete(authController.protect, authController.restrictTo('admin'), storeController.deleteStore);

module.exports = router;