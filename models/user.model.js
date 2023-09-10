const mongoose = require('mongoose');
const Joi = require('joi');

const UserSchema = mongoose.Schema({
  userid: String,
  username: String,
  email: {
    required: true,
    type: String,
    unique: true, // Make it unique
  },
  first_name: String,
  last_name: String,
  contact: String,
  password: String,
  role: String,
  isLoggedIn: Boolean,
  uuid: {
    required: true,
    type: String,
    unique: true, // Make it unique
  },
  accesstoken: String,
  coupens: [{ id: Number, discountValue: Number }],
  bookingRequests: [
    {
      reference_number: Number,
      coupon_code: Number,
      show_id: Number,
      tickets: [Number],
    },
  ],
});

// Define the validation schema for User
const userValidationSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string(), // Optional field
  contact: Joi.string(), // Optional field
  isLoggedIn: Joi.boolean(), // Optional field
});

// Create a method to validate user data
UserSchema.methods.validateUser = function () {
  return userValidationSchema.validate(this.toObject());
};

module.exports = mongoose.model('User', UserSchema);
