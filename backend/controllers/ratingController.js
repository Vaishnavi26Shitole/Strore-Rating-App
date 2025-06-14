const Rating = require('../models/Rating');
const Store = require('../models/Store');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createRating = catchAsync(async (req, res, next) => {
  const { value, store } = req.body;

  // Check if user already rated this store
  const existingRating = await Rating.findOne({
    user: req.user.id,
    store
  });

  if (existingRating) {
    return next(new AppError('You have already rated this store', 400));
  }

  const newRating = await Rating.create({
    value,
    store,
    user: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: {
      rating: newRating
    }
  });
});

exports.updateRating = catchAsync(async (req, res, next) => {
  const rating = await Rating.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { value: req.body.value },
    { new: true, runValidators: true }
  );

  if (!rating) {
    return next(new AppError('No rating found with that ID or you are not authorized', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rating
    }
  });
});

exports.getStoreRatings = catchAsync(async (req, res, next) => {
  const ratings = await Rating.find({ store: req.params.storeId })
    .populate('user', 'name email');

  res.status(200).json({
    status: 'success',
    results: ratings.length,
    data: {
      ratings
    }
  });
});

exports.getMyRatings = catchAsync(async (req, res, next) => {
  const ratings = await Rating.find({ user: req.user.id })
    .populate('store', 'name address');

  res.status(200).json({
    status: 'success',
    results: ratings.length,
    data: {
      ratings
    }
  });
});