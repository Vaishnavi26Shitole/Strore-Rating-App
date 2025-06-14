const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide store name'],
    trim: true,
    maxlength: [100, 'Store name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide store email'],
    unique: true,
    lowercase: true
  },
  address: {
    type: String,
    required: [true, 'Please provide store address'],
    maxlength: [400, 'Address cannot exceed 400 characters']
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Store must belong to an owner']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating for a store
storeSchema.virtual('averageRating').get(function() {
  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return sum / this.ratings.length;
  }
  return 0;
});

// Populate owner details when querying stores
storeSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'owner',
    select: 'name email'
  });
  next();
});

module.exports = mongoose.model('Store', storeSchema);