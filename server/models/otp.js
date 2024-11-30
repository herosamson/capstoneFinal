const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: { type: String },
  otp: { type: String },
  createdAt: { type: Date },
  expiresAt: { type: Date },
}, { timestamps: true });

const OTPVerification = mongoose.model('token', tokenSchema);

module.exports = OTPVerification;
