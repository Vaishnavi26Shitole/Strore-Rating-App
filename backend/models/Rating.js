const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: [true, 'Please provide a rating value'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: [true, 'Rating must belong to a store']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Rating must belong to a user']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate ratings from the same user for the same store
ratingSchema.index({ store: 1, user: 1 }, { unique: true });

// Calculate average ratings when a new rating is created
ratingSchema.statics.calcAverageRatings = async function(storeId) {
  const stats = await this.aggregate([
    {
      $match: { store: storeId }
    },
    {
      $group: {
        _id: '$store',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$value' }
      }
    }
  ]);

  if (stats.length > 0) {
    await this.model('Store').findByIdAndUpdate(storeId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await this.model('Store').findByIdAndUpdate(storeId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

ratingSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.store);
});

module.exports = mongoose.model('Rating', ratingSchema);