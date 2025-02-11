const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  contact: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false } 
}, { timestamps: true });

const User = mongoose.model('Register', RegisterSchema);

module.exports = User;
